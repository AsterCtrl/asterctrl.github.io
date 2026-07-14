---
title: 紧凑 CAN 数据面
---

经典 CAN 的 8 字节 payload 不承载通用 DDS envelope。部署期已经知道 Node、Route、
类型和 QoS，因此 arbitration ID 直接表达 Route 与优先级。

Fast Path 服务周期控制和状态，使用固定布局、latest 语义和最小序号。Reliable Path
服务 Service、Action、配置和离散事件，支持分片、确认与重试，但优先级低于控制帧。

总线报告按最坏位填充计算，并包含电机和超电等保留流量。控制流量不自适应降频；UI、
日志和遥测可以合并或降频。超过预算时 compiler 拒绝生成固件。
