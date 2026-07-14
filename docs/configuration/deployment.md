---
title: Deployment 与 Link
---

Node 名称是用户定义的逻辑 ID，例如 `gimbal_f4` 和 `chassis_h7`，不等于 hostname、
板型或 wire ID。wire ID 由 compiler 分配并写入 lock。

Link 描述物理连接。一个 CAN 总线只声明一次并列出所有 endpoint；Topic 路由从
Module 端口图和实例放置自动推导。Route rule 只选择 QoS，不能成为手工路由表。

部署校验必须覆盖资源存在性、类型一致性、路径、MTU、分片、优先级、deadline 和
总线预算。任何未分类的跨节点控制 Route 都是构建错误。

## 编译命令

```sh
xrctl deploy compile \
  control-2027/workspace.yaml \
  control-2027/deployments/infantry-wheel-legged.yaml \
  control-2027/build/generated/infantry-wheel-legged
```

compiler 执行以下已经落地的检查：

1. workspace Package 与 `package.lock.yaml` 完整，真实 Git Package 的 HEAD 与 lock 一致。
2. 从 Package export 找到 `module.yaml`，递归解析 Package 依赖。
3. 每个 robot instance 恰好部署一次，必需端口和硬件能力都有绑定。
4. 同一逻辑绑定的 publisher/server 唯一，所有 endpoint 类型一致。
5. 跨 Node route 有且只有一条物理 Link；多路径时必须显式 `via`。
6. route 匹配 QoS，控制流声明 rate、deadline、max age、stale 和 re-arm。
7. classic CAN 按实际分片、CRC 前位区间最坏 bit stuffing 和 intermission 计算预算。

一个 fast 单帧保留 1-byte sequence；分片帧保留 2-byte sequence/fragment header。预算还
叠加 `reserved_bandwidth`，用于 DJI 电机、超电等非框架既有流量。总利用率超过 Link
limit 时编译失败，而不是只在报告里告警。

## 生成结果

```text
generated/
  deployment.resolved.yaml
  deployment.lock.yaml
  nodes/<node>/node_config.hpp
  nodes/<node>/generated_main.cpp
  reports/module_graph.json
  reports/routes.json
  reports/link_budget.yaml
  reports/executors.yaml
  reports/memory.yaml
```

Node ID 与 Route ID 按名称确定性分配，并在后续编译中保留已有值。lock 同时记录整机
deployment hash、Schema hash、类型 hash、协议版本和 backend 版本。删除或重命名 Node
属于身份变化，不应被 hostname 或板型名称隐式代替。

当前生成入口已参与 host 编译测试，但完整 Module 构造和 F4/H7 toolchain 目标仍在迁移
阶段；CAN-FD、量化 codec、Linux/AimRT 输出属于后续里程碑。
