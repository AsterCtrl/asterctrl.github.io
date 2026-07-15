---
title: Schema 与 TypeSupport
---

跨 Module 公共契约由 `robot-msgs` Schema 定义。生成器输出 C++ 类型、稳定类型名、
Schema Hash、最大编码长度、TypeSupport 和跨平台测试向量。

当前 schema 使用结构化 YAML，文件后缀分别为 `.msg.yaml`、`.srv.yaml` 和
`.action.yaml`。所有记录必须有静态上界；v1alpha1 支持整数、浮点、布尔、enum、固定
数组和其他固定记录，不支持 string 或无界 sequence。

```yaml
api_version: xrobot.io/schema/v1alpha1
kind: Message
metadata: {name: ImuSample, namespace: srm.msg}
spec:
  fields:
    - {name: acceleration, type: float32, unit: m/s2, array: 3}
    - {name: angular_velocity, type: float32, unit: rad/s, array: 3}
```

生成命令：

```sh
xrctl schema generate robot-msgs/schemas build/generated
```

输出包含 `include/robot_msgs/robot_msgs.hpp`、`schema.lock.yaml` 和
`test_vectors.yaml`。生成器重复运行只在内容变化时写文件；schema lock 记录源文件
SHA-256、每个类型的 128-bit hash 和最大编码长度。

## v1 wire encoding

当前基础 encoding 是固定长度 little-endian：字段按 schema 顺序编码，enum 使用声明的
底层整数，固定数组逐元素编码，浮点保留 IEEE 754 bit pattern。它不复制 C++ 对象内存，
因此 padding、对齐与编译器 ABI 不进入协议。默认值测试向量由 Python 独立生成，C++
生成结果还会经过严格告警编译和 encode/decode 往返测试。

Schema 语言和 wire encoding 是两层。相同逻辑类型可以拥有紧凑 CAN encoding、host
测试 encoding 和未来 ROS 2 adapter。MCU 只链接部署实际使用的 encoding。

当前 deployment budget 使用基础 fixed encoding 的真实最大长度。字段量化 codec 尚未
交付；在误差测试和生成 codec 完成前，不能只在 YAML 中手填一个更小字节数骗过预算。

控制 deployment 默认要求类型哈希完全一致。只有明确声明并测试过的接口才允许版本
转换，不能把任意新旧固件混跑当成隐含承诺。

轮腿 `RobotIntent` 保留“求解后的意图”，而不是重新塞入遥控器原始字段。云台 yaw
增量与底盘 yaw 预测前馈是两个不同物理量；扳机绕过视觉开火门控也是显式布尔事实。
跳跃准备、反向跟随和 UI 刷新位由 schema 中的 `RobotIntentAction` 定义，producer 与
consumer 不再各自手写同一组魔数。这样更换输入硬件不会迫使底盘控制猜测事件来源。
