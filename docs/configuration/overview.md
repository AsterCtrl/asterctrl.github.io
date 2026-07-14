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

所有文件先经过 Draft 2020-12 JSON Schema 校验，未知键默认拒绝。只有
`options`、实例参数值等明确的 backend/业务扩展点允许自由对象：

```sh
xrctl config validate control-2027/workspace.yaml
xrctl config validate control-2027/deployments/infantry-wheel-legged.yaml
```

错误包含文件名和对象路径，例如 `deployment.yaml: nodes.gimbal_f4.runtime`。配置校验
通过只代表单文件结构正确；跨文件引用、类型、放置、硬件资源和链路预算由 deployment
compile 阶段检查。
