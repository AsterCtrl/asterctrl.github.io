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

## 已验证的控制路径约束

当前 `chassis-wheel-legged` host 测试在全局 `operator new` 计数器下执行一次完整的
Topic 输入、双 `MotorGroup::Snapshot`、五连杆/LQR/VMC 计算、双组 `Apply` 和状态发布，
计数保持不变。相同测试在 AppleClang 17 的严格告警、AddressSanitizer 与
UndefinedBehaviorSanitizer 下通过。

这只证明该 host 路径没有动态分配和已检测的内存/未定义行为问题，不等价于 MCU
WCET、栈上界或 deadline 已验证。周期耗时、MC02 RAM/栈与中断干扰必须由后续固件
map、栈水位和目标板测量补齐。

`inf-wheel-legged-input` 也在全局 `operator new` 计数器下完成一次真实 Runtime Poll、
周期 Executor、latest 输入映射、仲裁和 `RobotIntent` 发布，计数保持不变。其失败注入
覆盖 source 超龄/离线、非法 source 和 publisher 背压，同样只证明 host 热路径。

当前双板 deployment report 生成 F4 侧 7 个 Executor、声明栈 17,920 B，H7 侧 6 个
Executor、声明栈 24,576 B。经典 CAN 1 Mbit/s 下语义 route 利用率为 0.2839，设备预留
为 0.3000，总计 0.5839，低于 0.65 构建上限。该数值包含最坏 bit stuffing、帧间隔和
当前 10 条跨板 route；它是静态上界报告，不是示波器实测总线占用。
