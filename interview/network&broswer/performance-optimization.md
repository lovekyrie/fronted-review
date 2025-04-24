### 性能优化
Web性能优化是提高网站加载速度和用户体验的关键。

#### 1. 资源加载优化
##### 1.1 图片优化
```javascript
// 图片懒加载
<img data-src="image.jpg" class="lazy" alt="Lazy Image">

// 实现懒加载
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img.lazy');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
});

// 图片压缩
// 使用WebP格式
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Fallback Image">
</picture>
```

##### 1.2 资源压缩
```javascript
// Gzip压缩
// Nginx配置
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

// 代码分割
// webpack配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
};
```

#### 2. 渲染优化
##### 2.1 CSS优化
```css
/* 避免重排重绘 */
.element {
  transform: translateX(100px); /* 使用transform代替left */
  will-change: transform; /* 提示浏览器优化 */
}

/* 使用CSS动画代替JavaScript动画 */
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

.element {
  animation: slide 1s ease-in-out;
}
```

##### 2.2 JavaScript优化
```javascript
// 防抖
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 节流
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用Web Workers
const worker = new Worker('worker.js');
worker.postMessage({ data: 'process' });
worker.onmessage = (e) => console.log(e.data);
```

#### 3. 缓存优化
##### 3.1 浏览器缓存
```http
# 强缓存
Cache-Control: max-age=31536000
Expires: Wed, 21 Oct 2023 07:28:00 GMT

# 协商缓存
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

##### 3.2 应用缓存
```javascript
// Service Worker缓存
// 注册Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// 缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

#### 4. 网络优化
##### 4.1 HTTP优化
```javascript
// 使用HTTP/2
// Nginx配置
listen 443 ssl http2;

// 使用CDN
// 配置CDN域名
const cdnUrl = 'https://cdn.example.com';
const imageUrl = `${cdnUrl}/images/logo.png`;
```

##### 4.2 预加载
```html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="critical.js" as="script">

<!-- 预连接 -->
<link rel="preconnect" href="https://api.example.com">

<!-- 预获取 -->
<link rel="prefetch" href="next-page.html">
```

#### 5. 代码优化
##### 5.1 代码分割
```javascript
// 动态导入
const module = await import('./module.js');

// 路由分割
const routes = [
  {
    path: '/dashboard',
    component: () => import('./Dashboard.vue')
  }
];
```

##### 5.2 代码压缩
```javascript
// 使用Terser压缩
// webpack配置
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
```

#### 6. 最佳实践
1. 减少HTTP请求
2. 使用CDN
3. 启用压缩
4. 优化图片
5. 使用缓存
6. 代码分割
7. 延迟加载
8. 优化CSS
9. 优化JavaScript
10. 监控性能

#### 7. 常见面试题
1. **性能优化指标**
   - 首屏加载时间
   - 页面加载时间
   - 资源加载时间
   - 交互响应时间

2. **如何优化首屏加载**
   - 资源预加载
   - 代码分割
   - 懒加载
   - 服务端渲染

3. **如何监控性能**
   - 性能指标
   - 监控工具
   - 性能分析
   - 优化策略 