---
title: Legacy Module Adapter
---

Legacy Adapter 允许部分继承 `LibXR::Application` 的模块在迁移期继续运行，并把
`OnMonitor()` 接入受控 Executor。

适配器不能自动把 C++ 对象引用变成跨节点 RPC，也不能让旧模块私自创建的无限线程
获得关闭语义，更不能把原始结构体升级为稳定 wire contract。相关模块仍需按风险迁移。
