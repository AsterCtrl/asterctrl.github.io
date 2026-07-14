---
title: 配置分层
---

每项事实只有一个所有者：

| 配置 | 所有内容 |
| --- | --- |
| `package.yaml` | Package 版本、依赖和导出 target |
| `module.yaml` | Module 端口、资源、Executor 和放置约束 |
| `robot.yaml` | 实例、机器人参数和逻辑端口绑定 |
| hardware profile | 设备接线与逻辑资源到板级资源的映射 |
| `deployment.yaml` | Node、BSP、实例放置、Link 和 QoS |
| lock | commit、Node/Route ID、类型哈希和 backend 版本 |

结构配置在构建期固定。只有 Schema 明确声明可变范围和生命周期的参数，才能通过
Parameter Service 修改或持久化。
