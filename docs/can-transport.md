---
title: 紧凑 CAN 数据面
---

经典 CAN 的 8 字节 payload 不承载通用 DDS envelope。部署期已经知道 Node、Route、
类型和 QoS，因此 arbitration ID 直接表达 Route 与优先级。

Fast Path 服务周期控制和状态，使用固定布局、latest 语义和最小序号。Reliable Path
服务 Service、Action、配置和离散事件，支持分片、确认与重试，但优先级低于控制帧。

总线报告按最坏位填充计算，并包含电机和超电等保留流量。控制流量不自适应降频；UI、
日志和遥测可以合并或降频。超过预算时 compiler 拒绝生成固件。

## 当前 classic CAN 布局

- 11-bit arbitration ID 由静态优先级与 Route ID 组成，不发送字符串 Topic 名。
- 单帧 Fast Path 使用 1 B sequence；分片 Fast Path 使用 sequence + fragment header。
- Reliable Path 每片保留 6 B 数据，使用 4-bit sequence、ACK、超时与有限重试。
- 握手比较 protocol version、deployment hash 与 schema hash；不一致时应用 Runtime 不启动。
- 心跳和轻量时间同步不承担 broker 职责，任一 Node 失联不影响另一侧本地 Topic。

`FastTopicEgress` 在真正编码/写 CAN 前执行生成的 `max_rate_hz`，被节流样本计入
`rate_limited`；它不只是预算报告中的一个数字。接收端用 source timestamp、sequence 和
`max_age` 拒绝陈旧/回拨样本，分片缺失不会向应用泄漏半条消息。

当前双板生成器只给 framework adapter 安装 `0x001..0x007`、`0x208..0x209`、`0x212`
和 `0x40b..0x411` 四组精确 filter。Dev C 的 DJI `0x203/0x20a/0x2ff` 等设备流量不会
被误交给 Route decoder；畸形应用帧只增加错误统计，不会让固件主循环 Halt。

## 已验证与未验证

host 测试覆盖 Fast Path 分片/乱序/丢片恢复、Reliable ACK/重复/重试、Topic rate limit、
跨 CAN Service/Action、握手不匹配、心跳失联/恢复和零热路径分配。当前 deployment 在
1 Mbit/s 下总静态利用率为 `0.60563 < 0.65`。

尚未完成的是目标总线示波器占用、长期错误帧压力、CAN error-passive/bus-off 恢复和真实
双板时钟漂移测量；静态预算不能替代这些硬件证据。
