---
title: 构建与部署
---

# 当前部署路径

普通 Linux 不需要部署编译器：

```text
Package → runtime.yaml → aster run
```

```bash
aster validate runtime.yaml --runtime build/aster_runtime
aster run --config runtime.yaml --duration-ms 100
```

`aster validate` 只使用 Runtime 原生解析器，不加载 Package；`aster run --check` 才会
加载 Module、执行初始化、封闭注册表并关闭 Runtime。

## 跨节点和 Zephyr（设计中，当前不可执行）

可选 `deployment.yaml` 的目标接口是：

```text
runtime.yaml + deployment.yaml + package.yaml
                           ↓
                   validate → resolve
                           ↓
               Linux node / Zephyr inputs
```

这条 v1alpha3 编译路径尚未完成，下面只是目标形状，当前命令不能执行它。现有 `deploy plan/apply/status` 仍消费旧 v1alpha2
Deployment/Inventory/Bundle，只负责摘要校验、分阶段文件切换和回滚；不会自动启动
systemd，也不会烧录 MCU。

完成后，Zephyr 的 Kconfig、Devicetree overlay、静态 Registry 和资源表将由编译器生成，
普通应用用户不手写 Kconfig。当前 `dev_c`、`mc02` 的 native_sim、QEMU、编译和实板
smoke 仍是验收门禁，不代表新部署路径已完成。
