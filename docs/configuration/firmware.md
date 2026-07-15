---
title: 固件生成与烧录
---

应用仓库不手写 `app_main`、设备构造或板间路由。它提交 Robot、hardware profile、
Deployment 和 lock；deployment compiler 为每个 MCU Node 生成完整固件工程。

## 生成双板工程

在 `control-2027` 中执行：

```sh
PYTHONPATH=../xrobot-tools/src \
  /Users/enhao-zhang/anaconda3/bin/python3 -m xrobot_tools.cli \
  deploy compile \
  workspace.yaml \
  deployments/infantry-wheel-legged-dual.yaml \
  build/generated \
  --lock deployments/infantry-wheel-legged-dual.lock.yaml
```

编译器先验证 Package HEAD 与 `package.lock.yaml`、BSP 型号、hardware 资源、Module
端口、跨节点 Route、QoS 和 CAN 预算。任一项不一致都会在生成固件前失败。

## 交叉编译

每个生成 Node 都是独立 CMake 工程：

```sh
cd build/generated/nodes/gimbal_f4
cmake --preset firmware
cmake --build --preset firmware

cd ../chassis_h7
cmake --preset firmware
cmake --build --preset firmware
```

若需要保留已有构建证据，可以用 `-B` 指向新的二进制目录。构建完成后每块板都必须
同时存在 `.elf`、`.hex`、`.bin` 和 linker `.map`；只有 descriptor 或静态库不算固件。

## 启动顺序与故障码

生成的 `app_main()` 执行：

1. BSP/libxr platform 初始化。
2. 类型化 hardware 设备和精确 CAN filter 初始化。
3. 本地端口、跨板 Route 和 `NodeComposition` 配置。
4. BSP、设备与 CAN adapter 启动。
5. 周期发送握手、心跳和安全设备命令。
6. deployment/schema/protocol 一致且链路 online 后启动应用 Runtime。
7. 每 1 ms 有界 drain CAN、调度周期任务、运行 Executor、交换设备命令并 poll BSP。

不可恢复的启动错误写入 debugger 可见的：

```text
xrobot_firmware_fault_code = (firmware_stage << 8) | runtime_status
```

因此板子没有进入应用层时，应先读取该变量，而不是在 Module 中加入阻塞日志。

## 2026-07-16 参考证据

`infantry-wheel-legged-dual` 的两次独立生成逐文件一致，生成树 SHA-256 为
`f6571b52d0362777fb7aeae403b66130b268ff2ebd8e783ae8b7bd2ff2876700`，
resolved deployment hash 为 `a23cc8bfbd79217af4f2496f4de2e9a2`。

| Node | MCU | Flash | RAM | `text/data/bss` |
| --- | --- | ---: | ---: | ---: |
| `gimbal_f4` | STM32F407 | 247,472 B | 101,384 B | 240,216 / 7,244 / 94,136 B |
| `chassis_h7` | STM32H723 | 264,656 B | 97,704 B | 260,920 / 3,732 / 93,960 B |

两份 ELF 均为 little-endian ELF32 ARM、EABI hard-float，未解析符号为 0。向量表位于
`0x08000000`：F4 初始 SP/Reset 为 `0x20020000/0x08012cad`，H7 为
`0x24050000/0x0800f51d`。经典 CAN 静态总利用率为 `0.60563`，低于 `0.65` 上限。

这些证据证明真实可烧文件、静态接线、启动入口和链接闭合，不证明电机方向/零位、IMU
安装、裁判实录、USB 重枚举、闭环稳定性、WCET 或任务栈水位已经在硬件上验证。首烧应
架空底盘并依次检查 fault code、总线在线、传感器方向、执行器零位与最小输出，再进入
闭环测试。
