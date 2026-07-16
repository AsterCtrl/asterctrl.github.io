---
title: 环境配置
---

开发 AsterCtrl 工具和 Host target 需要 CMake、Ninja、支持 C++20 的编译器、Python 3.11
以上和 Node.js 20 以上。构建 MCU firmware 时，再安装对应目标的交叉编译工具链。

| 工具 | 最低要求 | 用途 |
| --- | --- | --- |
| Python | 3.11 | `aster`、配置校验与代码生成 |
| CMake | 3.25 | Runtime、Package 与生成 target |
| Ninja | 1.10 | 推荐的构建后端 |
| C++ compiler | C++20 | Host 测试和 Runtime |
| Node.js | 20 | 文档站开发与静态构建 |

具体版本由 workspace 的 lock 和 CI 矩阵确定，不应写入开发者的本机绝对路径。

## 安装开发版工具

```sh
git clone https://github.com/aster-ctrl/aster-tools.git
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -e ./aster-tools
aster --help
```

也可以不做全局安装，直接从源码运行：

```sh
PYTHONPATH=../aster-tools/src python3 -m aster_tools.cli --help
```

## 创建 Workspace

```text
my-control-system/
  workspace.yaml
  package.lock.yaml
  applications/
  hardware/
  deployments/
```

`workspace.yaml` 声明 Package 来源，lock 固定版本。控制逻辑、接线和部署分别维护，
生成目录可以删除并重复生成。第一个工程建议先选择 Host target 验证消息图和控制逻辑，
再增加 MCU 或 Linux target。

```sh
aster config validate workspace.yaml
aster config validate applications/main.yaml
aster config validate deployments/host.yaml
```

Package 应提供独立的构建或测试入口。工具按 lock 解析依赖，不依赖某台电脑上碰巧存在的
目录布局，也不会隐式 pull、checkout 或覆盖本地修改。
