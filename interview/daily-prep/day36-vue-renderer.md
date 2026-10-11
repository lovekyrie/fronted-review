# Day 36 Vue 渲染器与 diff

## 今日目标

- 读 `runtime-core/src/renderer.ts` 的 `patch / patchElement / patchChildren` 核心片段
- 画一张 mount / patch / unmount 的三路径流程图
- 输出 Vue 3 diff 算法（双端 + 最长递增子序列）讲解稿

## 按顺序阅读

1. [渲染机制](../advanced/week3/rendering-mechanism)
2. [Vue diff](../framework/vue/dom-diff)

## 实操与自测

**检查点**

- Vue 3 的 diff 核心是`双端比较 + 处理中间乱序段用 LIS`，减少真实 DOM 移动
- `processElement / processComponent / processFragment` 按 vnode 类型分派
- Fragment 需要额外维护 `anchor` 来定位插入位置

**先独立完成，再对照专题**

- renderer 入口架构 — [参考章节](../advanced/week3/rendering-mechanism#day-36-renderer-入口架构)
- patchElement 流程 — [参考章节](../advanced/week3/rendering-mechanism#day-36-patchelement-流程)
- children diff 三阶段（Vue 3） — [参考章节](../advanced/week3/rendering-mechanism#day-36-children-diff-三阶段-vue-3)
- 最长递增子序列（LIS） — [参考章节](../advanced/week3/rendering-mechanism#day-36-最长递增子序列-lis)
- key 的作用 — [参考章节](../advanced/week3/rendering-mechanism#day-36-key-的作用)
- children diff 完整流程图 — [参考章节](../advanced/week3/rendering-mechanism#day-36-children-diff-完整流程图)
- LIS 算法核心 — [参考章节](../advanced/week3/rendering-mechanism#day-36-lis-算法核心)

**脱稿口述题**

- 1. Vue 3 的 diff 为什么要用最长递增子序列？
- 2. `key` 在 diff 里起什么作用？

**录音练习**

按这个顺序录，不要临场重新组织：

1. renderer 架构（patch 入口按 type 分派 → element / component / fragment）（1.5 分钟）
2. children diff 三阶段（头头 → 尾尾 → 乱序 + LIS）（2 分钟）
3. LIS 收益 + key 的作用 + 不加 key 的后果（1.5 分钟）

录完后自查：

- 是否说出 children diff 分三阶段。
- 是否说出 LIS 找"不需要移动的最大集合"。
- 是否说出 key + type 判断同一节点。
- 是否说出不加 key 会导致状态错乱。

## 复盘

今天最需要回补的 3 个点：

1. Fragment 的 `anchor` 定位机制（没有真实根节点时如何确定插入位置）。
2. `processComponent` 中 mount vs update 的分支逻辑。
3. Vue 2 双端 diff 和 Vue 3 快速 diff + LIS 的具体差异。
