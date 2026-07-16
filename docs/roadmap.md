---
title: 路线图
---

## 当前基础

- MCU Runtime、Schema/TypeSupport、deployment compiler 与紧凑 CAN 已形成可链接纵向切片。
- Host、sanitizer、协议向量、故障注入、确定性 codegen、链路预算和 ELF 静态审计已有测试。
- libxr backend 与 BSP 集成可以生成完整 MCU target，具体产品仍需各自完成硬件验收。

## 后续里程碑

- 生产级 Linux Runtime、进程内与进程间 backend。
- AimRT、ROS 2、DDS 和 Zenoh Bridge。
- 模拟时钟、设备仿真、记录回放和物理仿真。
- ESP32、更多 STM32 系列、MSPM0 与更多 RTOS/裸机 conformance。
- OTA、安全、崩溃恢复、长期压力和工业认证工作。

后续 target 不能倒逼 MCU 热路径引入动态发现、无界分配或平台类型泄漏。

Sim/real 共接口通过 simulator hardware profile 与 backend 复用同一 Module、Schema 和
应用图；不能把物理引擎条件编译进控制源码。特定设备的模型推导和参数脚本保留在对应
领域 Package，而不是进入 AsterCtrl 核心。
