# Day 58 浏览器渲染流水线 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 58 | 渲染流水线 | [浏览器渲染](../network&broswer/broswer-render)、[性能优化](../advanced/week6/performance-optimization) |

## 今日目标

- 看完 `/network&broswer/broswer-render`、Chrome Rendering Performance 文档
- 画一张完整渲染流水线图：Parse → Style → Layout → Paint → Composite
- 输出“什么样的 CSS 改动只触发 Composite”答题稿

## 阅读卡点

- 回流（Reflow）触发 Layout，重绘（Repaint）不触发 Layout，合成只走 Composite
- Will-change、transform3d、position:fixed 都可能提升合成层
- 过多合成层也会反噬：显存占用 + 层合并成本

## 速记卡 / 知识点

<!-- 流水线 5 步 / 触发层级对照表 / 合成层提升条件 -->

## 手写 / 流程图

```text
DOM + CSSOM → Render Tree → Layout (Reflow) → Paint (Repaint) → Composite
```

## 口述题

### 1. Reflow / Repaint / Composite 区别？

> 回答模板：

### 2. 合成层是不是越多越好？

> 回答模板：

## 5 分钟录音顺序

1. 流水线 5 步（1.5 分钟）
2. 触发层级（2 分钟）
3. 合成层利弊（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
