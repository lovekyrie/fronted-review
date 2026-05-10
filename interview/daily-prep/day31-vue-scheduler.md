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

<!-- scheduler 数据结构 / 同帧合并 / pre / sync / post 三种时机 -->

## 手写 / 流程图

```text
setState × 3 → queueJob 去重 → microtask flush → 执行 job → flushPost → nextTick 解决
```

## 口述题

### 1. Vue 的 `nextTick` 为什么能拿到最新 DOM？

> 回答模板：

### 2. 父子组件的更新顺序是怎么保证的？

> 回答模板：

## 5 分钟录音顺序

1. scheduler 入队去重（1.5 分钟）
2. 微任务 flush 时机（2 分钟）
3. pre / sync / post 的含义（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
