# Day 61 HTTP 缓存 + Service Worker

## 今日目标

- 看完 MDN HTTP Caching + Service Worker API
- 画一张“浏览器 → Service Worker → HTTP 缓存 → 网络”的请求链路
- 输出 Service Worker 三种常见策略：Cache First / Network First / Stale While Revalidate

## 按顺序阅读

1. [缓存机制](../network&broswer/cache-mechanism)
2. [浏览器存储](../network&broswer/broswer-storage)

## 实操与自测

**检查点**

- SW 是请求代理，可以拦截 fetch 并决定走网络还是走 Cache API
- SW 更新机制：install → waiting → activate，强刷不会立即替换老 SW
- `Cache-Control: no-cache` 并不是“不缓存”，是“每次协商”；`no-store` 才是完全不缓存

**先独立完成，再对照专题**

- HTTP 缓存体系 — [参考章节](../network&broswer/cache-mechanism#day-61-http-缓存体系)
- Cache-Control 常见值 — [参考章节](../network&broswer/cache-mechanism#day-61-cache-control-常见值)
- 最佳实践：HTML + 静态资源分策略 — [参考章节](../network&broswer/cache-mechanism#day-61-最佳实践-html-静态资源分策略)
- Service Worker 生命周期 — [参考章节](../network&broswer/cache-mechanism#day-61-service-worker-生命周期)
- 三种缓存策略 — [参考章节](../network&broswer/cache-mechanism#day-61-三种缓存策略)
- 请求链路 — [参考章节](../network&broswer/cache-mechanism#day-61-请求链路)
- 三种策略实现 — [参考章节](../network&broswer/cache-mechanism#day-61-三种策略实现)

**脱稿口述题**

- 1. Service Worker 常见三种缓存策略怎么选？
- 2. `no-cache` 和 `no-store` 区别？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 请求链路（浏览器 → SW → HTTP 缓存 → 网络）+ 强缓存/协商缓存区别（1.5 分钟）
2. SW 生命周期（install → waiting → activate）+ skipWaiting/claim（2 分钟）
3. 三种缓存策略（Cache First / Network First / SWR）+ 适用场景（1.5 分钟）

录完后自查：

- 是否说出 no-cache ≠ 不缓存。
- 是否说出 SW 的 waiting 阶段和 skipWaiting。
- 是否说出三种策略各自适用的资源类型。
- 是否说出 HTML 用 no-cache + 静态资源用长期缓存 + hash。

## 复盘

今天最需要回补的 3 个点：

1. `stale-while-revalidate` HTTP 头部（和 SW 策略同名但层级不同）。
2. SW 更新时的"等旧页面关闭"问题（以及 `skipWaiting` 的风险）。
3. Cache API 和浏览器 HTTP 缓存的关系（两层独立缓存）。
