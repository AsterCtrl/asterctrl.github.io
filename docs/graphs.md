---
title: 配置、通信与部署
---

# 普通 Linux 的配置与可选部署

普通 Linux 的入口是：

```text
编写 Module → CMake 构建 Package → runtime.yaml → aster run
```

`runtime.yaml` 选择 Package、Module Instance、Executor、日志、参数和 Local
Channel/RPC。Module 在 `Initialize()` 中注册 Topic/RPC，Runtime 在 `Start()` 前封闭
注册表。通信关系来自实际注册结果，而不是用户手写 Port 图。

## 设计中的部署配置（当前不可执行）

目标上，跨节点或 Zephyr 部署由 `deployment.yaml` 描述：

- Instance 到 Node 的放置；
- Linux/Zephyr 平台和板卡；
- Topic/RPC 名称、类型、收发节点和容量预算；
- Transport、Executor 和平台资源策略。

v1alpha3 Deployment 编译器尚未完成。当前 `aster graph`、`aster resolve`、`aster build`
和旧示例仍是 v1alpha2 回归路径，会输出迁移提示；它们不能消费这里描述的
`deployment.yaml`，也不能代表新 Runtime 的通信图查询。

无论部署在哪里，业务 Module 源码保持不变。真正实现这条路径后，Linux 和 Zephyr
只会更换编译目标、Runtime Adapter 和节点配置。
