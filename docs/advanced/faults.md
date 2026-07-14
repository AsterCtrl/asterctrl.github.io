---
title: 时间、失联与故障策略
---

每个 Node 使用本地单调时钟。Deployment 可以指定时间基准 Node，通过轻量同步维护
偏移；它不是 Broker，失联不会中断其他节点的本地路由。

控制订阅必须声明 deadline、max age、stale 行为和 re-arm 条件。Runtime 检测并报告
故障，最终执行器 Module 决定零力矩、松电、保持或其他机器人相关安全动作。
