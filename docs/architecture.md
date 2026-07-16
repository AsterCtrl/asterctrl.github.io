---
title: 架构与术语
---

| 概念 | 含义 |
| --- | --- |
| Package | Git、版本和依赖发布单元，可导出多个 Module 与纯库 |
| Module | 具有生命周期、端口、参数和能力需求的可部署运行单元 |
| Application | Module 实例、产品参数和逻辑端口组成的行为图 |
| Node | 一个固件镜像或进程中的 Runtime 实例 |
| Runtime | 管理生命周期、Executor、通信、参数和诊断 |
| Backend | Runtime 能力在某个平台或传输上的实现 |
| Target | Node 使用的 BSP、操作系统、工具链和构建 profile |
| Hardware Profile | 产品逻辑设备到板级资源、驱动参数和接线的映射 |
| Link | Node 之间的物理总线、进程间通道或网络连接 |
| TypeSupport | 类型标识、最大尺寸、编码和解码契约 |
| Deployment | 实例到逻辑 Node、Target、Link、QoS 和预算的映射 |

模块逻辑与部署分离，但位置透明不等于时间透明。硬实时闭环可以声明必须与设备
同节点；可跨节点端口必须声明 deadline、消息年龄和失联策略。

Runtime 的 MCU 实现使用静态注册和提前生成的路由，不需要 broker 或运行时动态
发现。未来 Linux backend 可以拥有不同执行器和进程间传输，但不改变 Module API。
