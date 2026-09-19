---
title: Transport
---

# Transport 状态

当前 v1alpha3 Linux Runtime 只接通 Local Channel/RPC。队列容量来自 `runtime.yaml`，
回调在实例 Executor 上异步执行，编码消息由 Runtime 取得所有权。

CAN/SocketCAN 和 USB CDC ACM 已有协议、Adapter 与旧生成 Node 回归实现，但尚未成为
新启动器可选择的后端。它们不能作为 v1alpha3 跨节点部署已经完成的证据。物理协议细节
仍封装在 Adapter 内部，不进入业务 Module Interface。

CAN/SocketCAN 支持构建期 Route ID、优先级、分片/重组、可靠 Channel 与 RPC、超时、
重试、背压、握手和链路统计。生成器在节点侧插入有界 RPC Router：本地服务仍走进程内
Backend，跨节点 client/server 则连接到 CAN Adapter，业务 Module 始终只使用
`core.rpc()`。对端重启会取消在途调用并丢弃旧会话的延迟回包。总线预算包含 framing、
仲裁、重传和声明的最大频率。

未来的 v1alpha3 部署编译器会检查远端 RPC 的节点和路由约束。当前 `aster resolve` 仍
属于 v1alpha2 回归路径。

USB CDC ACM 在 Zephyr 使用新 USB Device Stack，Linux 端使用 TTY，wire framing 为
COBS + CRC32C。产品必须显式配置 VID/PID。

USB CDC ACM 的 v0.2 生成链路承载 Channel；RPC over USB 后移。UDP 不在 v0.2 范围内；
多 Host 数据链路和 SSH 部署仍属于后续集成工作。UDP、ROS 2、AimRT Bridge、录制回放
和开放式运行时发现不在当前 alpha 的实现范围。
