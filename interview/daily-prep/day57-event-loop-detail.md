# Day 57 事件循环细节

## 今日目标

- 读完事件循环专题中的微任务检查点、rAF 和 Node.js 差异
- 输出一张“一帧内部”执行序列图（JS 任务 → 微任务 → rAF → style/layout/paint）
- 能讲清 `queueMicrotask / setTimeout / requestAnimationFrame / requestIdleCallback` 的时机差

## 按顺序阅读

1. [事件循环](../jscore/basic/event-loop)
2. [性能优化](../advanced/week6/performance-optimization)

## 实操与自测

**检查点**

- 浏览器在微任务检查点持续清空队列，期间新入队的微任务也会执行
- `rAF` 是“下一帧绘制前”，不是“每 16ms 一次”
- `rIC` 是浏览器真的闲下来才跑，不保证被调用

**先独立完成，再对照专题**

- 画出一次可能的“任务 → 微任务检查点 → 渲染机会 → rAF → style/layout/paint”流程，并说明渲染为何可能跳过。[核对渲染章节](../jscore/basic/event-loop#requestanimationframe-在事件循环中的位置)
- 对比 `queueMicrotask`、`setTimeout(0)`、`requestAnimationFrame`、`requestIdleCallback` 的队列和时机。[核对事件循环](../jscore/basic/event-loop#event-loop-事件循环)
- 预测 `console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4')` 的输出；说明 timer 与 rAF 为什么没有固定先后。[核对两道例题](../jscore/basic/event-loop#事件循环输出练习)。
- 讲出一个 Node.js 差异及一个微任务饥饿风险。[核对 Node.js 章节](../jscore/basic/event-loop#node-js-阶段机制-libuv-事件循环)

**脱稿口述题**

- 1. `Promise.then` 和 `setTimeout(fn, 0)` 执行顺序？
- 2. `rAF` 适合做什么，不适合做什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 事件循环一帧完整步骤（Task → 微任务 → rAF → 渲染 → rIC）（1.5 分钟）
2. 四种异步 API 时机对比 + 经典输出题（2 分钟）
3. rAF / rIC 适用场景 + Node.js 差异（1.5 分钟）

录完后自查：

- 是否说出微任务在检查点被持续清空。
- 是否说出 rAF 在渲染前执行。
- 是否说出 rIC 不保证被调用。
- 是否能口算经典输出题。

## 复盘

今天最需要回补的 3 个点：

1. `MutationObserver` 的微任务特性（批量 DOM 变化，一次性通知）。
2. Node.js 的 `process.nextTick` 和浏览器微任务的差异。
3. `MessageChannel` 在 React 调度器中的应用（替代 setTimeout 实现更精确的任务切片）。
