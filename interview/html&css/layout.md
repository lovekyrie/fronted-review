### CSS 布局方式
CSS提供了多种布局方式，其中Flex和Grid是最常用的现代布局方案。

#### 1. Flex 布局
##### 1.1 基本概念
```css
.container {
  display: flex;
  /* 或 */
  display: inline-flex;
}
```

##### 1.2 容器属性
```css
.container {
  /* 主轴方向 */
  flex-direction: row; /* 默认值 */
  flex-direction: row-reverse;
  flex-direction: column;
  flex-direction: column-reverse;

  /* 是否换行 */
  flex-wrap: nowrap; /* 默认值 */
  flex-wrap: wrap;
  flex-wrap: wrap-reverse;

  /* 主轴对齐方式 */
  justify-content: flex-start; /* 默认值 */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;

  /* 交叉轴对齐方式 */
  align-items: stretch; /* 默认值 */
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline;

  /* 多行对齐方式 */
  align-content: stretch; /* 默认值 */
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
}
```

##### 1.3 项目属性
```css
.item {
  /* 排序 */
  order: 0; /* 默认值 */

  /* 放大比例 */
  flex-grow: 0; /* 默认值 */

  /* 缩小比例 */
  flex-shrink: 1; /* 默认值 */

  /* 基础大小 */
  flex-basis: auto; /* 默认值 */

  /* 简写方式 */
  flex: 0 1 auto; /* 默认值 */
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */

  /* 单独对齐方式 */
  align-self: auto; /* 默认值 */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: baseline;
  align-self: stretch;
}
```

#### 2. Grid 布局
##### 2.1 基本概念
```css
.container {
  display: grid;
  /* 或 */
  display: inline-grid;
}
```

##### 2.2 容器属性
```css
.container {
  /* 定义列 */
  grid-template-columns: 100px 100px 100px;
  grid-template-columns: repeat(3, 100px);
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-columns: minmax(100px, 1fr);

  /* 定义行 */
  grid-template-rows: 100px 100px 100px;
  grid-template-rows: repeat(3, 100px);
  grid-template-rows: 1fr 2fr 1fr;

  /* 定义区域 */
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";

  /* 列间距 */
  column-gap: 20px;

  /* 行间距 */
  row-gap: 20px;

  /* 简写方式 */
  gap: 20px;
  gap: 20px 30px;

  /* 对齐方式 */
  justify-items: stretch; /* 默认值 */
  justify-items: start;
  justify-items: end;
  justify-items: center;

  align-items: stretch; /* 默认值 */
  align-items: start;
  align-items: end;
  align-items: center;

  /* 整体对齐 */
  justify-content: start;
  justify-content: end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;

  align-content: start;
  align-content: end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: space-evenly;
}
```

##### 2.3 项目属性
```css
.item {
  /* 位置 */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;

  /* 简写方式 */
  grid-column: 1 / 3;
  grid-row: 1 / 3;

  /* 区域 */
  grid-area: header;

  /* 对齐方式 */
  justify-self: stretch; /* 默认值 */
  justify-self: start;
  justify-self: end;
  justify-self: center;

  align-self: stretch; /* 默认值 */
  align-self: start;
  align-self: end;
  align-self: center;
}
```

#### 3. 布局应用
##### 3.1 Flex 布局应用
```css
/* 水平居中 */
.container {
  display: flex;
  justify-content: center;
}

/* 垂直居中 */
.container {
  display: flex;
  align-items: center;
}

/* 完全居中 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 等分布局 */
.container {
  display: flex;
}
.item {
  flex: 1;
}

/* 响应式导航 */
.nav {
  display: flex;
  flex-wrap: wrap;
}
.nav-item {
  flex: 1 1 200px;
}
```

##### 3.2 Grid 布局应用
```css
/* 网格布局 */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* 页面布局 */
.page {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* 卡片布局 */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
```

#### 4. 最佳实践
1. 选择合适的布局方式
2. 使用简写属性提高效率
3. 考虑响应式设计
4. 使用CSS变量管理尺寸
5. 注意浏览器兼容性
6. 使用开发者工具调试
7. 遵循BEM命名规范
8. 保持代码整洁
9. 考虑性能优化
10. 进行代码审查

#### 5. 常见面试题
1. **Flex和Grid的区别**
   - Flex是一维布局
   - Grid是二维布局
   - Flex适合线性布局
   - Grid适合复杂网格

2. **Flex布局的应用场景**
   - 导航栏
   - 卡片布局
   - 居中布局
   - 等分布局

