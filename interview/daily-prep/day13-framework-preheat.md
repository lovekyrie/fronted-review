# Day 13 Vue / React 基础预热 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 13 | Vue/React 预热 | [Vue 3](../framework/vue/vue3)、[React 基础](../framework/react/basics) |

## 今日目标

- 看完 `/framework/vue/vue3`、`/framework/react/basics`
- 输出 Vue / React 基础认知对比表（响应式、组件、状态、生命周期）
- 输出组件化、状态、渲染三条主线共性提纲

## 阅读卡点

- Vue 的“响应式”和 React 的“重新渲染”不是一回事，但最终目的都是同步 UI
- 组件化解决的是**复用 + 隔离 + 可组合性**三个问题
- 不要陷入源码细节，今天只做“语言 → 心智模型”的过渡

## 速记卡 / 知识点

### Vue vs React 对照表

| 维度 | Vue 3 | React 18+ |
|------|-------|-----------|
| 响应式 | Proxy 自动追踪依赖 | 手动 setState 触发重渲染 |
| 模板 | SFC `<template>` + 编译优化 | JSX（本质是 JS） |
| 组件更新 | 精确到组件（依赖收集） | 父组件 re-render 子组件默认也 re-render |
| 状态管理 | Pinia（官方） | Redux / Zustand / Jotai |
| 生命周期 | setup + onMounted 等 | useEffect + cleanup |
| 性能优化 | 编译时（静态提升、PatchFlag） | 运行时（memo / useMemo / useCallback） |

### 组件化三大价值

1. **复用**：同一组件在不同页面使用，减少重复代码。
2. **隔离**：每个组件有独立的状态和样式作用域，互不干扰。
3. **可组合性**：小组件组合成大组件，像搭积木一样构建 UI。

### 状态管理思路共性

```text
单向数据流：State → View → Action → State
```

- Vue（Pinia）：`state` + `getters` + `actions`，响应式自动更新视图。
- React（Redux）：`store` + `reducers` + `dispatch`，不可变更新触发重渲染。
- 共性：都是集中管理共享状态，单一数据源，可预测的状态变化。

### 设计哲学差异

- **Vue**：渐进式、低门槛、编译时优化、"帮你做更多"。
- **React**：函数式、纯 UI = f(state)、运行时调度、"给你更多控制"。

## 手写 / 流程图

### 组件更新触发链对比

```text
Vue:  data 变更 → dep.notify() → scheduler 入队 → nextTick → 组件 render → patch (diff) → DOM 更新
React: setState → update 入队 → scheduler 调度 → fiber reconcile (render phase) → commit phase → DOM 更新
```

### Vue 3 响应式简图

```text
reactive(obj)
  → Proxy get: track(target, key) → 收集当前 effect
  → Proxy set: trigger(target, key) → 通知所有依赖的 effect 重新执行
```

### React 更新简图

```text
setState(newState)
  → 创建 update 对象入队
  → scheduleUpdateOnFiber → 进入调度
  → render phase: 遍历 fiber 树，调用函数组件，生成新 VNode
  → commit phase: 对比新旧 fiber，最小化 DOM 操作
```

## 口述题

### 1. 为什么现代前端一定离不开组件化？

回答模板：

> 组件化解决三个核心问题：复用、隔离、可组合。复用是指同一个按钮 / 表单 / 弹窗在多个页面用，不用重复写。隔离是指每个组件有独立的状态和样式作用域，改一个不影响其他的。可组合性是指小组件组合成大组件，像搭积木一样构建复杂 UI。
>
> 更深层看，组件化还带来了关注点分离：每个组件只负责一件事，方便团队分工、代码审查、测试和性能优化（比如按组件粒度做懒加载）。

### 2. Vue 和 React 的共同问题域是什么？

回答模板：

> 它们解决的核心问题是一样的：**数据驱动视图**。当状态变化时，如何高效地把 UI 同步到最新状态，不需要手动操作 DOM。
>
> 具体来说有三条主线：一是响应式/状态管理（如何检测变化），二是组件系统（如何组织 UI），三是渲染更新（如何最小化 DOM 操作）。只不过 Vue 用 Proxy + 编译优化做到精确更新，React 用不可变数据 + fiber 调度做到可中断渲染。设计哲学不同，但问题域一致。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Vue / React 设计哲学差异（Proxy vs setState，编译时 vs 运行时）（2 分钟）
2. 组件化三大价值（复用 / 隔离 / 可组合）（1.5 分钟）
3. 状态管理共性（单向数据流 + 集中管理 + 可预测变化）（1.5 分钟）

录完后自查：

- 是否说出 Vue 是编译时优化，React 是运行时优化。
- 是否说出组件化的三个核心价值。
- 是否说出两者共同解决"数据驱动视图"问题。
- 是否说出单向数据流的概念。

## 今日复盘

今天最需要回补的 3 个点：

1. Vue 的 PatchFlag 具体优化了什么（跳过静态节点对比）。
2. React fiber 的可中断渲染具体怎么实现（时间切片 + 优先级调度）。
3. Pinia 和 Vuex 的区别（去掉 mutation，TS 支持更好，组合式 API）。
