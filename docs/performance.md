---
title: 性能、内存与实时性
---

Aster 不用单个机器人或单块板的数字代表框架性能。结论必须来自可复现 benchmark、链接器
map、目标板测量或 deployment report，并同时写明 target、工具链、配置和测试负载。

## 构建期报告

deployment compiler 为每个 target 和 Route 生成静态上界：

- text、data、bss、固定消息池和声明任务栈。
- Module、Executor、队列深度和周期。
- 类型最大编码长度、最大频率、分片数和 deadline。
- CAN 最坏位填充、帧间隔、控制面和保留设备流量。
- deployment、Schema、backend 与工具版本哈希。

报告用于阻止明显不可部署的配置，但不是目标板 WCET 或总线示波器测量的替代品。

## 运行期指标

Runtime 和 transport backend 应暴露：

| 维度 | 指标 |
| --- | --- |
| Executor | 运行次数、最大耗时、deadline miss、队列高水位 |
| Topic | 发布、接收、合并、丢弃、消息年龄、stale 次数 |
| Link | 字节率、帧率、重试、CRC/解码错误、sequence gap |
| Time | 同步偏差、漂移、authority 状态和时间回拨 |
| Memory | 固定池使用率、任务栈水位和故障记录 |

诊断本身必须有优先级和带宽预算，不能阻塞 ISR、控制 Executor 或 Fast Path。

## 热路径约束

MCU profile 的 `Start` 之后不得依赖动态分配。测试至少应对完整控制周期、发布/订阅、
设备 Snapshot/Apply 和错误路径安装分配计数器，并配合 ASan/UBSan 与严格编译告警。

零动态分配测试只证明被覆盖路径；它不证明：

- 所有平台库都没有隐藏分配。
- 目标 MCU 的最坏执行时间满足 deadline。
- 中断嵌套、cache、DMA 竞争和总线拥塞已被测量。
- 声明的任务栈在长期运行中足够。

最终产品必须在目标硬件上测量 WCET、stack watermark、真实链路占用和故障恢复。报告页面
可以引用这些产物，但必须保留生成命令、commit 和测试条件。

## CAN 预算口径

经典 CAN 预算按每条消息的最大编码长度计算分片，并计入 arbitration、control、CRC、
ACK、EOF、intermission 与最坏 bit stuffing。握手、心跳、时间同步和非 Aster 设备流量
分别计入；总利用率超过 deployment 上限时构建失败。

静态预算是保守上界，真实总线 capture 用于验证配置和发现突发、重试或未建模设备，不应
反过来用平均负载掩盖最坏情况。
