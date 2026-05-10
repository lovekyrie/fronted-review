# Day 45 useEffect 陷阱与 Strict Mode 双执行 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 45 | useEffect 陷阱 | [Week 4 Hooks](../advanced/week4/hooks)、[React Hooks](../framework/react/hooks) |

## 今日目标

- 看完 React useEffect 官方文档（重点“Specifying reactive dependencies”）
- 输出 useEffect 三大坑清单：依赖不全 / cleanup 漏写 / 对象/函数引用不稳
- 解释 Strict Mode 双执行的目的：帮你发现**不幂等**的 effect

## 阅读卡点

- 所有在 effect 内读取的响应式值都应进入依赖数组；用 `useEffectEvent`（React 19）隔离不想触发的
- cleanup 的目的是“让每次 effect 执行像第一次”，常用于订阅 / 定时器 / 竞态请求
- Strict Mode 双 mount 用于发现你忘写的 cleanup

## 速记卡 / 知识点

<!-- effect 触发时机 / cleanup 时机 / 竞态请求处理 / useEffectEvent -->

## 手写 / 流程图

```jsx
// 典型竞态请求：用 AbortController + effect cleanup 正确取消
```

## 口述题

### 1. useEffect 的 cleanup 到底在什么时候执行？

> 回答模板：

### 2. 为什么 Strict Mode 要双执行？它暴露了什么？

> 回答模板：

## 5 分钟录音顺序

1. effect 时机 + 依赖（2 分钟）
2. 三大坑 + 修复（2 分钟）
3. Strict Mode 的意义（1 分钟）

## 今日复盘

1. 
2. 
3. 
