# Day 59 Web Vitals 指标 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 59 | Web Vitals | [Web Vitals](../network&broswer/web-vitals)、[性能优化](../advanced/week6/performance-optimization) |

## 今日目标

- 看完 web.dev 的 Web Vitals / LCP / INP / CLS 三篇
- 输出三大指标 → 优化动作的映射表
- 在 Chrome DevTools Performance 面板实测一个页面的 LCP / INP / CLS

## 阅读卡点

- LCP 关心的是**最大可视元素的绘制时间**，不是整页加载完
- INP 替代了 FID，衡量整次交互的最慢那次响应
- CLS 只统计用户未预期的布局偏移（有 input 的不算）

## 速记卡 / 知识点

<!-- 三大指标阈值 / 测量手段（RUM / Lighthouse） / 常见优化手法 -->

## 手写 / 流程图

```text
LCP 慢 → 先看是图片/文字/视频？优化方向不同
INP 慢 → 长任务 + 主线程阻塞
CLS 高 → 图片没写宽高 / 字体替换跳动 / 延迟注入广告
```

## 口述题

### 1. 三大指标对应的典型优化动作？

> 回答模板：

### 2. 你上一个项目的 LCP 是多少？怎么优化的？

> 回答模板：

## 5 分钟录音顺序

1. 三个指标定义（1.5 分钟）
2. LCP 优化（2 分钟）
3. INP / CLS 优化（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
