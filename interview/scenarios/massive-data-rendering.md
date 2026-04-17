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
