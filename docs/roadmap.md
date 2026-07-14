---
title: 路线图
---

## 当前纵向切片

- Runtime、Schema、deployment compiler 与紧凑 CAN。
- C 板 F4 + MC02 H7 双板轮腿完整迁移。
- Host、固件构建、协议、故障和资源验证。

## 后续里程碑

- 生产级 Linux Runtime 与进程间 backend。
- AimRT、ROS 2、DDS 和 Zenoh Bridge。
- 模拟时钟、设备仿真、记录回放和物理仿真。
- ESP32、G4、MSPM0 与更多 RTOS/裸机 conformance。
- OTA、安全、崩溃恢复、长期压力和工业认证工作。

后续项目不能倒逼 MCU 热路径引入动态发现、无界分配或平台类型泄漏。
