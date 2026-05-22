# Day 35 Patch Flag / 静态提升 / Block Tree 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 35 | Patch Flag / Block Tree | [渲染机制](../advanced/week3/rendering-mechanism)、[Vue diff](../framework/vue/dom-diff) |

## 今日目标

- 深入 Patch Flag 枚举（TEXT / CLASS / STYLE / PROPS / FULL_PROPS / HYDRATE_EVENTS / STABLE_FRAGMENT…）
- 画一张 Block Tree 结构图，对比传统 VDOM Diff
- 输出 Vue 3 编译优化答题稿

## 阅读卡点

- Block 是“动态节点容器”，diff 时只遍历 block.dynamicChildren，而不是整棵树
- Patch Flag 决定 `patch` 函数走哪条快路径，避免全量属性 diff
- `v-if / v-for` 会创建新 block 切断，导致动态节点收集范围改变

## 速记卡 / 知识点

### Patch Flag 枚举

| Flag | 值 | 含义 |
|------|-----|------|
| `TEXT` | 1 | 子节点是动态文本 |
| `CLASS` | 2 | 动态 class 绑定 |
| `STYLE` | 4 | 动态 style 绑定 |
| `PROPS` | 8 | 动态非 class/style 属性 |
| `FULL_PROPS` | 16 | 有动态 key 的 props，需全量 diff |
| `HYDRATE_EVENTS` | 32 | 需要 hydrate 的事件 |
| `STABLE_FRAGMENT` | 64 | 子节点顺序不变的 fragment |
| `KEYED_FRAGMENT` | 128 | 子节点有 key 的 fragment |
| `UNKEYED_FRAGMENT` | 256 | 子节点无 key 的 fragment |
| `NEED_PATCH` | 512 | 只需要非 props 的 patch（ref / hooks） |
| `HOISTED` | -1 | 静态提升节点，永不 diff |
| `BAIL` | -2 | 退出优化模式，走全量 diff |

作用：编译器在编译阶段就标记出哪些节点是动态的、动态的什么属性，运行时 `patch` 函数根据 flag 走**快路径**，跳过不变的部分。

### Block Tree

- **Block**：一个"动态节点容器"，收集所有后代中的动态节点到 `dynamicChildren` 数组。
- **传统 diff**：递归遍历整棵 vnode 树，逐个节点对比。
- **Block diff**：只遍历 `block.dynamicChildren`，扁平化的数组，O(动态节点数) 而非 O(总节点数)。

Block 切断点：`v-if` / `v-for` / `<Component>` 会创建新的 Block，因为它们会改变子树结构。

### 静态提升（Static Hoisting）

```js
// 编译前
<div>
  <span>static text</span>
  <span>{{ dynamic }}</span>
</div>

// 编译后（伪代码）
const _hoisted_1 = createVNode('span', null, 'static text', -1 /* HOISTED */)
function render() {
  return createBlock('div', null, [
    _hoisted_1,  // 复用，不参与 diff
    createVNode('span', null, ctx.dynamic, 1 /* TEXT */)
  ])
}
```

收益：静态节点只创建一次，后续 re-render 直接复用引用，既省内存又跳过 diff。

## 手写 / 流程图

### 传统 VDOM diff vs Block Tree diff

```text
传统 diff:
  div (compare)
  ├── span "static" (compare → no change)
  ├── span "static" (compare → no change)
  └── span {{ msg }} (compare → TEXT changed → update)
  共对比 4 个节点

Block Tree diff:
  div [Block]
  └── dynamicChildren: [ span {{ msg }} (PatchFlag: TEXT) ]
  只对比 1 个节点，且知道只需更新 textContent
```

### Patch Flag 快路径

```text
patch(n1, n2):
  if (patchFlag & TEXT)   → 只更新 el.textContent
  if (patchFlag & CLASS)  → 只更新 el.className
  if (patchFlag & STYLE)  → 只更新 el.style
  if (patchFlag & PROPS)  → 只 diff dynamicProps 列表中的属性
  if (patchFlag === HOISTED) → 跳过，不 diff
```

## 口述题

### 1. Patch Flag 具体是怎么加速 diff 的？

回答模板：

> Patch Flag 是 Vue 3 编译器在编译阶段给动态节点打的标记，告诉运行时"这个节点的哪些部分是动态的"。比如标记为 `TEXT` 就表示只有文本内容会变，`CLASS` 表示只有 class 会变。
>
> 运行时 `patch` 函数拿到这个 flag 后，走对应的快路径：标记 `TEXT` 就只更新 `textContent`，标记 `CLASS` 就只更新 `className`，不需要全量对比所有属性。这样每个节点的 diff 成本从 O(属性数) 降到 O(1)。
>
> 配合 Block Tree，整体 diff 从"遍历整棵树 × 全量属性对比"变成"只遍历动态节点 × 精准属性更新"，这就是 Vue 3 比 Vue 2 diff 快很多的核心原因。

### 2. Block Tree 和传统 VDOM 的区别是什么？

回答模板：

> 传统 VDOM（如 React、Vue 2）diff 时需要递归遍历整棵虚拟 DOM 树，逐层对比每个节点。即使模板里 90% 都是静态内容，diff 也要走一遍。
>
> Vue 3 的 Block Tree 在编译阶段就识别出哪些节点是动态的，把它们收集到 Block 的 `dynamicChildren` 数组里。运行时 diff 只遍历这个扁平数组，跳过所有静态节点。相当于 diff 的复杂度从 O(模板总节点数) 降到 O(动态节点数)。
>
> 需要注意的是 `v-if` 和 `v-for` 会创建新的 Block，因为它们会改变子树结构，导致 dynamicChildren 不能跨结构收集。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Patch Flag 的动机和枚举（TEXT/CLASS/STYLE/PROPS）+ 快路径原理（1 分钟）
2. Block Tree 结构 + 和传统 diff 的对比 + v-if/v-for 切断（2 分钟）
3. 静态提升原理 + HOISTED flag + 实际收益（2 分钟）

录完后自查：

- 是否说出 Patch Flag 是编译阶段标记、运行时使用。
- 是否说出 Block 收集 dynamicChildren 做扁平化 diff。
- 是否说出 v-if / v-for 会创建新 Block。
- 是否说出静态提升跳过 diff 且复用引用。

## 今日复盘

今天最需要回补的 3 个点：

1. `BAIL` flag（-2）退出优化的场景：手写 render 函数、非编译模板。
2. `v-once` 和静态提升的关系：`v-once` 把整个子树标记为静态。
3. `cacheHandlers`（事件处理函数缓存）和 Patch Flag 的配合。
