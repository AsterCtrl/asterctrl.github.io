---
slug: /
title: AsterCtrl 0.2
---

# 一套 Module，两种原生 Runtime

AsterCtrl 是面向机器人和嵌入式控制的确定性框架。Linux 与 Zephyr 都运行
AsterCtrl 自己的 Runtime；AimRT 只是设计参考，不是依赖或生成目标。

> 当前公开版本是
> [`v0.2.0-alpha.1`](https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1)。
> 这是供架构验证和集成试用的 compile-only alpha，不是实板验证完成的正式版。

业务代码只实现 Module。普通 Linux 应用使用 `runtime.yaml` 选择 Package、实例、
Executor、日志和本地 Channel/RPC；不要求用户维护 `application.yaml`、Port 连接表
或 Deployment Lock。跨节点和 Zephyr 部署才额外使用 `deployment.yaml`，指定实例放置
和通信契约。v1alpha3 部署编译器目前仍在实现中。

v0.2 的官方范围包括：

- Linux Runtime 与 Zephyr 可移植 Module Interface；
- `aster` CLI 和配置驱动 Package；
- bounded Protobuf TypeSupport；
- Local Channel/RPC；CAN/SocketCAN、USB CDC ACM 的协议和 Adapter 回归实现；
- `dev_c`、`mc02` Board 支持正在进行中。

UDP、完整 SIL/PIL、开放式运行时发现以及 ROS/AimRT Bridge 留到后续版本。

从[安装与首个工程](./setup.md)开始，或先阅读[配置、通信与部署](./graphs.md)。
