---
title: 性能与实时性
---

性能结论必须来自可复现的 benchmark、链接器 map 或 deployment report。

框架至少持续报告：

- 每个 Node 的 text、data、bss、固定消息池和任务栈。
- 每条 Route 的最大编码长度、发送频率、帧数和 deadline。
- CAN 最坏位填充后的负载，而不只计算 payload 字节。
- 实际发送/接收频率、丢弃、合并、重试和队列高水位。
- 消息年龄、deadline miss 和时钟同步状态。

当前权威 control-2026 构建基线为：

| 节点 | text | data | bss |
| --- | ---: | ---: | ---: |
| MC02 H7 chassis | 119472 | 6052 | 69512 |
| C board F4 gimbal | 89832 | 2928 | 76920 |

这些数字只是迁移比较基线，不是新框架已经达到的性能结果。
