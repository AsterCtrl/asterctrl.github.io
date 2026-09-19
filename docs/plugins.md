---
title: Package 与插件
---

# 声明式 Package 与插件

v1alpha3 Package Manifest 只描述导出的 Module 类型、C++ 入口、源码、平台支持和许可证。
依赖由 CMake、west 和 uv 管理，旧的 `aster package add/remove/list/lock` 已移除。

```yaml
api_version: aster.dev/v1alpha3
kind: Package
metadata: {name: demo, version: 0.1.0, license: Apache-2.0}
spec:
  modules:
    - type: demo.Hello
      class: demo::Hello
      header: src/hello.hpp
      sources: [src/hello.cpp]
      platforms: [linux, zephyr]
```

`aster_add_package` 在 CMake configure 阶段生成 Linux C ABI 入口。生成的 Package 只链接
Module/Package Interface，不链接 Runtime，也不执行 Package 自带的 Python。Zephyr 静态
入口仍在实现中。

CorePlugin 的 ABI 已有加载和接口查询测试，但生产生命周期和后端注册尚未接入新 Runtime。
CMake `FetchContent` 只用于固定提交或摘要的 Host 依赖；Zephyr module 统一由 west 管理。
