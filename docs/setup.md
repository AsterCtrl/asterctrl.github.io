---
title: 环境配置
---

第一阶段开发环境需要 CMake、Ninja、C++20 编译器、Python 3.11 以上、Node.js 20
以上和 Arm GNU Toolchain。

当前双板参考构建验证使用：

| 工具 | 已验证版本/路径 |
| --- | --- |
| CMake | 4.3.0 |
| Ninja | 1.13.2 |
| Python | `/Users/enhao-zhang/anaconda3/bin/python3` 3.13.9 |
| Arm GNU Toolchain | `/opt/homebrew/bin/arm-none-eabi-*` 15.2.1 |
| Node.js | 20 以上 |

所有依赖版本最终由 workspace 与 lock 文件确定。上游 XRobot、libxr 和权威
control-2026 工作区均视为只读输入，不在初始化脚本中执行隐式 pull 或 checkout。

每个 Package 都必须提供独立的 host 构建或验证入口。顶层工具负责按 lock 解析
Package，而不是依赖开发者本机碰巧存在的目录顺序。

本地开发时不必把 `xrctl` 安装到全局环境：

```sh
cd control-2027
PYTHONPATH=../xrobot-tools/src \
  /Users/enhao-zhang/anaconda3/bin/python3 -m xrobot_tools.cli --help
```

Package host 测试使用各仓库的 preset：

```sh
cmake --preset host-debug
cmake --build --preset host-debug
ctest --preset host-debug --output-on-failure
```

需要 ASan/UBSan 的 Package 另外提供 `host-sanitize` preset。MCU 生成、链接和产物审计
见[固件生成与烧录](./configuration/firmware.md)。
