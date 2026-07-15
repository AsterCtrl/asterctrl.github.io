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
