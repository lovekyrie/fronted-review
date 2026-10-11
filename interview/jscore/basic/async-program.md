# 异步编程概览

先用回调理解异步操作为何需要完成信号；Promise 表示未来的结果；`async` / `await` 则以更直观的写法组织基于 Promise 的控制流。

按顺序阅读：

1. [事件循环](./event-loop)：任务、微任务与渲染时机。
2. [Promise](../advanced/promise)：状态、链式调用、静态方法与错误处理。
3. [async/await](../advanced/async-await)：Generator 模型、`spawn` 以及串行与并行。

选择异步 API 时，先判断任务是否依赖上一步的结果、是否必须收齐全部结果，以及失败如何向外传递。
