---
title: 调试与诊断
---

# 从 Resolved Graph 开始

先运行 `aster graph` 检查实例放置、Port 类型、Provider、Route 和预算，再检查
`deployment.lock.yaml` 是否与运行节点报告的 Deployment ID 和 Schema Hash 一致。

Runtime 状态为 staged、starting、ready、degraded、failed、stopping。已知节点离线表示
非 ready，不表示拓扑发生变化。

Transport 诊断至少包含发送/接收、背压、丢弃、重传、陈旧数据、解码失败、握手不兼容、
队列水位和链路预算。不要把单元测试通过写成“实机已验证”。
