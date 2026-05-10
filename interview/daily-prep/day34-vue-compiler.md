# Day 34 Vue 模板编译流程 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 34 | 模板编译 | [渲染机制](../advanced/week3/rendering-mechanism)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 看完 Vue Rendering Mechanism 文档
- 画一张 parse → transform → codegen 的流程图
- 在 Vue SFC Playground 里观察一段模板被编译成的 render 函数

## 阅读卡点

- `parse` 输出 AST，`transform` 给 AST 打标记（`patchFlag`、`dynamicProps`）
- `codegen` 根据 AST 生成 render 字符串，包括 `_createVNode / _createBlock` 的选择
- 静态节点会被提升到 render 函数外部，只创建一次

## 速记卡 / 知识点

<!-- 三阶段职责 / patch flag 种类 / 静态提升触发条件 -->

## 手写 / 流程图

```text
template → parse → AST → transform(加 patchFlag) → codegen → render 函数
```

## 口述题

### 1. 一段模板是怎么变成 render 函数的？

> 回答模板：

### 2. 为什么 Vue 3 的 render 通常比 Vue 2 更快？

> 回答模板：

## 5 分钟录音顺序

1. 编译三阶段（2 分钟）
2. patchFlag 作用（1.5 分钟）
3. 静态提升 + block tree 预告（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
