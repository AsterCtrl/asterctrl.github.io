---
title: Workspace 与 Package
---

`control-2027` 是机器人组合仓库，不复制公共 Package 源码。`workspace.yaml` 声明
本地或 Git source，`package.lock.yaml` 固定 commit 与内容摘要。

一个 Package 可以导出多个 Module。例如 `motor` 同时包含 DJI、DM、舵机协议和
管理模块。是否拆 Git 仓库由版本、维护者和领域内聚性决定，不由 C++ 类数量决定。

生成目录不是事实源。开发者修改 `package.yaml`、Schema、Robot 或 Deployment，
然后重新运行工具；生成输出必须可重复并可安全删除。
