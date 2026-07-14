---
title: 设计思想
---

框架把 XRobot 文档中的 LibXR 原则视为硬约束，而不是性能优化建议。

## 有界数据流

ISR 和 DMA 负责及时完成缓冲交接、外设 rearm 和有限状态推进。协议解析、控制
决策和日志等工作交给 Executor。热路径不依赖阻塞锁、调度顺序或临时分配。

## 初始化准备资源

模块在 `Initialize` 阶段注册端口并申请固定资源，在 `Start` 后只使用有界队列、
预分配消息槽和静态路由。部署编译器必须给出 RAM、队列和任务栈上界。

## 上下文必须显式

`ModuleContext` 提供 Runtime 服务；`ExecutionContext` 表示当前是线程、回调还是
ISR。二者不能混为一谈。ISR-safe API 的能力严格小于线程 API。

## 完成行为必须明确

底层 I/O 在发起时绑定完成策略。Topic 发布只承诺本地 Runtime 接受消息，不把
“送达所有远端节点”伪装成同步保证。Service 和 Action 明确处理超时和取消。

## 平台类型不能泄漏

可移植接口表达能力与语义，不出现 HAL handle、FreeRTOS task、POSIX fd 或
libxr 具体类型。平台能力由 backend 适配。
