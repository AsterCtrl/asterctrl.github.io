---
title: Topic、Service 与 Action
---

Topic 用于持续状态和指令，Service 用于有界请求/响应，Action 用于可取消的长任务。
Runtime 内部只需要 Channel 与 RPC 两种传输原语；Action 由生成代码组合 goal、
feedback、result、cancel 和 timeout 状态机。

应用代码不判断订阅者位于同模块、同节点还是另一块板。部署编译器选择本地后端或
物理 Link。这个透明性不掩盖 deadline、丢包和节点失联，相关策略属于端口契约。
