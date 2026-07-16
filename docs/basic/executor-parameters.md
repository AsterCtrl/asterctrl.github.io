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

## 周期任务

Module 不读取 `period_us`，也不创建平台定时器。它只在 `Initialize` 中把实现绑定到
manifest 已声明的任务名：

```cpp
Status Controller::Initialize(ModuleContext& context) noexcept {
  return context.BindPeriodicTask("control", {RunControl, this});
}

void Controller::RunControl(void* state,
                            const ExecutionContext& context) noexcept {
  static_cast<Controller*>(state)->Update(context);
}
```

deployment compiler 生成固定容量的 `StaticPeriodicScheduler<N>`、任务周期和目标
Executor。Runtime 在所有 Module 初始化后检查每个周期任务都已绑定，而且引用的 Module
与 Executor 都属于当前 Node。随后由平台线程调用 `Runtime::Poll(monotonic_ns, context)`；
ISR 不得直接 Poll。

第一次 Poll 会立即发布任务。若平台晚于一个或多个周期，调度器只发布一次最新任务，
不会补跑历史周期；前一次任务仍 pending 时也不会重入。`releases`、`completed`、
`skipped` 和 `schedule_failures` 可用于诊断执行器阻塞与队列背压。调度热路径使用固定
数组、函数指针和锁自由 32-bit 原子计数，不动态分配。

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

deployment compiler 会把 Application instance 中的覆盖值和 `module.yaml` 默认值合并，在 host
阶段完成名称、类型、范围、有限浮点和 `float32` 表示性校验。生成结果按 `bool`、
`int32`、`uint32`、`float32` 和 `float64` 分表，保留 mutability 与 persistence，供后续
composition 直接构造固定容量的 `Parameter<T>` 与 `StaticParameterRegistry<N>`。这一步
不意味着 MCU 支持加载 YAML；YAML 只存在于构建主机。
