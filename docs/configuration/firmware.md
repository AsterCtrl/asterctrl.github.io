---
title: 固件生成与烧录
---

应用 workspace 不手写 `app_main`、设备构造或跨节点路由。它提交机器人图、hardware
profile、Deployment 和 lock；deployment compiler 为每个 MCU target 生成独立固件工程。

## 生成目标

```sh
PYTHONPATH=../aster-tools/src python3 -m aster_tools.cli \
  deploy compile \
  workspace.yaml \
  deployments/production.yaml \
  build/generated/production \
  --lock deployments/production.lock.yaml
```

编译器在生成前验证 Package HEAD 与 lock、BSP 能力、hardware 资源、Module 端口、跨节点
Route、QoS 和链路预算。任何不一致都必须在构建期失败。

## 交叉编译

每个 MCU Node 都是独立 CMake 工程：

```sh
cmake --preset firmware -S build/generated/production/nodes/motion_control
cmake --build build/generated/production/nodes/motion_control/build
```

具体 preset 由 BSP Package 导出。发布构建应同时保存 `.elf`、烧录格式、linker map、
deployment lock 和生成报告。只有 descriptor 或静态库不算完整 firmware。

## 生成入口

典型 MCU `app_main()` 按以下顺序执行：

1. 初始化 BSP 和平台 backend。
2. 构造 hardware profile 声明的类型化设备。
3. 配置本地端口、跨节点 Route 和 `NodeComposition`。
4. 启动设备、transport 与 Runtime 控制面。
5. 完成 deployment/schema/protocol 握手。
6. 启动应用 Module 和 Executor。
7. 在有界循环中处理 I/O、周期任务、队列和诊断。

握手完成前，执行器 backend 仍要维持明确的安全命令或 watchdog 行为。Runtime 不会因
另一个节点尚未上线而无限期沿用最后一条控制命令。

不可恢复的启动错误写入 debugger 可见的：

```text
aster_firmware_fault_code = (firmware_stage << 8) | runtime_status
```

值为 0 只表示尚未进入不可恢复 Halt，不等于所有设备和 Module 已在线。

## 烧录验收

“固件构建通过”只证明静态组合、入口和链接闭合。首次硬件验收还应覆盖：

- 电源、时钟、引脚复用和外设 DMA。
- 传感器安装方向、标定、时间戳和丢帧恢复。
- 执行器方向、零位、限幅、watchdog 和失联释放。
- 总线 capture、真实利用率、bus-off 与重连。
- 控制周期 WCET、任务栈水位和长期运行。

这些结果属于具体产品的构建记录，不应写成 Aster 对所有 target 的通用性能承诺。
