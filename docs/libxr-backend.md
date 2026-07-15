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

## MotorGroup 契约

`motor` Package 的 `MotorGroup` 提供三个有界操作：

- `Snapshot(span<Feedback>)` 复制一份完整逻辑组快照，不在控制回调中启动 CAN I/O。
- `Apply(span<const Command>)` 原子接受整组下一拍命令；成功只表示 adapter 已接受。
- `Relax()` 明确撤销整组驱动输出。

反馈与命令使用 SI 单位，组大小和逻辑顺序在初始化时校验。方向、CAN ID、协议帧和
电流换算属于 adapter/hardware profile。轮腿底盘因此只依赖四关节组与两轮组；DJI、
达妙和未来仿真 adapter 可以替换，而不会污染五连杆与 LQR 代码。
