### Vue 3 渲染机制

高级前端面试里，Vue 渲染机制不能只回答“数据变化后生成虚拟 DOM，再 diff 更新真实 DOM”。这只能说明运行时的一部分。

Vue 3 更完整的回答应该把**编译期优化**和**运行时更新**放在同一条链路里：

`template -> compiler -> render function -> vnode -> block tree -> patch flags -> scheduler -> patch -> DOM`

这条链路能解释大部分追问：为什么 Vue 3 的更新不需要全量 diff、`patch flag` 有什么用、静态提升为什么能减少创建成本、`block tree` 解决什么问题、响应式触发更新后为什么 DOM 不是同步立刻更新。

#### 1. Vue 的渲染链路

Vue 单文件组件里的模板最终不会直接运行。它会先被编译成 render function。

可以把整体流程拆成三段：

1. 编译阶段：`template` 被编译成 `render function`
2. 渲染阶段：执行 `render function` 得到 vnode 树
3. 更新阶段：响应式数据变化后，重新执行组件 render effect，生成新 vnode，再 patch 到 DOM

```text
template
  -> compiler
  -> render function
  -> vnode
  -> patch
  -> DOM
```

如果只讲“虚拟 DOM diff”，会漏掉 Vue 3 很关键的优势：**它在编译阶段就知道模板里哪些部分是动态的，运行时可以少做很多猜测。**

#### 2. 从模板到 render function

一个模板：

```vue
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>static text</p>
    <button @click="onClick">{{ count }}</button>
  </div>
</template>
```

编译后会变成类似这样的 render function：

```js
function render(_ctx, _cache) {
  return openBlock(), createElementBlock('div', { class: 'card' }, [
    createElementVNode('h3', null, toDisplayString(_ctx.title), 1),
    createElementVNode('p', null, 'static text'),
    createElementVNode('button', {
      onClick: _ctx.onClick,
    }, toDisplayString(_ctx.count), 9),
  ])
}
```

这不是为了让你背生成代码，而是要理解几个信息：

- 模板会变成 JavaScript 函数
- render function 执行时会读取响应式数据
- 读取响应式数据会触发依赖收集
- 编译器会把动态节点标出来
- 运行时 patch 可以利用这些标记减少比较

#### 3. vnode 是什么

vnode 是真实 DOM 的 JavaScript 描述。

一个 vnode 大概包含：

```js
const vnode = {
  type: 'div',
  props: {
    class: 'card',
  },
  children: [
    {
      type: 'span',
      children: 'hello',
    },
  ],
}
```

Vue 更新 DOM 时，不是直接拿模板字符串操作 DOM，而是：

1. 本次 render 生成新 vnode
2. 和上一次 vnode 对比
3. 找出需要变更的部分
4. 调用宿主平台 API 更新真实 DOM

vnode 的价值不是“比 DOM 快”。更准确地说，vnode 是一层跨平台、可比较、可缓存、可调度的 UI 描述。

#### 4. 组件更新本质是 render effect

组件挂载时，Vue 会为组件创建一个 render effect。

可以简化理解成：

```js
effect(
  () => {
    const vnode = render()
    patch(prevVNode, vnode)
  },
  {
    scheduler: queueJob,
  },
)
```

render function 执行期间读取响应式数据：

```vue
<template>
  <div>{{ count }}</div>
</template>
```

这里读取 `count` 时会收集当前组件的 render effect。当 `count` 变化时，会触发这个 effect，但组件更新通常不会立即同步执行，而是进入 scheduler 队列。

这和 Week 3 响应式文档里的链路可以接起来：

```text
trigger
  -> component render effect
  -> scheduler queue
  -> render function
  -> new vnode
  -> patch
```

所以 Vue 的更新不是“响应式直接操作 DOM”，而是响应式触发组件重新渲染，再由 patch 更新 DOM。

#### 5. scheduler 和批量更新

如果连续修改多次状态：

```js
count.value++
count.value++
count.value++
```

Vue 不会每次都立刻 patch DOM。它会把组件更新任务放进队列，并在同一轮微任务中批量刷新。

这样可以避免无意义的中间状态渲染。

```js
count.value++

await nextTick()
// 这里再读取 DOM，才能看到更新后的结果
```

面试里可以这样回答：**响应式触发是同步发生的，但组件 DOM 更新通常经过 scheduler 批量调度，`nextTick` 等的是这批更新任务完成。**

