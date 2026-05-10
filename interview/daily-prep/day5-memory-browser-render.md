# Day 5 内存管理与浏览器渲染基础 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 5 | 内存与渲染 | [内存管理](../jscore/basic/memory-management)、[浏览器渲染](../network&broswer/broswer-render) |

## 今日目标

- 看完 `/jscore/basic/memory-management`、`/network&broswer/broswer-render`
- 输出一张“内存泄漏排查流程图”（发现 → 定位 → 修复 → 验证）
- 输出一张浏览器渲染流程图（DOM → CSSOM → Render Tree → Layout → Paint → Composite）

## 阅读卡点

- V8 GC：新生代 Scavenge + 老生代 Mark-Sweep / Mark-Compact
- 常见泄漏源：全局变量、闭包持有、未解绑事件、游离 DOM、定时器
- `transform` / `opacity` 走合成层，不触发 layout，性能优于 `top / left`

## 速记卡 / 知识点

<!-- GC 算法 / WeakMap WeakRef 作用 / 渲染流水线 / 合成层触发条件 -->

## 手写 / 流程图

```text
[ DOM ] + [ CSSOM ] → [ Render Tree ] → Layout → Paint → Composite
```

## 口述题

### 1. 为什么 `WeakMap` 能减轻泄漏风险？

> 回答模板：

### 2. 为什么 `transform` 动画通常比 `top/left` 更稳？

> 回答模板：

## 5 分钟录音顺序

1. GC 机制 + 常见泄漏源（2 分钟）
2. 排查流程 + DevTools Memory 面板（1.5 分钟）
3. 渲染流水线 + 合成层（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
