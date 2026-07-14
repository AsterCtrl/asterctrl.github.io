---
title: Module 生命周期
---

Module 使用三个阶段：

```text
Initialize -> Start -> Shutdown
```

`Initialize` 获取句柄、注册端口并准备资源，可以明确失败。所有 Module 初始化完成、
部署摘要验证通过后才进入 `Start`。`Shutdown` 必须停止输出、取消任务并释放受控资源。

构造函数不得启动线程、订阅 Topic 或访问硬件。可移植 Module 也不得自行创建
FreeRTOS task 或 `std::thread`，而是从 `ModuleContext` 获取声明过的 Executor。
