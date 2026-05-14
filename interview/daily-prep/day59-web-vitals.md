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

### 三大核心指标

| 指标 | 全称 | 衡量 | Good | Needs Improvement | Poor |
|------|------|------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | 最大可视元素绘制时间 | ≤ 2.5s | ≤ 4s | > 4s |
| **INP** | Interaction to Next Paint | 最慢交互的响应延迟 | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | 累计布局偏移量 | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### LCP 优化

LCP 元素通常是：`<img>` / `<video>` / 背景图 / 大文本块。

| 优化方向 | 措施 |
|----------|------|
| 减少资源加载时间 | `<link rel="preload">` 关键图片 / 用 CDN / WebP/AVIF 格式 |
| 减少渲染阻塞 | 内联关键 CSS / `async` / `defer` 非关键 JS |
| 减少服务端时间 | SSR / Edge 渲染 / TTFB 优化 |
| 优先级 | `fetchpriority="high"` 给 LCP 图片 |

### INP 优化

| 问题 | 措施 |
|------|------|
| 长任务阻塞主线程 | 拆分任务（`yield to main thread`）/ Web Worker |
| 事件处理慢 | 减少 handler 复杂度 / debounce / 用 `startTransition` |
| 大量 DOM 操作 | 虚拟列表 / `content-visibility` |

### CLS 优化

| 问题 | 措施 |
|------|------|
| 图片无尺寸 | 始终设置 `width / height` 或 `aspect-ratio` |
| 字体替换跳动 | `font-display: optional` 或 `size-adjust` |
| 动态注入内容 | 预留空间 / `min-height` / 骨架屏 |

### 测量手段

| 工具 | 类型 | 场景 |
|------|------|------|
| Lighthouse | 实验室数据 | 开发阶段 |
| CrUX | 真实用户数据 | 线上监控 |
| `web-vitals` 库 | RUM | 自定义埋点 |
| Performance Observer | 浏览器 API | 精细测量 |

## 手写 / 流程图

### LCP 问题诊断树

```text
LCP > 2.5s
  ├─ LCP 元素是图片？
  │   ├─ 图片太大？→ 压缩 / WebP / AVIF / srcset
  │   ├─ 加载太晚？→ preload / fetchpriority="high"
  │   └─ CDN 慢？→ 就近节点 / HTTP/2
  ├─ LCP 元素是文字？
  │   ├─ CSS 阻塞？→ 内联关键 CSS
  │   └─ 字体加载慢？→ font-display: swap / preload 字体
  └─ TTFB 慢？
      └─ 服务端优化 / SSR / Edge 缓存
```

### web-vitals 埋点

```js
import { onLCP, onINP, onCLS } from 'web-vitals'

onLCP(metric => sendToAnalytics('LCP', metric))
onINP(metric => sendToAnalytics('INP', metric))
onCLS(metric => sendToAnalytics('CLS', metric))
```

## 口述题

### 1. 三大指标对应的典型优化动作？

回答模板：

> LCP 优化核心是让最大元素尽快绘制：preload 关键图片、内联关键 CSS、用 WebP 格式减小图片体积、SSR 减少 TTFB。INP 优化核心是保持主线程空闲：拆分长任务（用 `scheduler.yield()` 或 `setTimeout` 让出主线程）、减少事件处理复杂度、用虚拟列表减少 DOM 操作。CLS 优化核心是避免非预期的布局偏移：图片始终设宽高、字体用 `font-display: optional`、动态内容预留空间。
>
> 实际项目中，先用 Lighthouse 定位最差的指标，再针对性优化。80% 的 LCP 问题来自图片加载。

### 2. 你上一个项目的 LCP 是多少？怎么优化的？

回答模板：

> （根据实际项目调整）我们项目初始 LCP 在 4s 左右，主要瓶颈是首屏大图和 JS bundle 阻塞。优化措施：第一，给 LCP 图片加 `<link rel="preload">`，从 4s 降到 3s。第二，关键 CSS 内联 + 非关键 JS defer，又降了 0.3s。第三，图片换成 WebP + CDN，最终稳定在 2.2s 左右。
>
> 监控方面用 `web-vitals` 库做 RUM 埋点，发到自建 APM 平台，按 P75 追踪。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 三大指标定义 + 阈值（LCP ≤2.5s / INP ≤200ms / CLS ≤0.1）（1.5 分钟）
2. LCP 优化全链路（图片/CSS/TTFB）（2 分钟）
3. INP + CLS 优化 + web-vitals 埋点（1.5 分钟）

录完后自查：

- 是否说出三个指标的阈值。
- 是否说出 LCP 通常是图片或大文本。
- 是否说出 INP 替代了 FID。
- 是否说出 CLS 只统计非预期偏移。

## 今日复盘

今天最需要回补的 3 个点：

1. `fetchpriority` 属性对资源加载优先级的影响。
2. INP 和 FID 的区别（FID 只测第一次交互，INP 测所有交互中最慢的）。
3. `PerformanceObserver` API 的使用（自定义指标采集）。
