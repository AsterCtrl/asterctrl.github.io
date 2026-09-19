---
title: 发布与开发日志
---

# v0.2 发布状态

## 当前版本

[`v0.2.0-alpha.1`](https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1)
已于 2026-09-04 发布。它是架构验证和集成试用的 compile-only alpha，不是正式硬件版本。
当前仓库已通过的 Host 证据包括：

- Linux Host 的 C++、Python、ABI、Local Channel/RPC、配置解析和 Package 测试；
- bounded Protobuf、旧 Graph 负向 Fixture、确定性生成和双语文档构建；
- ASan/UBSan、TSan、Clang format/tidy、依赖和离线 Host 检查。

这些证据不等价于当前 revision 已完成 Linux GCC/arm64、Zephyr、实板或新跨节点 Runtime
验收。

发布页提供 Linux 包、compile-only Zephyr 固件、Schema/Lock/开发日志元数据、CycloneDX
SBOM 和 `SHA256SUMS`。发布工件均由标签源码重新构建，不把主分支临时产物直接升级为发布包。

## Alpha 后的主分支进展

后续发布前必须重新核对核心仓库审计中的 Linux、Zephyr、CAN/USB 和官网状态，不能把旧
v1alpha2 生成节点测试写成 v1alpha3 部署已完成。

## Alpha 边界

`v0.2.0-alpha.1` 用于架构验证和集成试用，不代表硬件验收完成。它尚未完成：

- `dev_c` 与 `mc02` 的 console、clock、CAN、UART、SPI、watchdog 实板 smoke；
- USB CDC ACM 真实枚举；
- 两块实板之间的 CAN 数据链路、丢包、重启和恢复测试。

正式 `v0.2.0` 必须完成两块板实测和 CAN 跨节点故障测试；USB 真实枚举若仍未完成，
Release Notes 必须继续明确标注。

旧仓库归档和官网导航清理属于发布后的管理动作；当前不自动操作远端或销毁历史。
