# Day 57 事件循环细节 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 57 | 事件循环细节 | [事件循环](../jscore/basic/event-loop)、[性能优化](../advanced/week6/performance-optimization) |

## 今日目标

- 看完 MDN Microtasks Guide + HTML spec 事件循环章节
- 输出一张“一帧内部”执行序列图（JS 任务 → 微任务 → rAF → style/layout/paint）
- 能讲清 `queueMicrotask / setTimeout / requestAnimationFrame / requestIdleCallback` 的时机差

## 阅读卡点

- 微任务在每次 JS 执行栈清空后立即 flush，不等下一次宏任务
- `rAF` 是“下一帧绘制前”，不是“每 16ms 一次”
- `rIC` 是浏览器真的闲下来才跑，不保证被调用

## 速记卡 / 知识点

### 事件循环一帧内部执行序列

```text
1. 取一个 Task（宏任务）：setTimeout / setInterval / I/O / UI event
2. 执行该 Task
3. 清空 Microtask Queue：Promise.then / queueMicrotask / MutationObserver
4. （如果需要渲染）:
   a. 执行 requestAnimationFrame 回调
   b. Style 计算
   c. Layout
   d. Paint
   e. Composite
5. 如果有空闲时间 → 执行 requestIdleCallback
6. 回到 1
```

### 四种异步 API 时机对比

| API | 队列 | 时机 | 保证执行 |
|-----|------|------|----------|
| `queueMicrotask` | 微任务 | 当前 JS 栈清空后立即 | ✅ |
| `setTimeout(fn, 0)` | 宏任务 | 下一轮事件循环（最小 4ms） | ✅ |
| `requestAnimationFrame` | rAF 队列 | 下一帧绘制前 | ✅（页面可见时） |
| `requestIdleCallback` | 空闲队列 | 浏览器空闲时 | ❌ 不保证 |

### 微任务关键规则

- 微任务在**每次 JS 执行栈清空后**立即 flush，不等下一个宏任务。
- 微任务中产生的新微任务会在**同一轮**被处理（可能导致无限循环阻塞）。
- `async/await` 本质是 Promise，await 后面的代码等价于 `.then` 回调。

### Node.js 差异

| 阶段 | 回调 |
|------|------|
| timers | setTimeout / setInterval |
| poll | I/O |
| check | setImmediate |
| 每阶段之间 | process.nextTick → Promise 微任务 |

## 手写 / 流程图

### 经典输出题

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
Promise.resolve().then(() => {
  console.log('4')
  setTimeout(() => console.log('5'), 0)
})
console.log('6')

// 输出顺序：1 → 6 → 3 → 4 → 2 → 5
// 解析：同步(1,6) → 微任务(3,4) → 宏任务(2) → 宏任务(5)
```

### rAF + 微任务交互

```js
requestAnimationFrame(() => {
  console.log('rAF')
  Promise.resolve().then(() => console.log('micro in rAF'))
})
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('micro'))

// 可能的输出：micro → timeout → rAF → micro in rAF
// （rAF 在渲染阶段执行，通常晚于 timeout）
```

## 口述题

### 1. `Promise.then` 和 `setTimeout(fn, 0)` 执行顺序？

回答模板：

> `Promise.then` 是微任务，`setTimeout(fn, 0)` 是宏任务。事件循环中，每执行完一个宏任务就会清空所有微任务。所以 `Promise.then` 的回调一定在当前宏任务结束后、下一个宏任务之前执行，比 `setTimeout` 快。
>
> 具体来说：同步代码执行完 → 清空微任务队列（Promise.then）→ 取下一个宏任务（setTimeout）。如果微任务里又产生了新的微任务，新的也会在同一轮被清空，然后才去取 setTimeout。

### 2. `rAF` 适合做什么，不适合做什么？

回答模板：

> rAF 适合做**动画和 DOM 读写**。它保证回调在浏览器下一次绘制前执行，和屏幕刷新率同步（通常 60fps = 16.6ms 一帧）。用 rAF 做动画不会出现掉帧或过度渲染。
>
> 不适合做两件事。第一，不适合做长时间计算——rAF 回调如果执行太久，会阻塞渲染，导致掉帧。长计算应该用 `requestIdleCallback` 或 Web Worker。第二，不适合做"尽快执行"的操作——它不保证在当前帧执行，可能要等到下一帧。如果只是想异步执行，用微任务或 setTimeout。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 事件循环一帧完整步骤（Task → 微任务 → rAF → 渲染 → rIC）（1.5 分钟）
2. 四种异步 API 时机对比 + 经典输出题（2 分钟）
3. rAF / rIC 适用场景 + Node.js 差异（1.5 分钟）

录完后自查：

- 是否说出微任务在每次 JS 栈清空后立即 flush。
- 是否说出 rAF 在渲染前执行。
- 是否说出 rIC 不保证被调用。
- 是否能口算经典输出题。

## 今日复盘

今天最需要回补的 3 个点：

1. `MutationObserver` 的微任务特性（批量 DOM 变化，一次性通知）。
2. Node.js 的 `process.nextTick` 和浏览器微任务的差异。
3. `MessageChannel` 在 React 调度器中的应用（替代 setTimeout 实现更精确的任务切片）。
