# Day 38 手写 mini-vue reactivity 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 38 | mini-vue reactivity | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 在仓库 `hand-write/` 下新建一个 mini-vue-reactivity 目录（或更新 `vue-book/reactive-system`）
- 实现 `reactive / ref / effect / computed / watch` 五件套
- 写 3 个测试用例：基础响应 / 嵌套 effect / computed 缓存

## 阅读卡点

- 必须实现 `effectStack` 才能处理嵌套 effect
- `cleanup` 是优化点，每次 run 前先把自己从 deps 里清掉，再重新收集
- `computed` 用 `dirty` 标志 + 惰性求值，必须让访问者能收到它的 trigger

## 速记卡 / 知识点

<!-- 五件套实现步骤 / 依赖数据结构 / 用到的闭包和 WeakMap -->

## 手写 / 流程图

```js
// 目标 API
const state = reactive({ count: 0 })
const double = computed(() => state.count * 2)
effect(() => console.log(state.count, double.value))
state.count++ // -> 1, 2
```

## 口述题

### 1. 你手写 mini-vue 时踩过哪些坑？

> 回答模板：

### 2. 嵌套 effect 为什么需要栈？

> 回答模板：

## 5 分钟录音顺序

1. 五件套关系图（2 分钟）
2. 踩坑点（嵌套 / cleanup / computed dirty）（2 分钟）
3. 和源码差距（1 分钟）

## 今日复盘

1. 
2. 
3. 
