### HTML5 新特性
HTML5引入了许多新的元素、属性和API，使Web开发更加强大和灵活。

#### 1. 语义化标签
##### 1.1 文档结构标签
```html
<header>头部区域</header>
<nav>导航区域</nav>
<main>主要内容区域</main>
<article>文章内容</article>
<section>区块</section>
<aside>侧边栏</aside>
<footer>底部区域</footer>
```

##### 1.2 文本语义标签
```html
<mark>标记文本</mark>
<time>时间</time>
<figure>
  <img src="image.jpg" alt="图片">
  <figcaption>图片说明</figcaption>
</figure>
<details>
  <summary>可折叠内容</summary>
  <p>详细内容</p>
</details>
```

#### 2. 表单增强
##### 2.1 新的输入类型
```html
<input type="email" placeholder="邮箱">
<input type="url" placeholder="网址">
<input type="number" min="0" max="100">
<input type="range" min="0" max="100">
<input type="date">
<input type="time">
<input type="color">
<input type="search" placeholder="搜索">
```

##### 2.2 表单属性
```html
<input type="text" required>
<input type="text" pattern="[A-Za-z]{3}">
<input type="text" placeholder="请输入">
<input type="text" autofocus>
<input type="text" autocomplete="on">
<input type="text" list="suggestions">
<datalist id="suggestions">
  <option value="建议1">
  <option value="建议2">
</datalist>
```

#### 3. 多媒体
##### 3.1 音频
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频播放
</audio>
```

##### 3.2 视频
```html
<video controls width="320" height="240">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放
</video>
```

#### 4. Canvas
```html
<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);

// 绘制圆形
ctx.beginPath();
ctx.arc(150, 150, 50, 0, Math.PI * 2);
ctx.fillStyle = 'blue';
ctx.fill();
</script>
```

#### 5. SVG
```html
<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="red"/>
  <rect x="50" y="50" width="100" height="100" fill="blue"/>
  <line x1="0" y1="0" x2="200" y2="200" stroke="black"/>
</svg>
```

#### 6. Web Storage
##### 6.1 localStorage
```javascript
// 存储数据
localStorage.setItem('username', 'John');
localStorage.setItem('age', '30');

// 获取数据
const username = localStorage.getItem('username');
const age = localStorage.getItem('age');

// 删除数据
localStorage.removeItem('username');

// 清空所有数据
localStorage.clear();
```

##### 6.2 sessionStorage
```javascript
// 存储数据
sessionStorage.setItem('token', 'abc123');

// 获取数据
const token = sessionStorage.getItem('token');

// 删除数据
sessionStorage.removeItem('token');
```

#### 7. Web Workers
```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage('开始计算');
worker.onmessage = function(e) {
  console.log('计算结果：', e.data);
};

// worker.js
self.onmessage = function(e) {
  const result = heavyComputation();
  self.postMessage(result);
};
```

#### 8. WebSocket
```javascript
const socket = new WebSocket('ws://example.com/socket');

socket.onopen = function() {
  console.log('连接已建立');
  socket.send('Hello Server!');
};

socket.onmessage = function(e) {
  console.log('收到消息：', e.data);
};

socket.onclose = function() {
  console.log('连接已关闭');
};
```

#### 9. 拖放API
```html
<div draggable="true" id="draggable">可拖拽元素</div>
<div id="droppable">放置区域</div>

<script>
const draggable = document.getElementById('draggable');
const droppable = document.getElementById('droppable');

draggable.ondragstart = function(e) {
  e.dataTransfer.setData('text', e.target.id);
};

droppable.ondragover = function(e) {
  e.preventDefault();
};

droppable.ondrop = function(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  e.target.appendChild(document.getElementById(data));
};
</script>
```

#### 10. 地理定位
```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      console.log('纬度：', position.coords.latitude);
      console.log('经度：', position.coords.longitude);
    },
    function(error) {
      console.error('获取位置失败：', error.message);
    }
  );
}
```

#### 11. 最佳实践
1. 使用语义化标签提高可读性
2. 使用新的表单类型和属性增强用户体验
3. 使用Canvas和SVG进行图形绘制
4. 使用Web Storage存储数据
5. 使用Web Workers处理复杂计算
6. 使用WebSocket实现实时通信
7. 使用拖放API实现交互功能
8. 使用地理定位获取位置信息
9. 使用多媒体标签播放音视频
10. 使用新的API增强功能

#### 12. 常见面试题
1. **HTML5新特性有哪些？**
   - 语义化标签
   - 表单增强
   - 多媒体支持
   - Canvas和SVG
   - Web Storage
   - Web Workers
   - WebSocket
   - 拖放API
   - 地理定位

2. **localStorage和sessionStorage的区别**
   - localStorage数据永久保存
   - sessionStorage数据会话结束即清除
   - 存储容量不同
   - 作用域不同

3. **Canvas和SVG的区别**
   - Canvas是位图，SVG是矢量图
   - Canvas适合游戏和动画
   - SVG适合图标和图表
   - Canvas性能更好
   - SVG可缩放不失真 