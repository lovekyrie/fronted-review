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