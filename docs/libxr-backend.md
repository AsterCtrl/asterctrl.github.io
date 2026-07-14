---
title: libxr Backend 与 BSP
---

libxr 提供线程、同步、内存、时间、HardwareContainer 和 CAN/UART/SPI 等底层能力。
`runtime-libxr` 将这些能力适配为框架 Runtime，但平台类型不能穿过 portable API。

BSP 描述物理板能力，hardware profile 描述机器人在该板上的接线。应用 Module 只请求
诸如 `robot_bus` 或 `imu_spi` 的逻辑资源，切换板型时由配置重新绑定。
