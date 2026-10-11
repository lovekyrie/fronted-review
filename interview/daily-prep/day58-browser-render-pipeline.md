# Day 58 浏览器渲染流水线

## 今日目标

- 看完 `/network&broswer/broswer-render`、Chrome Rendering Performance 文档
- 画一张完整渲染流水线图：Parse → Style → Layout → Paint → Composite
- 输出“什么样的 CSS 改动只触发 Composite”答题稿

## 按顺序阅读

1. [浏览器渲染](../network&broswer/broswer-render)
2. [性能优化](../advanced/week6/performance-optimization)

## 实操与自测

**检查点**

- 回流（Reflow）触发 Layout，重绘（Repaint）不触发 Layout，合成只走 Composite
- Will-change、transform3d、position:fixed 都可能提升合成层
- 过多合成层也会反噬：显存占用 + 层合并成本

**先独立完成，再对照专题**

- 渲染流水线 5 步 — [参考章节](../network&broswer/broswer-render#day-58-渲染流水线-5-步)
- 触发层级对照表 — [参考章节](../network&broswer/broswer-render#day-58-触发层级对照表)
- 合成层提升条件 — [参考章节](../network&broswer/broswer-render#day-58-合成层提升条件)
- 回流触发的常见操作 — [参考章节](../network&broswer/broswer-render#day-58-回流触发的常见操作)
- 完整渲染流水线 — [参考章节](../network&broswer/broswer-render#day-58-完整渲染流水线)
- 避免 Layout Thrashing — [参考章节](../network&broswer/broswer-render#day-58-避免-layout-thrashing)
- 只触发 Composite 的动画 — [参考章节](../network&broswer/broswer-render#day-58-只触发-composite-的动画)

**脱稿口述题**

- 1. Reflow / Repaint / Composite 区别？
- 2. 合成层是不是越多越好？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 渲染流水线 5 步（Parse → Style → Layout → Paint → Composite）（1.5 分钟）
2. Reflow / Repaint / Composite 触发条件 + Layout Thrashing（2 分钟）
3. 合成层提升条件 + 利弊 + will-change 使用原则（1.5 分钟）

录完后自查：

- 是否说出 5 步流水线。
- 是否说出 transform/opacity 只触发 Composite。
- 是否说出读取 offsetTop 会强制同步回流。
- 是否说出合成层过多会占 GPU 内存。

## 复盘

今天最需要回补的 3 个点：

1. CSS `contain` 属性的作用（限制回流范围）。
2. `content-visibility: auto` 实现虚拟化渲染的原理。
3. Chrome Performance 面板中如何识别长任务和回流。
