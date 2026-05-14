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

### VNode 结构

```js
{
  type: 'div' | Component | Fragment | Text,
  props: { class, style, onClick, ... } | null,
  children: string | VNode[] | null,
  el: HTMLElement | null,  // 对应的真实 DOM
  key: string | number | null
}
```

### patch 分派逻辑

```text
patch(n1, n2, container):
  if (n1 && n1.type !== n2.type) → unmount(n1); n1 = null
  switch (n2.type):
    string    → processElement(n1, n2, container)
    Text      → processText(n1, n2, container)
    Fragment  → processFragment(n1, n2, container)
    Component → processComponent(n1, n2, container)
```

### patchProps 四类

| 类型 | 处理方式 |
|------|----------|
| `class` | `el.className = value` |
| `style` | 遍历对象设 `el.style[key]` |
| `on*` 事件 | `el.addEventListener / removeEventListener` |
| 普通属性 | `el.setAttribute / removeAttribute` |

## 手写 / 流程图

### 最小 renderer 实现

```js
function h(type, props, children) {
  return { type, props, children, el: null, key: props?.key ?? null }
}

function mount(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type))
  // props
  if (vnode.props) {
    for (const key in vnode.props) {
      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
      } else {
        el.setAttribute(key, vnode.props[key])
      }
    }
  }
  // children
  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => mount(child, el))
  }
  container.appendChild(el)
}

function patch(n1, n2) {
  if (n1.type !== n2.type) {
    const parent = n1.el.parentNode
    unmount(n1)
    mount(n2, parent)
    return
  }
  const el = (n2.el = n1.el)
  // patch props
  const oldProps = n1.props || {}
  const newProps = n2.props || {}
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      el.setAttribute(key, newProps[key])
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) el.removeAttribute(key)
  }
  // patch children (简化版：string vs array)
  const oldCh = n1.children
  const newCh = n2.children
  if (typeof newCh === 'string') {
    if (newCh !== oldCh) el.textContent = newCh
  } else if (Array.isArray(newCh)) {
    if (typeof oldCh === 'string') {
      el.textContent = ''
      newCh.forEach(child => mount(child, el))
    } else {
      // 简化 diff: 逐个对比，多余删除，不够新增
      const commonLen = Math.min(oldCh.length, newCh.length)
      for (let i = 0; i < commonLen; i++) patch(oldCh[i], newCh[i])
      if (newCh.length > oldCh.length) {
        newCh.slice(commonLen).forEach(child => mount(child, el))
      } else {
        oldCh.slice(commonLen).forEach(child => unmount(child))
      }
    }
  }
}

function unmount(vnode) {
  vnode.el.parentNode.removeChild(vnode.el)
}
```

### createApp 简示

```js
function createApp(rootComponent) {
  return {
    mount(selector) {
      const container = document.querySelector(selector)
      let prevVNode = null
      // 结合 reactivity effect
      effect(() => {
        const vnode = rootComponent.render()
        if (!prevVNode) mount(vnode, container)
        else patch(prevVNode, vnode)
        prevVNode = vnode
      })
    }
  }
}
```

## 口述题

### 1. mount 和 patch 的主要区别是什么？

回答模板：

> mount 是**首次渲染**，把 VNode 转成真实 DOM 并插入容器。需要创建元素、设置属性、处理事件、递归挂载子节点。patch 是**更新渲染**，对比新旧 VNode 的差异，只做最小化 DOM 操作。
>
> 关键区别在于 patch 会复用旧 DOM 节点（`n2.el = n1.el`），只更新变化的属性和子节点，避免全量重建。如果新旧 VNode 类型不同，则先 unmount 旧的再 mount 新的。

### 2. 如果让你从零做一个 renderer，你会怎么拆？

回答模板：

> 我会分四层。第一层是 VNode 创建（`h` 函数），定义好 `{ type, props, children, el, key }` 结构。第二层是平台 API 抽象（`createElement / setAttribute / appendChild / removeChild`），这样 renderer 可以跨平台。第三层是核心 render 逻辑：mount、patch、unmount，patch 里按 type 分派处理 element / text / fragment / component。第四层是 children diff，先实现简单的逐个对比，再升级为头尾 + LIS 优化。
>
> 和 reactivity 的连接点是 `effect`：组件的 render 函数包在 effect 里，数据变时自动 re-render 触发 patch。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. VNode 结构 + h 函数（1 分钟）
2. mount 流程（createElement → props → children → appendChild）（2 分钟）
3. patch 流程（复用 el → diff props → diff children）+ 和 reactivity 连接（2 分钟）

录完后自查：

- 是否说出 VNode 的核心字段。
- 是否说出 mount 创建 DOM、patch 复用 DOM。
- 是否说出 patchProps 四类处理。
- 是否说出 effect 把 render 和 reactivity 连接。

## 今日复盘

今天最需要回补的 3 个点：

1. 事件处理的优化：invoker 模式（不 remove/add，只换 handler 引用）。
2. Fragment 的实现：没有根节点时用 `anchor` 注释节点定位。
3. 组件 VNode 的处理：调用 render 得到子 VNode 后走 element 流程。