#### 6. Vue 3 为什么强调编译优化

React 运行时只看到 JSX 执行后的元素树，很难提前知道哪些地方一定静态、哪些地方一定动态。

Vue 模板有更强的静态结构，编译器可以提前分析：

- 哪些节点永远不会变
- 哪些文本会变
- 哪些 props 会变
- 哪些事件处理函数可以缓存
- 哪些动态节点需要进入更新路径

所以 Vue 3 的核心优化思路是：**编译期尽量提供信息，运行时按提示做最少工作。**

#### 7. 静态提升

模板里完全静态的节点可以被提升到 render function 外面。

```vue
<template>
  <div>
    <h1>Title</h1>
    <p>{{ message }}</p>
  </div>
</template>
```

其中 `<h1>Title</h1>` 不依赖任何响应式数据，每次组件更新都重新创建这个 vnode 是浪费。

编译器可以把它提升：

```js
const hoisted = createElementVNode('h1', null, 'Title')

function render(_ctx) {
  return createElementVNode('div', null, [
    hoisted,
    createElementVNode('p', null, _ctx.message),
  ])
}
```

静态提升的价值：

- 减少更新时重复创建 vnode
- patch 时可以跳过静态节点
- 静态节点越多，收益越明显

面试里不要只说“静态提升能提升性能”，要说明它减少的是**重复创建和重复比较**。

#### 8. patch flag

`patch flag` 是编译器给动态节点打的更新提示。

例如：

```vue
<div :class="className">{{ title }}</div>
```

编译器知道：

- 文本 `title` 是动态的
- `class` 是动态的
- 其他结构是稳定的

生成代码时会带上类似标记：

```js
createElementVNode(
  'div',
  { class: _ctx.className },
  toDisplayString(_ctx.title),
  3,
)
```

这里的数字可以理解成位运算标记，告诉运行时这个节点有哪些动态部分。

常见类型包括：

- 文本动态
- class 动态
- style 动态
- props 动态
- 事件动态
- children 动态

有了 `patch flag`，运行时不必完整比较所有 props 和 children，而是直接检查被标记的部分。

这就是 Vue 3 和传统虚拟 DOM diff 的关键差异之一：**Vue 3 的 diff 不是纯运行时盲猜，而是带着编译器提示执行。**

#### 9. block tree

`patch flag` 解决的是“单个节点哪些地方会变”。`block tree` 解决的是“更新时应该优先看哪些动态节点”。

在一个稳定结构里，很多节点是静态的，真正会变的只是少数动态节点。

```vue
<template>
  <section>
    <h1>Profile</h1>
    <p>{{ name }}</p>
    <p>{{ age }}</p>
    <footer>static footer</footer>
  </section>
</template>
```

传统 diff 会沿着整棵树递归走一遍。Vue 3 会在 block 中收集动态子节点：

```text
block(section)
  dynamicChildren:
    - p(name)
    - p(age)
```

更新时可以直接遍历 `dynamicChildren`，跳过稳定静态结构。

所以 block tree 的核心价值是：**把更新路径从整棵模板树收敛到动态节点列表。**

#### 10. 事件缓存

模板里写事件：

```vue
<button @click="handleClick">Submit</button>
```

如果每次 render 都创建新的事件函数引用，运行时就可能认为事件 props 发生了变化。

Vue 编译器可以缓存事件处理函数，让引用保持稳定：

```js
onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick(...args))
```

事件缓存的目标不是让点击更快，而是减少更新时不必要的 props 变化。

#### 11. `v-once` 和 `v-memo`

##### 11.1 `v-once`

`v-once` 表示这个子树只渲染一次，后续更新跳过。

```vue
<div v-once>
  {{ title }}
</div>
```

它适合确实不会变化的内容。误用在会变化的状态上，会导致 UI 不更新。

##### 11.2 `v-memo`

`v-memo` 可以基于依赖数组跳过子树更新。

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id === activeId]">
  {{ item.name }}
