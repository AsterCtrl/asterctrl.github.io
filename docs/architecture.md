---
title: 架构
---

# Module、Interface、Seam 与 Adapter

可移植 Core 是一个深 Module：小型 Interface 后面隐藏生命周期、注册封闭、路由、
容量检查和失败回滚。Clock、Executor、Hardware 与 Transport 是真正发生变化的 Seam，
Linux、Zephyr 和测试 Fake 是这些 Seam 上的 Adapter。

Module 生命周期固定为：

1. 加载 Package；
2. `Initialize(CoreRef)` 并注册 Channel/RPC；
3. Runtime 封闭所有注册表；
4. `Start()`；
5. 运行；
6. 逆序 `Shutdown()`。

任一阶段失败都会逆序回滚。Zephyr 热路径不使用堆分配、异常、RTTI 或无界容器。

Linux Package 通过版本化 C ABI 加载 `.so` ModuleBundle/CorePlugin。ABI 不传递 STL、
异常或所有权不明确的对象。Zephyr 消费同一 Package Manifest，但在构建期生成静态注册表。
