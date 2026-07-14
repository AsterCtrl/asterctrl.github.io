---
title: Executor 与参数
---

Executor 是 Runtime 管理的执行资源。Module 声明周期、优先级、栈、队列和是否需要
独占执行器，compiler 负责生成 MCU task 或裸机调度表。

`ExecutionContext` 明确记录 Executor 名称、执行类别和优先级。只有 `kThread` 允许
阻塞，`kCallback` 与 `kInterrupt` 都必须使用非阻塞接口。任务使用函数指针和稳定的
状态地址表达，不使用可能分配内存的 `std::function`。

首个 `CooperativeExecutor<N>` 是固定数组 FIFO，适用于 host 测试和裸机串行调度。它
明确拒绝 ISR 投递，因为它不假装具备并发安全。MCU 的 ISR/DMA handoff 由 libxr backend
提供专门的有界队列，再唤醒 Runtime Executor。

Executor 统计 accepted、executed、rejected 和 high watermark；队列满返回
`Status::kCapacityExceeded`。这些数值会进入后续生成的 RAM/队列与运行诊断报告。

参数分为构建期结构、启动期值和运行期可调值。运行期参数必须声明类型、单位、范围、
持久化策略和修改所需生命周期。硬件绑定、路由、队列容量和安全结构不能热修改。

| mutability | 启动 seal 前 | 运行中 |
| --- | --- | --- |
| `kBuildTime` | 只读 | 只读 |
| `kStartup` | 可写 | 只读 |
| `kRuntime` | 可写 | 可写 |

每次写入先检查执行上下文、阶段和范围，再调用可选业务校验回调。回调拒绝时旧值与
revision 保持不变。ISR 修改参数始终被拒绝。运行期可调不等于任意 YAML 热重载；只有
进入静态参数表且声明为 `kRuntime` 的标量才能修改。
