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

### 组件更新触发链

```text
响应式数据变化
  → dep.trigger()
  → 当前组件的 ReactiveEffect 被标记 dirty
  → scheduler 将更新入队（queueJob）
  → nextTick 后批量执行
  → effect.run() → 调用组件 render 生成新 VNode
  → patch(oldVNode, newVNode) → 递归子树
```

### setupRenderEffect

每个组件实例都有一个 `ReactiveEffect`，在 `setupRenderEffect` 中创建：

```js
const effect = new ReactiveEffect(
  () => componentUpdateFn,  // render + patch
  () => queueJob(update)    // scheduler：不立即执行，入队等 nextTick
)
```

### shouldUpdateComponent

父组件 re-render 时，遇到子组件 VNode 会调用 `shouldUpdateComponent(n1, n2)` 判断：

```text
对比 props（浅比较）
  → props 没变 → 跳过子组件更新
  → props 变了 → 触发子组件 update
额外检查：slots / emits / dirs 是否有变化
```

### 组件 vs 元素更新

| 维度 | 元素更新 | 组件更新 |
|------|----------|----------|
| 触发 | patchElement | processComponent → updateComponent |
| 核心 | patchProps + patchChildren | shouldUpdateComponent → re-render → patch 子树 |
| 优化 | Patch Flag 快路径 | props 浅比较 + v-memo |

### 性能优化手段

- **`v-memo`**：条件缓存子树，deps 不变则跳过整个子树的 re-render。
- **`shallowRef / shallowReactive`**：只追踪第一层变化，减少深层依赖收集。
- **`markRaw`**：标记对象不被 reactive 包装（大对象、第三方实例）。
- **`defineProps` 解构**：Vue 3.3+ 自动保持响应性，不再需要 `toRefs`。
- **组件拆分**：把频繁更新的部分拆成独立组件，缩小更新范围。

## 手写 / 流程图

### 完整更新流程

```text
state.count++ (Proxy set)
  → trigger(target, 'count')
  → dep.effects 中有组件 A 的 effect
  → scheduler: queueJob(updateA)
  → 同步代码执行完毕
  → nextTick flush queue
  → updateA(): 
      const newTree = render()
      patch(prevTree, newTree, container)
        → patchElement: 更新自身 DOM
        → 遇到子组件 <Child>:
            shouldUpdateComponent(oldChild, newChild)?
              → props 没变 → 跳过
              → props 变了 → child.update() → 子组件 re-render
```

### props 变化判断

```text
shouldUpdateComponent(n1, n2):
  1. 有 dynamicSlots → true
  2. 新节点有 children (slots) → 对比 slots
  3. 对比 props:
     - oldProps === newProps → false
     - 数量不同 → true
     - 遍历 newProps，值不同 → true
  4. 都一样 → false (跳过更新)
```

## 口述题

### 1. 父组件更新时子组件一定会更新吗？

回答模板：

> 不一定。父组件 re-render 时生成了新的子组件 VNode，但 Vue 会调用 `shouldUpdateComponent` 做浅比较。如果子组件的 props、slots、emits 都没变化，就跳过子组件的 update，直接复用旧的子树。
>
> 这和 React 不一样。React 默认父组件 re-render 子组件也会 re-render，需要手动用 `React.memo` 才能跳过。Vue 因为有响应式系统 + 编译时优化，默认就有一定程度的"自动跳过"。
>
> 但如果父组件每次 render 都给子组件传了新对象引用（如 `{ ...props }`），浅比较就会认为变了，子组件还是会更新。所以要注意不要在模板里创建临时对象作为 props。

### 2. 怎样避免不必要的组件更新？

回答模板：

> 五个手段。第一，`v-memo` 可以条件缓存整个子树，当依赖值不变时跳过 re-render，适合列表中的高开销项。第二，避免给子组件传临时对象或内联函数，破坏浅比较。第三，`shallowRef / shallowReactive` 减少深层追踪，适合大对象或性能敏感数据。第四，`markRaw` 标记不需要响应式的对象（如 echarts 实例）。第五，组件拆分，把频繁变化的部分拆成独立组件，缩小 re-render 范围。
>
> 本质上，Vue 的优化思路是"缩小更新范围 + 减少 diff 工作量"，和 React 的"减少 re-render 次数"思路有区别。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 组件更新触发链（数据变 → trigger → scheduler → nextTick → render → patch）（2 分钟）
2. shouldUpdateComponent 的判定逻辑（props 浅比较 + slots）（1.5 分钟）
3. 五个优化手段（v-memo / shallowRef / markRaw / 组件拆分 / 避免临时对象）（1.5 分钟）

录完后自查：

- 是否说出每个组件都有一个 ReactiveEffect。
- 是否说出 scheduler 用 queueJob 批量异步更新。
- 是否说出 shouldUpdateComponent 做 props 浅比较。
- 是否说出和 React 在"自动跳过"上的差异。

## 今日复盘

今天最需要回补的 3 个点：

1. `queueJob` 的去重逻辑（同一个 job 不会入队两次）和 flush 时机。
2. `v-memo` 的实现原理（isMemoSame 对比 deps 数组）。
3. `KeepAlive` 对组件更新的影响（activated / deactivated 替代 mount / unmount）。
