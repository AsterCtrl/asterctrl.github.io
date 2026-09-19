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

## 跨节点和 Zephyr

可选 `deployment.yaml` 的目标接口是：

```text
runtime.yaml + deployment.yaml + package.yaml
                           ↓
                   validate → resolve
                           ↓
               Linux node / Zephyr inputs
```

这条 v1alpha3 编译路径尚未完成。现有 `deploy plan/apply/status` 仍消费旧 v1alpha2
Deployment/Inventory/Bundle，只负责摘要校验、分阶段文件切换和回滚；不会自动启动
systemd，也不会烧录 MCU。

Zephyr 的 Kconfig、Devicetree overlay、静态 Registry 和资源表由编译器生成，普通应用
用户不手写 Kconfig。`dev_c`、`mc02` 的 native_sim、QEMU、编译和实板 smoke 仍是后续
门禁。
