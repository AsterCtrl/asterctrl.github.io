---
title: 路线图
---

# 下一阶段

当前 alpha 之后按这个顺序推进：

1. 把 CorePlugin 从动态库查询入口接入 Runtime 的初始化、启动、停止和回滚生命周期。
2. 实现 v1alpha3 `deployment.yaml`，解析实例放置、Topic/RPC 节点契约和稳定通信身份。
3. 从同一 Package Manifest 生成 Zephyr 静态 Registry、配置、资源表、Kconfig 和 overlay。
4. 将 CAN/USB Adapter 接入新 Runtime，再执行 Linux、native_sim、QEMU、dev_c 和 mc02 门禁。
5. 替代路径验证后删除旧 Provider/Hardware/Graph 生成代码，最后同步官网和发布说明。

## 明确后移

- 完整 SIL/PIL、确定性场景、记录与回放；
- UDP Transport 与受约束的 Linux 网络发现；
- ROS 2 Bridge；
- 有明确互操作需求时再实现 AimRT Bridge；
- `control-2027` 机器人业务 Package 的垂直切片迁移；
- MCU A/B OTA 和自动化板级测试农场。

当前实施证据和未完成项见核心仓库的
[`convergence-audit.md`](https://github.com/AsterCtrl/AsterCtrl/blob/main/document/sphinx-en/development/convergence-audit.md)。
