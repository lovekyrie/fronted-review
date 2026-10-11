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

## Daily practice reference

### Day 72: Core idea

```text
10,000 rows, only ~20 DOM nodes in the viewport.
On scroll, swap viewport content and use padding/transform to keep the scroll height.
```

### Day 72: Fixed-height math

| Variable | Formula |
|------|------|
| Total height | `totalHeight = itemCount * itemHeight` |
| Start index | `startIndex = Math.floor(scrollTop / itemHeight)` |
| End index | `endIndex = startIndex + Math.ceil(containerHeight / itemHeight)` |
| Offset | `offset = startIndex * itemHeight` |

### Day 72: Three tiers

| Tier | Traits | Complexity |
|----|------|--------|
| **Fixed height** | Every row has a fixed height; compute directly | Low |
| **Dynamic height** | Estimate first, measure real height after render, cache it | Medium |
| **Dynamic + buffer** | Extra buffer rows above/below to cut blank flashes | High |

### Day 72: Buffer strategy

```text
buffer = 5 rows
Actual render range = [startIndex - buffer, endIndex + buffer]
→ Fast scrolling does not blank the viewport
```

### Day 72: Fixed-height core

```vue
<template>
  <div class="viewport" :style="{ height: containerHeight + 'px', overflow: 'auto' }" @scroll="onScroll">
    <div class="spacer" :style="{ height: totalHeight + 'px' }">
      <div class="visible" :style="{ transform: `translateY(${offset}px)` }">
        <div v-for="item in visibleItems" :key="item.id" :style="{ height: itemHeight + 'px' }">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps<{ items: any[]; itemHeight: number; containerHeight: number }>()
const scrollTop = ref(0)
const buffer = 5

const totalHeight = computed(() => props.items.length * props.itemHeight)
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer))
const endIndex = computed(() => Math.min(
  props.items.length,
  Math.ceil((scrollTop.value + props.containerHeight) / props.itemHeight) + buffer
))
const offset = computed(() => startIndex.value * props.itemHeight)
const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))

function onScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}
</script>
```

### Day 72: Dynamic-height idea

```ts
// estimated height
const estimatedHeight = 50
const positions = items.map((_, i) => ({
  index: i,
  top: i * estimatedHeight,
  bottom: (i + 1) * estimatedHeight,
  height: estimatedHeight,
}))

// measure real height after render, update positions
function updatePositions(nodes: HTMLElement[]) {
  nodes.forEach((node, i) => {
    const realHeight = node.getBoundingClientRect().height
    const diff = realHeight - positions[startIndex + i].height
    positions[startIndex + i].height = realHeight
    positions[startIndex + i].bottom += diff
    // shift all later items down by diff
    for (let j = startIndex + i + 1; j < positions.length; j++) {
      positions[j].top += diff
      positions[j].bottom += diff
    }
  })
}

// binary-search startIndex
function findStartIndex(scrollTop: number): number {
  let low = 0, high = positions.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (positions[mid].bottom <= scrollTop) low = mid + 1
    else if (positions[mid].top > scrollTop) high = mid - 1
    else return mid
  }
  return low
}
```
