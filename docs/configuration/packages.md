---
title: Package 与 Module 配置
---

新 Package 使用独立 `package.yaml`，不继续扩展头文件注释中的旧 XRobot manifest。
Legacy Adapter 可以读取旧 manifest，但不会把隐藏在构造函数中的依赖视为可跨节点
端口。

Module 描述必须包含公开端口类型、硬件能力、Executor 需求、固定资源和放置约束。
工具在构建 C++ 之前校验引用、类型和循环依赖，并拒绝未知配置键。

Package 通过 `exports.modules` 暴露一个或多个 Module：

```yaml
spec:
  exports:
    modules:
      - name: chassis-wheel-legged
        manifest: module.yaml
```

`module.yaml` 中的端口只声明角色和类型，不声明它在 CAN 上的 ID：

```yaml
spec:
  ports:
    - name: motion_command
      kind: subscriber
      type: srm.msg.ChassisMotionCommand
      required: true
  executors:
    - name: control
      priority: 6
      stack_bytes: 4096
      queue_depth: 8
      period_us: 1000
```

`robot.yaml` 创建实例并把端口绑定到逻辑名称，`deployment.yaml` 再决定实例落在哪个
Node。跨板 Route、CAN ID 与 transport adapter 都由 compiler 生成，Module 不包含
“如果在另一块板”分支。
