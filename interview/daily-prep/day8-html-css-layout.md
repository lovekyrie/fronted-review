# Day 8 HTML/CSS 高频布局 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 8 | HTML/CSS 布局 | [布局](../html&css/layout)、[盒模型](../html&css/box-model)、[响应式设计](../html&css/responsive-design)、[CSS 进阶](../advanced/css-advanced) |

## 今日目标

- 看完 `/html&css/layout`、`/box-model`、`/responsive-design`、`/advanced/css-advanced`、`/advanced/mobile-and-cross-platform`
- 输出 BFC 触发方式 + 应用场景总结
- 输出 rem / vw / safe-area 选型对比表

## 阅读卡点

- 盒模型 `content-box` vs `border-box`：计算宽度时包不包含 padding/border
- BFC 触发条件不止 `overflow: hidden`，还有 `display: flow-root`、浮动、定位等
- 移动端 1px 问题本质是 dpr > 1 时的物理像素 vs CSS 像素映射

## 速记卡 / 知识点

### 盒模型

- **`content-box`**（默认）：`width` 只包含内容，实际占位 = width + padding + border。
- **`border-box`**：`width` 包含 content + padding + border，更符合直觉。
- 工程默认：`*, *::before, *::after { box-sizing: border-box; }`

### BFC（块格式化上下文）

触发条件：

- `overflow` 不为 `visible`（如 `hidden / auto`）
- `display: flow-root`（最干净的方式）
- `float` 不为 `none`
- `position: absolute / fixed`
- `display: inline-block / flex / grid`

应用场景：

- 清除浮动（父容器 `display: flow-root`）。
- 阻止 margin 折叠。
- 自适应两栏布局（BFC 不与浮动元素重叠）。

### Flex 布局

```text
主轴 (main axis)   →   justify-content  控制主轴对齐
交叉轴 (cross axis) →   align-items      控制交叉轴对齐
```

常用属性：

- `flex: 1` = `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`
- `gap`：替代 margin 做间距，更简洁。
- `order`：调整子项排列顺序。

### Grid 布局

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

- `fr` 单位：按比例分配剩余空间。
- `grid-template-areas`：命名区域，适合复杂页面布局。
- `minmax(200px, 1fr)`：响应式列宽。

### 移动端适配方案

| 方案 | 原理 | 适用场景 |
|------|------|----------|
| `rem` + 动态 `html font-size` | 等比缩放 | 整体等比的活动页 |
| `vw / vh` | 视口百分比 | 现代移动端首选 |
| `px` + 媒体查询 | 断点适配 | PC 多端响应式 |
| `safe-area-inset-*` | 安全区域 | 刘海屏 / 底部横条 |

### 1px 问题

本质：dpr > 1 时，1 CSS px 对应多个物理像素，视觉上偏粗。

解法：
- `transform: scaleY(0.5)` + 伪元素（最常用）。
- `border-image` / SVG。
- `@media (-webkit-min-device-pixel-ratio: 2)` 条件适配。

## 手写 / 流程图

### 三栏布局对比

```css
/* 方案 1：Flex（推荐） */
.container { display: flex; }
.left { width: 200px; }
.center { flex: 1; }
.right { width: 200px; }

/* 方案 2：Grid */
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}

/* 方案 3：浮动 + BFC */
.left { float: left; width: 200px; }
.right { float: right; width: 200px; }
.center { overflow: hidden; /* BFC 不与浮动重叠 */ }
```

### 水平垂直居中（4 种）

```css
/* 1. Flex */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. Grid */
.parent { display: grid; place-items: center; }

/* 3. 绝对定位 + transform */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* 4. 绝对定位 + margin: auto */
.child { position: absolute; inset: 0; margin: auto; width: 100px; height: 100px; }
```

## 口述题

### 1. 如何解决 1px 问题？

回答模板：

> 1px 问题的本质是在高 dpr 设备上，1 个 CSS 像素对应 2 个或 3 个物理像素，导致 border 看起来偏粗。
>
> 最常用的解法是用伪元素 + `transform: scaleY(0.5)`：给元素加一个 `::after` 伪元素，设置 `border-bottom: 1px solid`，再用 `transform: scaleY(0.5)` 缩放，视觉上就是 0.5px。还可以用媒体查询 `@media (-webkit-min-device-pixel-ratio: 2)` 只在高 dpr 设备上生效。
>
> 其他方案还有 `border-image` 用 SVG 画线、viewport 的 `initial-scale=0.5` 整体缩放（副作用大，基本不用）。实际项目里伪元素方案最稳。

### 2. CSS Modules / CSS-in-JS / Tailwind 如何选？

回答模板：

> CSS Modules 是编译时作用域隔离，生成唯一类名，适合中大型项目，和 Vue scoped style 思路类似，零运行时成本。
>
> CSS-in-JS（如 styled-components / Emotion）在 JS 里写样式，好处是可以用 JS 变量做动态样式，但有运行时开销，SSR 时需要额外处理。React 生态用得多，Vue 生态较少。
>
> Tailwind 是原子化 CSS，用预定义的工具类组合样式，生产包体积小（PurgeCSS），开发速度快，但模板会比较长，适合快速迭代和设计系统统一的团队。
>
> 选型建议：Vue 项目首选 scoped style + CSS Modules；需要高度动态样式用 CSS-in-JS；追求开发速度和一致性用 Tailwind。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 盒模型（content-box vs border-box）+ BFC 触发条件和应用（1.5 分钟）
2. Flex 核心概念 + Grid 基础 + 三栏布局实现（2 分钟）
3. 移动端适配方案 + 1px 问题解法（1.5 分钟）

录完后自查：

- 是否说出 BFC 至少 3 种触发方式。
- 是否说出 `flex: 1` 的展开值。
- 是否说出 1px 问题的本质是 dpr。
- 是否说出至少 2 种居中方案。

## 今日复盘

今天最需要回补的 3 个点：

1. `grid-template-areas` 命名区域的具体写法和适用场景。
2. `safe-area-inset-*` 在 iOS 上的实际配置（`viewport-fit=cover` + `env()`）。
3. `flex-shrink` 的计算规则（超出空间按 shrink 比例分配）。
