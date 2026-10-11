# Day 9 语义化 / 兼容性 / 动画

## 今日目标

- 看完 `/html&css/semantic-tag`、`/browser-compatibility`、`/animation`
- 输出一页《HTML/CSS 高频坑点》提纲
- 输出一张动画属性与渲染成本对照表

## 按顺序阅读

1. [语义化标签](../html&css/semantic-tag)
2. [浏览器兼容性](../html&css/browser-compatibility)
3. [动画](../html&css/animation)
4. [HTML5 特性](../html&css/html5-feature)

## 实操与自测

**检查点**

- 语义化不只是 SEO，还有可访问性（屏幕阅读器）和团队协作可读性
- CSS 兼容性要能讲前缀 + PostCSS + Browserslist 的组合意义
- 只有 `transform / opacity` 类动画走合成层；`width / height / top / left` 会触发 Layout

**先独立完成，再对照专题**

- 语义化标签 — [参考章节](../html&css/semantic-tag#day-9-语义化标签)
- 浏览器兼容性处理链路 — [参考章节](../html&css/browser-compatibility#day-9-浏览器兼容性处理链路)
- CSS 动画三类渲染成本 — [参考章节](../html&css/animation#day-9-css-动画三类渲染成本)
- CSS 动画 vs JS 动画 — [参考章节](../html&css/animation#day-9-css-动画-vs-js-动画)
- HTML5 新特性速记 — [参考章节](../html&css/html5-feature#day-9-html5-新特性速记)
- 触发 Layout 的动画 vs 仅 Composite 的动画 — [参考章节](../html&css/animation#day-9-触发-layout-的动画-vs-仅-composite-的动画)
- 淡入淡出动画 — [参考章节](../html&css/animation#day-9-淡入淡出动画)

**脱稿口述题**

- 1. 为什么要做语义化？
- 2. 为什么有些动画会掉帧？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 语义化三个价值（SEO / 可访问性 / 可维护性）（1 分钟）
2. 兼容性处理链路（PostCSS + Browserslist + Babel）（2 分钟）
3. 动画性能分层（Layout / Paint / Composite）+ 掉帧原因（2 分钟）

录完后自查：

- 是否说出语义化的 3 个核心价值。
- 是否说出 PostCSS + Browserslist 的协作关系。
- 是否说出 `transform / opacity` 走合成层不触发 Layout。
- 是否说出 16.67ms 帧预算的概念。

## 复盘

今天最需要回补的 3 个点：

1. `<article>` 和 `<section>` 的区别（article 可独立引用，section 是主题分区）。
2. `will-change` 过度使用的内存代价，什么时候该加什么时候不该加。
3. Web Animations API 的基本用法（`element.animate()`），和 CSS animation 的对比。
