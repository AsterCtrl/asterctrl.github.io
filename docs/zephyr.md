---
title: Zephyr 与官方板卡
---

# Board 与 Hardware Profile

官方板卡仓库是 `AsterCtrl/asterctrl-boards`，v0.2 提供：

- `dev_c`；
- `mc02`。

Board Devicetree 只描述板卡事实，例如 SoC、时钟、Flash/SRAM、固定外设和连接。机器人接线、
设备别名、校准和具体驱动配置放在 Hardware Profile 或应用 overlay 中。

Zephyr 依赖由 `west.yml` 固定，不能由 CMake `FetchContent` 获取。应用用户选择 Deployment
和 Hardware Profile，`aster` 在 configure 前生成 Kconfig、Devicetree 和静态注册表。

正式 v0.2 发布要求两块实板通过 console、clock、CAN loopback、UART、SPI 和 watchdog smoke。
