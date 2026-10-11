# Day 13 Vue / React 基础预热

## 今日目标

- 看完 `/framework/vue/vue3`、`/framework/react/basics`
- 输出 Vue / React 基础认知对比表（响应式、组件、状态、生命周期）
- 输出组件化、状态、渲染三条主线共性提纲

## 按顺序阅读

1. [Vue 3](../framework/vue/vue3)
2. [React 基础](../framework/react/basics)

## 实操与自测

**检查点**

- Vue 的“响应式”和 React 的“重新渲染”不是一回事，但最终目的都是同步 UI
- 组件化解决的是**复用 + 隔离 + 可组合性**三个问题
- 不要陷入源码细节，今天只做“语言 → 心智模型”的过渡

**先独立完成，再对照专题**

- Vue vs React 对照表 — [参考章节](../framework/vue/vue3#day-13-vue-vs-react-对照表)
- 组件化三大价值 — [参考章节](../framework/vue/vue3#day-13-组件化三大价值)
- 状态管理思路共性 — [参考章节](../framework/vue/vue3#day-13-状态管理思路共性)
- 设计哲学差异 — [参考章节](../framework/vue/vue3#day-13-设计哲学差异)
- 组件更新触发链对比 — [参考章节](../framework/vue/vue3#day-13-组件更新触发链对比)
- Vue 3 响应式简图 — [参考章节](../framework/vue/vue3#day-13-vue-3-响应式简图)
- React 更新简图 — [参考章节](../framework/react/basics#day-13-react-更新简图)

**脱稿口述题**

- 1. 为什么现代前端一定离不开组件化？
- 2. Vue 和 React 的共同问题域是什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Vue / React 设计哲学差异（Proxy vs setState，编译时 vs 运行时）（2 分钟）
2. 组件化三大价值（复用 / 隔离 / 可组合）（1.5 分钟）
3. 状态管理共性（单向数据流 + 集中管理 + 可预测变化）（1.5 分钟）

录完后自查：

- 是否说出 Vue 是编译时优化，React 是运行时优化。
- 是否说出组件化的三个核心价值。
- 是否说出两者共同解决"数据驱动视图"问题。
- 是否说出单向数据流的概念。

## 复盘

今天最需要回补的 3 个点：

1. Vue 的 PatchFlag 具体优化了什么（跳过静态节点对比）。
2. React fiber 的可中断渲染具体怎么实现（时间切片 + 优先级调度）。
3. Pinia 和 Vuex 的区别（去掉 mutation，TS 支持更好，组合式 API）。
