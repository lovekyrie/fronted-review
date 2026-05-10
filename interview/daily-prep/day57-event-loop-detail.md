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

<!-- Event Loop 步骤 / microtask queue / task queue / render steps / raf/ric 时机 -->

## 手写 / 流程图

```text
run Task → drain microtasks → (maybe render: rAF → style → layout → paint) → pick next Task
```

## 口述题

### 1. `Promise.then` 和 `setTimeout(fn, 0)` 执行顺序？

> 回答模板：

### 2. `rAF` 适合做什么，不适合做什么？

> 回答模板：

## 5 分钟录音顺序

1. 事件循环基础（1.5 分钟）
2. 渲染步骤插入点（2 分钟）
3. rAF / rIC 适用场景（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
