---
title: 发布与开发日志
---

# v0.2 发布门禁

`v0.2.0-alpha.1` 允许两块板只完成 compile/link/size gate。正式 `v0.2.0` 必须完成 dev_c、
mc02 实板 smoke 和 CAN 跨节点丢包/重启测试。

Release 包含源码、Linux artifact、两板固件、Schema、Lock、校验和、SBOM、Changelog、
Development Log 和回滚说明。USB 真实枚举未作为门禁时，Release Notes 必须明确标注。

正式版验证完成后，旧核心仓库只读归档并从官网导航、组织置顶和活跃 Workspace 移除，历史
仍可通过原 URL 查阅。
