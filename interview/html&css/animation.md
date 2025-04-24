### CSS 动画
CSS动画是一种通过CSS属性变化来创建动态效果的技术。

#### 1. 过渡动画
##### 1.1 基本语法
```css
.element {
  /* 过渡属性 */
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  transition-delay: 0s;

  /* 简写方式 */
  transition: all 0.3s ease 0s;
}
```

##### 1.2 过渡属性
```css
.element {
  /* 指定过渡属性 */
  transition-property: width, height, background-color;

  /* 过渡时间 */
  transition-duration: 0.3s;
  transition-duration: 300ms;

  /* 过渡函数 */
  transition-timing-function: ease;
  transition-timing-function: linear;
  transition-timing-function: ease-in;
  transition-timing-function: ease-out;
  transition-timing-function: ease-in-out;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  /* 过渡延迟 */
  transition-delay: 0.2s;
}
```

#### 2. 关键帧动画
##### 2.1 基本语法
```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 0.5s ease-out;
}
```

##### 2.2 动画属性
```css
.element {
  /* 动画名称 */
  animation-name: slideIn;

  /* 动画时间 */
  animation-duration: 0.5s;

  /* 动画函数 */
  animation-timing-function: ease-out;

  /* 动画延迟 */
  animation-delay: 0.2s;

  /* 动画次数 */
  animation-iteration-count: 1;
  animation-iteration-count: infinite;

  /* 动画方向 */
  animation-direction: normal;
  animation-direction: reverse;
  animation-direction: alternate;
  animation-direction: alternate-reverse;

  /* 动画填充模式 */
  animation-fill-mode: none;
  animation-fill-mode: forwards;
  animation-fill-mode: backwards;
  animation-fill-mode: both;

  /* 动画状态 */
  animation-play-state: running;
  animation-play-state: paused;

  /* 简写方式 */
  animation: slideIn 0.5s ease-out 0.2s infinite alternate;
}
```

#### 3. 变换
##### 3.1 2D变换
```css
.element {
  /* 位移 */
  transform: translate(100px, 100px);
  transform: translateX(100px);
  transform: translateY(100px);

  /* 旋转 */
  transform: rotate(45deg);

  /* 缩放 */
  transform: scale(1.5);
  transform: scaleX(1.5);
  transform: scaleY(1.5);

  /* 倾斜 */
  transform: skew(30deg);
  transform: skewX(30deg);
  transform: skewY(30deg);

  /* 组合变换 */
  transform: translate(100px, 100px) rotate(45deg) scale(1.5);
}
```

##### 3.2 3D变换
```css
.element {
  /* 3D位移 */
  transform: translate3d(100px, 100px, 100px);
  transform: translateZ(100px);

  /* 3D旋转 */
  transform: rotate3d(1, 1, 1, 45deg);
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);

  /* 3D缩放 */
  transform: scale3d(1.5, 1.5, 1.5);
  transform: scaleZ(1.5);

  /* 透视 */
  perspective: 1000px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
```

#### 4. 动画效果
##### 4.1 淡入淡出
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.element {
  animation: fadeIn 0.5s ease-out;
}
```

##### 4.2 滑动效果
```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 0.5s ease-out;
}
```

##### 4.3 缩放效果
```css
@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.element {
  animation: scaleIn 0.5s ease-out;
}
```

#### 5. 性能优化
##### 5.1 硬件加速
```css
.element {
  /* 启用硬件加速 */
  transform: translateZ(0);
  will-change: transform;
}
```

##### 5.2 动画性能
```css
.element {
  /* 避免重排 */
  transform: translateX(100px);
  
  /* 避免重绘 */
  opacity: 0.5;
  
  /* 使用will-change */
  will-change: transform, opacity;
}
```

#### 6. 最佳实践
1. 使用transform代替位置属性
2. 避免频繁触发重排
3. 使用will-change提示浏览器
4. 合理使用动画时间
5. 考虑动画性能
6. 提供降级方案
7. 注意动画可访问性
8. 使用CSS变量管理动画
9. 保持动画简洁
10. 测试不同设备

#### 7. 常见面试题
1. **CSS动画和JavaScript动画的区别**
   - CSS动画性能更好
   - CSS动画更简单
   - JavaScript动画更灵活
   - JavaScript动画可以更复杂

2. **如何优化动画性能**
   - 使用transform
   - 避免重排重绘
   - 使用will-change
   - 合理使用动画时间

3. **动画的可访问性考虑**
   - 提供降级方案
   - 考虑用户偏好
   - 避免过度动画
   - 提供暂停功能 