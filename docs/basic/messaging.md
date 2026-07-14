---
title: Topic、Service 与 Action
---

Topic 用于持续状态和指令，Service 用于有界请求/响应，Action 用于可取消的长任务。
Runtime 内部只需要 Channel 与 RPC 两种传输原语；Action 由生成代码组合 goal、
feedback、result、cancel 和 timeout 状态机。

| 接口 | 适用场景 | 当前 MCU 语义 |
| --- | --- | --- |
| Topic | 状态流、控制指令、事件 | 固定订阅数、固定队列深度、异步回调 |
| Service | 短请求/响应 | `CallAsync`、固定并发槽、服务端 Executor 执行 |
| Action | 可取消长任务 | 固定 goal 槽、feedback/result/cancel/deadline 状态机 |

## Schema First

可跨 Node 的类型必须由 schema 生成 `TypeSupport<T>`。契约至少包含规范名称、128-bit
Schema Hash、最大编码长度以及确定性的 `Encode` / `Decode`。本地 Topic 可以直接复制
C++ 值，但仍要求同一份 TypeSupport，因此切换成本地、CAN 或未来 DDS backend 时不会
偷偷换 wire contract。手写业务 `struct` 不能直接成为跨板协议。

## Topic

`TopicPublisher<T>` 是 Module 持有的窄句柄；`StaticTopic<T, N>`、订阅槽和容量由生成
代码持有。订阅提供两种有界策略：

- `kLatest`：Executor 尚未处理时只保留最新值，并累计 `overwritten`。
- `kKeepAll`：保留到声明深度，满后返回 `kCapacityExceeded` 并累计 `dropped`。

发布不会内联展开订阅业务。消息先进入固定邮箱，再由目标 Executor 运行回调。若无法
安排回调，发布明确返回错误；Runtime 不会把一条永远无法执行的消息报告为成功。

## Service

MCU 接口只提供非阻塞 `CallAsync`。请求被复制到固定槽，服务 handler 在配置的
Executor 上运行，完成回调收到同一个显式 `ExecutionContext`。槽耗尽或 Executor
背压会在调用时返回错误。回调必须短小且不阻塞；长任务应使用 Action。

## Action

`SendGoal` 成功只表示 goal 已进入 Runtime，不表示服务端已经接受。接受响应、feedback、
cancel 响应和 result 是独立事件。deadline 使用绝对单调时间；Runtime 定时检查后以
`Status::kTimeout` 完成过期 goal。cancel 已排队但尚未处理时不允许提前复用 goal 槽，
避免旧 cancel 作用到新 goal。

应用代码不判断订阅者位于同模块、同节点还是另一块板。部署编译器选择本地后端或
物理 Link。这个透明性不掩盖 deadline、丢包和节点失联，相关策略属于端口契约。

位置透明不等于时间透明。硬闭环端口仍可声明 `same_node: required`；跨板控制端口必须
给出 deadline、max age、stale 行为和恢复条件。通信错误通过 `Status`、统计和诊断暴露，
不会被“无缝切换”这个词隐藏。
