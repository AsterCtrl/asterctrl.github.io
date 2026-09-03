---
title: 编写 Module
---

# Portable Module

Module 的公共生命周期只有四个操作：`Info()`、`Initialize(CoreRef)`、`Start()` 和
`Shutdown()`。构造函数不启动线程、不订阅 Channel，也不接触硬件。

在 `Initialize()` 中通过 CoreRef 获取 Configurator、Logger、Executor、Channel、RPC、
Parameter、Clock、Allocator 和 HardwareManager。保存窄句柄，不保存平台对象。

硬件能力由 `module.yaml` 声明 Requirement，由 Deployment 选择 Provider。业务 Module
不得包含条件编译的“仿真分支”，也不得直接使用 POSIX、Zephyr 或芯片 HAL。

注册表在所有 Module 初始化后封闭，因此运行期间新增 Port、Provider 或 Route 会失败。