</div>
```

当 memo 依赖没有变化时，Vue 可以复用上一次子树。

`v-memo` 更适合大列表里的局部更新优化，不应该作为默认写法。高级面试里可以说：**Vue 3 已经有编译优化，手动 memo 应该用于明确的性能瓶颈。**

#### 12. patch 的基本过程

patch 的核心目标是把旧 vnode 更新成新 vnode。

可以粗略拆成：

1. 如果新旧节点类型不同，卸载旧节点，挂载新节点
2. 如果是相同元素，更新 props，再更新 children
3. 如果是组件，更新 props，决定是否重新渲染组件
4. 如果是文本节点，更新文本内容
5. 如果是 Fragment，处理子节点列表

```text
patch(oldVNode, newVNode)
  -> type changed ? replace
  -> element ? patchElement
  -> component ? patchComponent
  -> text ? patchText
  -> fragment ? patchChildren
```

真实实现更复杂，但面试里重点不是背函数名，而是理解：patch 是按 vnode 类型分发处理，并尽量复用已有 DOM 和组件实例。

#### 13. 列表 diff 和 key

列表更新是 diff 里最常被追问的部分。

```vue
<li v-for="item in list" :key="item.id">
  {{ item.name }}
</li>
```

`key` 的作用是给同级节点一个稳定身份，让 Vue 判断：

- 哪些节点可以复用
- 哪些节点需要新增
- 哪些节点需要删除
- 哪些节点需要移动

如果使用 index 作为 key，当列表插入、删除、排序时，节点身份会错位，可能导致组件状态或 DOM 状态被错误复用。

#### 14. keyed children 的更新思路

Vue 处理带 key 列表时，可以简化理解成几步：

1. 从头部同步相同节点
2. 从尾部同步相同节点
3. 处理只剩新增的情况
4. 处理只剩删除的情况
5. 对未知顺序区间建立 key 到新索引的映射
6. 找出可复用节点
7. 计算最长递增子序列，减少移动次数

例如：

```text
old: A B C D E
new: A C B D F
```

头尾能先快速匹配一部分，中间乱序区域再通过 key 映射和最长递增子序列处理。

最长递增子序列的作用不是找“变化最少的节点”，而是找出一批**相对顺序已经正确、可以不移动的节点**。

#### 15. 组件更新边界

父组件更新时，子组件不一定都要重新执行。

Vue 会根据 props、slots、patch flag 等信息判断子组件是否需要更新。

```vue
<Child :count="count" />
<StaticChild />
```

如果 `StaticChild` 没有依赖父组件变化的动态输入，就不应该被无意义更新。

但要注意：如果父组件传给子组件的是每次 render 都新建的对象或函数，也可能扩大更新范围。

```vue
<Child :options="{ size: 'large' }" />
```

这种写法每次都会创建新对象。复杂场景下可以把稳定对象移出 render 路径，或用计算属性控制引用变化。

#### 16. SSR hydration

SSR 场景下，服务端先生成 HTML，浏览器端再执行 hydration，把已有 DOM 和客户端 vnode 关联起来。

```text
server render
  -> HTML
  -> browser receives DOM
  -> client vnode
  -> hydrate existing DOM
