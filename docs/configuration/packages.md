---
title: Package 与 Module 配置
---

新 Package 使用独立 `package.yaml`，不继续扩展头文件注释中的旧 XRobot manifest。
Legacy Adapter 可以读取旧 manifest，但不会把隐藏在构造函数中的依赖视为可跨节点
端口。

Module 描述必须包含公开端口类型、硬件能力、Executor 需求、固定资源和放置约束。
工具在构建 C++ 之前校验引用、类型和循环依赖，并拒绝未知配置键。
