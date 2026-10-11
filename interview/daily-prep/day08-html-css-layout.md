# Day 8 HTML/CSS 高频布局

## 今日目标

- 看完 `/html&css/layout`、`/box-model`、`/responsive-design`、`/advanced/css-advanced`、`/advanced/mobile-and-cross-platform`
- 输出 BFC 触发方式 + 应用场景总结
- 输出 rem / vw / safe-area 选型对比表

## 按顺序阅读

1. [布局](../html&css/layout)
2. [盒模型](../html&css/box-model)
3. [响应式设计](../html&css/responsive-design)
4. [CSS 进阶](../advanced/css-advanced)

## 实操与自测

**检查点**

- 盒模型 `content-box` vs `border-box`：计算宽度时包不包含 padding/border
- BFC 触发条件不止 `overflow: hidden`，还有 `display: flow-root`、浮动、定位等
- 移动端 1px 问题本质是 dpr > 1 时的物理像素 vs CSS 像素映射

**先独立完成，再对照专题**

- 盒模型 — [参考章节](../html&css/box-model#day-8-盒模型)
- BFC（块格式化上下文） — [参考章节](../html&css/layout#day-8-bfc-块格式化上下文)
- Flex 布局 — [参考章节](../html&css/layout#day-8-flex-布局)
- Grid 布局 — [参考章节](../html&css/layout#day-8-grid-布局)
- 移动端适配方案 — [参考章节](../html&css/responsive-design#day-8-移动端适配方案)
- 1px 问题 — [参考章节](../html&css/responsive-design#day-8-1px-问题)
- 三栏布局对比 — [参考章节](../html&css/layout#day-8-三栏布局对比)
- 水平垂直居中（4 种） — [参考章节](../html&css/layout#day-8-水平垂直居中-4-种)

**脱稿口述题**

- 1. 如何解决 1px 问题？
- 2. CSS Modules / CSS-in-JS / Tailwind 如何选？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 盒模型（content-box vs border-box）+ BFC 触发条件和应用（1.5 分钟）
2. Flex 核心概念 + Grid 基础 + 三栏布局实现（2 分钟）
3. 移动端适配方案 + 1px 问题解法（1.5 分钟）

录完后自查：

- 是否说出 BFC 至少 3 种触发方式。
- 是否说出 `flex: 1` 的展开值。
- 是否说出 1px 问题的本质是 dpr。
- 是否说出至少 2 种居中方案。

## 复盘

今天最需要回补的 3 个点：

1. `grid-template-areas` 命名区域的具体写法和适用场景。
2. `safe-area-inset-*` 在 iOS 上的实际配置（`viewport-fit=cover` + `env()`）。
3. `flex-shrink` 的计算规则（超出空间按 shrink 比例分配）。
