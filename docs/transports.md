---
title: Transport
---

# v0.2 官方 Transport

Local、CAN/SocketCAN、USB CDC ACM 都实现同一个有界 Transport Interface。Graph 只看到
Link 和 Route；CAN ID、分片、串口 framing 等细节留在 Adapter Implementation 内部。

CAN/SocketCAN 支持构建期 Route ID、优先级、分片/重组、可靠 Channel 与 RPC、超时、
重试、背压、握手和链路统计。生成器在节点侧插入有界 RPC Router：本地服务仍走进程内
Backend，跨节点 client/server 则连接到 CAN Adapter，业务 Module 始终只使用
`core.rpc()`。对端重启会取消在途调用并丢弃旧会话的延迟回包。总线预算包含 framing、
仲裁、重传和声明的最大频率。

v0.2 的远端 RPC 只支持 CAN，而且同一源节点上的同一服务只能指向一个远端节点；这两条
约束会在 `aster resolve` 阶段检查，避免生成无法确定路由或并未实现的部署。

USB CDC ACM 在 Zephyr 使用新 USB Device Stack，Linux 端使用 TTY，wire framing 为
COBS + CRC32C。产品必须显式配置 VID/PID。

USB CDC ACM 的 v0.2 生成链路承载 Channel；RPC over USB 后移。UDP 不在 v0.2 范围内；
多 Host 数据链路使用 CAN/SocketCAN 或 USB，SSH 只用于部署产物。
