---
title: 参与贡献
---

# 工程规范

使用 GitHub Flow 和 Squash Merge。提交主题格式为 `scope: lowercase summary`，公共 Interface
变更同时更新测试、Changelog 和文档。

PR 必须通过 C++ format/tidy、Host sanitizer、Runtime 与旧 Graph fixture、wire
compatibility、Zephyr 构建、文档构建、依赖许可证和禁止依赖扫描。工作流配置不等于
当前主机已经完成所有 Zephyr 或实板门禁。

平台行为应放在现有 Seam 的 Adapter 内。只有出现真实的第二种 Implementation 时才新增
Seam，避免把平台细节扩散到每个业务 Module。
