### 浏览器兼容性
浏览器兼容性是指网页在不同浏览器中能够正常显示和运行的能力。

#### 1. 浏览器前缀
##### 1.1 常用前缀
```css
.element {
  /* Webkit (Chrome, Safari) */
  -webkit-transform: rotate(45deg);
  -webkit-transition: all 0.3s;
  -webkit-animation: slide 1s;

  /* Mozilla (Firefox) */
  -moz-transform: rotate(45deg);
  -moz-transition: all 0.3s;
  -moz-animation: slide 1s;

  /* Opera */
  -o-transform: rotate(45deg);
  -o-transition: all 0.3s;
  -o-animation: slide 1s;

  /* Microsoft (IE) */
  -ms-transform: rotate(45deg);
  -ms-transition: all 0.3s;
  -ms-animation: slide 1s;

  /* 标准属性 */
  transform: rotate(45deg);
  transition: all 0.3s;
  animation: slide 1s;
}
```

##### 1.2 自动添加前缀
```javascript
// 使用PostCSS
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}

// 使用webpack
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
}
```

#### 2. 特性检测
##### 2.1 CSS特性检测
```css
/* 使用@supports */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

##### 2.2 JavaScript特性检测
```javascript
// 检测特性
if (typeof window.localStorage !== 'undefined') {
  // 支持localStorage
}

// 使用Modernizr
if (Modernizr.flexbox) {
  // 支持flexbox
}

// 使用特性检测库
if (supports.cssGrid) {
  // 支持CSS Grid
}
```

#### 3. 浏览器兼容性处理
##### 3.1 CSS兼容性
```css
/* 使用条件注释 */
<!--[if IE]>
<link rel="stylesheet" href="ie.css">
<![endif]-->

/* 使用媒体查询 */
@media screen and (-webkit-min-device-pixel-ratio:0) {
  /* Chrome, Safari */
}

@media screen and (-moz-images-in-menus:0) {
  /* Firefox */
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  /* IE */
}
```

##### 3.2 JavaScript兼容性
```javascript
// 使用polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 使用babel
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions']
      }
    }]
  ]
}
```

#### 4. 常见兼容性问题
##### 4.1 CSS兼容性问题
```css
/* 盒模型 */
.element {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

/* Flexbox */
.container {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: flex;
}

/* Grid */
.container {
  display: -ms-grid;
  display: grid;
}

/* 渐变 */
.element {
  background: -webkit-linear-gradient(top, #fff, #000);
  background: -moz-linear-gradient(top, #fff, #000);
  background: linear-gradient(to bottom, #fff, #000);
}
```

##### 4.2 JavaScript兼容性问题
```javascript
// 事件处理
if (window.addEventListener) {
  element.addEventListener('click', handler);
} else {
  element.attachEvent('onclick', handler);
}

// AJAX
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else {
  xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

// 本地存储
if (window.localStorage) {
  localStorage.setItem('key', 'value');
} else {
  // 降级处理
}
```

#### 5. 最佳实践
1. 使用特性检测而不是浏览器检测
2. 提供降级方案
3. 使用现代构建工具
4. 保持代码简洁
5. 测试不同浏览器
6. 使用CSS预处理器
7. 使用JavaScript转译器
8. 考虑移动端兼容性
9. 使用CDN加速
10. 定期更新依赖

#### 6. 常见面试题
1. **如何处理浏览器兼容性问题**
   - 使用特性检测
   - 提供降级方案
   - 使用polyfill
   - 使用构建工具

2. **CSS前缀的作用**
   - 支持实验性特性
   - 提供浏览器特定实现
   - 确保向后兼容
   - 过渡到标准属性

3. **如何测试浏览器兼容性**
   - 使用浏览器开发工具
   - 使用在线测试工具
   - 使用自动化测试
   - 进行跨浏览器测试 