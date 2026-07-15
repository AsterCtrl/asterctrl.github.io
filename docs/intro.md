---
sidebar_position: 1
slug: /
title: 框架概览
---

这套框架面向资源受限 MCU、Linux 和未来仿真环境中的分布式机器人控制。
首个参考实现是 C 板 F4 与 MC02 H7 组成的双板轮腿机器人。

框架保留 XRobot/libxr 的静态嵌入式取向，同时补齐模块生命周期、统一执行器、
Schema First 消息、部署图编译、紧凑 CAN 路由和可验证的失联策略。

```text
robot.yaml + deployment.yaml
              |
       deployment compiler
       /                 \
F4 static firmware   H7 static firmware
       \                 /
        compiled CAN routes
```

当前状态以仓库测试和生成报告为准。文档不会把规划中的能力描述成已经完成。

截至 2026-07-16，首个纵向切片已经生成并链接 Dev C F4 与 MC02 H7 的完整
`.elf/.hex/.bin/.map`，两次 deployment codegen 逐文件一致，两个 firmware report 均为
`ready: true`。这里的“可烧录”表示镜像、入口、BSP、设备和静态路由已经闭合；尚未进行
硬件闭环、方向/零位、真实总线 capture、WCET 与 stack watermark 验收。

## 第一阶段目标

- 迁移 control-2026 轮腿机器人的完整双板行为。
- 建立独立 Runtime、工具、消息和传输 Package。
- 生成两块板的静态组合、路由和资源报告。
- 在没有硬件闭环的条件下完成构建、协议、故障与数值验证。

生产级 Linux Runtime、ROS 2/DDS Bridge、完整物理仿真和其他 MCU BSP 属于
后续里程碑，但当前公共 API 不得阻断这些扩展。
