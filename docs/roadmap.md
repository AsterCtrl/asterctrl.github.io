---
title: 路线图
---

## 当前纵向切片

- Runtime、Schema、deployment compiler 与紧凑 CAN 已形成可链接纵向切片。
- C 板 F4 + MC02 H7 双板轮腿生成真实 `.elf/.hex/.bin/.map`。
- Host、sanitizer、协议、故障注入、确定性 codegen、CAN 预算和 ELF 静态审计已通过。

软件里程碑不等于实车验收。下一门槛是架空首烧、双板握手、方向/零位、BMI088 安装、
裁判与超电实录、USB 断线重枚举、机构闭环、WCET 和 stack watermark。

## 后续里程碑

- 生产级 Linux Runtime 与进程间 backend。
- AimRT、ROS 2、DDS 和 Zenoh Bridge。
- 模拟时钟、设备仿真、记录回放和物理仿真。
- ESP32、G4、MSPM0 与更多 RTOS/裸机 conformance。
- OTA、安全、崩溃恢复、长期压力和工业认证工作。

后续项目不能倒逼 MCU 热路径引入动态发现、无界分配或平台类型泄漏。

仿真里程碑保留当前 Q/R 到 LQR K 的 MATLAB 推导脚本。Sim/real 共接口应新增 simulator
hardware profile 与 backend，复用同一 Module/Schema/robot graph；不能把物理引擎条件
编译进轮腿控制源码。
