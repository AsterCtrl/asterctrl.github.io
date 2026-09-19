---
slug: /
title: AsterCtrl 0.2
---

# 一套 Module Interface，面向 Linux 与 Zephyr

AsterCtrl 是面向机器人和嵌入式控制的框架。Linux Runtime 已提供配置驱动运行；
Zephyr 侧提供可移植 Module Interface 和板级迁移路径，v1alpha3 静态部署仍在实现。
AimRT 只是设计参考，不是依赖或生成目标。确定性约束当前主要由 Zephyr 有界路径和
通信契约保证，不应理解为 Linux 动态运行时的全部行为。

> 当前公开版本是
> [`v0.2.0-alpha.1`](https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1)。
> 这是供架构验证和集成试用的 compile-only alpha，不是实板验证完成的正式版。

业务代码只实现 Module。普通 Linux 的唯一入口是 `runtime.yaml`，它选择 Package、
实例、Executor、日志和本地 Channel/RPC；当前用户模型不再维护独立应用图、Port
连接表或 Deployment Lock。跨节点和 Zephyr 部署未来才额外使用 `deployment.yaml`，
指定实例放置和通信契约；当前 v1alpha3 部署编译器不可执行。

v0.2 的官方范围包括：

- Linux Runtime 与 Zephyr 可移植 Module Interface；
- `aster` CLI 和配置驱动 Package；
- bounded Protobuf TypeSupport；
- Local Channel/RPC；CAN/SocketCAN、USB CDC ACM 的协议和 Adapter 回归实现（当前
  新 Launcher 只接通 Local）；
- `asterctrl-boards` 中的 `dev_c`、`mc02` 板级定义和 compile-only/qualification 路径，
  不等于 v1alpha3 静态部署或实板验收完成。

UDP、完整 SIL/PIL、开放式运行时发现以及 ROS/AimRT Bridge 留到后续版本。

从[安装与首个工程](./setup.md)开始，或先阅读[配置、通信与部署](./graphs.md)。
