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

目标固件当前链接结果为：

| 节点 | Flash | RAM | text | data | bss |
| --- | ---: | ---: | ---: | ---: | ---: |
| MC02 H7 chassis | 264656 | 97704 | 260920 | 3732 | 93960 |
| C board F4 gimbal | 247472 | 101384 | 240216 | 7244 | 94136 |

Flash 来自链接器 memory region，RAM 包含链接脚本保留的 heap/stack；`text/data/bss` 来自
Arm GNU `size`，不能把两种口径混为一个百分比。F4 当前使用 77.35% 主 RAM，是首烧后
必须继续测任务栈水位的主要资源风险。

## 已验证的控制路径约束

当前 `chassis-wheel-legged` host 测试在全局 `operator new` 计数器下执行一次完整的
Topic 输入、双 `MotorGroup::Snapshot`、五连杆/LQR/VMC 计算、双组 `Apply` 和状态发布，
计数保持不变。相同测试在 AppleClang 17 的严格告警、AddressSanitizer 与
UndefinedBehaviorSanitizer 下通过。

这只证明该 host 路径没有动态分配和已检测的内存/未定义行为问题，不等价于 MCU
WCET、栈上界或 deadline 已验证。周期耗时、任务栈水位和中断干扰仍必须由目标板测量。

当前测试还覆盖趴地功控的六参数估算/逆解、超电状态机、无上限透传、比例限流、
NaN/零功率 fail-closed，以及最终 `torque_limit_nm` 到 Motor 命令的集成路径。Motor
adapter 的测试直接解码 CAN，验证 `268/17` M3508 在 20 A 时约为 4.9256 Nm，并验证
DJI 速度 PID 与 DM torque frame 都执行同一可移植上限。两组测试均通过严格告警和
ASan/UBSan。

`inf-wheel-legged-input` 也在全局 `operator new` 计数器下完成一次真实 Runtime Poll、
周期 Executor、latest 输入映射、仲裁和 `RobotIntent` 发布，计数保持不变。其失败注入
覆盖 source 超龄/离线、非法 source 和 publisher 背压，同样只证明 host 热路径。

`dr16` 与 `vt13` 的真实 Runtime 周期也在全局分配计数器下保持不变。读取预算固定为
每周期最多 4 次、每次最多 64 B；测试以 5 B UART 分片证明 VT13 的 21 B 帧会跨两个
周期完成，而不会突破预算。协议测试覆盖错位/丢字节恢复、CRC 或物理域错误、100 ms
失联、读取失败和离线发布背压；它们没有测量目标 MCU 上的 UART 队列高水位或 WCET。

`inf-wheel-legged-ui` 的完整绘制也在全局分配计数器下保持零动态分配。其 64 项固定队列
存储绘制动作而不是 120 B 完整帧；每个 50 ms Executor 周期最多准备或重试一条命令，
`refresh_hz=10` 进一步限制 UART 接受速率。该测试覆盖完整重绘、无效五连杆、裁判重连
和 writer 背压，但尚未测量 MC02 UART TX 队列高水位与 DMA 延迟。

当前双板 deployment report 生成 F4 侧 8 个 Executor、声明栈 24,064 B，H7 侧 5 个
Executor、声明栈 23,552 B。经典 CAN 1 Mbit/s 下应用 route 利用率为 0.28430，握手/
心跳/时间同步控制面为 0.02133，设备预留为 0.30000，总计 0.60563，低于 0.65 构建
上限。该数值包含最坏 bit stuffing、帧间隔和当前 10 条跨板 route；它是静态上界报告，
不是示波器实测总线占用。