```

hydration 的目标不是重新创建 DOM，而是复用服务端已有 DOM，并绑定事件、建立组件实例和响应式更新关系。

常见问题是服务端和客户端渲染结果不一致，比如：

- 直接使用 `window`
- 渲染依赖当前时间
- 随机数导致内容不同
- 用户态数据服务端和客户端不一致

高级面试里可以补一句：**SSR 首屏快不等于没有客户端成本，hydration 本身也是运行时工作。**

#### 17. Vue 和 React 渲染优化差异

Vue 和 React 都有 vnode / element 描述 UI，也都需要把状态变化映射到 DOM 更新。

但优化策略不同：

- Vue：模板编译器能提前分析静态和动态部分，通过 patch flag、静态提升、block tree 辅助运行时
- React：更偏运行时调度和组件级 memo，依赖开发者用 `memo`、`useMemo`、`useCallback` 控制部分重复渲染

不要简单说“Vue 更快”或“React 更灵活”。更好的回答是：

**Vue 用模板约束换取更多编译期信息，React 用 JavaScript 表达能力换取更灵活的运行时模型。**

#### 18. 常见高级追问

##### 18.1 Vue 3 为什么还需要虚拟 DOM

因为 vnode 不只是为了 diff。它还提供跨平台描述、组件抽象、调度更新、SSR hydration 等能力。Vue 3 通过编译优化减少虚拟 DOM 的运行时成本，而不是完全放弃虚拟 DOM。

##### 18.2 patch flag 解决什么问题

它告诉运行时一个 vnode 哪些部分是动态的。这样 patch 时不用完整比较所有属性和子节点，可以直接更新被标记的部分。

##### 18.3 block tree 解决什么问题

它把一个稳定结构里的动态节点收集起来，更新时优先遍历动态节点列表，而不是递归走完整模板树。

##### 18.4 静态提升为什么有效

静态 vnode 不依赖响应式数据，可以在 render function 外创建一次，后续更新复用，减少重复创建和重复比较。

##### 18.5 Vue 的 DOM 更新是同步的吗

响应式触发是同步的，但组件更新通常会进入 scheduler 队列，在微任务中批量刷新。需要等 DOM 更新后读取结果时，用 `nextTick`。

##### 18.6 key 为什么不能随便用 index

key 用来标识同级节点身份。列表插入、删除、排序时，index 不能稳定代表业务项，会导致 DOM 或组件实例被错误复用。

##### 18.7 最长递增子序列在 diff 中有什么用

它用来找出乱序列表中相对顺序已经正确的一组节点，这些节点可以不移动，从而减少 DOM 移动次数。

##### 18.8 SSR hydration 的难点是什么

难点是服务端 HTML 和客户端 vnode 必须尽量一致。任何只在客户端存在的状态、时间、随机数、浏览器 API 都可能导致 hydration mismatch。

#### 19. 面试回答模板

如果面试官问“Vue 3 渲染机制”，可以按这个顺序回答：

1. Vue 模板会先被编译成 render function，render 执行后生成 vnode
2. 组件挂载时会创建 render effect，render 中读取响应式数据完成依赖收集
3. 响应式数据变化后触发组件 render effect，但组件更新会经过 scheduler 批量调度
4. 更新时重新执行 render function 得到新 vnode，再通过 patch 更新真实 DOM
5. Vue 3 的优势不只是虚拟 DOM diff，而是编译器会提前标记动态部分
6. 静态提升减少静态 vnode 的重复创建和比较
7. patch flag 告诉运行时哪些属性或文本是动态的
8. block tree 把动态节点收集起来，更新时跳过大量静态结构
9. 列表 diff 依赖稳定 key，并通过最长递增子序列减少 DOM 移动
10. SSR hydration 会复用服务端 DOM，但要求服务端和客户端渲染结果一致

这样回答能把 Vue 3 的响应式、调度、编译优化和 DOM patch 串成一条完整链路。

## 每日练习参考

### Day 34：知识补充

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

### Day 34：常见 patch flag 方向

| 类型 | 含义 | 示例 |
|------|------|------|
| TEXT | 文本动态 | `{{ title }}` |
| CLASS | class 动态 | `:class="cls"` |
| STYLE | style 动态 | `:style="style"` |
| PROPS | 指定 props 动态 | `:id="id"` |
| FULL_PROPS | props 复杂，需完整比较 | `v-bind="obj"` |
| NEED_PATCH | 需要运行时处理 | ref、指令等 |

### Day 34：动手示例

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

### Day 35：Patch Flag 枚举

| Flag | 值 | 含义 |
|------|-----|------|
| `TEXT` | 1 | 子节点是动态文本 |
| `CLASS` | 2 | 动态 class 绑定 |
| `STYLE` | 4 | 动态 style 绑定 |
| `PROPS` | 8 | 动态非 class/style 属性 |
| `FULL_PROPS` | 16 | 有动态 key 的 props，需全量 diff |
| `HYDRATE_EVENTS` | 32 | 需要 hydrate 的事件 |
| `STABLE_FRAGMENT` | 64 | 子节点顺序不变的 fragment |
| `KEYED_FRAGMENT` | 128 | 子节点有 key 的 fragment |
| `UNKEYED_FRAGMENT` | 256 | 子节点无 key 的 fragment |
| `NEED_PATCH` | 512 | 只需要非 props 的 patch（ref / hooks） |
| `HOISTED` | -1 | 静态提升节点，永不 diff |
| `BAIL` | -2 | 退出优化模式，走全量 diff |

作用：编译器在编译阶段就标记出哪些节点是动态的、动态的什么属性，运行时 `patch` 函数根据 flag 走**快路径**，跳过不变的部分。

### Day 35：Block Tree

- **Block**：一个"动态节点容器"，收集所有后代中的动态节点到 `dynamicChildren` 数组。
- **传统 diff**：递归遍历整棵 vnode 树，逐个节点对比。
- **Block diff**：只遍历 `block.dynamicChildren`，扁平化的数组，O(动态节点数) 而非 O(总节点数)。

Block 切断点：`v-if` / `v-for` / `<Component>` 会创建新的 Block，因为它们会改变子树结构。

### Day 35：静态提升（Static Hoisting）

```js
// 编译前
<div>
  <span>static text</span>
  <span>{{ dynamic }}</span>
