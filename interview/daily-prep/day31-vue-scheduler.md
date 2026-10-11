# Day 31 Vue 调度器与异步更新

## 今日目标

- 读 Vue 源码 `runtime-core/src/scheduler.ts`
- 画一张“同步改 3 次状态 → 只触发一次组件更新”的时序图
- 输出 `queueJob / queuePostFlushCb / nextTick` 三者关系

## 按顺序阅读

1. [响应式原理](../advanced/week3/reactivity)
2. [渲染机制](../advanced/week3/rendering-mechanism)

## 实操与自测

**检查点**

- Vue 的异步更新利用**微任务**合并，所以 `nextTick` 里能拿到最新 DOM
- 组件 job 按 id 排序，父组件先更新，避免子组件先渲染再被父级卸载
- `flushPostFlushCbs` 对应 `watchEffect` 的 `flush: 'post'` 时机

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week3/reactivity#day-31-知识补充)
- 动手示例 — [参考章节](../advanced/week3/reactivity#day-31-动手示例)

**脱稿口述题**

- 1. Vue 的 `nextTick` 为什么能拿到最新 DOM？
- 2. 父子组件的更新顺序是怎么保证的？

**录音练习**

1. scheduler 入队去重（1.5 分钟）
2. 微任务 flush 时机（2 分钟）
3. pre / sync / post 的含义（1.5 分钟）

## 复盘

1. 最容易被追问：`nextTick` 不是“让数据更新”，数据已经更新了；它等的是 DOM patch 完成。
2. 当前短板：要把 `pre / sync / post` watcher 时机和实际场景对应起来，尤其是 post 读取 DOM。
3. 下一次补充：接到 Day32，说明 `ref/reactive/computed/watch` 如何基于这套响应式和调度机制工作。
