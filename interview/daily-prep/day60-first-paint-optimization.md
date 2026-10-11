# Day 60 首屏性能优化

## 今日目标

- 看完 web.dev Optimize LCP
- 输出首屏优化 checklist：网络层 / 资源层 / 渲染层 / 运行时
- 画一张 SPA 首屏瀑布流，标注可优化阶段

## 按顺序阅读

1. [性能优化](../advanced/week6/performance-optimization)
2. [Web Vitals](../network&broswer/web-vitals)

## 实操与自测

**检查点**

- 首屏关键资源：HTML → 关键 CSS → 关键 JS → 首屏数据 → 首屏图
- 接口提前：`<link rel="preconnect">` + `<link rel="preload">` + SSR/骨架屏
- 业务层优化：接口合并、字段瘦身、按需取数、图片格式（WebP / AVIF）

**先独立完成，再对照专题**

- 首屏优化 4 层 — [参考章节](../advanced/week6/performance-optimization#day-60-首屏优化-4-层)
- 关键渲染路径 — [参考章节](../advanced/week6/performance-optimization#day-60-关键渲染路径)
- preload / preconnect / prefetch — [参考章节](../advanced/week6/performance-optimization#day-60-preload-preconnect-prefetch)
- SSR vs 骨架屏 vs Loading — [参考章节](../advanced/week6/performance-optimization#day-60-ssr-vs-骨架屏-vs-loading)
- SPA 首屏瀑布流 + 优化点 — [参考章节](../advanced/week6/performance-optimization#day-60-spa-首屏瀑布流-优化点)
- 关键资源加载示例 — [参考章节](../advanced/week6/performance-optimization#day-60-关键资源加载示例)

**脱稿口述题**

- 1. SPA 白屏怎么优化？
- 2. `preload` / `preconnect` / `prefetch` 区别？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 首屏优化 4 层框架（网络/资源/渲染/运行时）（2 分钟）
2. 关键渲染路径 + preload/preconnect/prefetch 区别（1.5 分钟）
3. SSR vs 骨架屏 + 业务侧落地（接口合并/图片优化）（1.5 分钟）

录完后自查：

- 是否说出 CSS 阻塞渲染、JS 阻塞解析。
- 是否说出 preload / preconnect / prefetch 各自适用场景。
- 是否说出 Code Splitting 按路由拆分。
- 是否说出骨架屏的作用（JS 未执行前就有内容）。

## 复盘

今天最需要回补的 3 个点：

1. `modulepreload` 和 `preload` 的区别（modulepreload 会预解析 ES Module）。
2. Critical CSS 的自动提取工具（如 critters）。
3. 接口瘦身：GraphQL / BFF 层按需取字段减少首屏数据量。
