# Day 47 useTransition / useDeferredValue 与并发机制 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 47 | 并发 | [并发机制](../advanced/week4/concurrency) |

## 今日目标

- 看完 React useTransition、useDeferredValue、Suspense
- 输出并发渲染答题稿：Lanes / 可中断 Render / 优先级
- 找一个真实场景举例：搜索框大量结果渲染，保持输入流畅

## 阅读卡点

- `useTransition` 把一次 update 标记为**非紧急**，让浏览器优先处理紧急任务（输入）
- `useDeferredValue` 不改动触发方，而是**延迟消费方**；两者互补
- 并发不是多线程，是单线程下的**可中断调度**

## 速记卡 / 知识点

<!-- Lanes 优先级 / startTransition / isPending / useDeferredValue 差异 -->

## 手写 / 流程图

```jsx
// 搜索输入 + 结果列表的 useTransition 典型写法
```

## 口述题

### 1. useTransition 和 useDeferredValue 怎么选？

> 回答模板：

### 2. React 并发不是多线程，那它“并发”在哪？

> 回答模板：

## 5 分钟录音顺序

1. 并发渲染的含义（1.5 分钟）
2. useTransition 场景（2 分钟）
3. useDeferredValue 场景 + Suspense 协同（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
