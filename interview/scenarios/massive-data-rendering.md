# 海量数据渲染：虚拟列表与时间分片

## 一、问题本质

当页面一次渲染几千到几十万条数据时，瓶颈通常在：

- DOM 节点数量过多导致布局与绘制开销高。
- 一次性计算任务过长导致主线程卡顿。

## 二、虚拟列表（Virtual List）

### 核心思想

只渲染可视区附近的节点，其他节点用占位高度撑开滚动条。

### 关键参数

- `itemHeight`：行高（固定高场景最简单）。
- `containerHeight`：容器高度。
- `startIndex / endIndex`：当前可视窗口对应的数据区间。
- `offsetTop`：可视区之前的占位高度。

```ts
const startIndex = Math.floor(scrollTop / itemHeight)
const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 // buffer
const endIndex = Math.min(startIndex + visibleCount, list.length)
const offsetTop = startIndex * itemHeight
```

### 进阶难点

- 不定高列表：需要维护高度缓存并动态修正滚动偏移。
- 回流抖动：批量更新位置时尽量合并到同一帧。

## 三、时间分片（分批执行）

大任务不要一次跑完，可切成多个小任务穿插到多帧执行。

### requestAnimationFrame 方案

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

- 每帧控制在预算内（例如 8ms），给渲染留时间。
- 比 `setTimeout` 更贴合浏览器渲染节奏。

## 四、面试答题模板

1. 先说明性能瓶颈：DOM 数量 + 主线程占用。
2. 给出组合方案：虚拟列表减少 DOM，时间分片降低长任务。
3. 解释边界：不定高、快速滚动、回收策略、键值稳定性。
4. 最后给指标：FPS、长任务数量、首屏渲染时间。

## 每日练习参考

### Day 72：虚拟列表核心原理

```text
10000 条数据，只渲染可视区域内的 ~20 条 DOM。
滚动时动态替换可视区内容 + 用 padding/transform 撑起滚动高度。
```

### Day 72：定高虚拟列表计算

| 变量 | 公式 |
|------|------|
| 总高度 | `totalHeight = itemCount * itemHeight` |
| 起始索引 | `startIndex = Math.floor(scrollTop / itemHeight)` |
| 结束索引 | `endIndex = startIndex + Math.ceil(containerHeight / itemHeight)` |
| 偏移量 | `offset = startIndex * itemHeight` |

### Day 72：三档实现

| 档 | 特点 | 复杂度 |
|----|------|--------|
| **定高** | 每项高度固定，直接计算 | 低 |
| **动态高度** | 先预估高度，渲染后测量真实高度缓存 | 中 |
| **动态 + 缓冲区** | 上下多渲染 buffer 行，减少白屏 | 高 |

### Day 72：缓冲策略

```text
buffer = 5 行
实际渲染范围 = [startIndex - buffer, endIndex + buffer]
→ 快速滚动时可视区不会白屏
```

### Day 72：定高虚拟列表核心实现

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

### Day 72：动态高度核心思路

```ts
// 预估高度
const estimatedHeight = 50
const positions = items.map((_, i) => ({
  index: i,
  top: i * estimatedHeight,
  bottom: (i + 1) * estimatedHeight,
  height: estimatedHeight,
}))

// 渲染后测量真实高度，更新 positions
function updatePositions(nodes: HTMLElement[]) {
  nodes.forEach((node, i) => {
    const realHeight = node.getBoundingClientRect().height
    const diff = realHeight - positions[startIndex + i].height
    positions[startIndex + i].height = realHeight
    positions[startIndex + i].bottom += diff
    // 后续项都要往下偏移 diff
    for (let j = startIndex + i + 1; j < positions.length; j++) {
      positions[j].top += diff
      positions[j].bottom += diff
    }
  })
}

// 用二分查找定位 startIndex
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
