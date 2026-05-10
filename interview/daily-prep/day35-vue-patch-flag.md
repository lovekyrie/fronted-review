# Day 35 Patch Flag / 静态提升 / Block Tree 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 35 | Patch Flag / Block Tree | [渲染机制](../advanced/week3/rendering-mechanism)、[Vue diff](../framework/vue/dom-diff) |

## 今日目标

- 深入 Patch Flag 枚举（TEXT / CLASS / STYLE / PROPS / FULL_PROPS / HYDRATE_EVENTS / STABLE_FRAGMENT…）
- 画一张 Block Tree 结构图，对比传统 VDOM Diff
- 输出 Vue 3 编译优化答题稿

## 阅读卡点

- Block 是“动态节点容器”，diff 时只遍历 block.dynamicChildren，而不是整棵树
- Patch Flag 决定 `patch` 函数走哪条快路径，避免全量属性 diff
- `v-if / v-for` 会创建新 block 切断，导致动态节点收集范围改变

## 速记卡 / 知识点

<!-- Patch Flag 枚举 / Block 作用 / 静态提升触发 / 与传统 diff 对比 -->

## 手写 / 流程图

```text
普通 diff: 遍历整个 vnode 树
Vue 3 block diff: 只遍历 block.dynamicChildren
```

## 口述题

### 1. Patch Flag 具体是怎么加速 diff 的？

> 回答模板：

### 2. Block Tree 和传统 VDOM 的区别是什么？

> 回答模板：

## 5 分钟录音顺序

1. Patch Flag 的动机（1 分钟）
2. Block Tree 结构（2 分钟）
3. 静态提升的实际收益（2 分钟）

## 今日复盘

1. 
2. 
3. 
