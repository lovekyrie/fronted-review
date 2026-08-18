# Day 5 Memory Management and Browser Rendering Basics Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 5 | Memory and rendering | [Memory Management](../jscore/basic/memory-management), [Browser Rendering](../network&broswer/broswer-render) |

## Today's goals

- Finish `/en/jscore/basic/memory-management`, `/en/network&broswer/broswer-render`
- Produce a “memory-leak investigation flowchart” (discover → locate → fix → verify)
- Produce a browser rendering flowchart (DOM → CSSOM → Render Tree → Layout → Paint → Composite)

## Reading checkpoints

- V8 GC: young generation Scavenge + old generation Mark-Sweep / Mark-Compact
- Common leak sources: globals, closures holding data, unbound events, detached DOM, timers
- `transform` / `opacity` go through the compositor layer, skip layout, and outperform `top / left`

## Cheat sheet / knowledge points

### V8 generational GC

| Region | Algorithm | Traits |
|------|------|------|
| Young generation | Scavenge (copying, From → To) | small and fast; short-lived objects |
| Old generation | Mark-Sweep + Mark-Compact | large and slower; long-lived objects |

Core idea: start from roots (the global object, execution contexts) and do **reachability marking**. Unreachable objects are collected.

Advanced optimizations: Incremental Marking, Concurrent Marking, Lazy Sweeping — to avoid stop-the-world GC.

### Common memory-leak scenarios

1. **Globals**: accidentally attached to `window`, never collected.
2. **Closures holding large objects**: callbacks / timers referencing outer big data.
3. **Unbound event listeners**: still attached to the DOM after the component is destroyed.
4. **Detached DOM references**: the node was removed from the document, but a JS variable still holds it.
5. **Caches that grow forever**: Map / Object with no eviction.
6. **Uncleared `setInterval`**: must `clearInterval` on unmount.

### WeakMap / WeakSet

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

### Browser rendering pipeline

```text
HTML → DOM Tree
             ↘
CSS  → CSSOM    → Render Tree → Layout → Paint → Composite
```

- **Reflow**: geometry changes (`width / height / margin`) retrigger Layout; the most expensive.
- **Repaint**: appearance changes (`color / background`) without Layout.
- **Composite**: `transform / opacity` go through the GPU compositor layer, skip Layout and Paint, and are the cheapest.

### Conditions that create a compositor layer

- `transform: translate3d()` / `will-change: transform`
- `opacity` animations
- `<video>` / `<canvas>` / `<iframe>`
- `position: fixed` (some browsers)

### Investigation flow

```text
Discover (memory curve keeps rising)
  → Locate (compare Heap Snapshots before and after)
  → Fix (unbind / clearInterval / set to null / switch to WeakMap)
  → Verify (re-record Performance and confirm the memory curve is stable)
```

## Handwritten notes / flowcharts

### Full rendering-pipeline diagram

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

### DevTools steps for investigating memory leaks

```text
1. Open Chrome DevTools -> Memory panel
2. Take a Heap Snapshot (baseline)
3. Perform the suspected leaking action
4. Take another Heap Snapshot
5. Switch to Comparison view and inspect delta objects
6. Watch for Detached DOM and closure retainer chains
7. After the fix, repeat the steps to verify
```

## Oral questions

### 1. Why can `WeakMap` reduce leak risk?

Answer template:

> `WeakMap` keys are weak references and are not counted in the reference graph in a way that keeps the key alive. When no external variable references the key object, GC can collect it, and the corresponding WeakMap entry disappears automatically.
>
> A typical case is caching metadata with a DOM node as the key. With a normal Map, after the node is removed the Map still holds a reference, so the node cannot be collected. With WeakMap, removing the node drops the reference automatically and does not leak.
>
> Extra: WeakMap is not enumerable and has no `size`, because when an internal entry is collected is non-deterministic; being able to iterate it would contradict “weak reference” semantics.

### 2. Why are `transform` animations usually more stable than `top/left`?

Answer template:

> The browser pipeline is Layout → Paint → Composite. Changing `top / left` is a geometry change, which triggers reflow (Layout); the whole pipeline has to run again, which is expensive.
>
> `transform` only affects the compositor layer (Composite). It does not trigger Layout or Paint and is handled by the GPU. That means more stable frame rates and less stutter.
>
> Likewise, `opacity` also goes through the compositor. For animation, prefer `transform: translate()` over `top / left`, and `opacity` over `visibility`. You can also use `will-change: transform` to tell the browser to create a compositor layer ahead of time.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. GC (young-generation Scavenge + old-generation Mark-Sweep) + 6 leak scenarios (2 minutes)
2. Investigation flow (discover → locate → fix → verify) + the WeakMap approach (1.5 minutes)
3. Rendering pipeline + reflow / repaint / composite + why `transform` wins (1.5 minutes)

Self-check after recording:

- Did you say how the young and old generations divide the work?
- Did you say 3+ leak scenarios and the matching fixes?
- Did you say `transform` goes through the compositor and does not trigger Layout?
- Did you say what WeakMap weak references mean?

## Today's review

The 3 points that most need follow-up today:

1. The concrete flow of V8 incremental / concurrent marking, and how to say it briefly in an interview.
2. Side effects of overusing `will-change` (extra GPU memory).
3. How to read the Performance panel frame chart, and which metrics indicate jank.
