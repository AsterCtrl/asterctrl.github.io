---
title: Package 与插件
---

# 声明式 Package

Package Manifest 声明导出的 Module、消息类型、Core Plugin、平台支持、资源上限、依赖和
许可证。`aster package lock` 将 Git commit 或归档 Hash 固定到 `package.lock`。

解析 Package 不执行仓库中的任意 Python。生成扩展通过版本化 Backend Interface 和声明式
Schema 接入。Linux Plugin 是 `.so`，Zephyr 使用同一 Manifest 生成静态链接项。

CMake `FetchContent` 可用于固定版本的 Host 依赖或测试工具；Zephyr module 必须通过 west。
