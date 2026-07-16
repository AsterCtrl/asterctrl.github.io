---
title: 调试与可观测性
---

框架诊断覆盖 Module 生命周期、Executor 超时、Route 频率、字节率、丢弃、合并、重试、
队列高水位、消息年龄、heartbeat 和时钟同步状态。

诊断本身必须有带宽预算。低优先级日志不能阻塞 ISR、控制 Executor 或 CAN Fast Path。
最终工具应能从 lock 和运行指标解释一条消息经过了哪些节点与 backend。

## MCU 启动故障

生成固件提供全局变量：

```text
aster_firmware_fault_code = (stage << 8) | status
```

高字节 stage 区分 BSP initialize、hardware initialize/start、CAN endpoint/bind/init、
Composition configure/initialize/start、CAN drain、scheduler poll、Executor drain、hardware
exchange 与 BSP poll；低字节是 `aster::runtime::Status`。值为 0 只表示尚未进入不可恢复
Halt，不等于所有 Module 在线。

跨节点 deployment/schema/protocol 不一致不会让不完整的控制系统继续运行。`LinkControl`
保持握手并让应用 Runtime 留在未启动状态，同时 hardware exchange 继续发送 Relax/安全
命令。调试时应同时检查 fault code、握手统计、heartbeat state 和 CAN RX 错误计数。

## 传输指标

Fast Topic 至少公开发送消息、写失败和 `rate_limited`；Ingress 公开陈旧消息、解码失败、
sequence gap 与分片错误；Reliable Path 公开 ACK、重复、重试和超时。畸形应用帧由 backend
计数并丢弃，不能升级为整机 Halt。低优先级 UI/遥测的节流不能掩盖控制 Route deadline。

当前这些指标主要通过 host/fault-injection 测试和 debugger 读取。统一的 Linux CLI、
长期指标存储与板上 stack-watermark 页面属于后续可观测性里程碑。
