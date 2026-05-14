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

- Vue 模板不会直接运行，编译器会把 template 转成 render function，render 执行后生成 vnode。
- 编译主流程可以拆成三步：`parse -> transform -> codegen`。
- `parse` 负责把模板字符串解析成 AST，描述标签、属性、指令、插值、文本等结构。
- `transform` 负责在 AST 上做转换和标记，例如识别动态文本、动态 class/style、事件、指令、组件。
- `codegen` 负责把转换后的 AST 生成 render 函数字符串，里面会出现 `openBlock`、`createElementBlock`、`createVNode` 等调用。
- 静态提升会把不依赖响应式数据的 vnode 提到 render 外，只创建一次，减少更新时重复创建和比较。
- patch flag 是编译器给动态节点打的提示，告诉运行时这个 vnode 哪些部分会变，例如 text、class、style、props。
- 事件缓存让事件处理函数引用稳定，减少每次 render 都创建新函数导致的无意义 props 变化。
- block tree 会收集稳定结构里的动态子节点，更新时优先遍历 dynamicChildren，而不是完整递归整棵模板树。
- Day34 只需要讲清编译主链路；patch flag、block tree、diff 细节会在 Day35-36 展开。

### 常见 patch flag 方向

| 类型 | 含义 | 示例 |
|------|------|------|
| TEXT | 文本动态 | `{{ title }}` |
| CLASS | class 动态 | `:class="cls"` |
| STYLE | style 动态 | `:style="style"` |
| PROPS | 指定 props 动态 | `:id="id"` |
| FULL_PROPS | props 复杂，需完整比较 | `v-bind="obj"` |
| NEED_PATCH | 需要运行时处理 | ref、指令等 |

## 手写 / 流程图

```text
template → parse → AST → transform(加 patchFlag) → codegen → render 函数
```

```vue
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>static text</p>
    <button @click="onClick">{{ count }}</button>
  </div>
</template>
```

```js
// 简化后的 render 形态，重点看动态标记和静态节点
const _hoisted_1 = createElementVNode('p', null, 'static text')

function render(_ctx, _cache) {
  return openBlock(), createElementBlock('div', { class: 'card' }, [
    createElementVNode('h3', null, toDisplayString(_ctx.title), 1),
    _hoisted_1,
    createElementVNode(
      'button',
      {
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick(...args)),
      },
      toDisplayString(_ctx.count),
      1,
    ),
  ])
}
```

```text
组件挂载
  -> 创建 render effect
  -> 执行 render function
  -> render 读取 title/count
  -> track 组件 render effect
  -> 生成 vnode
  -> patch 到 DOM

状态变化
  -> trigger render effect
  -> scheduler queueJob
  -> 重新 render
  -> 根据 patch flag / block tree 做更少比较
  -> patch DOM
```

## 口述题

### 1. 一段模板是怎么变成 render 函数的？

> 回答模板：Vue 模板会先经过编译器处理，主流程是 parse、transform、codegen。parse 把模板字符串解析成 AST，AST 里描述标签、属性、指令、文本和插值。transform 会遍历 AST，识别哪些节点是静态的、哪些字段是动态的，并打上 patch flag、dynamicProps 等运行时提示，也会做静态提升和事件缓存相关处理。codegen 最后把 AST 生成 render function。组件运行时执行 render function 得到 vnode，render 过程中读取响应式数据会收集组件 render effect，后续数据变化再触发重新 render 和 patch。

### 2. 为什么 Vue 3 的 render 通常比 Vue 2 更快？

> 回答模板：Vue 3 的优势不只是运行时 diff 改了，而是编译期给运行时提供了更多信息。模板结构相对静态，编译器可以提前知道哪些节点永远不变，哪些文本、class、style 或 props 是动态的。静态节点可以提升到 render 外复用，动态节点可以带 patch flag，稳定结构里的动态子节点可以进入 block tree。这样更新时运行时不是盲目递归比较整棵 vnode 树，而是根据编译器提示直接处理动态部分。Vue 2 也有模板编译，但 Vue 3 在 block tree、patch flag、静态提升等方向做得更系统。

## 5 分钟录音顺序

1. 编译三阶段（2 分钟）
2. patchFlag 作用（1.5 分钟）
3. 静态提升 + block tree 预告（1.5 分钟）

## 今日复盘

1. 最容易被追问：render function 执行时读取响应式数据，所以模板编译和响应式依赖收集不是两条孤立链路。
2. 当前短板：patch flag 和 block tree 这里只能先讲作用，细节要放到 Day35 继续补。
3. 下一次补充：接到 Day35，重点解释 Patch Flag、静态提升和 Block Tree 如何减少运行时 diff 成本。
