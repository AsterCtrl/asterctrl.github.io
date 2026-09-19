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
git checkout v0.2.0-alpha.1
uv sync --frozen --all-groups
uv run aster doctor
cmake --preset host-debug
cmake --build --preset host-debug
ctest --preset host-debug
```

上面的标签是当前公开 alpha。跟踪开发分支时可省略 `git checkout`，但不要把 `main` 构建
与带标签的发布工件混用。

创建最小工程：

```bash
uv run aster init hello-aster
uv run cmake -S hello-aster -B hello-aster/build -G Ninja \
  -DASTERCTRL_SOURCE_DIR="$PWD"
uv run cmake --build hello-aster/build
uv run aster validate hello-aster/runtime.yaml \
  --runtime hello-aster/build/asterctrl/aster_runtime
uv run aster run --runtime hello-aster/build/asterctrl/aster_runtime \
  --config hello-aster/runtime.yaml --duration-ms 100
```

`aster init` 只生成最小 Linux Package 和 `runtime.yaml`，不生成独立 Application 图、
Deployment 图或自定义启动器。本页只覆盖当前 Linux 流程；跨节点和 Zephyr 的
`deployment.yaml` 编译器仍未完成，不能按目标接口直接运行。
