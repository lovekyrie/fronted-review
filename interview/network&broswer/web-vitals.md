# Web Vitals 核心指标

## 一、为什么重要

性能优化从“感觉快”升级为“指标可度量”。面试中建议先讲指标定义，再讲优化动作。

## 二、核心指标

- **FCP**（First Contentful Paint）：首次内容绘制时间。
- **LCP**（Largest Contentful Paint）：最大内容元素渲染时间。
- **CLS**（Cumulative Layout Shift）：累计布局偏移，反映页面稳定性。
- **FID / INP**：交互延迟（现代实践更关注 INP）。

## 三、如何测量

- Chrome DevTools Performance / Lighthouse。
- 线上接入 `web-vitals` 库采集真实用户数据（RUM）。

```ts
import { onLCP, onCLS, onINP } from 'web-vitals'

onLCP((metric) => report(metric))
onCLS((metric) => report(metric))
onINP((metric) => report(metric))
```

## 四、常见优化动作

- LCP：优化首屏图、资源预加载、SSR/SSG、减少阻塞资源。
- CLS：给图片/广告位预留尺寸，避免动态插入导致跳动。
- INP：减少长任务、事件回调拆分、降低主线程压力。

## 五、面试回答模板

先报问题指标，再讲定位工具，最后说优化动作和结果（例如 LCP 4s -> 1.5s）。
