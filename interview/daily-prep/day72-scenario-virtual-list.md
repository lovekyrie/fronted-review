# Day 72 场景题：海量数据 / 虚拟列表 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 72 | 虚拟列表 | [海量数据渲染](../scenarios/massive-data-rendering) |

## 今日目标

- 看完 `/scenarios/massive-data-rendering`
- 输出虚拟列表实现三档：定高 / 动态高度 / 变长 + 缓冲区
- 手写一个最小定高虚拟列表 demo

## 阅读卡点

- 虚拟列表的本质是“只渲染可视区域 + buffer”，用 transform 平移
- 动态高度需要维护一份**真实高度索引**，可用缓存 + 二分定位
- 页面有多级滚动时，监听 scroll 要选对容器，否则会抖动

## 速记卡 / 知识点

### 虚拟列表核心原理

```text
10000 条数据，只渲染可视区域内的 ~20 条 DOM。
滚动时动态替换可视区内容 + 用 padding/transform 撑起滚动高度。
```

### 定高虚拟列表计算

| 变量 | 公式 |
|------|------|
| 总高度 | `totalHeight = itemCount * itemHeight` |
| 起始索引 | `startIndex = Math.floor(scrollTop / itemHeight)` |
| 结束索引 | `endIndex = startIndex + Math.ceil(containerHeight / itemHeight)` |
| 偏移量 | `offset = startIndex * itemHeight` |

### 三档实现

| 档 | 特点 | 复杂度 |
|----|------|--------|
| **定高** | 每项高度固定，直接计算 | 低 |
| **动态高度** | 先预估高度，渲染后测量真实高度缓存 | 中 |
| **动态 + 缓冲区** | 上下多渲染 buffer 行，减少白屏 | 高 |

### 缓冲策略

```text
buffer = 5 行
实际渲染范围 = [startIndex - buffer, endIndex + buffer]
→ 快速滚动时可视区不会白屏
```

## 手写 / 流程图

### 定高虚拟列表核心实现

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

### 动态高度核心思路

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

## 口述题

### 1. 虚拟列表三个主要难点？

回答模板：

> 第一，**动态高度**——如果每项高度不固定，无法直接计算 scrollTop 对应的 startIndex。解决方案：先用预估高度，渲染后测量真实高度缓存，用二分查找定位。第二，**白屏闪烁**——快速滚动时新 DOM 还没渲染出来。解决方案：上下多渲染 buffer 行（通常 5-10 行）。第三，**滚动抖动**——动态高度更新后总高度变化，scrollTop 跳动。解决方案：更新高度时同步修正 scrollTop。
>
> 实际项目中推荐直接用成熟库（vue-virtual-scroller / react-window / tanstack-virtual），自己写容易踩很多坑。

### 2. 动态高度怎么精准定位？

回答模板：

> 两步。第一步，维护一个 `positions` 数组，记录每项的 `{ top, bottom, height }`。初始用预估高度，渲染后用 `getBoundingClientRect` 测量真实高度，回写到 positions 并向下修正所有后续项。第二步，用二分查找根据 scrollTop 在 positions 中定位 startIndex——找到 `bottom > scrollTop` 的第一项。
>
> 这样即使每项高度不同，也能 O(logN) 定位到正确的起始项。总高度用 positions 最后一项的 bottom。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 为什么要虚拟列表（10000 DOM 的性能问题）（1 分钟）
2. 定高实现（scrollTop → startIndex → 可视项 → transform 偏移）（2 分钟）
3. 动态高度（预估 → 测量 → 二分定位）+ buffer + 推荐库（2 分钟）

录完后自查：

- 是否说出只渲染可视区域 + buffer。
- 是否说出定高的计算公式。
- 是否说出动态高度的二分查找。
- 是否说出推荐使用成熟库。

## 今日复盘

今天最需要回补的 3 个点：

1. `IntersectionObserver` 替代 scroll 监听的方案（减少 scroll 事件频率）。
2. `content-visibility: auto` 作为轻量级替代方案。
3. 虚拟列表 + 无限滚动的结合实现。
