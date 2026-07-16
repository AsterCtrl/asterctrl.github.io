---
title: Workspace 与 Package
---

Workspace 是一个机器人产品或产品族的组合仓库。它保存应用图、硬件接线、部署配置和
版本锁，不复制公共 Package 的源代码。

```yaml
api_version: aster.dev/v1alpha1
kind: Workspace
metadata: {name: warehouse-robot}
packages:
  - name: aster-runtime
    source: {type: git, url: https://github.com/aster-robotics/aster-runtime.git}
  - name: drive-control
    source: {type: path, path: ../drive-control}
```

`package.lock.yaml` 固定 Git commit、内容摘要和依赖闭包，使 CI、不同开发者和发布构建
解析到同一组输入。本地 path source 适合联合开发，发布 profile 应使用可追踪版本。

## 如何划分 Package

一个 Package 是版本、维护和依赖发布单元，不等于一个 C++ 类或一个 Module。一个内聚的
传感器、执行器或算法域可以导出多个 Runtime Module 和纯算法 target。只有在版本节奏、
维护者或复用边界真正独立时才拆仓库；无需为每个小类创建仓库。

典型 workspace 只选择本机器人需要的 Package：

- Aster 核心：Runtime、工具、消息契约、transport 和目标 backend。
- 通用能力：设备驱动、状态估计、控制算法、日志或诊断。
- 产品能力：某种运动机构、操作流程、安全策略和 UI。

不存在“所有 Aster Module 都必须部署”的全局清单。未被机器人图实例化的 Module 不会
进入生成节点或固件。

生成目录不是事实源。开发者修改 Package manifest、Schema、Robot、hardware profile 或
Deployment，然后重新运行工具；`build/generated` 不应手工维护。