</div>

// 编译后（伪代码）
const _hoisted_1 = createVNode('span', null, 'static text', -1 /* HOISTED */)
function render() {
  return createBlock('div', null, [
    _hoisted_1,  // 复用，不参与 diff
    createVNode('span', null, ctx.dynamic, 1 /* TEXT */)
  ])
}
```

收益：静态节点只创建一次，后续 re-render 直接复用引用，既省内存又跳过 diff。

### Day 35：Patch Flag 快路径

```text
patch(n1, n2):
  if (patchFlag & TEXT)   → 只更新 el.textContent
  if (patchFlag & CLASS)  → 只更新 el.className
  if (patchFlag & STYLE)  → 只更新 el.style
  if (patchFlag & PROPS)  → 只 diff dynamicProps 列表中的属性
  if (patchFlag === HOISTED) → 跳过，不 diff
```

### Day 36：renderer 入口架构

```text
patch(n1, n2, container)
  → n2.type 判断：
    string     → processElement
    Component  → processComponent
    Fragment   → processFragment
    Text       → processText
```

- `n1 === null` → mount（首次挂载）
- `n1 !== null` → patch（更新对比）
- `n1 存在但 n2 === null` → unmount（卸载）

### Day 36：patchElement 流程

```text
patchElement(n1, n2):
  1. patchProps(el, oldProps, newProps, patchFlag)
  2. patchChildren(n1, n2, el, patchFlag)
  3. n2.el = n1.el  // 复用 DOM 节点
```

### Day 36：children diff 三阶段（Vue 3）

```text
阶段 1：从头比 — i 从 0 开始，相同 key+type 直接 patch
阶段 2：从尾比 — e1/e2 从末尾开始，相同 key+type 直接 patch
阶段 3：处理中间乱序段
  → 建 keyToNewIndex Map
  → 遍历旧节点，查 Map 找到新位置
  → 用最长递增子序列（LIS）确定不需要移动的节点
  → 剩余节点做移动或新增
```

### Day 36：最长递增子序列（LIS）

- 作用：在乱序段中找到**不需要移动的最大节点集合**，其余节点才需要 DOM 移动。
- 算法：贪心 + 二分，O(n log n)。
- 收益：把 DOM 移动次数降到最少。React 没有用 LIS，Vue 3 在这里更优。

### Day 36：key 的作用

- key 是 vnode 的唯一标识，用于 diff 时**快速匹配新旧节点**。
- 没有 key → 按索引匹配，可能导致组件状态错乱、不必要的 DOM 操作。
- 有 key → 通过 `keyToNewIndex` Map 精确查找对应节点。

### Day 36：children diff 完整流程图

```text
旧: [a, b, c, d, e, f]    新: [a, d, b, g, f]

阶段 1 头头比: a === a → patch ✓, i = 1
阶段 2 尾尾比: f === f → patch ✓, e1 = 4, e2 = 3

中间乱序段:
  旧: [b, c, d, e]  新: [d, b, g]

  keyToNewIndex: { d→0, b→1, g→2 }
  遍历旧节点:
    b → 新位置 1
    c → 不存在 → unmount
    d → 新位置 0
    e → 不存在 → unmount

  newIndexToOldIndex: [3, 1, 0]  (d原位3, b原位1, g是新增)
  LIS([3, 1]) = [1] → 索引 1 的节点(b)不动

  倒序遍历: g(mount) → b(不动) → d(move)
