# Day 59 Web Vitals 指标

## 今日目标

- 看完 web.dev 的 Web Vitals / LCP / INP / CLS 三篇
- 输出三大指标 → 优化动作的映射表
- 在 Chrome DevTools Performance 面板实测一个页面的 LCP / INP / CLS

## 按顺序阅读

1. [Web Vitals](../network&broswer/web-vitals)
2. [性能优化](../advanced/week6/performance-optimization)

## 实操与自测

**检查点**

- LCP 关心的是**最大可视元素的绘制时间**，不是整页加载完
- INP 替代了 FID，衡量整次交互的最慢那次响应
- CLS 只统计用户未预期的布局偏移（有 input 的不算）

**先独立完成，再对照专题**

- 三大核心指标 — [参考章节](../network&broswer/web-vitals#day-59-三大核心指标)
- LCP 优化 — [参考章节](../advanced/week6/performance-optimization#day-59-lcp-优化)
- INP 优化 — [参考章节](../advanced/week6/performance-optimization#day-59-inp-优化)
- CLS 优化 — [参考章节](../advanced/week6/performance-optimization#day-59-cls-优化)
- 测量手段 — [参考章节](../network&broswer/web-vitals#day-59-测量手段)
- LCP 问题诊断树 — [参考章节](../network&broswer/web-vitals#day-59-lcp-问题诊断树)
- web-vitals 埋点 — [参考章节](../network&broswer/web-vitals#day-59-web-vitals-埋点)

**脱稿口述题**

- 1. 三大指标对应的典型优化动作？
- 2. 你上一个项目的 LCP 是多少？怎么优化的？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 三大指标定义 + 阈值（LCP ≤2.5s / INP ≤200ms / CLS ≤0.1）（1.5 分钟）
2. LCP 优化全链路（图片/CSS/TTFB）（2 分钟）
3. INP + CLS 优化 + web-vitals 埋点（1.5 分钟）

录完后自查：

- 是否说出三个指标的阈值。
- 是否说出 LCP 通常是图片或大文本。
- 是否说出 INP 替代了 FID。
- 是否说出 CLS 只统计非预期偏移。

## 复盘

今天最需要回补的 3 个点：

1. `fetchpriority` 属性对资源加载优先级的影响。
2. INP 和 FID 的区别（FID 只测第一次交互，INP 测所有交互中最慢的）。
3. `PerformanceObserver` API 的使用（自定义指标采集）。
