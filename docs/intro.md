---
sidebar_position: 1
slug: /
title: Aster 概览
---

Aster 是面向资源受限 MCU、Linux 进程和仿真环境的分布式机器人框架。应用开发者使用
同一套 Module、Topic、Service、Action 和 Parameter API 描述机器人行为；部署编译器
根据目标配置决定模块运行位置、本地或远端路由、固定内存和平台适配。

```text
Application graph + Deployment + Target profiles
                         |
                  asterctl compile
             /           |           \
       MCU firmware   Linux process   simulation
             \           |           /
               versioned message contracts
```

## 核心边界

- **Aster Runtime** 管理生命周期、Executor、端口、参数与诊断。
- **Aster Tools** 校验 Package、机器人图与部署图，并生成静态组合和报告。
- **Aster Transports** 实现跨节点协议；应用看不到板间通信分支。
- **Platform Backends** 适配 libxr、RTOS、裸机、Linux 或仿真能力。
- **Domain Packages** 提供传感器、执行器、运动控制和机器人专属逻辑，但不属于框架核心。

Package 是否参与构建由 workspace 和机器人图决定。Aster 不要求安装任何特定电机、IMU、
底盘或操作设备，也不规定机器人必须采用某一种机械结构。

## 当前实现范围

当前 MCU Runtime、Schema/TypeSupport、静态 deployment compiler、紧凑 CAN transport、
libxr backend 和固件生成链路已有可执行测试。生产级 Linux Runtime、DDS/ROS 2 Bridge、
完整物理仿真以及更多 MCU/RTOS backend 仍在路线图中。能力状态以测试、benchmark 和
生成报告为准，不以路线图代替实现。

## 从哪里开始

1. 阅读[设计思想](./concept.md)理解实时性边界。
2. 按[环境配置](./setup.md)建立第一个 workspace。
3. 通过[基础编程](./basic/module.md)实现 Module。
4. 使用[Deployment](./configuration/deployment.md)把逻辑映射到目标节点。
