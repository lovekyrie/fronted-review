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

### 渲染流水线 5 步

```text
1. Parse: HTML → DOM tree, CSS → CSSOM tree
2. Style: DOM + CSSOM → Render Tree（不包含 display:none）
3. Layout: 计算每个节点的几何信息（位置、大小）
4. Paint: 生成绘制指令（颜色、边框、阴影等）
5. Composite: 将多个图层合并，GPU 输出到屏幕
```

### 触发层级对照表

| 操作类型 | 触发阶段 | 示例属性 |
|----------|----------|----------|
| **回流（Reflow）** | Layout → Paint → Composite | `width / height / margin / padding / display / position / font-size` |
| **重绘（Repaint）** | Paint → Composite | `color / background / visibility / box-shadow / border-color` |
| **合成（Composite Only）** | Composite | `transform / opacity / will-change` |

### 合成层提升条件

- `transform: translateZ(0)` 或 `translate3d()`
- `will-change: transform / opacity`
- `position: fixed`（部分浏览器）
- `<video>` / `<canvas>` / `<iframe>`
- CSS `filter` / `backdrop-filter`

### 回流触发的常见操作

```js
// 读取布局信息会强制同步回流（Layout Thrashing）
el.offsetTop / el.offsetHeight
el.getBoundingClientRect()
window.getComputedStyle(el)
el.scrollTop
```

## 手写 / 流程图

### 完整渲染流水线

```text
HTML bytes → 解码 → Tokenize → 构建 DOM Tree
                                     ↓
CSS bytes → 解码 → Tokenize → 构建 CSSOM Tree
                                     ↓
                              Render Tree（DOM + CSSOM，排除 display:none）
                                     ↓
                              Layout（计算几何信息）
                                     ↓
                              Paint（生成绘制指令，按图层）
                                     ↓
                              Composite（GPU 合成图层，输出到屏幕）
```

### 避免 Layout Thrashing

```js
// ❌ 读写交替，每次读都强制同步回流
for (let i = 0; i < items.length; i++) {
  items[i].style.width = container.offsetWidth + 'px'  // 读 → 写 → 读 → 写
}

// ✅ 批量读，再批量写
const width = container.offsetWidth  // 读一次
for (let i = 0; i < items.length; i++) {
  items[i].style.width = width + 'px'  // 只写
}
```

### 只触发 Composite 的动画

```css
/* ✅ 只触发合成层，60fps 流畅动画 */
.animate {
  transform: translateX(100px);
  opacity: 0.5;
  will-change: transform, opacity;
}

/* ❌ 触发回流，性能差 */
.animate-bad {
  left: 100px;  /* 触发 Layout */
  width: 200px; /* 触发 Layout */
}
```

## 口述题

### 1. Reflow / Repaint / Composite 区别？

回答模板：

> 三者是渲染流水线的不同阶段。Reflow（回流）改变了元素的几何信息（位置、大小），需要重新 Layout → Paint → Composite，开销最大。Repaint（重绘）只改变外观（颜色、阴影），不需要重新 Layout，跳过一步。Composite（合成）只改变合成层属性（transform、opacity），直接走 GPU 合成，不需要主线程参与，最高效。
>
> 优化原则：尽量让动画只触发 Composite。用 `transform` 代替 `left/top`，用 `opacity` 代替 `visibility`。用 `will-change` 提前告诉浏览器创建合成层。

### 2. 合成层是不是越多越好？

回答模板：

> 不是。合成层的好处是动画不走主线程，不阻塞 JS 执行。但每个合成层都需要额外的 GPU 内存来存储纹理。如果层太多（比如对列表的每个 item 都加 `will-change`），GPU 内存会暴涨，反而导致性能下降。
>
> 而且还有"隐式合成"问题：当一个元素被提升为合成层后，它上面叠加的元素也可能被隐式提升，导致层数失控。正确做法是只对需要动画的元素加合成层提升，用 Chrome DevTools 的 Layers 面板检查实际层数。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 渲染流水线 5 步（Parse → Style → Layout → Paint → Composite）（1.5 分钟）
2. Reflow / Repaint / Composite 触发条件 + Layout Thrashing（2 分钟）
3. 合成层提升条件 + 利弊 + will-change 使用原则（1.5 分钟）

录完后自查：

- 是否说出 5 步流水线。
- 是否说出 transform/opacity 只触发 Composite。
- 是否说出读取 offsetTop 会强制同步回流。
- 是否说出合成层过多会占 GPU 内存。

## 今日复盘

今天最需要回补的 3 个点：

1. CSS `contain` 属性的作用（限制回流范围）。
2. `content-visibility: auto` 实现虚拟化渲染的原理。
3. Chrome Performance 面板中如何识别长任务和回流。
