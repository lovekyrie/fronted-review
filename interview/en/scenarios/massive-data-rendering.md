# Massive data rendering: virtual lists and time slicing

## 1. The real bottleneck

When a page renders thousands to hundreds of thousands of rows, cost usually comes from:

- Too many DOM nodes → layout and paint explode.
- One long compute task → the main thread janks.

## 2. Virtual list

### Idea

Render only nodes near the viewport. Everything else is a spacer that keeps the scrollbar honest.

### Key params

- `itemHeight`: row height (fixed height is the easy case).
- `containerHeight`: viewport height.
- `startIndex / endIndex`: data window for the current view.
- `offsetTop`: spacer height above the viewport.

```ts
const startIndex = Math.floor(scrollTop / itemHeight)
const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 // buffer
const endIndex = Math.min(startIndex + visibleCount, list.length)
const offsetTop = startIndex * itemHeight
```

### Harder cases

- Variable height: keep a height cache and correct scroll offset as you go.
- Layout thrash: batch position updates into the same frame.

## 3. Time slicing

Do not run a huge job in one go. Split it into small tasks across frames.

### requestAnimationFrame

```ts
function scheduleLargeTask<T>(tasks: T[], run: (task: T) => void) {
  let index = 0
  function loop() {
    const frameStart = performance.now()
    while (index < tasks.length && performance.now() - frameStart < 8) {
      run(tasks[index++])
    }
    if (index < tasks.length) requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
```

- Stay inside a per-frame budget (e.g. 8ms) so painting still happens.
- Closer to the browser’s render cadence than `setTimeout`.

## 4. Interview template

1. Name the bottleneck: DOM count + main-thread occupancy.
2. Combine: virtual list cuts DOM, time slicing cuts long tasks.
3. Edges: variable height, fast scroll, recycling, stable keys.
4. Metrics: FPS, long-task count, first paint.
