---
title: Channel、RPC 与 bounded Protobuf
---

# 两种通信语义

Channel 用于有界的数据流和事件；RPC 用于带超时的有界请求/响应。Action 不是核心的一等
概念，可取消的长任务应由应用层使用 Channel 和 RPC 组合状态机。

消息以 `.proto` 定义，但必须符合 bounded profile：字符串、bytes、repeated 和队列均声明
上限；禁止 map、`Any`、递归消息和无界字段。

`aster codegen` 生成 Linux/Zephyr 共用的固定容量 C++ 类型、编码器、解码器、最大编码长度
和 Schema Hash。Target 不链接 Google Protobuf；Host CI 使用官方实现验证 wire compatibility。

解码时未知字段会被跳过，截断数据、非法 wire type、超长字段和容量溢出会返回明确错误。
