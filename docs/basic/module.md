---
title: Module 生命周期
---

Module 使用三个阶段：

```text
Initialize -> Start -> Shutdown
```

`Initialize` 获取句柄、注册端口并准备资源，可以明确失败。所有 Module 初始化完成、
部署摘要验证通过后才进入 `Start`。`Shutdown` 必须停止输出、取消任务并释放受控资源。

当前接口为：

```cpp
class Module {
 public:
  virtual std::string_view Name() const noexcept = 0;
  virtual Status Initialize(ModuleContext& context) noexcept = 0;
  virtual Status Start() noexcept = 0;
  virtual void Shutdown() noexcept = 0;
};
```

Runtime 先按生成顺序初始化 Executor，再初始化 Module。Module 在初始化阶段绑定周期
任务，Runtime 随后校验并初始化调度器。启动顺序为 Executor、Module、调度器；关闭时
先停止调度器，再逆序关闭 Module 和 Executor。某个 Executor、Module 或调度器失败时，
Runtime 记录失败对象、阶段和 `Status`，不会继续启动不完整的应用图。

构造函数不得启动线程、订阅 Topic 或访问硬件。可移植 Module 也不得自行创建
FreeRTOS task 或 `std::thread`，而是从 `ModuleContext` 获取声明过的 Executor。

## ModuleContext

`ModuleContext` 是当前 Module 的静态能力视图，不拥有资源。deployment compiler 为它
注入默认 Executor、周期任务绑定器、单调时钟、日志、诊断、端口表、参数表和硬件表。Module
在 `Initialize` 阶段按端口名和生成类型解析句柄：

```cpp
Status Controller::Initialize(ModuleContext& context) noexcept {
  if (auto status = context.ResolveTopicPublisher(
          "command_out", command_publisher_);
      !IsOk(status)) {
    return status;
  }
  return context.ResolveParameter("gain", gain_);
}
```

解析会同时校验端口类别和 Schema Hash。端口名存在但消息类型不匹配时返回
`Status::kTypeMismatch`，不会通过 `void*` 猜测类型。静态注册表 seal 后不可增加端口，
因此这里不是运行时发现机制。

硬件也通过名称和公开类型契约解析：

```cpp
Status Chassis::Initialize(ModuleContext& context) noexcept {
  if (auto status = context.ResolveHardware("joint_motors", joint_motors_);
      !IsOk(status)) {
    return status;
  }
  return context.ResolveHardware("wheel_motors", wheel_motors_);
}
```

`StaticHardwareRegistry<N>` 在生成入口中加入设备后 seal。解析同时检查逻辑名与
`TypeName()`；同名但类型不同返回 `kTypeMismatch`。Module 得到的是诸如
`MotorGroup` 的平台无关能力接口，不是 CAN handle 或具体驱动对象。硬件表没有动态
发现、运行期新增或字符串工厂语义。

生成节点使用 `MappedPortResolver` 和 `MappedHardwareResolver` 把 Module 局部名映射为
application/hardware profile 中的系统级名称。映射只保存固定 `span<NameMapping>`，不拥有端点也不
分配内存；改名后仍由上游 registry 校验 Port kind、Schema Hash 或硬件 `TypeName()`。
因此它不是弱类型 service locator，而是部署编译结果的一部分。

`ModuleContext` 与 `ExecutionContext` 不可混用：前者回答“这个 Module 能使用什么”，
后者回答“当前代码正在线程、回调还是中断中执行”。日志、诊断、发布和参数修改都应
传入当前 `ExecutionContext`。
