---
title: Deployment 与 Link
---

Node 是用户定义的**逻辑 Runtime 身份**，例如 `motion_control`、`perception_compute` 和
`supervisor`。Node 名不包含 MCU、板型、操作系统或 hostname；这些信息属于 target。
将目标从 MCU 固件改成 Linux 进程时，只替换 target 和 link，逻辑身份可以保持稳定。

```yaml
api_version: aster.dev/v1alpha1
kind: Deployment
metadata: {name: production}
application: ../robots/mobile-robot.yaml

nodes:
  motion_control:
    runtime: aster-mcu
    target:
      bsp: vendor/controller-a
      hardware: ../hardware/motion-controller-a.yaml
      profile: freertos-release
    instances: [state_estimator, drive_controller]

  perception_compute:
    runtime: aster-host
    target:
      platform: linux-x86_64
      hardware: ../hardware/perception-host.yaml
      profile: release
    instances: [localization, obstacle_detection]
```

`motion_control` 表达职责，`vendor/controller-a` 才表达硬件。若需要同一职责的冗余副本，
使用稳定的逻辑实例名，如 `motion_control_primary` 和 `motion_control_backup`，仍不编码板型。

## Link 与路由

Link 描述物理或进程间连接。一个总线只声明一次并列出 endpoint；Topic 路由从 Module
端口图和实例放置自动推导。应用不创建 `robot-link` Module，也不手写跨板发布逻辑。

```yaml
links:
  control_bus:
    transport: aster-can
    endpoints:
      - {node: motion_control, resource: control_bus}
      - {node: supervisor, resource: control_bus}
    options: {frame: classic, bitrate_bps: 1000000, mtu_bytes: 8}
    budget: {utilization_limit: 0.65}

  compute_ipc:
    transport: aster-shm
    endpoints:
      - {node: perception_compute, resource: ipc}
      - {node: supervisor, resource: ipc}
```

Route rule 只选择 QoS，不成为手工路由表。编译器检查端口类型、路径、MTU、分片、频率、
deadline、消息年龄和总线预算。任何未分类的跨节点控制 Route 都是构建错误。

```yaml
qos_profiles:
  control_fast:
    class: control
    delivery: latest
    reliability: best_effort
    history_depth: 1
    max_rate_hz: 200
    deadline_ms: 10
    max_age_ms: 20
    on_stale: relax
    rearm: fresh_sample

route_rules:
  - {match: {topic: /control/**}, qos: control_fast}
```

## 编译与生成结果

```sh
asterctl deploy compile \
  workspace.yaml \
  deployments/production.yaml \
  build/generated/production \
  --lock deployments/production.lock.yaml
```

编译器解析 Package export，检查每个实例恰好部署一次，为本地端口和跨节点端口生成路由，
并输出：

```text
generated/
  deployment.resolved.yaml
  deployment.lock.yaml
  nodes/<logical-node>/
    node_config.hpp
    node_descriptor.cpp
    node_composition.hpp
    node_hardware.hpp
    firmware_entry.cpp
  reports/
    module_graph.json
    routes.json
    link_budget.yaml
    executors.yaml
    memory.yaml
    composition.yaml
    firmware.yaml
```

只有目标为 MCU 且 BSP 提供固件集成元数据时才生成 `firmware_entry.cpp`。Linux 或仿真
target 可以生成不同入口，但共享相同 Node、Module 和端口语义。

Node ID 与 Route ID 按逻辑名称确定性分配并写入 lock。lock 同时记录 deployment hash、
Schema hash、类型 hash、协议与 backend 版本；target 的硬件变化不会迫使业务 Topic 改名。
