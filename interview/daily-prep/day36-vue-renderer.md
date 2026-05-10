# Day 36 Vue 渲染器与 diff 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 36 | 渲染器 + diff | [渲染机制](../advanced/week3/rendering-mechanism)、[Vue diff](../framework/vue/dom-diff) |

## 今日目标

- 读 `runtime-core/src/renderer.ts` 的 `patch / patchElement / patchChildren` 核心片段
- 画一张 mount / patch / unmount 的三路径流程图
- 输出 Vue 3 diff 算法（双端 + 最长递增子序列）讲解稿

## 阅读卡点

- Vue 3 的 diff 核心是`双端比较 + 处理中间乱序段用 LIS`，减少真实 DOM 移动
- `processElement / processComponent / processFragment` 按 vnode 类型分派
- Fragment 需要额外维护 `anchor` 来定位插入位置

## 速记卡 / 知识点

<!-- renderer 入口 / patch dispatch / children diff 三阶段 / LIS 原理 -->

## 手写 / 流程图

```text
patch(n1, n2) → 相同类型：patchElement → patchProps + patchChildren
children 对比: 头头 → 尾尾 → 头尾交换 → 中间乱序 + LIS 定稳定序列
```

## 口述题

### 1. Vue 3 的 diff 为什么要用最长递增子序列？

> 回答模板：

### 2. `key` 在 diff 里起什么作用？

> 回答模板：

## 5 分钟录音顺序

1. renderer 架构（1.5 分钟）
2. children diff 流程（2 分钟）
3. LIS 的收益（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
