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
  control-2027/deployments/infantry-wheel-legged-dual.yaml \
  control-2027/build/generated/infantry-wheel-legged-dual \
  --lock control-2027/deployments/infantry-wheel-legged-dual.lock.yaml
```

compiler 执行以下已经落地的检查：

1. workspace Package 与 `package.lock.yaml` 完整，真实 Git Package 的 HEAD 与 lock 一致。
2. 从 Package export 找到 `module.yaml`，递归解析 Package 依赖。
3. 每个 robot instance 恰好部署一次，必需端口和硬件能力都有绑定。
4. 同一逻辑绑定的 publisher/server 唯一，所有 endpoint 类型一致。
5. 跨 Node route 有且只有一条物理 Link；多路径时必须显式 `via`。
6. route 匹配 QoS，控制流声明 rate、deadline、max age、stale 和 re-arm。
7. classic CAN 按实际分片、CRC 前位区间最坏 bit stuffing 和 intermission 计算预算。
8. instance 参数名称来自对应 `module.yaml`，值必须匹配标量类型、存储上界和声明范围。

启动参数写在 Robot instance，而不是硬编码进 Module：

```yaml
infantry_input:
  package: inf-wheel-legged-input
  module: inf-wheel-legged-input
  parameters:
    input_source: 1       # 0 = DR16, 1 = VT13
    input_timeout_ms: 100
```

未配置的参数采用 manifest 默认值；未知名称、`bool` 冒充整数、越界值、NaN 和无法表示
为 `float32` 的值都会使 deployment compile 失败。compiler 会先把 `float32` 规约为实际
IEEE 754 值，因此 host 报告与 MCU 常量不会因 Python double 的额外精度产生差异。

一个 fast 单帧保留 1-byte sequence；分片帧保留 2-byte sequence/fragment header。预算还
叠加 `reserved_bandwidth`，用于 DJI 电机、超电等非框架既有流量。总利用率超过 Link
limit 时编译失败，而不是只在报告里告警。

## 生成结果

```text
generated/
  deployment.resolved.yaml
  deployment.lock.yaml
  nodes/<node>/node_config.hpp
  nodes/<node>/node_descriptor.cpp
  nodes/<node>/node_composition.hpp  # 仅在所有 Module 可组合时生成
  nodes/<node>/node_hardware.hpp     # BSP 资源与类型化设备构造
  nodes/<node>/firmware_entry.cpp    # MCU 启动、握手与有界主循环
  nodes/<node>/CMakeLists.txt
  nodes/<node>/CMakePresets.json
  reports/module_graph.json
  reports/routes.json
  reports/link_budget.yaml
  reports/executors.yaml
  reports/memory.yaml
  reports/composition.yaml
  reports/firmware.yaml
```

Node ID 与 Route ID 按名称确定性分配，并在后续编译中保留已有值。lock 同时记录整机
deployment hash、Schema hash、类型 hash、协议版本和 backend 版本。删除或重命名 Node
属于身份变化，不应被 hostname 或板型名称隐式代替。

`node_config.hpp` 已生成 `kModules`、`kExecutors`、`kRoutes` 和五张按类型分组的参数
表。参数表包含 instance、名称、单位、解析值、上下界、mutability 和 persistence；浮点
值以精确 IEEE 754 bit pattern 生成，MCU 不需要解析 YAML 或字符串。Executor 表使用
`<instance>__<task>` 唯一名称，并固定 priority、stack、queue、period 与 exclusive；
生成的 `consteval` 校验会拒绝重复任务名、空容量、越界参数和不存在的所属实例。参数
默认值也写入 `module_graph.json`，数量与纯 value 字节进入 memory report。

`node_descriptor.cpp` 只验证这些静态表，明确不是 firmware entry。若节点内所有 Package
都提供真实 implementation header，compiler 另外生成 `NodeComposition`：它静态拥有
Module、固定容量 Executor、Parameter、局部端口/硬件名映射、周期调度器和 Runtime，
并提供 `Configure -> Initialize -> Start` 生命周期及按索引运行 Executor 的接口。
`Configure` 注入整机 Port/Hardware registry；host 可以注入 fake，MCU glue 可以注入
CAN/libxr adapter，而 Module 源码不变。

当 target BSP 提供 firmware integration metadata 时，compiler 还会生成
`NodeHardware`、精确 CAN 接收范围、`firmware_entry.cpp` 和可直接交叉编译的 CMake
工程。入口顺序固定为 BSP/设备初始化、CAN endpoint 绑定、Composition 配置与初始化、
BSP/设备启动、跨板握手，最后才启动应用 Runtime。握手前仍周期发送 Relax/安全设备命令，
不会等待另一块板时静默停止电机 watchdog。

缺 header、实现 target、BSP integration metadata 或必须资源时，不生成半套可烧工程，
原因写入 `composition.yaml`/`firmware.yaml`。当前 Dev C F4 与 MC02 H7 报告均为
`ready: true`；CAN-FD、Linux/AimRT 输出属于后续里程碑。
