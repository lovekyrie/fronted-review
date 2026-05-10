# Day 44 React state queue 与函数式更新 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 44 | state queue | [Week 4 Hooks](../advanced/week4/hooks)、[React Hooks](../framework/react/hooks) |

## 今日目标

- 看完 React useState / Queueing State Updates
- 做 3 道输出题（连续 `setCount(count + 1)` × 3 vs `setCount(c => c + 1)` × 3）
- 输出 stale state / stale closure 的典型案例 + 修复方式

## 阅读卡点

- `setState` 只是把更新入队，本次 render 内 state 不变
- 直接值更新会用**本次 render 快照**的 state，函数式更新用**队列累积**的 state
- 函数式更新天然能解决“连点 3 次按钮只加 1”的老问题

## 速记卡 / 知识点

<!-- 直接值 vs 函数式的差异 / stale closure 典型场景 / useEvent 与官方 useEffectEvent -->

## 手写 / 流程图

```jsx
// 3 道对比题：直接值 × 3  vs  函数式 × 3  vs  混合
```

## 口述题

### 1. 为什么连续调 3 次 setState 只加了 1？

> 回答模板：

### 2. 什么是 stale closure？怎么修？

> 回答模板：

## 5 分钟录音顺序

1. state 入队模型（1.5 分钟）
2. 直接值 vs 函数式（2 分钟）
3. stale closure 修复（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
