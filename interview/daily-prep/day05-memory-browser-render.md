# Day 5 内存管理与浏览器渲染基础

## 今日目标

- 看完 `/jscore/basic/memory-management`、`/network&broswer/broswer-render`
- 输出一张“内存泄漏排查流程图”（发现 → 定位 → 修复 → 验证）
- 输出一张浏览器渲染流程图（DOM → CSSOM → Render Tree → Layout → Paint → Composite）

## 按顺序阅读

1. [内存管理](../jscore/basic/memory-management)
2. [浏览器渲染](../network&broswer/broswer-render)

## 实操与自测

**检查点**

- V8 GC：新生代 Scavenge + 老生代 Mark-Sweep / Mark-Compact
- 常见泄漏源：全局变量、闭包持有、未解绑事件、游离 DOM、定时器
- `transform` / `opacity` 走合成层，不触发 layout，性能优于 `top / left`

**先独立完成，再对照专题**

- V8 分代回收 — [参考章节](../jscore/basic/memory-management#day-5-v8-分代回收)
- 常见内存泄漏场景 — [参考章节](../jscore/basic/memory-management#day-5-常见内存泄漏场景)
- WeakMap / WeakSet — [参考章节](../jscore/basic/memory-management#day-5-weakmap-weakset)
- 浏览器渲染流水线 — [参考章节](../network&broswer/broswer-render#day-5-浏览器渲染流水线)
- 合成层触发条件 — [参考章节](../network&broswer/broswer-render#day-5-合成层触发条件)
- 排查流程 — [参考章节](../jscore/basic/memory-management#day-5-排查流程)
- 渲染流水线完整图 — [参考章节](../network&broswer/broswer-render#day-5-渲染流水线完整图)
- 内存泄漏排查 DevTools 步骤 — [参考章节](../jscore/basic/memory-management#day-5-内存泄漏排查-devtools-步骤)

**脱稿口述题**

- 1. 为什么 `WeakMap` 能减轻泄漏风险？
- 2. 为什么 `transform` 动画通常比 `top/left` 更稳？

**录音练习**

按这个顺序录，不要临场重新组织：

1. GC 机制（新生代 Scavenge + 老生代 Mark-Sweep）+ 6 种泄漏场景（2 分钟）
2. 排查流程（发现 → 定位 → 修复 → 验证）+ WeakMap 方案（1.5 分钟）
3. 渲染流水线 + 重排/重绘/合成区别 + `transform` 优势（1.5 分钟）

录完后自查：

- 是否说出新生代 / 老生代的分工。
- 是否说出 3 种以上泄漏场景 + 对应修复方法。
- 是否说出 `transform` 走合成层不触发 Layout。
- 是否说出 WeakMap 弱引用的意义。

## 复盘

今天最需要回补的 3 个点：

1. V8 增量标记 / 并发标记的具体流程，面试时如何简洁表达。
2. `will-change` 过度使用的副作用（占用额外 GPU 内存）。
3. Performance 面板的帧图怎么看，哪些指标说明存在卡顿。
