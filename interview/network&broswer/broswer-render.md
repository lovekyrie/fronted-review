### 浏览器渲染原理
浏览器渲染是将HTML、CSS和JavaScript转换为用户可见页面的过程。

#### 1. 渲染流程
##### 1.1 基本流程
```plaintext
1. 构建DOM树
   - 解析HTML
   - 创建DOM节点
   - 构建DOM树

2. 构建CSSOM树
   - 解析CSS
   - 创建CSSOM节点
   - 构建CSSOM树

3. 构建渲染树
   - 结合DOM和CSSOM
   - 计算样式
   - 构建渲染树

4. 布局（Layout）
   - 计算元素位置
   - 计算元素大小
   - 确定元素位置

5. 绘制（Paint）
   - 填充像素
   - 绘制文本
   - 绘制图像

6. 合成（Composite）
   - 图层合成
   - 显示页面
```

##### 1.2 重排和重绘
```javascript
// 触发重排的操作
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';
element.style.padding = '10px';
element.style.border = '1px solid red';

// 触发重绘的操作
element.style.color = 'red';
element.style.background = 'blue';
element.style.visibility = 'hidden';
element.style.opacity = '0.5';

// 避免重排重绘
element.style.transform = 'translateX(100px)';
element.style.willChange = 'transform';
```

#### 2. 渲染优化
##### 2.1 性能优化
```javascript
// 批量修改DOM
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment);

// 使用requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 使用CSS动画
.element {
  transition: transform 0.3s ease;
}
.element:hover {
  transform: translateX(100px);
}
```

##### 2.2 图层管理
```css
/* 创建新图层 */
.element {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

/* 使用硬件加速 */
.element {
  transform: translate3d(0, 0, 0);
  perspective: 1000px;
}
```

#### 3. 渲染阻塞
##### 3.1 CSS阻塞
```html
<!-- 内联关键CSS -->
<style>
  .critical {
    color: red;
  }
</style>

<!-- 异步加载非关键CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

##### 3.2 JavaScript阻塞
```html
<!-- 异步加载JavaScript -->
<script async src="script.js"></script>

<!-- 延迟加载JavaScript -->
<script defer src="script.js"></script>

<!-- 动态加载JavaScript -->
<script>
  const script = document.createElement('script');
  script.src = 'script.js';
  document.body.appendChild(script);
</script>
```

#### 4. 渲染性能
##### 4.1 性能指标
```javascript
// 测量性能
performance.mark('start');
// 执行操作
performance.mark('end');
performance.measure('operation', 'start', 'end');

// 使用Performance API
const timing = performance.timing;
const loadTime = timing.loadEventEnd - timing.navigationStart;
```

##### 4.2 性能监控
```javascript
// 监控重排重绘
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});
observer.observe({ entryTypes: ['layout-shift', 'paint'] });
```

#### 5. 最佳实践
1. 减少重排重绘
2. 使用CSS动画
3. 批量修改DOM
4. 使用requestAnimationFrame
5. 优化图层管理
6. 减少渲染阻塞
7. 使用硬件加速
8. 优化JavaScript执行
9. 监控渲染性能
10. 实现渐进增强

#### 6. 常见面试题
1. **浏览器渲染流程**
   - DOM树构建
   - CSSOM树构建
   - 渲染树构建
   - 布局和绘制

2. **如何优化渲染性能**
   - 减少重排重绘
   - 使用CSS动画
   - 批量修改DOM
   - 使用requestAnimationFrame

3. **如何处理渲染阻塞**
   - CSS阻塞处理
   - JavaScript阻塞处理
   - 资源加载优化
   - 关键渲染路径优化 