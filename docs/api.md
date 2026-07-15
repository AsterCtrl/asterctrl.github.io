---
title: API 与配置参考
---

API 和 YAML Schema 参考会逐步从代码与 Schema 生成。本页只索引已通过 host 测试和
严格告警构建的公开契约，避免把路线图写成已经交付的能力。

第一阶段参考范围包括 Runtime 生命周期、ModuleContext、ExecutionContext、Executor、
Topic、Service、Action、Parameter、TypeSupport、transport backend 和配置 Schema。

## 已实现头文件

| 头文件 | 稳定接口 |
| --- | --- |
| `runtime.hpp` | Runtime 生命周期、失败记录和逆序回滚 |
| `module.hpp` | `Module` 与静态 `ModuleSlot` |
| `module_context.hpp` | Runtime 能力、端口、参数与类型化硬件解析 |
| `hardware_registry.hpp` | seal 后只读的固定容量类型化硬件表 |
| `execution_context.hpp` | thread/callback/interrupt 语义 |
| `executor.hpp` | 无分配任务接口与统计 |
| `cooperative_executor.hpp` | 定长串行 Executor |
| `periodic_scheduler.hpp` | 固定容量周期调度、漏周期与背压统计 |
| `type_support.hpp` | Schema Hash、类型描述与生成契约 |
| `topic.hpp` | Publisher、Subscriber、静态 Topic 与 QoS |
| `service.hpp` | 异步 Client、Server bind 与固定请求槽 |
| `action.hpp` | Client、Server 与固定 goal 状态机 |
| `parameter.hpp` | 参数权限、范围、revision 与校验回调 |
| `port_registry.hpp` | seal 后只读的 schema-safe 静态端口表 |
| `parameter_registry.hpp` | seal 后只读的类型安全参数表 |
| `mapped_resolver.hpp` | 生成式局部端口/硬件名到整机 registry 的静态映射 |
| `runtime_services.hpp` | Clock、Log、Diagnostics 平台无关接口 |
| `legacy_module_adapter.hpp` | 旧对象 lifecycle hook 适配 |
| `byte_reader.hpp` | 非阻塞、有界、显式状态的已排队 RX 字节读取能力 |
| `motor_group.hpp` | 完整电机组快照、整组命令、显式 Relax 与标准故障位契约 |

这些接口当前标记为 `0.1.0-dev`，在第一套双板部署完成前仍允许有记录的破坏性调整。
transport backend、配置 Schema 和生成文件参考会在对应实现通过测试后加入本页。
