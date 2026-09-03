---
title: 安装与首个工程
---

# 环境

- Python 3.12 与 uv；
- CMake 3.28+、Ninja；
- Linux Host 推荐 LLVM 18；
- Zephyr 4.4.0 与 Zephyr SDK 1.0.1。

```bash
git clone https://github.com/AsterCtrl/AsterCtrl.git
cd AsterCtrl
uv sync --all-groups
uv run aster doctor
cmake --preset host-debug
cmake --build --preset host-debug
ctest --preset host-debug
```

创建最小工程：

```bash
uv run aster init hello-aster
uv run aster validate hello-aster/deployment.sim.yaml
uv run aster graph hello-aster/deployment.sim.yaml
uv run aster resolve hello-aster/deployment.sim.yaml
```

`aster init` 会生成简单 Application 和 Deployment；多节点与正式发布必须显式提交
Deployment 文件。
