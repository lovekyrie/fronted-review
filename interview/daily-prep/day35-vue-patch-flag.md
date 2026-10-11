# Day 35 Patch Flag / 静态提升 / Block Tree

## 今日目标

- 深入 Patch Flag 枚举（TEXT / CLASS / STYLE / PROPS / FULL_PROPS / HYDRATE_EVENTS / STABLE_FRAGMENT…）
- 画一张 Block Tree 结构图，对比传统 VDOM Diff
- 输出 Vue 3 编译优化答题稿

## 按顺序阅读

1. [渲染机制](../advanced/week3/rendering-mechanism)
2. [Vue diff](../framework/vue/dom-diff)

## 实操与自测

**检查点**

- Block 是“动态节点容器”，diff 时只遍历 block.dynamicChildren，而不是整棵树
- Patch Flag 决定 `patch` 函数走哪条快路径，避免全量属性 diff
- `v-if / v-for` 会创建新 block 切断，导致动态节点收集范围改变

**先独立完成，再对照专题**

- Patch Flag 枚举 — [参考章节](../advanced/week3/rendering-mechanism#day-35-patch-flag-枚举)
- Block Tree — [参考章节](../advanced/week3/rendering-mechanism#day-35-block-tree)
- 静态提升（Static Hoisting） — [参考章节](../advanced/week3/rendering-mechanism#day-35-静态提升-static-hoisting)
- 传统 VDOM diff vs Block Tree diff — [参考章节](../framework/vue/dom-diff#day-35-传统-vdom-diff-vs-block-tree-diff)
- Patch Flag 快路径 — [参考章节](../advanced/week3/rendering-mechanism#day-35-patch-flag-快路径)

**脱稿口述题**

- 1. Patch Flag 具体是怎么加速 diff 的？
- 2. Block Tree 和传统 VDOM 的区别是什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Patch Flag 的动机和枚举（TEXT/CLASS/STYLE/PROPS）+ 快路径原理（1 分钟）
2. Block Tree 结构 + 和传统 diff 的对比 + v-if/v-for 切断（2 分钟）
3. 静态提升原理 + HOISTED flag + 实际收益（2 分钟）

录完后自查：

- 是否说出 Patch Flag 是编译阶段标记、运行时使用。
- 是否说出 Block 收集 dynamicChildren 做扁平化 diff。
- 是否说出 v-if / v-for 会创建新 Block。
- 是否说出静态提升跳过 diff 且复用引用。

## 复盘

今天最需要回补的 3 个点：

1. `BAIL` flag（-2）退出优化的场景：手写 render 函数、非编译模板。
2. `v-once` 和静态提升的关系：`v-once` 把整个子树标记为静态。
3. `cacheHandlers`（事件处理函数缓存）和 Patch Flag 的配合。
