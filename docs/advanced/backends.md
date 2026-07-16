---
title: 自定义 Backend
---

Backend 实现 Runtime 已定义的窄接口，不向 Module 暴露平台对象。MCU backend 静态
链接和注册；未来 Linux backend 可以使用共享内存、UDP 或动态插件。

新增 backend 必须通过统一 conformance tests，包括生命周期、上下文、消息顺序、
超时、资源上界和关闭行为。仅能“发送字节”不足以成为合格 backend。

## Hardware Driver Provider

通用 deployment compiler 不认识具体传感器、执行器或厂商协议。需要参与静态硬件组合的
Package 通过 `exports.hardware_drivers` 声明构建期 provider：

```yaml
spec:
  exports:
    hardware_drivers:
      - driver: vendor/device-can
        provider: tools/aster_hardware.py
        factory: provider
```

provider 使用 `aster_tools.hardware_plugin` API 声明：

- driver 使用哪些资源种类，以及向 Module 提供哪一种 capability。
- 固件需要链接的 Package target。
- 设备参数的构建期校验。
- 所需 header、字段、初始化、Start 和 Exchange 代码片段。
- 多设备共享且按 key 去重的固定资源片段。

provider 只在 Host 构建期运行。生成固件仍是静态 C++，MCU 不加载 Python、不解析 YAML，
也不引入运行时插件系统。provider 路径必须位于所属 Package 内，重复 driver ID、越界路径、
资源类型不匹配或 capability 不匹配都会使 deployment compile 失败。

设备协议和配置生成应留在设备 Package；Aster Tools 只拼装资源、生命周期和 Registry。
新增设备不得通过在 `hardware_codegen.py` 中增加产品名称分支来实现。
