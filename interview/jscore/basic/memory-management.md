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
