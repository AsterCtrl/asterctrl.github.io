---
title: Application 与 Deployment 双图
---

# 双图分别回答什么问题

`application.yaml` 回答“机器人做什么”：

- Module Instance；
- typed Channel/RPC Port；
- 逻辑连接和业务参数；
- Capability Requirement。

它不能包含板卡、主机、IP、总线或引脚。

`deployment.<environment>.yaml` 回答“在哪里、怎样运行”：

- Instance → Node、Node → Host 放置；
- Linux/Zephyr Target；
- Capability Provider 与 Hardware Profile；
- Link、Transport、QoS、Clock 和 Executor 策略。

`aster resolve` 把两张图编译为确定性的 `deployment.lock.yaml`，其中保存 Node/Route ID、
Schema Hash、资源预算和产物摘要。运行时握手只验证已知身份，不能在 MCU 上创造新拓扑。

同一 Application 可配 `deployment.sim.yaml` 和 `deployment.real.yaml`。业务 Module 不变，
变化的只是 Adapter、放置、Transport 与时间策略。