3. **Grid布局的应用场景**
   - 页面整体布局
   - 复杂网格系统
   - 响应式布局
   - 不规则布局 

#### 6. 高频疏漏补充（布局追问）

##### 6.1 `flex: 1` 到底代表什么
`flex: 1` 等价于 `flex: 1 1 0%`，即可放大、可缩小、基础宽度为 0。  
面试里常追问：为什么写 `width` 可能不生效？因为 `flex-basis` 会参与尺寸计算。

##### 6.2 min-width: 0 的经典坑
在 flex 容器里，子项默认 `min-width: auto`，长文本可能撑破容器。  
解决：对子项设置 `min-width: 0`（配合 `overflow: hidden`）。

##### 6.3 Grid 的 `auto-fit` vs `auto-fill`
- `auto-fit`：会“折叠”空轨道，让已有列拉伸填满空间。
- `auto-fill`：保留空轨道占位。

##### 6.4 圣杯/双飞翼现代写法怎么答
优先回答：今天通常用 Flex 或 Grid 实现，兼容旧项目才考虑 float 方案。  
加分点：能解释为何旧方案要处理中间优先渲染和左右定宽。

##### 6.5 布局性能建议
1. 减少深层嵌套和复杂选择器。
2. 对频繁变化动画优先用 `transform/opacity`。
3. 布局抖动问题优先查”读写交替”与同步测量（如频繁读取 `offsetHeight`）。

---

#### 7. BFC（Block Formatting Context）深度

##### 7.1 什么是 BFC
BFC 是 Web 渲染引擎的一个独立区域，块级盒子的布局只在 BFC 内部进行。

**触发 BFC 的条件（常用）：**
```css
/* 常见触发方式 */
overflow: auto;        /* 或 hidden、scroll */
display: flow-root;    /* 纯 BFC 触发，无副作用 */
position: absolute/fixed;
float: left/right;
```

##### 7.2 BFC 的特性（面试必问）
1. **阻止外边距折叠（margin collapse）**：同属一个 BFC 的相邻块级盒子，外边距会折叠。
2. **包含浮动元素**：BFC 可以包含浮动元素（清除浮动）。
3. **不被浮动元素覆盖**：BFC 区域不会被浮动元素遮挡。

```html
<!-- 外边距折叠示例 -->
<div style=”margin-bottom: 20px;”></div>  <!-- 同一个 BFC，会折叠 -->
<div style=”margin-top: 30px;”></div>
<!-- 两个 div 的实际间距是 30px，不是 50px -->

<!-- 用 BFC 阻止折叠 -->
<div style=”margin-bottom: 20px; overflow: hidden;”></div>
<div style=”margin-top: 30px; overflow: hidden;”></div>
<!-- 实际间距是 50px -->
```

##### 7.3 margin collapse 深度规则

**不合并的情况：**
1. 存在触发 BFC 的父元素。
2. 子元素有 `display: inline-block`。
3. 父元素有 `column-count`（多列布局）。
4. 一个元素高度为 0（不合并）。

```css
/* 父元素触发 BFC */
.parent {
  overflow: hidden;  /* 子元素的 margin 不与父合并 */
}
```

> **面试高频追问**：为什么 flex 容器里子元素的 margin 不折叠？——因为 flex 容器触发了新的 BFC（实际上是因为 flex 条目使用 flex formatting context，与块级格式化不同）。

##### 7.4 圣杯/双飞翼布局的历史（加分项）
- 旧方案核心难题：中间列优先渲染 + 三列定宽。
- 解决方案：负 margin 配合 margin/padding 模拟中间列位置。
- **现代写法**：直接 Flex 或 Grid 实现，不需要浮动 + 负 margin。

---

#### 8. ICB 与 Containing Block（深度理解）

##### 8.1 Initial Containing Block（ICB）
- 根元素的包含块称为 ICB。
- 对于根元素（`<html>`），ICB 等于初始视口（viewport）的大小。
- 所有子元素的定位都是相对于它的 containing block。

##### 8.2 Containing Block 的计算
```css
/* 元素尺寸的基准 */
div {
  /* width/height 的百分比基准是 containing block 的宽高 */
  width: 50%;  /* 相对于最近的 containing block */

  /* 绝对定位的偏移基准 */
  position: absolute;
  top: 20%;   /* 相对于最近的 containing block */
}
```

> **面试追问**：一个 `position: absolute` 的元素，它的 containing block 是谁？——距离最近的 `position: relative/absolute/fixed` 的祖先元素，如果没有则是 ICB（初始包含块）。