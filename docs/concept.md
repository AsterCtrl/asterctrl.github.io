---
title: 设计思想
---

AsterCtrl 的目的不是再包装一层 HAL，也不是把某个嵌入式框架搬到更多平台。它要解决的
问题是：**怎样让一套控制逻辑在多块控制器、不同操作系统和仿真环境之间重新部署，而不把
板卡、线程、总线和进程边界写回业务代码。**

框架把控制系统视为三个可以独立演化、最终在构建期合并的模型：

```text
Application graph
行为、实例和逻辑端口
        +
Deployment graph
位置、平台和物理 Link
        +
Contracts
类型、时序和故障语义
        |
  aster compiler
        |
Node composition
路由、预算和版本锁
        |
MCU / Linux / simulation
```

这不是为了让所有平台看起来完全相同，而是让平台差异出现在正确的层中，并且能够被工具
检查、生成和追踪。

## 行为与部署是两张图

`Application` 描述 Module 实例、逻辑端口和产品参数，回答“系统做什么”。`Deployment`
描述逻辑 Node、实例放置、目标平台、物理 Link 和 QoS，回答“这些行为在哪里运行”。

业务 Module 不判断自己运行在 MCU、Linux 还是仿真进程，也不因为 Topic 跨板就调用另一套
API。更换控制器或拆分节点时，修改 deployment、target 和 hardware profile；只有控制行为
本身变化时才修改 Application 或 Module。

因此，AsterCtrl 的核心产物不是一个通用 `main()`，而是 deployment compiler 针对每个
逻辑 Node 生成的确定性运行组合。

## 位置透明，时间不透明

Topic、Service 和 Action 表达 Module 之间的语义关系。本地调用、板间 CAN、进程间共享
内存或未来的网络传输由部署编译器和 transport backend 决定，上层不出现 `send_to_h7()`
或 `if (simulation)` 一类分支。

但位置透明绝不等于忽略物理代价。跨节点 Route 必须显式声明频率、deadline、最大消息
年龄、可靠性和失联行为。无法满足硬实时闭环的端口可以约束为同节点放置。所谓“同一套
代码切换 sim 和 real”，指 Module API、消息契约和控制行为不变，不承诺传输延迟、设备
模型或动力学天然相同。

## 构建期集中，运行时去中心化

AsterCtrl 在构建期获得整套系统视图，用它完成实例放置、类型检查、静态路由分配、资源
预算和版本锁定。生成后，每个 Node 都拥有独立入口、固定组合和本地 Runtime，不依赖
master、broker 或某个中心节点维持控制数据流。

时间基准节点只提供时钟同步，不承担消息路由。节点重启或链路中断时，其余节点按照已生成
的 deadline 和故障策略继续运行或进入安全状态，而不是等待中心服务重新编排系统。

这里的“去中心化”描述运行时拓扑，不表示取消全局一致性。Package lock、deployment lock、
Schema hash 和协议版本共同定义一次整机发布；不兼容的节点在启动握手阶段不得使能控制链路。

## 每项事实只有一个所有者

跨平台系统最容易失控的原因不是 YAML 太少，而是同一个事实被复制到多处。AsterCtrl 按变化
原因拆分配置：

| 事实 | 所有者 |
| --- | --- |
| 可复用代码、版本和依赖 | `package.yaml` 与 package lock |
| Module 的端口、参数和能力需求 | `module.yaml` |
| 产品行为实例及逻辑连接 | `application.yaml` |
| 芯片和板卡提供的资源 | BSP 与 target profile |
| 产品接线和逻辑设备别名 | hardware profile |
| 实例放置、Link、QoS 和预算 | `deployment.yaml` |
| Node ID、Route ID 和线协议版本 | deployment lock |

Module 请求“一个带时间戳的惯性传感器”或“一个可控执行器”，不请求某个 HAL handle、具体
引脚或总线编号。hardware profile 完成产品接线，backend 把抽象能力落到平台 API。

## 资源预算是正确性的一部分

对于控制系统，“能够编译”但无法按时运行并不算正确。消息最大编码长度、队列深度、固定
内存、Executor、任务栈、CAN 最坏负载、deadline 和消息年龄都属于部署契约。

能在构建期证明的约束由工具检查，超出预算时直接拒绝生成；只能在目标机上测量的 WCET、
栈水位和链路抖动必须进入报告与验收记录。性能页面只引用可重复的 benchmark 和生成报告，
不把某次应用数据包装成框架承诺。

## 故障是接口语义，不是补丁

每条控制订阅都必须回答四个问题：多久没有新数据算失效、允许使用多旧的数据、失效后执行
什么策略、满足什么条件才能重新使能。Runtime 负责检测 deadline、消息年龄和链路状态；
最终执行器 Module 拥有具体安全动作，因为只有它理解设备的安全边界。

框架不允许无限期沿用最后一条控制命令，也不把“发出消息”等同于“远端已经执行”。Service
和 Action 必须显式处理超时、取消和迟到结果。

## 核心提供机制，Package 表达领域

AsterCtrl 核心只提供生命周期、Executor、通信契约、部署、诊断和平台适配机制。传感器、
电机、机械结构、飞行器、喷涂工艺、能源系统或生产设备的策略都属于独立 Domain Package。

一个 workspace 可以组合多个产品；一个 Package 可以导出多个 Module 和纯算法 target；未被
Application 实例化的 Package 不进入运行镜像。框架不内置“底盘加云台”之类的机器人结构，
也不要求所有 Package 都拆成单 Module 仓库。

## 思想来源不等于框架定义

AsterCtrl 复用了几类已经被验证的思想，但它们在这里承担不同职责：

- libxr 和 XRobot 提供 MCU I/O、ISR/DMA、静态资源和可复用 Package 的工程基础。
- AimRT 启发 Module、Runtime、Executor、Plugin、TypeSupport 与部署配置的职责分离。
- Schema First 消息系统提供跨语言、跨节点和仿真实物共用的稳定契约。
- AsterCtrl 自己补上整机 Application/Deployment 双图、板级能力分层、静态跨节点路由、
  MCU 资源预算和多固件一致发布。

因此，libxr/XRobot 的实时原则是 AsterCtrl 的实现地基，不是它的全部设计思想。所有 backend
仍必须遵守以下纪律：初始化阶段准备资源，热路径有界且不动态分配；ISR 和回调不阻塞、不
展开业务；`ExecutionContext` 显式区分线程、回调和 ISR；I/O 发起时绑定完成行为；公共接口
不泄漏 HAL、FreeRTOS、POSIX 或 libxr 平台类型。
