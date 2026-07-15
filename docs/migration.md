---
title: control-2026 迁移
---

权威源是本地 `control-2026/infantry_wheel_legged_sjtu` 当前 worktree，而不是远端分支
或单纯 `HEAD`。当前必须保留的未提交行为包括 75 ms 跳跃收腿延时和小陀螺模式的
当前 yaw 跟随。

迁移采用纯算法、运行 Module、设备驱动和部署配置分层。每项 legacy 功能在迁移矩阵
中拥有目标 Package、测试证据和状态，不能以“由新框架替代”为由静默删除。

## 当前轮腿控制切片

`wheel-legged-model` 提供五连杆、速度估计、轨迹规划、LQR 调度和十维状态反馈。
`chassis-wheel-legged` 的可移植核心把这些算法组合为完整平衡周期，Runtime 外壳再负责：

- 200 Hz 生成式周期任务，不在 Module 内创建线程或延时等待。
- `ChassisMotionCommand`、控制参数和 `AttitudeState` 的时间戳新鲜度。
- 四达妙关节与两 DJI 轮电机的两个类型化 `MotorGroup`。
- 失联、故障、NaN、几何不可解和命令拒绝时同时 `Relax()` 两组执行器。
- 高频/低频底盘状态发布与发布背压统计。

关节逻辑顺序固定为右前、右后、左前、左后；轮组顺序为右、左。左右符号、240 个
LQR 多项式系数、23 kg 质量、0.495 m 轮距、腿长范围和 75 ms 收腿保持均来自权威
worktree。严格告警与 ASan/UBSan host 测试通过，完整控制周期有零动态分配断言。

这仍不是“底盘已实机迁移完成”：DJI/达妙 adapter、MC02 固件入口和链接脚本尚未
交付。旧工程平衡态 `PowerControl()` 当前被注释，因此新实现也没有虚构一个平衡功控；
旧工程仍启用的卧倒轮电机功率限制尚待在规范化 adapter 之上迁移。

## 当前输入与协调切片

`inf-wheel-legged-input` 没有制造一个掩盖硬件差异的“通用遥控器包”。`Dr16Mapper` 与
`Vt13Mapper` 分别理解自己的 switch、按键、扳机、鼠标和键盘事实；第一帧只建立快照，
不会把上电时已按住的键伪造成边沿，鼠标 delta 也只消费一次。

最终 `MotionArbiter` 在摇杆越过进入阈值时让遥控器取得平移所有权，回到退出阈值以内
才交还键盘；所有权变化按 `source_blend_ms` 连续混合。离线、超龄、非法轴值、急停档
或非法 `input_source` 每周期发布新的 `PowerOff` intent，不沿用最后一条运动命令。启动
参数 `input_source=1` 将当前权威双板部署固定为 VT13，未选 DR16 不会自动接管。

输入设备本身也已从旧 UART 回调拆出。`dr16` 在任意字节分片上扫描 18 字节 DBUS 帧，
校验五个 11-bit 通道、两个三态 switch 和鼠标键物理域；没有 SOF/CRC 的协议只能用
一字节滑窗恢复。`vt13` 扫描 21 字节 `A9 53` 帧，使用旧工程实际采用的反射
`0x8408`、初值 `0xffff`、无最终 XOR、小端 CRC，而不是旧注释误称的 CCITT-FALSE。
它同时校验保留位、拨片、通道和 2-bit 鼠标键域，并可在前一帧丢字节后保留下一帧 SOF。

两者每 1 ms 最多从 `ByteReader` 取四个 64 B 块。只有完整合法帧刷新 100 ms 在线
看门狗；启动、回拨时钟或超时都发布显式 `online=false`，坏帧不会喂狗。若离线 Topic
因背压发送失败，下一周期继续尝试，不把失败误记为已交付。旧 VT13 驱动里的 toggle
flag 和按键计数没有复制进设备层，边沿与机器人状态仍由 Mapper/协调器拥有。

输入状态机保留站立/卧倒、FREE、蹭台阶、四档腿长、跳跃准备与触发、X 掉头反向跟随、
Q 开火策略、C 超电和 B UI 刷新语义。云台增量与旧代码中摇杆 30 倍、鼠标 10 倍的底盘
yaw 前馈分字段传递；物理扳机显式绕过视觉门控，鼠标仍服从所选开火策略。视觉跟踪时
协调器用实际云台反馈同步隐藏手动参考，退出自瞄不会释放累积的隐形增量。

Mapper、仲裁、状态机和真实 Runtime Module 测试在严格告警与 ASan/UBSan 下通过，周期
测试覆盖输入失联、未选源隔离、Topic 背压和零动态分配。当前跳跃完成仍只使用 1.2 s
权威超时兜底；底盘 jump FSM 完成反馈尚未进入消息契约，因此不能声称这一闭环已等价。

## 当前发射切片

`shoot-standard` 已把旧全局单例迁为 1 kHz Runtime Module。16 个生成参数显式保存
SJTU 轮腿步兵的 3240 deg 拨盘电机步长、双摩擦轮 `+1/-1` 方向、37k rpm 基准与
35k..39k 限幅、500/55 ms 单发/连发间隔、22.5 m/s 目标、弹速修正、前馈和单发热量。
`friction_motor_count` 可在构建期改为 3，不需要源码条件编译。

单发按模式进入沿推进一次；连发在 55 ms 到期前保持位置目标；显式反转按 500 ms
退弹。每次正向推进前都检查新鲜裁判数据与旧实现的五/六发热量余量。实测弹速只作为
反馈，协调器发送目标值 0 表示使用发射 Package 配置的 22.5 m/s，避免把实测值误当目标
而令闭环误差恒为零。

`MotorGroup::FaultFlag` 统一堵转、过温、过流、通信、编码器和驱动故障。拨盘堵转只触发
一次锁存退弹；其他故障、反馈失联、命令超过 30 ms、快照或整组命令失败会同时
`Relax()` 两组电机。严格告警、ASan/UBSan、两/三摩擦轮、热量边界、故障注入、发布
背压和完整周期零分配测试已通过。旧代码直接修改 DJI 私有 `final_output` 的前馈被规范为
有界速度参考偏置，因此仍需在 Dev C 实机上重新整定，不能据此声称发射机构已实机完成。

## 当前静态组合状态

deployment compiler 已能生成并运行静态 `NodeComposition`。集成夹具实际构造 Source 与
Sink Module、五种参数、周期 Executor、端口和 fake hardware，启动 Runtime 后验证消息
到达；缺实现的生产节点只生成 blocker 报告。当前 F4 blocker 为 gimbal 和
vision-link，H7 blocker 为 BMI088、referee、supercap 和 infantry UI；BMI088 还需在
两个 Executor 中声明唯一默认项。BSP、transport endpoint 和 FreeRTOS entry 尚未生成，
所以这不是“固件已经可链接”。
