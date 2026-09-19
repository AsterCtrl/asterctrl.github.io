---
title: 编写 Module
---

# Portable Module

Module 的公共生命周期只有四个操作：`Info()`、`Initialize(CoreRef)`、`Start()` 和
`Shutdown()`。构造函数不启动线程、不订阅 Channel，也不接触硬件。

在 `Initialize()` 中通过 CoreRef 获取 Configurator、Logger、Executor、Channel、RPC、
Parameter、Clock 和 Allocator。保存窄句柄，不保存平台对象。HardwareManager 不再是
可移植算法 Module 的默认依赖。

硬件访问放在 Driver Module 或平台 Adapter 中。业务 Module 不得包含条件编译的
“仿真分支”，也不得直接使用 POSIX、Zephyr 或芯片 HAL；算法与硬件之间通过
Channel/RPC 交互。

注册表在所有 Module 初始化后封闭，因此运行期间新增 Topic、RPC 或 Route 会失败。
