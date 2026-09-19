---
title: 架构
---

# Module、Interface、Seam 与 Adapter

可移植 Runtime 是一个深 Module：小型 Interface 后面隐藏生命周期、注册封闭、容量
检查和失败回滚。Clock、Executor 和 Transport 是真正发生变化的 Seam，Linux、Zephyr
和测试替身是这些 Seam 上的 Adapter。算法 Module 不需要认识操作系统头文件或板卡细节。

Module 生命周期固定为：

1. 加载 Package；
2. `Initialize(CoreRef)` 并注册 Channel/RPC；
3. Runtime 封闭所有注册表；
4. `Start()`；
5. 运行；
6. 逆序 `Shutdown()`。

任一阶段失败都会逆序回滚。Zephyr 热路径不使用堆分配、异常、RTTI 或无界容器。

Linux Package 通过版本化 C ABI 加载 `.so` Module。ABI 不传递 STL、异常或所有权不明确
的对象。Zephyr 目标是消费同一 Package Manifest，并在构建期生成静态注册表；这条
v1alpha3 路径尚未完成。

HardwareManager、Provider 和通用 Capability 编排属于旧迁移实现，不是新算法 Module
的必选契约。硬件访问由 Driver Module 或平台 Adapter 持有，算法通过 Channel/RPC
交互。
