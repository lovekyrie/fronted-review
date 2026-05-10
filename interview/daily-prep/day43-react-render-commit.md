# Day 43 React render / commit / batching 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 43 | render/commit | [并发机制](../advanced/week4/concurrency)、[React Hooks](../framework/react/hooks) |

## 今日目标

- 看完 React 官方 Queueing State Updates + `/framework/react/hooks`
- 画一张 React 更新流程图：Trigger → Render（Reconciler）→ Commit
- 输出 React 18 自动批处理的答题稿

## 阅读卡点

- Render 阶段可被中断 / 重试（Concurrent），Commit 阶段不可中断
- React 18 之前，batching 只在事件处理里生效；18 之后扩展到 Promise / setTimeout / 原生事件
- `flushSync` 用于“我必须立刻更新”的场景，是紧急出口

## 速记卡 / 知识点

<!-- Fiber / Render / Commit / Batching / Lanes 模型概览 -->

## 手写 / 流程图

```text
setState → scheduleUpdateOnFiber → 根据 lane 进入 workLoop → render 阶段 → commit 阶段（BeforeMutation / Mutation / Layout）
```

## 口述题

### 1. React 18 的自动批处理具体改了什么？

> 回答模板：

### 2. Render 阶段和 Commit 阶段的根本区别？

> 回答模板：

## 5 分钟录音顺序

1. 更新两阶段（2 分钟）
2. Batching 行为演变（1.5 分钟）
3. Lanes 与优先级（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
