# Day 34 Vue 模板编译流程

## 今日目标

- 看完 Vue Rendering Mechanism 文档
- 画一张 parse → transform → codegen 的流程图
- 在 Vue SFC Playground 里观察一段模板被编译成的 render 函数

## 按顺序阅读

1. [渲染机制](../advanced/week3/rendering-mechanism)
2. [Vue 3](../framework/vue/vue3)

## 实操与自测

**检查点**

- `parse` 输出 AST，`transform` 给 AST 打标记（`patchFlag`、`dynamicProps`）
- `codegen` 根据 AST 生成 render 字符串，包括 `_createVNode / _createBlock` 的选择
- 静态节点会被提升到 render 函数外部，只创建一次

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week3/rendering-mechanism#day-34-知识补充)
- 常见 patch flag 方向 — [参考章节](../advanced/week3/rendering-mechanism#day-34-常见-patch-flag-方向)
- 动手示例 — [参考章节](../advanced/week3/rendering-mechanism#day-34-动手示例)

**脱稿口述题**

- 1. 一段模板是怎么变成 render 函数的？
- 2. 为什么 Vue 3 的 render 通常比 Vue 2 更快？

**录音练习**

1. 编译三阶段（2 分钟）
2. patchFlag 作用（1.5 分钟）
3. 静态提升 + block tree 预告（1.5 分钟）

## 复盘

1. 最容易被追问：render function 执行时读取响应式数据，所以模板编译和响应式依赖收集不是两条孤立链路。
2. 当前短板：patch flag 和 block tree 这里只能先讲作用，细节要放到 Day35 继续补。
3. 下一次补充：接到 Day35，重点解释 Patch Flag、静态提升和 Block Tree 如何减少运行时 diff 成本。
