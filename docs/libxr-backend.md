---
title: libxr Backend 与 BSP
---

libxr 提供线程、同步、内存、时间、HardwareContainer 和 CAN/UART/SPI 等底层能力。
`runtime-libxr` 将这些能力适配为框架 Runtime，但平台类型不能穿过 portable API。

BSP 描述物理板能力，hardware profile 描述机器人在该板上的接线。应用 Module 只请求
诸如 `robot_bus` 或 `imu_spi` 的逻辑资源，切换板型时由配置重新绑定。

## 从 BSP 到 Module 的四层绑定

1. BSP 暴露 `can1`、`uart2`、GPIO、DMA 等板级资源。
2. hardware profile 把资源命名为 `wheel_motor_bus`、`joint_motor_bus` 等机器人接线。
3. 驱动 adapter 根据 ID、方向、减速比和协议创建类型化设备。
4. 生成入口把设备加入 `StaticHardwareRegistry`，Module 只解析逻辑名。

换 Dev C、MC02 或 host fake 时，前三层可以变化，控制 Module 的源码和公开接口不变。
若新板无法提供同一能力契约，部署编译应失败，而不是把板级条件编译塞回控制算法。

## UART 字节读取边界

Runtime 的 `ByteReader` 只表示“读取已经进入有界软件 RX 队列的字节”。它返回明确的
`Status` 和 `bytes_read`：无数据为 `kUnavailable`，不会阻塞等待下一帧，也不会把
DMA 缓冲区、libxr Queue、HAL UART handle 或回调类型暴露给 Module。

`xrobot-libxr-backend::UartReaderAdapter` 把 libxr RX Queue 适配为该契约。ISR/DMA
回调只负责有界交接，协议扫描和 CRC 校验由周期 Executor 在线程上下文完成；ISR 调用
`Read()` 会被明确拒绝。当前接口故意只有 RX。发送侧在能够分别表达“已入软件队列”、
“已交给外设”和“物理发送完成”之前，不提供一个含糊的 `Write()` 成功状态。

DR16 和 VT13 Module 都把 hardware profile 中的逻辑 `uart` 解析为同一个
`ByteReader`，因此 host fake、Dev C UART3/UART6 或未来其他 BSP adapter 可替换，而
协议解析源码不变。该能力契约解决的是 I/O 可移植性；波特率、奇偶校验、DMA 和引脚仍
属于 BSP 与 hardware profile。

## MotorGroup 契约

`motor` Package 的 `MotorGroup` 提供三个有界操作：

- `Snapshot(span<Feedback>)` 复制一份完整逻辑组快照，不在控制回调中启动 CAN I/O。
- `Apply(span<const Command>)` 原子接受整组下一拍命令；成功只表示 adapter 已接受。
- `Relax()` 明确撤销整组驱动输出。

反馈与命令使用 SI 单位，组大小和逻辑顺序在初始化时校验。方向、CAN ID、协议帧和
电流换算属于 adapter/hardware profile。轮腿底盘因此只依赖四关节组与两轮组；DJI、
达妙和未来仿真 adapter 可以替换，而不会污染五连杆与 LQR 代码。

`Feedback::fault_flags` 不直接泄漏厂商状态字。adapter 必须映射为统一的 `FaultFlag`：
堵转、过温、过流、通信、编码器和驱动故障。执行器 Module 再按机构语义决定处理方式，
例如发射拨盘可对堵转做一次有界退弹，但通信或驱动故障必须释放输出。尚未完成映射的
adapter 不能把未知厂商故障默认为“无故障”。

标准云台在 Module 内完成使用 `AttitudeState` 的角度外环，只把两个 rad/s 参考交给
单元素 `MotorGroup`。DJI adapter 负责 GM6020 内层速度 PID、raw current 与 SI 的换算、
命令方向、编码器方向和零位。当前 Dev C profile 保存 legacy ECD 5010/4215 与内环参数，
但方向归一和真实机构响应在 adapter 目标测试完成前仍是待验证项。

## SuperCapLink 契约

`supercap-ctrl` 的 Runtime Module 只解析聚合 `SuperCapLink`，其 `Read()` 取出一条已经
完成的带时间戳遥测，`Write()` 接受平台无关的功率上限、裁判缓冲能量、底盘输出状态和
boost 请求。无完整遥测时返回 `kUnavailable`，不能在线程中阻塞等待下一帧。

当前 SHU 自制超电 adapter 使用经典 CAN `0x210/0x211` 八字节协议。协议 codec 属于
`supercap-ctrl` Package；CAN2 资源、接收过滤、ISR/DMA 到固定队列的交接和 libxr 发送
完成语义属于 MC02 BSP adapter。仿真 adapter 可以直接实现同一 `SuperCapLink`，无需
伪造 CAN 外设或修改 Module。

`boost_requested` 是跨队伍的语义字段，不等于当前 SHU 帧中的一个 bit。SHU 协议没有
该字段，codec 会明确忽略它；轮腿的主动、被动、充电和安全功率状态仍由底盘 Module
拥有，不能下沉到通用硬件 adapter。

## RefereeUiWriter 契约

机器人专属 UI 只生成固定容量的 `RefereeUiCommand`。`referee` Package 的 codec 负责
官方交互数据头、96-bit 图形字段、CRC 和最大 120 B 帧；MC02 adapter 才负责 libxr
UART、固定 TX 队列、DMA 生命周期和序号。这样 UI Module 可以在 host fake、仿真 writer
或真实串口之间替换，而不修改布局代码。

`Write()` 成功只表示一条完整命令已被有界发送路径接受，不表示 DMA 或物理发送已经
完成；队列满必须返回明确背压，调用方保留同一条命令后重试。adapter 不得保存调用方
buffer 的引用，也不得在 UI Executor 中等待串口。Shutdown、DMA 错误、序号推进和重连
后的旧队列清理仍需由 MC02 adapter 的目标测试确定。
