# Day 39 手写 mini-vue renderer

## 今日目标

- 在 mini-vue 项目里加一个最小 renderer：支持 `h / mount / patch / unmount`
- 实现 element + text + fragment 三种 vnode 类型
- children diff 先只实现**头头 + 尾尾 + 暴力对比**，不要求 LIS

## 按顺序阅读

1. [渲染机制](../advanced/week3/rendering-mechanism)
2. [Vue diff](../framework/vue/dom-diff)

## 实操与自测

**检查点**

- vnode 结构：`{ type, props, children, el, key }`
- `patchProps` 要处理 `class / style / on* / 普通 attr` 四类
- 组件 vnode 用函数调用 render 得到子 vnode，再挂载

**先独立完成，再对照专题**

- VNode 结构 — [参考章节](../advanced/week3/rendering-mechanism#day-39-vnode-结构)
- patch 分派逻辑 — [参考章节](../advanced/week3/rendering-mechanism#day-39-patch-分派逻辑)
- patchProps 四类 — [参考章节](../advanced/week3/rendering-mechanism#day-39-patchprops-四类)
- 最小 renderer 实现 — [参考章节](../advanced/week3/rendering-mechanism#day-39-最小-renderer-实现)
- createApp 简示 — [参考章节](../advanced/week3/rendering-mechanism#day-39-createapp-简示)

**脱稿口述题**

- 1. mount 和 patch 的主要区别是什么？
- 2. 如果让你从零做一个 renderer，你会怎么拆？

**录音练习**

按这个顺序录，不要临场重新组织：

1. VNode 结构 + h 函数（1 分钟）
2. mount 流程（createElement → props → children → appendChild）（2 分钟）
3. patch 流程（复用 el → diff props → diff children）+ 和 reactivity 连接（2 分钟）

录完后自查：

- 是否说出 VNode 的核心字段。
- 是否说出 mount 创建 DOM、patch 复用 DOM。
- 是否说出 patchProps 四类处理。
- 是否说出 effect 把 render 和 reactivity 连接。

## 复盘

今天最需要回补的 3 个点：

1. 事件处理的优化：invoker 模式（不 remove/add，只换 handler 引用）。
2. Fragment 的实现：没有根节点时用 `anchor` 注释节点定位。
3. 组件 VNode 的处理：调用 render 得到子 VNode 后走 element 流程。
