---
title: 调试与诊断
---

# 从 Runtime 配置开始

普通 Linux 先检查配置，再检查真实 Module 注册：

```bash
aster validate runtime.yaml --runtime build/aster_runtime
aster run --config runtime.yaml --check
aster run --config runtime.yaml --duration-ms 100
```

`validate` 不加载 Package；`run --check` 会执行 `Initialize()`、封闭注册表并调用
`Shutdown()`，可能产生初始化副作用。旧 `aster graph/resolve` 只用于 v1alpha2 回归。

Runtime 状态为 staged、starting、ready、degraded、failed、stopping。已知节点离线表示
非 ready，不表示拓扑发生变化。

当前新启动器只接通 Local Channel/RPC。CAN/USB 的协议测试、SocketCAN `vcan` 和
pseudo-TTY 测试属于旧 Adapter 回归，不能写成跨节点或实板已验证。Transport 接入新
Runtime 后，再补发送/接收、背压、丢弃、重传、陈旧数据、解码失败、握手不兼容、队列
水位和链路预算诊断。
