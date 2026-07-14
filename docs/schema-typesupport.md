---
title: Schema 与 TypeSupport
---

跨 Module 公共契约由 `robot-msgs` Schema 定义。生成器输出 C++ 类型、稳定类型名、
Schema Hash、最大编码长度、TypeSupport 和跨平台测试向量。

Schema 语言和 wire encoding 是两层。相同逻辑类型可以拥有紧凑 CAN encoding、host
测试 encoding 和未来 ROS 2 adapter。MCU 只链接部署实际使用的 encoding。

控制 deployment 默认要求类型哈希完全一致。只有明确声明并测试过的接口才允许版本
转换，不能把任意新旧固件混跑当成隐含承诺。
