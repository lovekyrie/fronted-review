# 事件机制深入：捕获、冒泡、委托、自定义事件

## 一、事件流

浏览器事件分三个阶段：

1. 捕获阶段（从 Window 向目标节点传播）。
2. 目标阶段（到达触发节点）。
3. 冒泡阶段（从目标节点向上冒泡）。

```js
parent.addEventListener('click', () => console.log('capture'), true)
child.addEventListener('click', () => console.log('bubble'))
```

## 二、事件委托（代理）

把多个子节点事件统一绑定在父节点上，通过事件冒泡触发。

```js
list.addEventListener('click', (e) => {
  const target = e.target.closest('[data-id]')
  if (!target) return
  console.log('click item:', target.dataset.id)
})
```

### 优势

- 减少监听器数量，降低内存开销。
- 动态节点自动具备事件能力，不需要重复绑定。

## 三、阻止行为

- `stopPropagation`：阻止冒泡（不阻止默认行为）。
- `preventDefault`：阻止默认行为（如 `a` 标签跳转）。

## 四、自定义事件（CustomEvent）

组件通信场景常用，用 `detail` 传参。

```js
const event = new CustomEvent('user:login', {
  detail: { userId: 'u001' }
})
window.dispatchEvent(event)
```

## 五、面试易错点

- `stopImmediatePropagation` 会阻止同节点后续监听器执行。
- 委托时要注意 `e.target` 可能是内部子元素，通常用 `closest` 修正。
