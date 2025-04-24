### 响应式设计
响应式设计是一种使网页能够适应不同设备和屏幕尺寸的设计方法。

#### 1. 视口设置
##### 1.1 基本视口
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

##### 1.2 视口属性
```html
<!-- 禁止缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- 允许缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=2.0">
```

#### 2. 媒体查询
##### 2.1 基本语法
```css
/* 基本媒体查询 */
@media screen and (max-width: 768px) {
  /* 样式 */
}

/* 多个条件 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  /* 样式 */
}

/* 设备方向 */
@media screen and (orientation: landscape) {
  /* 横屏样式 */
}
```

##### 2.2 常用断点
```css
/* 移动设备 */
@media screen and (max-width: 576px) {
  /* 手机样式 */
}

/* 平板设备 */
@media screen and (min-width: 577px) and (max-width: 768px) {
  /* 平板样式 */
}

/* 小型桌面设备 */
@media screen and (min-width: 769px) and (max-width: 992px) {
  /* 小桌面样式 */
}

/* 大型桌面设备 */
@media screen and (min-width: 993px) {
  /* 大桌面样式 */
}
```

#### 3. 响应式单位
##### 3.1 相对单位
```css
.element {
  /* 相对于视口宽度 */
  width: 50vw;
  height: 50vh;

  /* 相对于父元素 */
  width: 50%;
  padding: 2em;
  margin: 1rem;

  /* 相对于根元素 */
  font-size: 1.5rem;
}
```

##### 3.2 计算函数
```css
.element {
  /* 计算宽度 */
  width: calc(100% - 20px);
  
  /* 计算字体大小 */
  font-size: calc(16px + 1vw);
  
  /* 计算间距 */
  padding: calc(1rem + 2vw);
}
```

#### 4. 响应式图片
##### 4.1 基本设置
```html
<!-- 响应式图片 -->
<img src="image.jpg" alt="响应式图片" style="max-width: 100%; height: auto;">

<!-- 不同尺寸图片 -->
<picture>
  <source srcset="large.jpg" media="(min-width: 800px)">
  <source srcset="medium.jpg" media="(min-width: 400px)">
  <img src="small.jpg" alt="响应式图片">
</picture>
```

##### 4.2 背景图片
```css
.element {
  background-image: url('image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

#### 5. 响应式布局
##### 5.1 Flex布局
```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 1 300px;
}
```

##### 5.2 Grid布局
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

#### 6. 响应式组件
##### 6.1 导航栏
```css
/* 响应式导航 */
.nav {
  display: flex;
  flex-wrap: wrap;
}

@media screen and (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
  
  .nav-item {
    width: 100%;
  }
}
```

##### 6.2 卡片布局
```css
/* 响应式卡片 */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}
```

#### 7. 最佳实践
1. 移动优先设计
2. 使用相对单位
3. 设置合适的断点
4. 优化图片加载
5. 考虑触摸操作
6. 测试不同设备
7. 保持性能优化
8. 使用CSS变量
9. 考虑可访问性
10. 渐进增强

#### 8. 常见面试题
1. **什么是移动优先设计**
   - 先设计移动端
   - 逐步增强功能
   - 考虑性能优化
   - 简化交互方式

2. **如何选择断点**
   - 基于内容
   - 考虑设备特性
   - 保持一致性
   - 避免过多断点

3. **响应式图片优化**
   - 使用srcset
   - 选择合适的格式
   - 考虑加载性能
   - 使用懒加载 