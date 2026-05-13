# Day 4 DOM / BOM / Web API + 事件机制 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 4 | DOM / BOM / 事件 | [DOM/BOM/Web API](../jscore/basic/dom-bom-webapi)、[事件机制](../jscore/basic/event-mechanism)、[其他 Web API](../jscore/basic/other-web-apis) |

## 今日目标

- 看完 `/jscore/basic/dom-bom-webapi`、`/jscore/basic/event-mechanism`、`/jscore/basic/other-web-apis`
- 做一个事件委托 demo（`closest` + 动态节点）
- 准备 `IntersectionObserver` + `sendBeacon` 的回答模板

## 阅读卡点

- 事件捕获 / 目标 / 冒泡三阶段，`stopPropagation` 和 `stopImmediatePropagation` 的区别
- SPA 改 URL 不刷新页面：`history.pushState` + `popstate`，以及 hash 方案的取舍
- 常见观察器 API 边界：Intersection、Mutation、Resize、Performance

## 速记卡 / 知识点

### DOM 树 vs 渲染树

```
DOM 树：HTML 标签 → 节点对象（Element / Text）
         ↓
渲染树：DOM 节点 + CSS 样式 → 布局计算
         ↓
       绘制 → 合成
```

关键点：渲染树只包含可见节点，`display: none` 的节点不在渲染树中。

### BOM 常用对象

| 对象 | 作用 |
|------|------|
| `window` | 全局对象、浏览器窗口 |
| `navigator` | 浏览器信息（userAgent、onLine） |
| `location` | URL 信息（href、pathname、hash） |
| `history` | 浏览历史（pushState、replaceState、go/back/forward） |
| `screen` | 屏幕信息（width、height） |

### 事件流三阶段

事件在 DOM 中的传播分三个阶段：

```text
1. 捕获阶段（Capture）：从 window 向下到目标节点
2. 目标阶段（Target）：达到目标节点
3. 冒泡阶段（Bubble）：从目标节点向上到 window
```

**大部分事件默认在冒泡阶段处理**，除非 `addEventListener` 第三个参数设为 `true`。

### stopPropagation vs stopImmediatePropagation

| 方法 | 作用 |
|------|------|
| `stopPropagation()` | 阻止事件继续传播到下一个节点，但当前节点的其他同类型监听器仍会执行 |
| `stopImmediatePropagation()` | 阻止事件继续传播，且**同时**阻止当前节点的其他同类型监听器执行 |

```js
// stopPropagation 示例
el.addEventListener('click', handlerA)
el.addEventListener('click', handlerB)  // 仍会执行

// stopImmediatePropagation 示例
el.addEventListener('click', handlerA)
el.addEventListener('click', handlerB)  // 不会执行
```

### 事件委托（Event Delegation）

把事件监听器挂到父节点，利用事件冒泡在父节点统一处理子节点事件。

**优势**：
- 减少监听器数量（尤其适合动态列表）
- 新增子节点无需单独绑定事件

**注意事项**：
- 不是所有事件都能冒泡（`focus`、`blur`、`load`、`error` 不冒泡，可用 `focusin`/`focusout`）
- 事件委托适合简单点击/输入类事件，不适合需要精确鼠标位置的事件

### 常见 Observer API 矩阵

| API | 观察目标 | 典型场景 |
|-----|---------|----------|
| `IntersectionObserver` | 元素进入/离开视口 | 懒加载、无限滚动、广告曝光 |
| `MutationObserver` | DOM 节点变化（增删改属性/子节点） | 动态内容监控 |
| `ResizeObserver` | 元素尺寸变化 | 自适应布局、图表响应 |
| `PerformanceObserver` | 性能指标（LargestContentfulPaint、FirstInputDelay 等） | Web Vitals 监控 |

### SPA 路由：hash vs history

| 方案 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| **hash** | `location.hash` 变化不触发页面刷新 | 兼容性好，无需后端配置 | URL 不好看，SEO 不友好 |
| **history** | `history.pushState` + `popstate` 事件 | URL 好看，SEO 友好 | 需要后端配合，刷新 404 需要 fallback |

```js
// hash 方案
window.addEventListener('hashchange', () => {
  const path = location.hash.slice(1)
  render(path)
})

// history 方案
window.addEventListener('popstate', () => {
  render(location.pathname)
})

// history.pushState 不触发 popstate，点击浏览器后退/前进才会触发
```

