---
title: control-2026 迁移
---

权威源是本地 `control-2026/infantry_wheel_legged_sjtu` 当前 worktree，而不是远端分支
或单纯 `HEAD`。当前必须保留的未提交行为包括 75 ms 跳跃收腿延时和小陀螺模式的
当前 yaw 跟随。

迁移采用纯算法、运行 Module、设备驱动和部署配置分层。每项 legacy 功能在迁移矩阵
中拥有目标 Package、测试证据和状态，不能以“由新框架替代”为由静默删除。
