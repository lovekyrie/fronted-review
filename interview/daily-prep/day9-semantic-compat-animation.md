# Day 9 语义化 / 兼容性 / 动画 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 9 | 语义化 / 兼容 / 动画 | [语义化标签](../html&css/semantic-tag)、[浏览器兼容性](../html&css/browser-compatibility)、[动画](../html&css/animation)、[HTML5 特性](../html&css/html5-feature) |

## 今日目标

- 看完 `/html&css/semantic-tag`、`/browser-compatibility`、`/animation`
- 输出一页《HTML/CSS 高频坑点》提纲
- 输出一张动画属性与渲染成本对照表

## 阅读卡点

- 语义化不只是 SEO，还有可访问性（屏幕阅读器）和团队协作可读性
- CSS 兼容性要能讲前缀 + PostCSS + Browserslist 的组合意义
- 只有 `transform / opacity` 类动画走合成层；`width / height / top / left` 会触发 Layout

## 速记卡 / 知识点

### 语义化标签

| 标签 | 语义 | 替代方案 |
|------|------|----------|
| `<header>` | 页头 / 区块头 | `<div class="header">` |
| `<nav>` | 导航 | `<div class="nav">` |
| `<main>` | 主内容（页面唯一） | `<div class="main">` |
| `<article>` | 独立内容（可被引用） | `<div class="article">` |
| `<section>` | 主题分区 | `<div class="section">` |
| `<aside>` | 侧边栏 / 附属内容 | `<div class="sidebar">` |
| `<footer>` | 页脚 / 区块脚 | `<div class="footer">` |
| `<figure>` / `<figcaption>` | 插图 + 说明 | `<div>` + `<p>` |

语义化的三个价值：

1. **SEO**：搜索引擎能理解页面结构。
2. **可访问性**：屏幕阅读器能正确朗读页面层级。
3. **可维护性**：团队协作时代码可读性更好。

### 浏览器兼容性处理链路

```text
开发时写现代语法
  → PostCSS + Autoprefixer 自动加前缀
  → Browserslist 配置目标浏览器
  → Babel / core-js 处理 JS polyfill
  → 构建产物兼容目标范围
```

Browserslist 配置示例：

```text
> 0.5%, last 2 versions, not dead
```

### CSS 动画三类渲染成本

| 属性类型 | 触发阶段 | 成本 | 示例 |
|----------|----------|------|------|
| 几何属性 | Layout + Paint + Composite | 最高 | `width / height / top / left / margin` |
| 外观属性 | Paint + Composite | 中等 | `color / background / box-shadow` |
| 合成属性 | 仅 Composite | 最低 | `transform / opacity` |

### CSS 动画 vs JS 动画

- **CSS `transition` / `animation`**：简单状态切换，浏览器可优化到合成层，性能好。
- **JS `requestAnimationFrame`**：复杂逻辑控制（暂停、反转、链式），帧同步。
- **Web Animations API**：结合两者优点，API 简洁，浏览器原生支持。

### HTML5 新特性速记

- `<canvas>` / `<svg>`：绘图。
- `<video>` / `<audio>`：多媒体。
- `<input type="date/email/range">`：表单增强。
- `localStorage / sessionStorage`：本地存储。
- `Geolocation / Drag & Drop / Web Worker`：设备能力。

## 手写 / 流程图

### 触发 Layout 的动画 vs 仅 Composite 的动画

```css
/* ❌ 触发 Layout（每帧都重排） */
@keyframes move-bad {
  from { top: 0; }
  to { top: 100px; }
}
.box-bad {
  position: relative;
  animation: move-bad 1s infinite;
}

/* ✅ 仅 Composite（GPU 合成，高性能） */
@keyframes move-good {
  from { transform: translateY(0); }
  to { transform: translateY(100px); }
}
.box-good {
  animation: move-good 1s infinite;
  will-change: transform;
}
```

### 淡入淡出动画

```css
.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
```

## 口述题

### 1. 为什么要做语义化？

回答模板：

> 语义化有三个核心价值。第一是 SEO，搜索引擎能根据 `<article>`、`<nav>`、`<main>` 这些标签理解页面结构和权重。第二是可访问性，屏幕阅读器会根据语义标签构建导航大纲，视障用户可以通过"跳到主内容"等方式快速定位。第三是团队可维护性，`<header>` 比 `<div class="header">` 意图更明确，代码审查时一目了然。
>
> 实际工程中的做法是：页面整体用 `header / main / footer` 搭骨架，内容区用 `article / section` 分块，侧边栏用 `aside`，导航用 `nav`。表单控件用 `<label>` + `for` 关联，图片用 `alt` 描述。

### 2. 为什么有些动画会掉帧？

回答模板：

> 掉帧的本质是单帧渲染时间超过了 16.67ms（60fps 的帧预算）。浏览器渲染流水线是 Layout → Paint → Composite，如果动画属性触发了 Layout（比如 `width / top / left`），每帧都要重排，开销很大，容易超时导致掉帧。
>
> 解法是用只触发 Composite 的属性做动画，主要是 `transform` 和 `opacity`，它们直接由 GPU 处理，不走 Layout 和 Paint。还可以用 `will-change: transform` 提前创建合成层。
>
> 另外要注意：JS 计算量过大也会阻塞主线程，导致动画帧回调延迟。可以用 `requestAnimationFrame` 保证帧同步，或者把重计算放到 Web Worker 里。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 语义化三个价值（SEO / 可访问性 / 可维护性）（1 分钟）
2. 兼容性处理链路（PostCSS + Browserslist + Babel）（2 分钟）
3. 动画性能分层（Layout / Paint / Composite）+ 掉帧原因（2 分钟）

录完后自查：

- 是否说出语义化的 3 个核心价值。
- 是否说出 PostCSS + Browserslist 的协作关系。
- 是否说出 `transform / opacity` 走合成层不触发 Layout。
- 是否说出 16.67ms 帧预算的概念。

## 今日复盘

今天最需要回补的 3 个点：

1. `<article>` 和 `<section>` 的区别（article 可独立引用，section 是主题分区）。
2. `will-change` 过度使用的内存代价，什么时候该加什么时候不该加。
3. Web Animations API 的基本用法（`element.animate()`），和 CSS animation 的对比。
