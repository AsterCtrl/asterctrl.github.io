---
title: 发布与开发日志
---

# v0.2 发布门禁

## 当前版本

[`v0.2.0-alpha.1`](https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1)
已于 2026-09-04 发布。它通过了：

- Linux x86_64 与 arm64 构建，GCC/Clang、ASan/UBSan/TSan 和 SocketCAN `vcan` 测试；
- bounded Protobuf、双图解析、确定性 Lock、负向 Fixture 与文档门禁；
- Zephyr `native_sim` 与 QEMU Runtime smoke；
- `dev_c`、`mc02` 及生成式 CAN/USB 节点的 compile/link/size gate；
- 固定依赖准备完成后的离线复建。

发布页提供 Linux 包、compile-only Zephyr 固件、Schema/Lock/开发日志元数据、CycloneDX
SBOM 和 `SHA256SUMS`。发布工件均由标签源码重新构建，不把主分支临时产物直接升级为发布包。

## Alpha 后的主分支进展

- 生成式 CAN 节点现已同时组成 bounded Channel 和 unary RPC，并覆盖 client/server、
  deadline、重试与对端重启恢复；
- `asterctrl-boards` 已提供统一 qualification 固件与证据记录器，两个目标均通过 Zephyr
  4.4 compile/link/size gate；
- 这些结果缩小了正式版缺口，但仍不是实板通过记录。

## Alpha 边界

`v0.2.0-alpha.1` 用于架构验证和集成试用，不代表硬件验收完成。它尚未完成：

- `dev_c` 与 `mc02` 的 console、clock、CAN、UART、SPI、watchdog 实板 smoke；
- USB CDC ACM 真实枚举；
- 两块实板之间的 CAN 数据链路、丢包、重启和恢复测试。

正式 `v0.2.0` 必须完成两块板实测和 CAN 跨节点故障测试；USB 真实枚举若仍未完成，
Release Notes 必须继续明确标注。

正式版验证完成后，旧核心仓库只读归档并从官网导航、组织置顶和活跃 Workspace 移除，历史
仍可通过原 URL 查阅。
