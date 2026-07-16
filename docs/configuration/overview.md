---
title: 配置分层
---

Aster 将可复用代码、机器人事实、板级接线和运行位置分开描述。每项事实只有一个所有者：

| 配置 | 所有内容 |
| --- | --- |
| `package.yaml` | Package 依赖和导出的 target、Module、Schema 或插件 |
| `module.yaml` | Module 端口、参数、硬件能力、Executor 和放置约束 |
| `robot.yaml` | 实例、产品参数和逻辑端口绑定 |
| hardware profile | 逻辑设备到目标板资源、驱动参数和接线的映射 |
| `deployment.yaml` | 逻辑 Node、target、实例放置、Link、QoS 和预算 |
| lock | Package commit、Node/Route ID、类型哈希和 backend 版本 |

芯片能力由 BSP 提供，板卡资源由 target profile 提供，机器人接线由 hardware profile
提供。Module 只请求逻辑能力，不包含引脚号、外设实例、操作系统类型或部署位置。

结构配置在构建期固定。只有 Schema 明确声明可变范围和生命周期的参数，才能通过
Parameter Service 修改或持久化。MCU 不在运行时重新解析整份 YAML。

```sh
asterctl config validate workspace.yaml
asterctl config validate deployments/production.yaml
```

所有文件先经过 JSON Schema 校验，未知键默认拒绝。错误包含文件名和对象路径，例如
`deployment.yaml: nodes.motion_control.runtime`。单文件校验通过后，deployment compiler
继续检查跨文件引用、端口类型、资源能力、放置约束和链路预算。
