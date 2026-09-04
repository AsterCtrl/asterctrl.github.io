---
slug: /
title: AsterCtrl 0.2
---

# 一套应用，两种原生运行时

AsterCtrl 是面向机器人和嵌入式控制的确定性框架。Linux 与 Zephyr 都运行
AsterCtrl 自己的 Runtime；AimRT 只是设计参考，不是依赖或生成目标。

> 当前公开版本是
> [`v0.2.0-alpha.1`](https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1)。
> 这是供架构验证和集成试用的 compile-only alpha，不是实板验证完成的正式版。

业务代码只实现 Module。Application Graph 描述 Module Instance 以及 Channel/RPC
关系，Deployment Graph 决定它们运行在哪台 Linux 主机或哪块 Zephyr 板卡，以及
采用哪个 Hardware、Clock 和 Transport Adapter。

v0.2 的官方范围包括：

- Linux 与 Zephyr Runtime；
- `aster` CLI 和双图编译器；
- bounded Protobuf TypeSupport；
- Local、CAN/SocketCAN、USB CDC ACM Transport；
- `dev_c`、`mc02` 两块 Zephyr board。

UDP、完整 SIL/PIL、开放式运行时发现以及 ROS/AimRT Bridge 留到后续版本。

从[安装与首个工程](./setup.md)开始，或先阅读[双图模型](./graphs.md)。