```

### Day 36：LIS 算法核心

```js
function getSequence(arr) {
  const result = [0]
  const p = arr.slice()
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === 0) continue // 新增节点跳过
    const last = arr[result[result.length - 1]]
    if (arr[i] > last) {
      p[i] = result[result.length - 1]
      result.push(i)
    } else {
      // 二分查找替换
      let lo = 0, hi = result.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (arr[result[mid]] < arr[i]) lo = mid + 1
        else hi = mid
      }
      if (arr[i] < arr[result[lo]]) {
        if (lo > 0) p[i] = result[lo - 1]
        result[lo] = i
      }
    }
  }
  // 回溯
  let len = result.length, idx = result[len - 1]
  while (len-- > 0) { result[len] = idx; idx = p[idx] }
  return result
}
```

### Day 37：组件更新触发链

```text
响应式数据变化
  → dep.trigger()
  → 当前组件的 ReactiveEffect 被标记 dirty
  → scheduler 将更新入队（queueJob）
  → nextTick 后批量执行
  → effect.run() → 调用组件 render 生成新 VNode
  → patch(oldVNode, newVNode) → 递归子树
```

### Day 37：setupRenderEffect

每个组件实例都有一个 `ReactiveEffect`，在 `setupRenderEffect` 中创建：

```js
const effect = new ReactiveEffect(
  () => componentUpdateFn,  // render + patch
  () => queueJob(update)    // scheduler：不立即执行，入队等 nextTick
)
```

### Day 37：shouldUpdateComponent

父组件 re-render 时，遇到子组件 VNode 会调用 `shouldUpdateComponent(n1, n2)` 判断：

```text
对比 props（浅比较）
  → props 没变 → 跳过子组件更新
  → props 变了 → 触发子组件 update
额外检查：slots / emits / dirs 是否有变化
```

### Day 37：组件 vs 元素更新

| 维度 | 元素更新 | 组件更新 |
|------|----------|----------|
| 触发 | patchElement | processComponent → updateComponent |
| 核心 | patchProps + patchChildren | shouldUpdateComponent → re-render → patch 子树 |
| 优化 | Patch Flag 快路径 | props 浅比较 + v-memo |

### Day 37：性能优化手段

- **`v-memo`**：条件缓存子树，deps 不变则跳过整个子树的 re-render。
- **`shallowRef / shallowReactive`**：只追踪第一层变化，减少深层依赖收集。
- **`markRaw`**：标记对象不被 reactive 包装（大对象、第三方实例）。
- **`defineProps` 解构**：Vue 3.3+ 自动保持响应性，不再需要 `toRefs`。
- **组件拆分**：把频繁更新的部分拆成独立组件，缩小更新范围。

### Day 37：完整更新流程

```text
state.count++ (Proxy set)
  → trigger(target, 'count')
  → dep.effects 中有组件 A 的 effect
  → scheduler: queueJob(updateA)
  → 同步代码执行完毕
  → nextTick flush queue
  → updateA():
      const newTree = render()
      patch(prevTree, newTree, container)
        → patchElement: 更新自身 DOM
        → 遇到子组件 <Child>:
            shouldUpdateComponent(oldChild, newChild)?
              → props 没变 → 跳过
              → props 变了 → child.update() → 子组件 re-render
```

### Day 37：props 变化判断

```text
shouldUpdateComponent(n1, n2):
  1. 有 dynamicSlots → true
  2. 新节点有 children (slots) → 对比 slots
  3. 对比 props:
     - oldProps === newProps → false
     - 数量不同 → true
     - 遍历 newProps，值不同 → true
  4. 都一样 → false (跳过更新)
```

### Day 39：VNode 结构

```js
{
  type: 'div' | Component | Fragment | Text,
  props: { class, style, onClick, ... } | null,
  children: string | VNode[] | null,
  el: HTMLElement | null,  // 对应的真实 DOM
  key: string | number | null
}
```

### Day 39：patch 分派逻辑

```text
patch(n1, n2, container):
  if (n1 && n1.type !== n2.type) → unmount(n1); n1 = null
  switch (n2.type):
    string    → processElement(n1, n2, container)
    Text      → processText(n1, n2, container)
    Fragment  → processFragment(n1, n2, container)
    Component → processComponent(n1, n2, container)
```

### Day 39：patchProps 四类

| 类型 | 处理方式 |
|------|----------|
| `class` | `el.className = value` |
| `style` | 遍历对象设 `el.style[key]` |
| `on*` 事件 | `el.addEventListener / removeEventListener` |
| 普通属性 | `el.setAttribute / removeAttribute` |

### Day 39：最小 renderer 实现

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

### Day 39：createApp 简示

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
