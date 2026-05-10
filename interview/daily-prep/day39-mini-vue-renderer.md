# Day 39 手写 mini-vue renderer 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 39 | mini-vue renderer | [渲染机制](../advanced/week3/rendering-mechanism)、[Vue diff](../framework/vue/dom-diff) |

## 今日目标

- 在 mini-vue 项目里加一个最小 renderer：支持 `h / mount / patch / unmount`
- 实现 element + text + fragment 三种 vnode 类型
- children diff 先只实现**头头 + 尾尾 + 暴力对比**，不要求 LIS

## 阅读卡点

- vnode 结构：`{ type, props, children, el, key }`
- `patchProps` 要处理 `class / style / on* / 普通 attr` 四类
- 组件 vnode 用函数调用 render 得到子 vnode，再挂载

## 速记卡 / 知识点

<!-- vnode 结构 / patch dispatch / patchProps / children 简化 diff -->

## 手写 / 流程图

```js
createApp({ render() { return h('div', null, 'hi') } }).mount('#app')
```

## 口述题

### 1. mount 和 patch 的主要区别是什么？

> 回答模板：

### 2. 如果让你从零做一个 renderer，你会怎么拆？

> 回答模板：

## 5 分钟录音顺序

1. vnode 结构（1 分钟）
2. mount 流程（2 分钟）
3. patch + children diff 的拆解（2 分钟）

## 今日复盘

1. 
2. 
3. 
