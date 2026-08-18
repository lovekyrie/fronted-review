# Day 72 scenario: massive data / virtual list — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 72 | Virtual list | [Massive data rendering](../scenarios/massive-data-rendering) |

## Today's goals

- Finish `/en/scenarios/massive-data-rendering`
- Output three virtual-list tiers: fixed height / dynamic height / variable height + buffer
- Handwrite a minimal fixed-height virtual-list demo

## Reading checkpoints

- A virtual list only renders the viewport + buffer, then shifts with transform
- Dynamic height needs a **real-height index**; cache heights and binary-search into it
- With nested scrollers, listen on the right container or you get jank

## Cheat sheet / knowledge

### Core idea

```text
10,000 rows, only ~20 DOM nodes in the viewport.
On scroll, swap viewport content and use padding/transform to keep the scroll height.
```

### Fixed-height math

| Variable | Formula |
|------|------|
| Total height | `totalHeight = itemCount * itemHeight` |
| Start index | `startIndex = Math.floor(scrollTop / itemHeight)` |
| End index | `endIndex = startIndex + Math.ceil(containerHeight / itemHeight)` |
| Offset | `offset = startIndex * itemHeight` |

### Three tiers

| Tier | Traits | Complexity |
|----|------|--------|
| **Fixed height** | Every row has a fixed height; compute directly | Low |
| **Dynamic height** | Estimate first, measure real height after render, cache it | Medium |
| **Dynamic + buffer** | Extra buffer rows above/below to cut blank flashes | High |

### Buffer strategy

```text
buffer = 5 rows
Actual render range = [startIndex - buffer, endIndex + buffer]
→ Fast scrolling does not blank the viewport
```

## Handwritten / flow

### Fixed-height core

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

### Dynamic-height idea

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

## Spoken questions

### 1. Three main hard parts of a virtual list?

Answer template:

> First, **dynamic height** — if row height is not fixed, you cannot map `scrollTop` to `startIndex` directly. Fix: estimate first, measure after render, cache, binary-search. Second, **blank flashes** — on fast scroll the new DOM is not ready yet. Fix: extra buffer rows above and below (usually 5-10). Third, **scroll jank** — updating real heights changes total height and `scrollTop` jumps. Fix: correct `scrollTop` in the same update.
>
> In real projects, prefer a mature lib (vue-virtual-scroller / react-window / tanstack-virtual). Hand-rolling hits many traps.

### 2. How do you locate rows precisely with dynamic height?

Answer template:

> Two steps. First, keep a `positions` array of `{ top, bottom, height }` per row. Start from estimated height; after render measure with `getBoundingClientRect`, write back, and shift every later item. Second, binary-search `scrollTop` in `positions` for `startIndex` — the first item whose `bottom > scrollTop`.
>
> Even with uneven heights you locate the start row in O(logN). Total height is the last item’s `bottom`.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Why a virtual list (perf of 10,000 DOM nodes) (1 min)
2. Fixed-height impl (`scrollTop` → `startIndex` → visible items → transform offset) (2 min)
3. Dynamic height (estimate → measure → binary search) + buffer + recommended libs (2 min)

After recording, self-check:

- Did you say viewport-only + buffer.
- Did you state the fixed-height formulas.
- Did you mention binary search for dynamic height.
- Did you recommend a mature lib.

## Today's recap

The 3 points that most need a follow-up today:

1. Replacing scroll listeners with `IntersectionObserver` (fewer scroll events).
2. `content-visibility: auto` as a lightweight alternative.
3. Combining a virtual list with infinite scroll.
