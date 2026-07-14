---
title: 环境配置
---

第一阶段开发环境需要 CMake、Ninja、C++20 编译器、Python 3.11 以上、Node.js 20
以上和 Arm GNU Toolchain。

所有依赖版本最终由 workspace 与 lock 文件确定。上游 XRobot、libxr 和权威
control-2026 工作区均视为只读输入，不在初始化脚本中执行隐式 pull 或 checkout。

每个 Package 都必须提供独立的 host 构建或验证入口。顶层工具负责按 lock 解析
Package，而不是依赖开发者本机碰巧存在的目录顺序。
