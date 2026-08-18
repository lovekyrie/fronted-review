# Day 5 内存管理与浏览器渲染基础 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 5 | 内存与渲染 | [内存管理](../jscore/basic/memory-management)、[浏览器渲染](../network&broswer/broswer-render) |

## 今日目标

- 看完 `/jscore/basic/memory-management`、`/network&broswer/broswer-render`
- 输出一张“内存泄漏排查流程图”（发现 → 定位 → 修复 → 验证）
- 输出一张浏览器渲染流程图（DOM → CSSOM → Render Tree → Layout → Paint → Composite）

## 阅读卡点

- V8 GC：新生代 Scavenge + 老生代 Mark-Sweep / Mark-Compact
- 常见泄漏源：全局变量、闭包持有、未解绑事件、游离 DOM、定时器
- `transform` / `opacity` 走合成层，不触发 layout，性能优于 `top / left`

## 速记卡 / 知识点

### V8 分代回收

| 区域 | 算法 | 特点 |
|------|------|------|
| 新生代 (Young) | Scavenge（复制算法，From → To） | 小而快，生命周期短的对象 |
| 老生代 (Old) | Mark-Sweep + Mark-Compact | 大而慢，长期存活的对象 |

核心思想：从根对象（全局对象、执行上下文）出发做**可达性标记**，不可达的对象被回收。

进阶优化：增量标记（Incremental Marking）、并发标记（Concurrent Marking）、懒清除（Lazy Sweeping）——避免全停顿 GC。

### 常见内存泄漏场景

1. **全局变量**：意外挂到 `window` 上，永远不会被回收。
2. **闭包持有大对象**：回调 / 定时器引用外层大数据。
3. **未解绑的事件监听器**：组件销毁后仍挂在 DOM 上。
4. **游离 DOM 引用**：DOM 节点已从文档移除，但 JS 变量仍持有引用。
5. **缓存无限增长**：Map / Object 没有淘汰策略。
6. **`setInterval` 未清除**：必须在卸载时 `clearInterval`。

### WeakMap / WeakSet

- 键是**弱引用**，不会阻止对象被 GC 回收。
- 适合做对象元信息缓存、私有数据关联。
- 不可枚举、没有 `size`、没有 `clear()`。

```js
const metaCache = new WeakMap()
function getMeta(node) {
  if (!metaCache.has(node)) metaCache.set(node, { mountedAt: Date.now() })
  return metaCache.get(node)
}
// node 被 GC 后，metaCache 中对应条目自动消失
```

### 浏览器渲染流水线

```text
HTML → DOM Tree
             ↘
CSS  → CSSOM    → Render Tree → Layout → Paint → Composite
```

- **重排 (Reflow)**：几何属性变化（`width / height / margin`），触发 Layout 重新计算，代价最大。
- **重绘 (Repaint)**：外观属性变化（`color / background`），不触发 Layout。
- **合成 (Composite)**：`transform / opacity` 走 GPU 合成层，不触发 Layout 和 Paint，性能最好。

### 合成层触发条件

- `transform: translate3d()` / `will-change: transform`
- `opacity` 动画
- `<video>` / `<canvas>` / `<iframe>`
- `position: fixed`（部分浏览器）

### 排查流程

```text
发现（内存曲线持续上升）
  → 定位（Heap Snapshot 对比前后快照）
  → 修复（解绑 / clearInterval / 置 null / 改用 WeakMap）
  → 验证（重新录制 Performance 确认内存曲线平稳）
```

## 手写 / 流程图

### 渲染流水线完整图

```text
╔════════╗   ╔════════╗
║  HTML  ║   ║  CSS   ║
╚════┬═══╝   ╚════┬═══╝
     │ parse       │ parse
     ▼              ▼
╔════════╗   ╔════════╗
║DOM Tree║   ║ CSSOM  ║
╚════┬═══╝   ╚════┬═══╝
     │              │
     └──────┬──────┘
           ▼
   ╔═══════════╗
   ║Render Tree║
   ╚═════┬═════╝
         ▼
   Layout → Paint → Composite
```

### 内存泄漏排查 DevTools 步骤

```text
1. 打开 Chrome DevTools -> Memory 面板
2. 取一个 Heap Snapshot (baseline)
3. 执行疑似泄漏的操作
4. 再取一个 Heap Snapshot
5. 选择 Comparison 视图，查看增量对象
6. 关注 Detached DOM 和闭包引用链
7. 修复后重复步骤验证
```

## 口述题

### 1. 为什么 `WeakMap` 能减轻泄漏风险？

回答模板：

> `WeakMap` 的键是弱引用，不会被纳入引用计数。当键对象在外部不再被任何变量引用时，GC 可以正常回收它，WeakMap 中对应的条目也会自动消失。
>
> 典型场景是用 DOM 节点作为键来缓存元信息。如果用普通 Map，节点移除后 Map 仍然持有引用，节点无法回收。换成 WeakMap，节点移除后引用自动断开，不会泄漏。
>
> 补充：WeakMap 不可枚举、没有 `size`，这是因为其内部条目何时被回收是不确定的，如果能遍历就与“弱引用”语义矛盾。

### 2. 为什么 `transform` 动画通常比 `top/left` 更稳？

回答模板：

> 浏览器渲染流水线是 Layout → Paint → Composite。`top / left` 修改的是几何属性，会触发重排（Layout），整个流水线都要重新跑一遍，开销很大。
>
> `transform` 只作用在合成层（Composite），不触发 Layout 和 Paint，直接由 GPU 处理。这意味着动画帧率更稳定，不会卡顿。
>
> 同理，`opacity` 也走合成层。所以做动画时应优先用 `transform: translate()` 代替 `top / left`，用 `opacity` 代替 `visibility`。还可以用 `will-change: transform` 提前告知浏览器创建合成层。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. GC 机制（新生代 Scavenge + 老生代 Mark-Sweep）+ 6 种泄漏场景（2 分钟）
2. 排查流程（发现 → 定位 → 修复 → 验证）+ WeakMap 方案（1.5 分钟）
3. 渲染流水线 + 重排/重绘/合成区别 + `transform` 优势（1.5 分钟）

录完后自查：

- 是否说出新生代 / 老生代的分工。
- 是否说出 3 种以上泄漏场景 + 对应修复方法。
- 是否说出 `transform` 走合成层不触发 Layout。
- 是否说出 WeakMap 弱引用的意义。

## 今日复盘

今天最需要回补的 3 个点：

1. V8 增量标记 / 并发标记的具体流程，面试时如何简洁表达。
2. `will-change` 过度使用的副作用（占用额外 GPU 内存）。
3. Performance 面板的帧图怎么看，哪些指标说明存在卡顿。
