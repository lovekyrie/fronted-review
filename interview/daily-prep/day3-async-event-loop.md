# Day 3 异步模型与事件循环 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 3 | 异步与事件循环 | [事件循环](../jscore/basic/event-loop)、[异步编程](../jscore/basic/async-program)、[Promise](../jscore/advanced/promise)、[async/await](../jscore/advanced/async-await) |

## 今日目标

- 看完 `/jscore/basic/event-loop`、`/jscore/basic/async-program`、`/jscore/advanced/promise`、`/jscore/advanced/async-await`
- 手写 Promise 核心（状态机 + then 链 + 值穿透）
- 画一张宏任务/微任务执行顺序图

## 阅读卡点

- `await` 后的代码是挂载为**微任务**执行，而非阻塞同步
- `setTimeout(fn, 0)` ≠ 立即执行，受最小 4ms 阈值 + 任务队列调度影响
- `Promise.resolve().then` 只入微任务队列一次，嵌套会重新入队

## 速记卡 / 知识点

<!-- 宏任务 / 微任务分类 / event loop 步骤 / Promise 三态 / async-await 等价展开 -->

## 手写 / 流程图

```js
// 手写 Promise 核心骨架：状态、then 链、值穿透
```

## 口述题

### 1. 为什么 `await` 后面的代码像“同步”？

> 回答模板：

### 2. `Promise.all` 和 `allSettled` 场景差异？

> 回答模板：

## 5 分钟录音顺序

1. 事件循环分段：执行栈 → 微任务 → 渲染 → 宏任务（2 分钟）
2. Promise 状态机 + then 链式（2 分钟）
3. async/await 等价展开（1 分钟）

## 今日复盘

1. 
2. 
3. 
