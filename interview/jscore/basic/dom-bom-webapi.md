# DOM / BOM / Web API 深入

## 一、DOM 常用操作 API

### 节点查找与创建

- 查询：`querySelector`, `querySelectorAll`, `getElementById`。
- 创建：`createElement`, `createTextNode`, `DocumentFragment`。
- 插入：`append`, `prepend`, `before`, `replaceWith`。
- 删除：`remove`。

```js
const ul = document.querySelector('#list')
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li')
  li.textContent = `item-${i}`
  fragment.append(li)
}
ul.append(fragment) // 批量插入，减少回流
```

## 二、DOM 树遍历

- 向上：`parentElement`, `closest`。
- 向下：`children`, `firstElementChild`。
- 同级：`previousElementSibling`, `nextElementSibling`。

面试延伸：**深度遍历/广度遍历** 的手写实现思路。

## 三、BOM 与 History API

- `window`, `location`, `history`, `navigator` 是 BOM 核心对象。
- `history.pushState` / `replaceState` 是 SPA 路由基础。
- `popstate` 用于监听浏览器前进后退。

```js
history.pushState({ from: 'home' }, '', '/profile')
window.addEventListener('popstate', (event) => {
  console.log('state changed:', event.state)
})
```

## 四、面试重点总结

- 如何减少 DOM 操作成本：批量更新、虚拟 DOM、事件委托。
- 为什么 SPA 路由不刷新：`pushState` 改 URL 但不触发页面重载。

## 每日练习参考

### Day 4：DOM 树 vs 渲染树

```
DOM 树：HTML 标签 → 节点对象（Element / Text）
         ↓
渲染树：DOM 节点 + CSS 样式 → 布局计算
         ↓
       绘制 → 合成
```

关键点：渲染树只包含可见节点，`display: none` 的节点不在渲染树中。

### Day 4：BOM 常用对象

| 对象 | 作用 |
|------|------|
| `window` | 全局对象、浏览器窗口 |
| `navigator` | 浏览器信息（userAgent、onLine） |
| `location` | URL 信息（href、pathname、hash） |
| `history` | 浏览历史（pushState、replaceState、go/back/forward） |
| `screen` | 屏幕信息（width、height） |

### Day 4：stopPropagation vs stopImmediatePropagation

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

### Day 4：常见 Observer API 矩阵

| API | 观察目标 | 典型场景 |
|-----|---------|----------|
| `IntersectionObserver` | 元素进入/离开视口 | 图片懒加载、无限滚动、广告曝光 |
| `MutationObserver` | DOM 节点变化（增删改属性/子节点） | 动态内容监控 |
| `ResizeObserver` | 元素尺寸变化 | 自适应布局、图表响应 |
| `PerformanceObserver` | 性能指标（LargestContentfulPaint、FirstInputDelay 等） | Web Vitals 监控 |

### Day 4：SPA 路由：hash vs history

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
