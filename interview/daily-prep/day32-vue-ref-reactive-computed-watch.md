# Day 32 ref / reactive / computed / watch 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 32 | ref/reactive/computed/watch | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 看完 Vue Computed / Watchers 文档
- 输出 4 个 API 的对照表：用法、响应边界、常见坑
- 手写最小版 `ref` + `computed`

## 阅读卡点

- `ref` 是带 `.value` 的对象包装，解构会丢响应；`reactive` 解构也会丢响应，要 `toRefs`
- `computed` 的懒计算：只有被访问时才 run，且会缓存结果
- `watch` 的 `immediate / deep / flush` 三个选项各自解决什么问题

## 速记卡 / 知识点

<!-- 4 API 对照表 / 响应丢失 3 种典型场景 / watch vs watchEffect -->

## 手写 / 流程图

```js
function ref(v) { /* class RefImpl + track/trigger */ }
function computed(getter) { /* dirty 标志 + effect 懒执行 */ }
```

## 口述题

### 1. `ref` 和 `reactive` 怎么选？

> 回答模板：

### 2. `computed` 和 `watch` 怎么选？

> 回答模板：

## 5 分钟录音顺序

1. 4 API 用法边界（2 分钟）
2. 响应丢失 3 种场景（1.5 分钟）
3. computed 懒计算 + 缓存（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
