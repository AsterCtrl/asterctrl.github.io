---
title: Legacy Module Adapter
---

Legacy Adapter 允许部分继承 `LibXR::Application` 的模块在迁移期继续运行，并把
旧对象包装进新 Runtime 的 `Initialize`、`Start`、`Shutdown` 顺序。适配器本身不包含
libxr 类型，只保存 `void*` 实例和三个显式函数指针 hook，因此 portable Runtime 仍不
依赖上游框架。

没有 lifecycle hook 时 Adapter 的对应阶段是 no-op。对构造时已经启动线程的旧模块，
这只提供登记和迁移落点，并不表示 Runtime 真正拥有那条线程。迁移时应优先把构造副作用
移到 `Initialize`，把任务创建改为 deployment 声明的 Executor，再补可执行的 Shutdown。

适配器不能自动把 C++ 对象引用变成跨节点 RPC，也不能让旧模块私自创建的无限线程
获得关闭语义，更不能把原始结构体升级为稳定 wire contract。相关模块仍需按风险迁移。

因此 Legacy Adapter 是兼容桥，不是长期运行模式。deployment report 会把仍使用 Adapter
的 Module 标为 migration debt，安全关键 Module 不应靠 Adapter 完成最终验收。
