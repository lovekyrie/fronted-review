### CSS 盒模型
CSS盒模型描述了元素内容、内边距、边框和外边距的布局方式。

#### 1. 盒模型组成
##### 1.1 标准盒模型
```css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
  background-color: #f0f0f0;
}
```
- 内容区域（Content）
- 内边距（Padding）
- 边框（Border）
- 外边距（Margin）

##### 1.2 盒模型计算
```css
/* 标准盒模型 */
.box {
  box-sizing: content-box; /* 默认值 */
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 总宽度 = 200px + 2*20px + 2*5px = 250px */
}

/* IE盒模型 */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 总宽度 = 200px（包含padding和border） */
}
```

#### 2. 盒模型属性
##### 2.1 内容区域
```css
.box {
  width: 200px;
  height: 100px;
  min-width: 100px;
  max-width: 300px;
  min-height: 50px;
  max-height: 200px;
}
```

##### 2.2 内边距
```css
.box {
  /* 简写方式 */
  padding: 20px;
  padding: 20px 40px;
  padding: 20px 40px 30px 50px;

  /* 单独设置 */
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 30px;
  padding-left: 50px;
}
```

##### 2.3 边框
```css
.box {
  /* 简写方式 */
  border: 5px solid black;
  border: 5px solid;
  border: 5px;

  /* 单独设置 */
  border-width: 5px;
  border-style: solid;
  border-color: black;

  /* 单边设置 */
  border-top: 5px solid black;
  border-right: 5px solid black;
  border-bottom: 5px solid black;
  border-left: 5px solid black;
}
```

##### 2.4 外边距
```css
.box {
  /* 简写方式 */
  margin: 20px;
  margin: 20px 40px;
  margin: 20px 40px 30px 50px;

  /* 单独设置 */
  margin-top: 20px;
  margin-right: 40px;
  margin-bottom: 30px;
  margin-left: 50px;

  /* 水平居中 */
  margin: 0 auto;
}
```

#### 3. 盒模型特性
##### 3.1 外边距合并
```css
/* 相邻元素的外边距会合并 */
.box1 {
  margin-bottom: 20px;
}
.box2 {
  margin-top: 30px;
  /* 实际间距为30px（取较大值） */
}

/* 父子元素的外边距会合并 */
.parent {
  margin-top: 20px;
}
.child {
  margin-top: 30px;
  /* 实际间距为30px（取较大值） */
}
```

##### 3.2 盒模型溢出
```css
.box {
  width: 200px;
  height: 100px;
  overflow: visible; /* 默认值 */
  overflow: hidden;
  overflow: scroll;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
```

##### 3.3 盒模型阴影
```css
.box {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  /* 水平偏移 垂直偏移 模糊半径 颜色 */
}
```

#### 4. 盒模型应用
##### 4.1 居中布局
```css
/* 水平居中 */
.box {
  width: 200px;
  margin: 0 auto;
}

/* 垂直居中 */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
```

##### 4.2 响应式布局
```css
.box {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}
```

##### 4.3 卡片布局
```css
.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
}
```

#### 5. 最佳实践
1. 使用`box-sizing: border-box`
2. 合理使用外边距合并
3. 注意盒模型溢出处理
4. 使用简写属性提高效率
5. 考虑响应式布局
6. 使用CSS变量管理尺寸
7. 注意浏览器兼容性
8. 使用开发者工具调试
9. 遵循BEM命名规范
10. 保持代码整洁

#### 6. 常见面试题
1. **标准盒模型和IE盒模型的区别**
   - 标准盒模型：width/height只包含内容
   - IE盒模型：width/height包含内容、padding和border
   - 使用box-sizing属性切换

2. **外边距合并的规则**
   - 相邻元素取较大值
   - 父子元素取较大值
   - 空元素的外边距会合并

3. **如何实现元素居中**
   - 水平居中：margin: 0 auto
   - 垂直居中：flex布局
   - 绝对定位：transform
   - Grid布局：place-items: center 