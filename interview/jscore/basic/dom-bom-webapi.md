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
