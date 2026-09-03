---
title: 构建与部署
---

# 从 YAML 到产物

解析必须发生在 CMake/west configure 之前：

```text
manifest + application + deployment + hardware + inventory
                         ↓
              validate → resolve → lock
                         ↓
           Linux CMake / Zephyr west build
```

```bash
aster validate deployment.real.yaml
aster resolve deployment.real.yaml
aster build deployment.real.yaml
aster deploy plan deployment.real.yaml --inventory inventory.yaml
aster deploy apply deployment.real.yaml --inventory inventory.yaml
aster deploy status robot-name
```

Linux 使用带摘要的版本目录和 systemd unit；远程投放通过 SSH。Zephyr 生成静态 Module、
路由、内存、Kconfig fragment 和 Devicetree overlay。普通应用用户不手写 Kconfig。

正式部署先 stage，再校验目标身份和摘要，然后激活并检查每个 Node 的 Deployment ID、
Schema Hash 与健康状态；失败时恢复上一 Linux 版本并保留上一 MCU 镜像用于受控回刷。
