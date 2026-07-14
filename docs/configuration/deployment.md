---
title: Deployment 与 Link
---

Node 名称是用户定义的逻辑 ID，例如 `gimbal_f4` 和 `chassis_h7`，不等于 hostname、
板型或 wire ID。wire ID 由 compiler 分配并写入 lock。

Link 描述物理连接。一个 CAN 总线只声明一次并列出所有 endpoint；Topic 路由从
Module 端口图和实例放置自动推导。Route rule 只选择 QoS，不能成为手工路由表。

部署校验必须覆盖资源存在性、类型一致性、路径、MTU、分片、优先级、deadline 和
总线预算。任何未分类的跨节点控制 Route 都是构建错误。
