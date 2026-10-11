# Day 37 Vue 组件更新与调度

## 今日目标

- 读 `setupRenderEffect` / `updateComponent` 的源码链路
- 画一张“props 变化 → 父组件 re-render → 子组件更新 / 跳过”的判断流程图
- 理解 `shouldUpdateComponent` 的短路判断

## 按顺序阅读

1. [渲染机制](../advanced/week3/rendering-mechanism)
2. [生命周期](../framework/vue/lifecycles)
3. [组件通信](../framework/vue/components-communication)

## 实操与自测

**检查点**

- 每个组件实例都有一个 `ReactiveEffect`，变化时 `effect.run` 触发 re-render
- `shouldUpdateComponent` 通过对比 props / slots / dirs 决定是否真的 update
- `v-memo` / `defineProps + withDefaults` 可以进一步裁剪更新

**先独立完成，再对照专题**

- 组件更新触发链 — [参考章节](../advanced/week3/rendering-mechanism#day-37-组件更新触发链)
- setupRenderEffect — [参考章节](../advanced/week3/rendering-mechanism#day-37-setuprendereffect)
- shouldUpdateComponent — [参考章节](../advanced/week3/rendering-mechanism#day-37-shouldupdatecomponent)
- 组件 vs 元素更新 — [参考章节](../advanced/week3/rendering-mechanism#day-37-组件-vs-元素更新)
- 性能优化手段 — [参考章节](../advanced/week3/rendering-mechanism#day-37-性能优化手段)
- 完整更新流程 — [参考章节](../advanced/week3/rendering-mechanism#day-37-完整更新流程)
- props 变化判断 — [参考章节](../advanced/week3/rendering-mechanism#day-37-props-变化判断)

**脱稿口述题**

- 1. 父组件更新时子组件一定会更新吗？
- 2. 怎样避免不必要的组件更新？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 组件更新触发链（数据变 → trigger → scheduler → nextTick → render → patch）（2 分钟）
2. shouldUpdateComponent 的判定逻辑（props 浅比较 + slots）（1.5 分钟）
3. 五个优化手段（v-memo / shallowRef / markRaw / 组件拆分 / 避免临时对象）（1.5 分钟）

录完后自查：

- 是否说出每个组件都有一个 ReactiveEffect。
- 是否说出 scheduler 用 queueJob 批量异步更新。
- 是否说出 shouldUpdateComponent 做 props 浅比较。
- 是否说出和 React 在"自动跳过"上的差异。

## 复盘

今天最需要回补的 3 个点：

1. `queueJob` 的去重逻辑（同一个 job 不会入队两次）和 flush 时机。
2. `v-memo` 的实现原理（isMemoSame 对比 deps 数组）。
3. `KeepAlive` 对组件更新的影响（activated / deactivated 替代 mount / unmount）。
