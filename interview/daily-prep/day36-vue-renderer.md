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

### renderer 入口架构

```text
patch(n1, n2, container)
  → n2.type 判断：
    string     → processElement
    Component  → processComponent
    Fragment   → processFragment
    Text       → processText
```

- `n1 === null` → mount（首次挂载）
- `n1 !== null` → patch（更新对比）
- `n1 存在但 n2 === null` → unmount（卸载）

### patchElement 流程

```text
patchElement(n1, n2):
  1. patchProps(el, oldProps, newProps, patchFlag)
  2. patchChildren(n1, n2, el, patchFlag)
  3. n2.el = n1.el  // 复用 DOM 节点
```

### children diff 三阶段（Vue 3）

```text
阶段 1：从头比 — i 从 0 开始，相同 key+type 直接 patch
阶段 2：从尾比 — e1/e2 从末尾开始，相同 key+type 直接 patch
阶段 3：处理中间乱序段
  → 建 keyToNewIndex Map
  → 遍历旧节点，查 Map 找到新位置
  → 用最长递增子序列（LIS）确定不需要移动的节点
  → 剩余节点做移动或新增
```

### 最长递增子序列（LIS）

- 作用：在乱序段中找到**不需要移动的最大节点集合**，其余节点才需要 DOM 移动。
- 算法：贪心 + 二分，O(n log n)。
- 收益：把 DOM 移动次数降到最少。React 没有用 LIS，Vue 3 在这里更优。

### key 的作用

- key 是 vnode 的唯一标识，用于 diff 时**快速匹配新旧节点**。
- 没有 key → 按索引匹配，可能导致组件状态错乱、不必要的 DOM 操作。
- 有 key → 通过 `keyToNewIndex` Map 精确查找对应节点。

## 手写 / 流程图

### children diff 完整流程图

```text
旧: [a, b, c, d, e, f]    新: [a, d, b, g, f]

阶段 1 头头比: a === a → patch ✓, i = 1
阶段 2 尾尾比: f === f → patch ✓, e1 = 4, e2 = 3

中间乱序段:
  旧: [b, c, d, e]  新: [d, b, g]
  
  keyToNewIndex: { d→0, b→1, g→2 }
  遍历旧节点:
    b → 新位置 1
    c → 不存在 → unmount
    d → 新位置 0
    e → 不存在 → unmount
  
  newIndexToOldIndex: [3, 1, 0]  (d原位3, b原位1, g是新增)
  LIS([3, 1]) = [1] → 索引 1 的节点(b)不动
  
  倒序遍历: g(mount) → b(不动) → d(move)
```

### LIS 算法核心

```js
function getSequence(arr) {
  const result = [0]
  const p = arr.slice()
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === 0) continue // 新增节点跳过
    const last = arr[result[result.length - 1]]
    if (arr[i] > last) {
      p[i] = result[result.length - 1]
      result.push(i)
    } else {
      // 二分查找替换
      let lo = 0, hi = result.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (arr[result[mid]] < arr[i]) lo = mid + 1
        else hi = mid
      }
      if (arr[i] < arr[result[lo]]) {
        if (lo > 0) p[i] = result[lo - 1]
        result[lo] = i
      }
    }
  }
  // 回溯
  let len = result.length, idx = result[len - 1]
  while (len-- > 0) { result[len] = idx; idx = p[idx] }
  return result
}
```

## 口述题

### 1. Vue 3 的 diff 为什么要用最长递增子序列？

回答模板：

> 在 children diff 的乱序段处理中，我们需要把旧节点移动到新的顺序。如果暴力移动每个节点，DOM 操作次数最多。LIS 的作用是找到乱序段中**相对顺序已经正确的最大子集**，这些节点不需要移动，只移动剩下的节点。
>
> 比如旧顺序 `[b, c, d]` 变成 `[d, b, c]`，LIS 是 `[b, c]`（递增子序列），只需要把 `d` 移到最前面，`b` 和 `c` 不动。这样 DOM 移动次数从 3 次降到 1 次。算法复杂度是 O(n log n)，这是 Vue 3 相比 Vue 2 双端 diff 的一个优化点。

### 2. `key` 在 diff 里起什么作用？

回答模板：

> `key` 是 vnode 的身份标识。diff 时判断两个节点"是否是同一个"靠的是 `key + type` 相同。
>
> 没有 key 时，diff 只能按索引位置匹配，如果列表顺序变了，可能会把 A 组件的 DOM 复用给 B 组件，导致状态错乱（比如 input 值残留、transition 异常）。
>
> 有 key 时，Vue 通过 `keyToNewIndex` Map 精确找到新旧节点的对应关系，可以正确复用、移动和删除。所以 `v-for` 必须加 key，且 key 不应该用 index（顺序变时 index 也变，等于没有 key）。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. renderer 架构（patch 入口按 type 分派 → element / component / fragment）（1.5 分钟）
2. children diff 三阶段（头头 → 尾尾 → 乱序 + LIS）（2 分钟）
3. LIS 收益 + key 的作用 + 不加 key 的后果（1.5 分钟）

录完后自查：

- 是否说出 children diff 分三阶段。
- 是否说出 LIS 找"不需要移动的最大集合"。
- 是否说出 key + type 判断同一节点。
- 是否说出不加 key 会导致状态错乱。

## 今日复盘

今天最需要回补的 3 个点：

1. Fragment 的 `anchor` 定位机制（没有真实根节点时如何确定插入位置）。
2. `processComponent` 中 mount vs update 的分支逻辑。
3. Vue 2 双端 diff 和 Vue 3 快速 diff + LIS 的具体差异。
