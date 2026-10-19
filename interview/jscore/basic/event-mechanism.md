# 事件机制深入：捕获、冒泡、委托、自定义事件

## 一、事件流

浏览器事件分三个阶段：

1. 捕获阶段（从 Window 向目标节点传播）。
2. 目标阶段（到达触发节点）。
3. 冒泡阶段（从目标节点向上冒泡）。

```js
parent.addEventListener('click', () => console.log('capture'), true) // true参数表示事件登记到捕获阶段, 在下面有解释
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

**`closest` 的查找行为**：`closest` 从自身开始向上查找，包含自身。所以两种情况都能正确处理：

| 点击位置 | `e.target` | `closest('[data-id]')` 结果 |
|---------|------------|---------------------------|
| 点 `<span>` 子元素 | `<span>` | 向上找到最近的带 `data-id` 的祖先 `<li>` |
| 点 `<li>` 自身 | `<li>` | 直接返回自身（因为自身就匹配） |

**即：点击哪个子元素都能准确定位到"列表项"这个语义边界，不会报错。**

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

## 每日练习参考

### Day 4：事件委托（Event Delegation）

把事件监听器挂到父节点，利用事件冒泡在父节点统一处理子节点事件。

**优势**：
- 减少监听器数量（尤其适合动态列表）
- 新增子节点无需单独绑定事件

**注意事项**：
- 不是所有事件都能冒泡（`focus`、`blur`、`load`、`error` 不冒泡，可用 `focusin`/`focusout`）
- 事件委托适合简单点击/输入类事件，不适合需要精确鼠标位置的事件

### Day 4：事件流三阶段

事件在 DOM 中的传播分三个阶段：

```text
1. 捕获阶段（Capture）：从 window 向下到目标节点
2. 目标阶段（Target）：达到目标节点
3. 冒泡阶段（Bubble）：从目标节点向上到 window
```

**大部分事件默认在冒泡阶段处理**，除非 `addEventListener` 第三个参数设为 `true`。

### Day 4：事件委托 demo：点击动态节点通过 closest 匹配

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

### Day 4：事件流三阶段图

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
