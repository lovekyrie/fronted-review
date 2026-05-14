# Day 31 Vue 调度器与异步更新 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 31 | scheduler | [响应式原理](../advanced/week3/reactivity)、[渲染机制](../advanced/week3/rendering-mechanism) |

## 今日目标

- 读 Vue 源码 `runtime-core/src/scheduler.ts`
- 画一张“同步改 3 次状态 → 只触发一次组件更新”的时序图
- 输出 `queueJob / queuePostFlushCb / nextTick` 三者关系

## 阅读卡点

- Vue 的异步更新利用**微任务**合并，所以 `nextTick` 里能拿到最新 DOM
- 组件 job 按 id 排序，父组件先更新，避免子组件先渲染再被父级卸载
- `flushPostFlushCbs` 对应 `watchEffect` 的 `flush: 'post'` 时机

## 速记卡 / 知识点

- 响应式的 `trigger` 是同步发生的，但组件 DOM 更新通常会进入 scheduler 队列异步批量执行。
- scheduler 的核心价值是合并同一轮事件循环内的多次状态变更，避免中间状态反复 render 和 patch。
- `queueJob` 会把组件更新 job 放进队列，并用去重逻辑保证同一个 job 在一次 flush 中只执行一次。
- Vue 通过微任务触发 flush，常见理解是基于 `Promise.resolve().then(flushJobs)`。
- 组件更新 job 会按 id 排序，父组件通常先创建、id 更小，所以父组件先更新；这能避免子组件先更新后又被父组件卸载。
- `nextTick` 等的是当前 scheduler flush 对应的 promise，因此在 `await nextTick()` 后通常能读到 patch 后的 DOM。
- `flush: 'pre'` 的 watcher 在组件 DOM 更新前执行，适合基于状态做前置副作用。
- `flush: 'post'` 的 watcher 在组件 DOM 更新后执行，适合读取更新后的 DOM。
- `flush: 'sync'` 会同步执行，不走批量队列，适合极少数需要立即响应的场景，但容易造成重复触发。
- scheduler 不是让响应式变异步，而是让“副作用执行 / 组件更新”可调度。

## 手写 / 流程图

```text
setState × 3 → queueJob 去重 → microtask flush → 执行 job → flushPost → nextTick 解决
```

```js
const queue = []
let isFlushing = false
let currentFlushPromise

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush() {
  if (isFlushing) return
  currentFlushPromise = Promise.resolve().then(flushJobs)
}

function flushJobs() {
  isFlushing = true
  queue.sort((a, b) => a.id - b.id)

  try {
    for (const job of queue) job()
  }
  finally {
    queue.length = 0
    isFlushing = false
    currentFlushPromise = null
  }
}

function nextTick(fn) {
  const p = currentFlushPromise || Promise.resolve()
  return fn ? p.then(fn) : p
}
```

```text
count.value++
count.value++
count.value++
  -> trigger 3 次
  -> queueJob(renderEffect) 3 次
  -> 队列只保留 1 个组件更新 job
  -> 本轮同步代码结束
  -> 微任务 flushJobs
  -> render -> patch DOM
  -> await nextTick() 后读取最新 DOM
```

## 口述题

### 1. Vue 的 `nextTick` 为什么能拿到最新 DOM？

> 回答模板：Vue 中响应式数据修改会同步触发依赖，但组件更新不会每次都立即 patch DOM，而是把组件的 render effect 放进 scheduler 队列，在同一轮微任务里批量刷新。`nextTick` 本质上等待的是当前这次 flush 对应的 promise。同步代码里连续改三次状态，DOM 不会立刻更新三次，而是队列去重后在微任务中统一执行 render 和 patch。所以 `await nextTick()` 之后，当前批次的组件更新已经完成，通常就能读到最新 DOM。

### 2. 父子组件的更新顺序是怎么保证的？

> 回答模板：Vue 会把组件更新封装成 job 放进 scheduler 队列，job 通常带有组件创建时的 id。父组件一般先创建，id 更小；flush 队列前按 id 排序，就能保证父组件先于子组件更新。这样有两个好处：第一，父组件更新可能决定子组件是否还存在，父先更新可以避免子组件做无意义更新；第二，父传给子的 props 先确定，子组件再基于最新输入更新。这个顺序不是靠递归立即执行，而是 scheduler 排队和排序保证的。

## 5 分钟录音顺序

1. scheduler 入队去重（1.5 分钟）
2. 微任务 flush 时机（2 分钟）
3. pre / sync / post 的含义（1.5 分钟）

## 今日复盘

1. 最容易被追问：`nextTick` 不是“让数据更新”，数据已经更新了；它等的是 DOM patch 完成。
2. 当前短板：要把 `pre / sync / post` watcher 时机和实际场景对应起来，尤其是 post 读取 DOM。
3. 下一次补充：接到 Day32，说明 `ref/reactive/computed/watch` 如何基于这套响应式和调度机制工作。
