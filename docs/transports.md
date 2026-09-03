---
title: Transport
---

# v0.2 官方 Transport

Local、CAN/SocketCAN、USB CDC ACM 都实现同一个有界 Transport Interface。Graph 只看到
Link 和 Route；CAN ID、分片、串口 framing 等细节留在 Adapter Implementation 内部。

CAN/SocketCAN 支持构建期 Route ID、优先级、分片/重组、可靠请求、超时、重试、背压、
握手和链路统计。总线预算包含 framing、仲裁、重传和声明的最大频率。

USB CDC ACM 在 Zephyr 使用新 USB Device Stack，Linux 端使用 TTY，wire framing 为
COBS + CRC32C。产品必须显式配置 VID/PID。

UDP 不在 v0.2 范围内；多 Host 数据链路使用 CAN/SocketCAN 或 USB，SSH 只用于部署产物。
