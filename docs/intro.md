---
sidebar_position: 1
slug: /
title: AsterCtrl 概览
---

AsterCtrl 是面向资源受限 MCU、Linux 进程和仿真环境的分布式控制框架。它把“系统做什么”
和“这些行为在哪里运行”分成 Application 与 Deployment 两张图，再在构建期生成每个逻辑
Node 的运行组合、静态路由、资源预算和版本锁。

应用开发者使用同一套 Module、Topic、Service、Action 和 Parameter API 描述控制行为；
部署编译器根据目标配置决定模块运行位置、本地或远端路由、固定内存和平台适配。硬件、
操作系统或进程边界因此不需要成为业务分支。

```text
Application graph + Deployment + Target profiles
                         |
               aster deploy compile
             /           |           \
       MCU firmware   Linux process   simulation
             \           |           /
               versioned message contracts
```

## 核心边界

- **AsterCtrl Runtime** 管理生命周期、Executor、端口、参数与诊断。
- **AsterCtrl Tools** 校验 Package、应用图与部署图，并生成静态组合和报告。
- **AsterCtrl Transports** 实现跨节点协议；应用看不到板间通信分支。
- **Platform Backends** 适配 libxr、RTOS、裸机、Linux 或仿真能力。
- **Domain Packages** 提供传感器、执行器、控制算法和产品专属逻辑，但不属于框架核心。

Package 是否参与构建由 workspace 和应用图决定。AsterCtrl 不要求安装任何特定电机、IMU、
执行机构或操作设备，也不规定应用必须采用某一种被控对象。

## 当前实现范围

当前 MCU Runtime、Schema/TypeSupport、静态 deployment compiler、紧凑 CAN transport、
libxr backend 和固件生成链路已有可执行测试。生产级 Linux Runtime、DDS/ROS 2 Bridge、
完整物理仿真以及更多 MCU/RTOS backend 仍在路线图中。能力状态以测试、benchmark 和
生成报告为准，不以路线图代替实现。

## 从哪里开始

1. 阅读[设计思想](./concept.md)理解 Application、Deployment 与运行时去中心化。
2. 按[环境配置](./setup.md)建立第一个 workspace。
3. 通过[基础编程](./basic/module.md)实现 Module。
4. 使用[Deployment](./configuration/deployment.md)把逻辑映射到目标节点。
