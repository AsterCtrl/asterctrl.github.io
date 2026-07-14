---
title: 调试与可观测性
---

框架诊断覆盖 Module 生命周期、Executor 超时、Route 频率、字节率、丢弃、合并、重试、
队列高水位、消息年龄、heartbeat 和时钟同步状态。

诊断本身必须有带宽预算。低优先级日志不能阻塞 ISR、控制 Executor 或 CAN Fast Path。
最终工具应能从 lock 和运行指标解释一条消息经过了哪些节点与 backend。
