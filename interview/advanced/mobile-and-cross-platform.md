# 移动端适配与跨端认知

## 一、移动端适配

### 1px 问题

高 DPR 设备下，CSS `1px` 看起来偏粗，可通过 `transform: scale` 或 viewport 方案处理。

### rem / vw 方案

- `rem`：基于根字体动态缩放，历史项目常用。
- `vw`：更直接按视口宽度计算，响应式实现简单。

### Safe Area 适配

刘海屏设备需使用 `env(safe-area-inset-*)` 预留安全区。

```css
.footer {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

## 二、跨端框架认知（面试够用）

- 小程序：双线程架构（逻辑层与视图层通信）。
- React Native：JS 驱动原生组件渲染。
- Flutter：自绘渲染引擎，跨平台一致性更强。

## 三、面试回答建议

结合你做过的移动端项目说“适配问题 -> 方案 -> 效果”，比纯概念更有说服力。
