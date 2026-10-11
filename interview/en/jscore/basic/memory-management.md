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

## Daily practice reference

### Day 5: V8 generational GC

| Region | Algorithm | Traits |
|------|------|------|
| Young generation | Scavenge (copying, From → To) | small and fast; short-lived objects |
| Old generation | Mark-Sweep + Mark-Compact | large and slower; long-lived objects |

Core idea: start from roots (the global object, execution contexts) and do **reachability marking**. Unreachable objects are collected.

Advanced optimizations: Incremental Marking, Concurrent Marking, Lazy Sweeping — to avoid stop-the-world GC.

### Day 5: Common memory-leak scenarios

1. **Globals**: accidentally attached to `window`, never collected.
2. **Closures holding large objects**: callbacks / timers referencing outer big data.
3. **Unbound event listeners**: still attached to the DOM after the component is destroyed.
4. **Detached DOM references**: the node was removed from the document, but a JS variable still holds it.
5. **Caches that grow forever**: Map / Object with no eviction.
6. **Uncleared `setInterval`**: must `clearInterval` on unmount.

### Day 5: WeakMap / WeakSet

- Keys are **weak references** and do not prevent the object from being GC’d.
- Good for object metadata caches and private data association.
- Not enumerable; no `size`; no `clear()`.

```js
const metaCache = new WeakMap()
function getMeta(node) {
  if (!metaCache.has(node)) metaCache.set(node, { mountedAt: Date.now() })
  return metaCache.get(node)
}
// after node is GC'd, the corresponding WeakMap entry disappears automatically
```

### Day 5: Investigation flow

```text
Discover (memory curve keeps rising)
  → Locate (compare Heap Snapshots before and after)
  → Fix (unbind / clearInterval / set to null / switch to WeakMap)
  → Verify (re-record Performance and confirm the memory curve is stable)
```

### Day 5: DevTools steps for investigating memory leaks

```text
1. Open Chrome DevTools -> Memory panel
2. Take a Heap Snapshot (baseline)
3. Perform the suspected leaking action
4. Take another Heap Snapshot
5. Switch to Comparison view and inspect delta objects
6. Watch for Detached DOM and closure retainer chains
7. After the fix, repeat the steps to verify
```
