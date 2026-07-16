---
title: Package 与 Module 配置
---

Package 通过 `package.yaml` 声明依赖与导出。一个 Package 可以导出多个 Module 和纯算法
target；仓库数量由领域边界决定，不由 Module 数量决定。

```yaml
api_version: aster.dev/v1alpha1
kind: Package
metadata: {name: drive-control, version: 1.2.0}
spec:
  dependencies:
    - {name: robot-interfaces, version: ^1.0}
  exports:
    modules:
      - {name: differential-drive, manifest: modules/differential-drive.yaml}
    libraries:
      - {name: trajectory-model, target: trajectory_model}
```

Module manifest 描述公开契约，不声明 CAN ID、UART 编号或运行板卡：

```yaml
api_version: aster.dev/v1alpha1
kind: Module
metadata: {name: differential-drive}
spec:
  implementation:
    target: differential_drive
    class: robot::motion::DifferentialDrive
    header: robot/motion/differential_drive.hpp
  ports:
    - name: command
      kind: subscriber
      type: robot.msg.TwistCommand
      required: true
    - name: state
      kind: publisher
      type: robot.msg.MotionState
  hardware:
    - {name: actuators, capability: aster.hardware.ActuatorGroup, required: true}
  executors:
    - {name: control, priority: 6, stack_bytes: 4096, queue_depth: 8, period_us: 1000}
```

`implementation.header` 是 Package 导出的可编译 C++ header。只有一个 Executor 时，它
自动成为 `ModuleContext` 默认 Executor；多个 Executor 必须恰好声明一个默认项。工具在
编译 C++ 之前校验依赖、端口类型、固定资源和放置约束。

`robot.yaml` 创建实例并绑定逻辑端口与硬件能力，`deployment.yaml` 再决定实例放在哪个
Node。跨节点 Route、wire ID 与 transport adapter 由编译器生成，Module 中不出现
“如果部署在另一块板上”的代码分支。