### sendBeacon

用于在页面卸载时可靠地发送数据，不会因为页面关闭而取消请求：

```js
// 页面卸载时发送数据，不阻塞页面关闭
navigator.sendBeacon('/analytics', JSON.stringify({ event: 'pageview' }))
```

适用场景：埋点上报、统计离开率。

## 手写 / 流程图

### 事件委托 demo：点击动态节点通过 closest 匹配

```html
<ul id="list">
  <!-- 动态生成 -->
</ul>
```

```js
// 事件委托：把监听器挂到 ul，只绑定一次
const list = document.getElementById('list')

list.addEventListener('click', (e) => {
  // closest 向上查找最近的匹配选择器的祖先节点
  const item = e.target.closest('[data-id]')
  if (!item) return

  const id = item.dataset.id
  console.log('点击了 item:', id)

  // 业务逻辑：编辑、删除、跳转等
  handleItemClick(id)
})

// 动态添加新节点，无需额外绑定
const newItem = document.createElement('li')
newItem.dataset.id = '100'
newItem.textContent = '新节点'
list.appendChild(newItem)
// 点击新节点同样被委托处理
```

### 事件流三阶段图

```text
window
  ↓ 捕获阶段（capture）
document
  ↓ 捕获阶段
body
  ↓ 捕获阶段
<div id="outer">
  ↓ 捕获阶段
<div id="inner">    ←── 目标阶段（target）
  ↑ 冒泡阶段
</div>
  ↑ 冒泡阶段
</div>
  ↑ 冒泡阶段
body
  ↑ 冒泡阶段
document
  ↑ 冒泡阶段
window
```

## 口述题

### 1. SPA 为什么不刷新页面也能改 URL？

回答模板：

> SPA 改 URL 不刷新页面的核心是浏览器的 History API。传统页面每次导航都会向服务器请求新的 HTML，但 SPA 通过 JavaScript 动态渲染内容，页面本身不刷新。
>
> History API 提供了两个关键方法：`pushState` 和 `replaceState`，它们可以修改浏览器的 URL 和 history 堆栈，但**不会触发页面刷新**。配合 `popstate` 事件监听浏览器的前进/后退， SPA 就能在 URL 变化时自行渲染对应的内容。
>
> hash 方案是另一种选择，利用 `location.hash` 变化不触发页面刷新的特性，但 URL 里带 `#` 不太美观，SEO 也不友好。所以有后端配合的情况下，history 方案更优。

### 2. 事件捕获 / 冒泡如何结合业务解释？

回答模板：

> 事件流三阶段是捕获 → 目标 → 冒泡。实际业务中大部分用的是冒泡，因为符合"从内到外"的直觉——比如点击按钮，先处理按钮自身逻辑，再交给外层容器做统一处理。
>
> 事件委托就是利用冒泡的典型例子：列表有 100 个 item，不用每个 item 都绑监听器，而是在外层容器绑一个，通过 `e.target` 判断点到哪个 item。动态新增的 item 天然也能被处理。
>
> 捕获阶段用得少，但有时候也必要：比如一个内部带输入框的组件，希望外部先拦截处理，再让输入框响应，这时可以在捕获阶段处理。
>
> 还有两个重要区别：`stopPropagation` 只阻止向外传播，但当前节点同类型的其他监听器还会执行；`stopImmediatePropagation` 更彻底，连当前节点的其他同类监听器也一起阻止了。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. DOM / BOM 基础概念（1 分钟）
2. 事件流三阶段 + 委托应用（2 分钟）
3. IntersectionObserver / MutationObserver / sendBeacon 适用边界（2 分钟）

录完后自查：

- 是否说出捕获 → 目标 → 冒泡三阶段顺序。
- 是否说出 `stopPropagation` 和 `stopImmediatePropagation` 的区别。
- 是否说出事件委托的适用场景（动态列表、减少监听器数量）。
- 是否说出 hash 和 history 路由方案的取舍。

## 今日复盘

今天最需要回补的 3 个点：

1. `focus`/`blur` 不冒泡，面试时能说清楚用 `focusin`/`focusout` 代替。
2. `IntersectionObserver` 的阈值（threshold）配置和 `rootMargin` 的作用。
3. `history.pushState` 不触发 `popstate`，哪些操作会触发要列清楚。