# Day 4 DOM / BOM / Web API + 事件机制

## 今日目标

- 看完 `/jscore/basic/dom-bom-webapi`、`/jscore/basic/event-mechanism`、`/jscore/basic/other-web-apis`
- 做一个事件委托 demo（`closest` + 动态节点）
- 准备 `IntersectionObserver` + `sendBeacon` 的回答模板

## 按顺序阅读

1. [DOM/BOM/Web API](../jscore/basic/dom-bom-webapi)
2. [事件机制](../jscore/basic/event-mechanism)
3. [其他 Web API](../jscore/basic/other-web-apis)

## 实操与自测

**检查点**

- 事件捕获 / 目标 / 冒泡三阶段，`stopPropagation` 和 `stopImmediatePropagation` 的区别
- SPA 改 URL 不刷新页面：`history.pushState` + `popstate`，以及 hash 方案的取舍
- 常见观察器 API 边界：Intersection、Mutation、Resize、Performance

**先独立完成，再对照专题**

- DOM 树 vs 渲染树 — [参考章节](../jscore/basic/dom-bom-webapi#day-4-dom-树-vs-渲染树)
- BOM 常用对象 — [参考章节](../jscore/basic/dom-bom-webapi#day-4-bom-常用对象)
- 事件流三阶段 — [参考章节](../jscore/basic/event-mechanism#day-4-事件流三阶段)
- stopPropagation vs stopImmediatePropagation — [参考章节](../jscore/basic/dom-bom-webapi#day-4-stoppropagation-vs-stopimmediatepropagation)
- 事件委托（Event Delegation） — [参考章节](../jscore/basic/event-mechanism#day-4-事件委托-event-delegation)
- 常见 Observer API 矩阵 — [参考章节](../jscore/basic/dom-bom-webapi#day-4-常见-observer-api-矩阵)
- SPA 路由：hash vs history — [参考章节](../jscore/basic/dom-bom-webapi#day-4-spa-路由-hash-vs-history)
- sendBeacon — [参考章节](../jscore/basic/other-web-apis#day-4-sendbeacon)
- 事件委托 demo：点击动态节点通过 closest 匹配 — [参考章节](../jscore/basic/event-mechanism#day-4-事件委托-demo-点击动态节点通过-closest-匹配)
- 事件流三阶段图 — [参考章节](../jscore/basic/event-mechanism#day-4-事件流三阶段图)

**脱稿口述题**

- 1. SPA 为什么不刷新页面也能改 URL？
- 2. 事件捕获 / 冒泡如何结合业务解释？

**录音练习**

按这个顺序录，不要临场重新组织：

1. DOM / BOM 基础概念（1 分钟）
2. 事件流三阶段 + 委托应用（2 分钟）
3. IntersectionObserver / MutationObserver / sendBeacon 适用边界（2 分钟）

录完后自查：

- 是否说出捕获 → 目标 → 冒泡三阶段顺序。
- 是否说出 `stopPropagation` 和 `stopImmediatePropagation` 的区别。
- 是否说出事件委托的适用场景（动态列表、减少监听器数量）。
- 是否说出 hash 和 history 路由方案的取舍。

## 复盘

今天最需要回补的 3 个点：

1. `focus`/`blur` 不冒泡，面试时能说清楚用 `focusin`/`focusout` 代替。
2. `IntersectionObserver` 的阈值（threshold）配置和 `rootMargin` 的作用。
3. `history.pushState` 不触发 `popstate`，哪些操作会触发要列清楚。
