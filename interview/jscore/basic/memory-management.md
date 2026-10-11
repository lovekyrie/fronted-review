# 前端内存管理与泄漏排查

## 一、垃圾回收机制（GC）

主流机制是**标记清除**：

1. 从根对象（全局对象、执行上下文）出发做可达性标记。
2. 不可达对象被回收。

补充概念：新生代/老生代、分代回收、增量回收（不同引擎实现细节略有差异）。

## 二、常见内存泄漏场景

- 定时器未清理（`setInterval`）。
- 全局事件监听未解绑。
- 闭包长时间持有大对象。
- 缓存无限增长（Map/Object 没有淘汰策略）。
- 脱离文档的 DOM 引用仍被 JS 持有。

## 三、WeakMap / WeakSet 适用场景

- 键是弱引用，不会阻止对象被回收。
- 适合做对象元信息缓存，避免长期持有。

```js
const metaCache = new WeakMap()
function getMeta(node) {
  if (!metaCache.has(node)) metaCache.set(node, { mountedAt: Date.now() })
  return metaCache.get(node)
}
```

## 四、排查方法

1. Chrome DevTools -> Memory -> Heap Snapshot 对比前后快照。
2. 看 Detached DOM、闭包引用链和大对象增长趋势。
3. 用 Performance 面板观察长时间交互后内存曲线是否持续上升。

## 五、面试答题建议

- 不要只说定义，要给「泄漏场景 + 如何定位 + 如何修复」完整闭环。

## 每日练习参考

### Day 5：V8 分代回收

| 区域 | 算法 | 特点 |
|------|------|------|
| 新生代 (Young) | Scavenge（复制算法，From → To） | 小而快，生命周期短的对象 |
| 老生代 (Old) | Mark-Sweep + Mark-Compact | 大而慢，长期存活的对象 |

核心思想：从根对象（全局对象、执行上下文）出发做**可达性标记**，不可达的对象被回收。

进阶优化：增量标记（Incremental Marking）、并发标记（Concurrent Marking）、懒清除（Lazy Sweeping）——避免全停顿 GC。

### Day 5：常见内存泄漏场景

1. **全局变量**：意外挂到 `window` 上，永远不会被回收。
2. **闭包持有大对象**：回调 / 定时器引用外层大数据。
3. **未解绑的事件监听器**：组件销毁后仍挂在 DOM 上。
4. **游离 DOM 引用**：DOM 节点已从文档移除，但 JS 变量仍持有引用。
5. **缓存无限增长**：Map / Object 没有淘汰策略。
6. **`setInterval` 未清除**：必须在卸载时 `clearInterval`。

### Day 5：WeakMap / WeakSet

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

### Day 5：排查流程

```text
发现（内存曲线持续上升）
  → 定位（Heap Snapshot 对比前后快照）
  → 修复（解绑 / clearInterval / 置 null / 改用 WeakMap）
  → 验证（重新录制 Performance 确认内存曲线平稳）
```

### Day 5：内存泄漏排查 DevTools 步骤

```text
1. 打开 Chrome DevTools -> Memory 面板
2. 取一个 Heap Snapshot (baseline)
3. 执行疑似泄漏的操作
4. 再取一个 Heap Snapshot
5. 选择 Comparison 视图，查看增量对象
6. 关注 Detached DOM 和闭包引用链
7. 修复后重复步骤验证
```
