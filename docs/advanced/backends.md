---
title: 自定义 Backend
---

Backend 实现 Runtime 已定义的窄接口，不向 Module 暴露平台对象。MCU backend 静态
链接和注册；未来 Linux backend 可以使用共享内存、UDP 或动态插件。

新增 backend 必须通过统一 conformance tests，包括生命周期、上下文、消息顺序、
超时、资源上界和关闭行为。仅能“发送字节”不足以成为合格 backend。
