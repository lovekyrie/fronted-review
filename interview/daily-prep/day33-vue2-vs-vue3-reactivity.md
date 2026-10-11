# Day 33 Vue 2 vs Vue 3 响应式对比

## 今日目标

- 对照 Vue 2 `Observer / Dep / Watcher` 和 Vue 3 `reactive / dep / effect` 架构
- 输出一张迁移常见问题清单（数组 / 新增属性 / Set Map 支持 / 深响应时机 / 性能）
- 能讲清 Vue 2 的 `Vue.set` 为什么存在、Vue 3 为什么不需要

## 按顺序阅读

1. [响应式原理](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## 实操与自测

**检查点**

- Vue 2 `Object.defineProperty` 的两大限制：不能监听新增/删除、不能监听数组索引
- Vue 2 重写 7 个数组方法绕开索引问题，Vue 3 用 Proxy 天然支持
- Vue 3 响应式是**按需**生成的（懒代理），对大对象更友好

**先独立完成，再对照专题**

- Vue 2 vs Vue 3 响应式角色对照 — [参考章节](../advanced/week3/reactivity#day-33-vue-2-vs-vue-3-响应式角色对照)
- 补充笔记 — [参考章节](../advanced/week3/reactivity#day-33-补充笔记)

**脱稿口述题**

- 1. Vue 3 响应式比 Vue 2 解决了哪些具体问题？
- 2. Vue 2 里为什么有 `Vue.set` / `$set`？

**录音练习**

1. Vue 2 响应式架构（2 分钟）
2. Vue 2 的痛点（1.5 分钟）
3. Vue 3 如何解决（1.5 分钟）

## 复盘

1. 最容易被追问：Vue 3 不是简单“性能比 Vue 2 好”，而是响应式可拦截操作范围更完整，架构也更统一。
2. 当前短板：数组部分不能只说 Proxy 天然支持，要知道 Vue 仍然对数组方法、length、索引依赖做了特殊处理。
3. 下一次补充：接到 Day34，进入模板编译，把响应式触发后的 render function 和 vnode 链路讲清楚。
