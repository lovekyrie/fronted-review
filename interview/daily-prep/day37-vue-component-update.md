# Day 37 Vue 组件更新与调度 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 37 | 组件更新 | [渲染机制](../advanced/week3/rendering-mechanism)、[生命周期](../framework/vue/lifecycles)、[组件通信](../framework/vue/components-communication) |

## 今日目标

- 读 `setupRenderEffect` / `updateComponent` 的源码链路
- 画一张“props 变化 → 父组件 re-render → 子组件更新 / 跳过”的判断流程图
- 理解 `shouldUpdateComponent` 的短路判断

## 阅读卡点

- 每个组件实例都有一个 `ReactiveEffect`，变化时 `effect.run` 触发 re-render
- `shouldUpdateComponent` 通过对比 props / slots / dirs 决定是否真的 update
- `v-memo` / `defineProps + withDefaults` 可以进一步裁剪更新

## 速记卡 / 知识点

<!-- setupRenderEffect / update / shouldUpdateComponent / 组件 vs 元素更新 -->

## 手写 / 流程图

```text
响应数据变 → effect 重跑 → 生成新 vnode → patch → 递归子组件 → shouldUpdate 判定
```

## 口述题

### 1. 父组件更新时子组件一定会更新吗？

> 回答模板：

### 2. 怎样避免不必要的组件更新？

> 回答模板：

## 5 分钟录音顺序

1. 组件更新触发链（2 分钟）
2. shouldUpdateComponent 判定（1.5 分钟）
3. 性能优化手法（v-memo / defineProps / shallowRef）（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
