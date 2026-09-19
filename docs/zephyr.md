---
title: Zephyr 与官方板卡
---

# Board 与 Zephyr 状态

官方板卡仓库是 `AsterCtrl/asterctrl-boards`，v0.2 提供：

- `dev_c`；
- `mc02`。

Board Devicetree 只描述板卡事实，例如 SoC、时钟、Flash/SRAM、固定外设和连接。新部署
编译器完成后，平台资源和 overlay 会由 `deployment.yaml` 生成；当前仍处于迁移阶段。

Zephyr 依赖由 `west.yml` 固定，不能由 CMake `FetchContent` 获取。应用用户选择 Runtime
和可选 Deployment，目标是由 `aster` 在 configure 前生成 Kconfig、Devicetree 和静态注册表。
当前 Zephyr 生成器仍消费 v1alpha2 输入，不能把它当成新路径。

板卡仓库中的 `samples/qualification` 用同一份固件测试 console、monotonic clock、console
UART TX、BMI08x SPI sample、CAN controller loopback 和 watchdog feed，并输出可机读的
`ASTERCTRL_HW_SMOKE` 标记。完成实测后，使用
`scripts/record_hardware_smoke.py` 将完整串口日志与实际烧录固件的 SHA-256、板名、操作者、
UTC 时间和仓库提交绑定为证据。记录器会拒绝缺项、失败标记或覆盖已有记录。

正式 v0.2 发布要求 `dev_c` 与 `mc02` 都产生这套实板证据。CI 编译 qualification 固件
只能证明配置和链接成立，不能代替实板；外部 UART RX、CAN 收发器和连接器仍需接线夹具
验证。
