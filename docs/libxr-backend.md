---
title: libxr Backend 与 BSP
---

libxr 提供 MCU 上的时间、线程、同步、内存和 CAN/UART/SPI 等 I/O 基础能力。
`aster-libxr-backend` 将这些能力适配为 AsterCtrl Runtime 与 hardware capability；libxr 类型
不能穿过可移植 API。

## 可移植层边界

可移植 Module 只依赖标准 C++、AsterCtrl API、生成消息和抽象 capability。以下类型必须留在
backend 或 BSP：

- HAL handle、寄存器和中断号。
- FreeRTOS task、queue、semaphore。
- POSIX file descriptor、socket 和 pthread。
- libxr device、queue、thread 和 callback 类型。

这样 Host fake、仿真设备、不同 MCU BSP 或未来 Linux backend 可以实现同一 capability，
而控制源码保持不变。

## 从 BSP 到 Module 的四层绑定

1. BSP 导出芯片与板级资源，例如 CAN controller、UART、SPI、GPIO、DMA 和时钟。
2. hardware profile 把这些资源组合成系统接线与逻辑设备。
3. driver adapter 根据协议、地址、方向、量程和标定构造类型化 capability。
4. 生成入口把 capability 注册到节点，Module 按逻辑名解析。

更换板卡时通常修改 BSP Package、target 与 hardware profile，不修改 Module `.cpp`。若
新目标不能满足 capability、时序、内存或带宽约束，deployment compile 应失败。

## I/O 完成语义

所有异步 I/O 必须明确“成功”代表哪一阶段：

- 数据已复制进固定软件队列。
- 请求已交给外设或 DMA。
- 物理发送已经完成。

不能用一个含糊的 `Write() == ok` 同时代表三者。adapter 不得保存调用方临时 buffer 的
引用；队列满返回明确背压，由上层按 QoS 选择丢弃、合并或重试。

接收侧 callback/ISR 只做有界交接和外设 rearm。协议扫描、CRC、Schema 解码和业务决策
由 Executor 在线程上下文执行。`ExecutionContext` 让 capability 拒绝来自错误上下文的调用。

## 聚合 Capability

Module 应解析领域能力而不是一组底层句柄。例如：

- `ByteReader` 表达有界、非阻塞的字节读取。
- `ActuatorGroup` 表达整组 Snapshot、Apply 和 Relax。
- `InertialSensor` 表达带单调时间戳的样本和标定操作。
- `FrameTransport` 表达固定上界帧的接收、发送和完成状态。

聚合接口需要保持“深”：将板级并发、协议状态与缓存生命周期封装在 adapter 内，同时让
Module 看见背压、时间戳和故障等不可忽略的语义。

## BSP Package

BSP 是独立 Package，可导出多个 board target。它负责启动代码、链接脚本、时钟、引脚、
外设资源和平台循环，但不包含系统设备接线或业务参数。hardware profile 才决定某台
具体应用的传感器和执行器如何占用这些资源。

通用的 libxr 修复可以向上游贡献；AsterCtrl 专属生命周期、TypeSupport、deployment 和路由
留在 AsterCtrl 仓库，不把框架职责塞入 libxr。
