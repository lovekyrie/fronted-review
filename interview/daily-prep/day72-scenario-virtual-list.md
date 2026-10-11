# Day 72 场景题：海量数据 / 虚拟列表

## 今日目标

- 看完 `/scenarios/massive-data-rendering`
- 输出虚拟列表实现三档：定高 / 动态高度 / 变长 + 缓冲区
- 手写一个最小定高虚拟列表 demo

## 按顺序阅读

1. [海量数据渲染](../scenarios/massive-data-rendering)

## 实操与自测

**检查点**

- 虚拟列表的本质是“只渲染可视区域 + buffer”，用 transform 平移
- 动态高度需要维护一份**真实高度索引**，可用缓存 + 二分定位
- 页面有多级滚动时，监听 scroll 要选对容器，否则会抖动

**先独立完成，再对照专题**

- 虚拟列表核心原理 — [参考章节](../scenarios/massive-data-rendering#day-72-虚拟列表核心原理)
- 定高虚拟列表计算 — [参考章节](../scenarios/massive-data-rendering#day-72-定高虚拟列表计算)
- 三档实现 — [参考章节](../scenarios/massive-data-rendering#day-72-三档实现)
- 缓冲策略 — [参考章节](../scenarios/massive-data-rendering#day-72-缓冲策略)
- 定高虚拟列表核心实现 — [参考章节](../scenarios/massive-data-rendering#day-72-定高虚拟列表核心实现)
- 动态高度核心思路 — [参考章节](../scenarios/massive-data-rendering#day-72-动态高度核心思路)

**脱稿口述题**

- 1. 虚拟列表三个主要难点？
- 2. 动态高度怎么精准定位？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 为什么要虚拟列表（10000 DOM 的性能问题）（1 分钟）
2. 定高实现（scrollTop → startIndex → 可视项 → transform 偏移）（2 分钟）
3. 动态高度（预估 → 测量 → 二分定位）+ buffer + 推荐库（2 分钟）

录完后自查：

- 是否说出只渲染可视区域 + buffer。
- 是否说出定高的计算公式。
- 是否说出动态高度的二分查找。
- 是否说出推荐使用成熟库。

## 复盘

今天最需要回补的 3 个点：

1. `IntersectionObserver` 替代 scroll 监听的方案（减少 scroll 事件频率）。
2. `content-visibility: auto` 作为轻量级替代方案。
3. 虚拟列表 + 无限滚动的结合实现。
