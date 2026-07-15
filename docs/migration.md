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

## 当前 BMI088 与姿态切片

`bmi088` 没有沿用旧工程的 HAL 中间层，也没有照搬 QDU Module 在构造函数中重试、休眠
和创建私有线程的做法。Runtime Module 只解析一个聚合 `Bmi088Sensor` 能力；具体 SPI、
双片选、gyro data-ready 和 heater PWM 被压到 `Bmi088Bus` adapter seam，仿真传感器可以
实现同一接口。公共头与热路径不包含 libxr、HAL、RTOS 或动态分配。

驱动以单步状态机复位两个 die，按单调时间等待 80 ms，检查 `0x1e/0x0f` chip ID，并逐项
写入、回读 6G/800 Hz accelerometer 与 2000 dps/2 kHz gyroscope 配置。每个完整 data-ready
样本转换为 SI 单位并保留中断时间戳。1 kHz Module 在同一个生成 Executor 上完成旧工程的
安装旋转、预标定 bias、杆臂补偿、100 帧重力预热、固定内存六状态 Quaternion EKF、运动
加速度后处理与 500 Hz heater PI，不依赖任务之间的隐式顺序。

chassis 权威参数已配置为 pitch `180 deg`、三轴 scale `1`、杆臂
`0.15413/0.04612/0.09348 m`、gyro bias
`0.00708952406/0.00323308632/0.00078589347 rad/s` 和目标温度 `40 degC`。非阻塞
`CalibrateImu` Action 用在线均值/方差判稳，支持进度、取消和三参数回滚。超过 10 ms 无
新样本会停止姿态发布并重新预热，不能无限期沿用最后姿态。

寄存器、带符号解析、安装矩阵、解析杆臂向心项、EKF 连续 yaw、失联恢复、Action、背压
和完整周期零分配测试在严格告警与 ASan/UBSan 下通过。MC02 libxr bus adapter、设备构造
注册、flash 参数持久化、真实录制数据回放和目标 timing 仍未完成，因此不能声称 IMU 已经
实机验证。

## 当前标准云台切片

`gimbal-standard` 已拆成纯角度外环和 Runtime Module。视觉目标只由协调器解释一次，
云台消费最终 `GimbalCommand`；C 板 BMI088 作为独立 Module 发布 `AttitudeState`，云台
不再持有 INS、SPI 或板级句柄。两轴执行器统一为单元素 `MotorGroup`，因此 host fake、
DJI adapter 和仿真实现使用同一控制源码。

手瞄 yaw `0.4/0/0.02`、自瞄 yaw `2.5/0/0.04` 和 pitch `1.5/0/0.02` 的 legacy
degree-domain 增益已按 `180/pi` 等价换算到 rad-domain；保留测量微分、最近圈 yaw 展开、
旋转速度前馈和 `-30..25 deg` pitch 限位。外环在生成的 200 Hz Executor 运行并输出有界
rad/s 参考，GM6020 内层速度 PID 属于 DJI adapter，不下沉板级类型到 Module。

命令超过 30 ms、姿态超过 20 ms、任一电机反馈超过 20 ms、故障、NaN、snapshot 或
apply 失败都会同时释放两轴。只有姿态和两轴反馈都有效时才发布测量状态，避免下游把
默认零值当作新鲜反馈。严格告警与 ASan/UBSan 测试覆盖 manual/vision 数值、跨 ±pi、
pitch 限位、非法枚举、背压、Shutdown 和完整周期零分配。Dev C BMI088 与 DJI adapter、
ECD 5010/4215 零位、方向、真实轨迹和目标 timing 仍需硬件验证。

## 当前裁判系统接收切片

`referee` 已把旧 UART 回调、全局缓冲区和 packed struct 解码迁为可移植 Runtime Module。
固定 137 B 的 `RefereeDecoder` 接受任意 UART 分片，扫描 `0xA5`，验证官方反射 CRC8 与
CRC16，并在坏校验、丢字节和超长声明后恢复下一候选帧。当前只解码轮腿控制实际消费的
机器人状态 `0x0201`、功率/热量 `0x0202` 和射击数据 `0x0207`，未知合法命令仅计入链路
活性，不扩张消息契约。

Module 每 1 ms 最多读取四个 64 B 已排队字节块，更新在 20 Hz 合并发布。只有机器人状态
与功率/热量各自都在 300 ms 内新鲜时才发布在线快照；可选弹速或未知帧不能掩盖任一必需
类别过期。启动和超时发布全零安全状态，Topic 背压时下一周期重试；解析和发布热路径有
零动态分配测试。官方输出位被归一为 chassis、gimbal、shooter 的应用位序。

