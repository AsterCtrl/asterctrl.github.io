---
title: 迁移现有系统
---

迁移的目标不是把旧目录原样搬进 AsterCtrl，而是保留经过确认的行为，同时显式建立代码、
消息、硬件与部署边界。旧工程在迁移期间保持只读，并作为行为、参数和协议的权威输入。

## 建立行为矩阵

先列出每项可观察行为，再决定目标 Package 和验证证据：

| Legacy 行为 | 新所有者 | 契约 | 证据 | 状态 |
| --- | --- | --- | --- | --- |
| 模式切换 | product-control | ControlIntent → ActuatorCommand | 状态机测试 | planned |
| 传感器失联 | sensor Module | State + freshness | 故障注入 | planned |
| 执行器限幅 | actuator adapter | ActuatorGroup | 协议向量 | planned |

没有分类的功能不能因为“新框架更先进”而静默删除。每个参数都应记录单位、来源、有效
范围和是否需要重新标定。

## 按责任拆分

常见 legacy 文件同时包含中断、协议、设备状态、滤波、控制、线程和全局变量。迁移时按
以下责任拆分：

1. **纯算法**：只处理数值和状态，不依赖 Runtime 或平台。
2. **Runtime Module**：拥有生命周期、端口、参数和周期任务。
3. **Driver/adapter**：封装协议、设备状态、方向、量程和 I/O 完成语义。
4. **BSP**：拥有芯片启动、引脚、外设、DMA 与 RTOS 接入。
5. **Deployment**：决定实例位置、target、Link 和 QoS。

Module 不创建私有线程，不在构造函数里睡眠重试，也不持有 HAL 或 RTOS handle。阻塞初始化
改写为有界状态机，周期执行由生成 Executor 调度。

## 消息迁移

不要将旧 C struct 的内存布局直接变成 wire contract。先定义 Schema、单位、枚举和固定
上界，再生成 TypeSupport 和测试向量。旧协议保留 codec 与录制帧回放，业务 Module 使用
规范化 SI 单位和语义消息。

输入设备的原始事实、系统意图和执行器命令应是不同契约。这样替换操作设备、移动控制
Module 或接入自动规划时，不要求下游猜测来源。

## 增量闭环

推荐迁移顺序：

1. 为纯算法补数值回归测试。
2. 用 Host fake 驱动 Runtime Module，覆盖正常与故障路径。
3. 接入一个真实 backend，并回放协议向量。
4. 生成单节点 target，验证入口、map、静态资源和零未解析符号。
5. 增加跨节点 Link，验证握手、stale、重连和带宽预算。
6. 最后做架空首烧、低输出台架与完整硬件闭环。

软件可构建、可链接和可回放不等于硬件验收。安装方向、零位、功率、WCET、栈水位和
长期故障恢复必须在目标产品上单独记录。

## Legacy XRobot Module

`LegacyModuleAdapter` 用于渐进接入旧 XRobot Module，使 workspace 可以先建立 AsterCtrl
deployment 和版本锁。它不自动发现隐藏在构造函数、全局变量或私有线程中的依赖，也不
保证旧 Module 满足热路径和生命周期约束。适配器是迁移工具，不是新 Package 的默认 API。
