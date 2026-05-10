# Day 33 Vue 2 vs Vue 3 响应式对比 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 33 | Vue 2 vs 3 | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 对照 Vue 2 `Observer / Dep / Watcher` 和 Vue 3 `reactive / dep / effect` 架构
- 输出一张迁移常见问题清单（数组 / 新增属性 / Set Map 支持 / 深响应时机 / 性能）
- 能讲清 Vue 2 的 `Vue.set` 为什么存在、Vue 3 为什么不需要

## 阅读卡点

- Vue 2 `Object.defineProperty` 的两大限制：不能监听新增/删除、不能监听数组索引
- Vue 2 重写 7 个数组方法绕开索引问题，Vue 3 用 Proxy 天然支持
- Vue 3 响应式是**按需**生成的（懒代理），对大对象更友好

## 速记卡 / 知识点

<!-- Vue 2 三大角色 / Vue 3 对应角色 / 迁移 API 差异 -->

## 手写 / 流程图

<!-- 并排画两张响应式架构图 -->

## 口述题

### 1. Vue 3 响应式比 Vue 2 解决了哪些具体问题？

> 回答模板：

### 2. Vue 2 里为什么有 `Vue.set` / `$set`？

> 回答模板：

## 5 分钟录音顺序

1. Vue 2 响应式架构（2 分钟）
2. Vue 2 的痛点（1.5 分钟）
3. Vue 3 如何解决（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