严格告警、ASan/UBSan、协议字面向量、分片、丢字节、CRC 故障、序号间断、超时与错峰
恢复测试均已通过。MC02 的 UART/libxr adapter、DMA 恢复和实机 2027 协议回放仍未完成，
因此这里只能证明 host 行为与静态组合，不声称裁判系统已在硬件上验证。

## 当前裁判 UI 输出切片

`referee` Package 现在同时提供平台无关的 `RefereeUiCommand`、`RefereeUiWriter` 和官方
`0x0301` codec。删除、文字以及 1/2/5/7 图形批次都使用固定容量；单帧最大 120 B。
96-bit 图形描述符按明确位偏移编码，不使用编译器 packed bitfield。精确 30 B 字面向量、
CRC、非法字段、所有合法批次和输出容量测试在严格告警与 ASan/UBSan 下通过。

`inf-wheel-legged-ui` 只订阅生成消息并解析一个 `RefereeUiWriter`，不接触 UART、DMA、
libxr 或 RTOS 类型。固定 64 项队列保存轻量绘制动作，每次 draw 周期最多提交一个完整
命令，默认写入上限 10 Hz；writer 背压时原命令原样保留并重试。裁判身份缺失或超过
300 ms 时不发送，重连、30 s 看门狗或递增的 `ui_refresh_sequence` 都从 delete-all
重新开始。序列字段让 F4 上一拍 B 键事件经过 20 Hz latest-only 跨板 route 后仍可观察，
持续按住不会反复触发。

完整布局保留相对方向、视觉框、地面引导线、两组五连杆及 BACK/FRONT 标签和腿长、
九行状态、超电与速度。五连杆由可移植的虚拟腿长/角度和 body pitch 反解；不可解时发送
黑色退化图形，不产生 NaN 坐标。重连、节流、背压、刷新序列、几何和完整周期零分配
测试均通过。MC02 `referee/ui-writer` UART TX adapter、固定发送队列、DMA 完成语义和真实
客户端视觉检查仍未完成，因此输出链路还不是可烧录结论。

## 当前超电协议切片

`supercap-ctrl` 已把旧 `super_cap.c` 中的 SHU 自制超电 CAN 协议与机器人功率策略拆开。
`ShuSuperCapCanCodec` 按字面保留主控发送 ID `0x210`、超电遥测 ID `0x211`、八字节小端
布局、mV 电压和 `0.01 W` 有符号输入/输出功率。SHU 帧没有 boost 字段，因此
`SuperCapCommand.mode` 不会被擅自塞进保留字节；原 `SuperCapModeControl()` 的安全、
被动、主动、充电状态和底盘功率分配仍待迁入 `chassis-wheel-legged`。

100 Hz Runtime Module 只依赖聚合 `SuperCapLink`。每周期最多取四条已排队遥测，并以
20 Hz 发布最新状态；10 V/24 V 默认阈值按电容能量的电压平方计算百分比。命令缺失、
非法或超过 100 ms 时，每个周期发送零功率、零 buffer、关闭输出的安全命令；Shutdown
也尝试同一写入。遥测超过旧工程一致的 50 ms 后发布 bit 31 离线状态，Topic 背压不会把
失败误记成已交付，新遥测会立即重使能在线发布。

精确帧、负功率、协议范围、队列上界、20 Hz 合并、两类超时、恢复、I/O 故障、发布
重试、Shutdown 和完整周期零分配均在严格告警与 ASan/UBSan 下通过。MC02 CAN2/libxr
adapter、`supercap-ctrl/shu-can` 设备构造注册、与 DJI 轮电机过滤器共存、真实帧回放和
目标链接仍未完成，因此当前结论仍是 host-verified，而不是可烧录验证。

## 当前静态组合状态

deployment compiler 已能生成并运行静态 `NodeComposition`。集成夹具实际构造 Source 与
Sink Module、五种参数、周期 Executor、端口和 fake hardware，启动 Runtime 后验证消息
到达；缺实现的生产节点只生成 blocker 报告。当前 H7 的 BMI088、轮腿底盘、UI、裁判
系统和超电已生成完整静态 composition，并通过严格语法编译；F4 的云台实现已可组合，
目前只被 vision-link 缺失 implementation header 阻塞。H7 `ready` 只表示 portable
Module 可被静态构造，MC02 adapter、BSP 设备构造、transport endpoint、FreeRTOS entry、
链接脚本和最终固件链接尚未生成，所以这不是“固件已经可链接”。
