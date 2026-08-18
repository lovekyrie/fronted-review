# Frontend memory management and leak hunting

## 1. Garbage collection (GC)

The mainstream algorithm is **mark-and-sweep**:

1. Start from roots (the global object, execution contexts) and mark reachable objects.
2. Unreachable objects are collected.

Related ideas: young / old generation, generational GC, incremental GC (engine details differ).

## 2. Common leak patterns

- Timers never cleared (`setInterval`).
- Global event listeners never removed.
- Closures holding large objects for a long time.
- Caches that grow forever (Map / Object with no eviction).
- Detached DOM nodes still referenced from JS.

## 3. When to use WeakMap / WeakSet

- Keys are weak references and do not keep the object alive.
- Good for per-object metadata caches without pinning the object.

```js
const metaCache = new WeakMap()
function getMeta(node) {
  if (!metaCache.has(node)) metaCache.set(node, { mountedAt: Date.now() })
  return metaCache.get(node)
}
```

## 4. How to investigate

1. Chrome DevTools → Memory → Heap Snapshot, compare before / after.
2. Look at Detached DOM, closure retainers, and growing large objects.
3. Use the Performance panel: after long interaction, does the memory curve keep rising?

## 5. Interview tip

- Do not stop at the definition. Give the full loop: leak scenario → how you find it → how you fix it.
