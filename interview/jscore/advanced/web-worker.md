# Web Worker

## 1. 背景：JS 单线程的局限

JavaScript 语言的核心特点是**单线程**。这意味着所有任务都需要排队执行。如果有一个任务（如复杂的图像处理、大数组排序）耗时很长，就会阻塞主线程，导致 UI 渲染卡顿，给用户造成“死机”的感觉。

**Web Worker** 的作用就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。

## 2. 基本使用

### 主线程
```javascript
// 1. 创建 Worker
var worker = new Worker('work.js');

// 2. 向 Worker 发送消息
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']});

// 3. 接收 Worker 发回的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  // 使用完后关闭
  // worker.terminate();
}
```

### Worker 线程 (work.js)
```javascript
// 1. 监听主线程消息
self.addEventListener('message', function (e) {
  // 2. 处理业务逻辑
  var data = e.data;
  
  // 3. 发回消息
  self.postMessage('You said: ' + data);
}, false);
```

## 3. 核心限制（面试考点）

虽然 Worker 开启了新线程，但它受限于主线程，并不是完全独立的：

1.  **同源限制**：分配给 Worker 运行的脚本文件，必须与主线程的脚本文件同源。
2.  **DOM 限制**：Worker 线程所在的全局对象，与主线程不一样，**无法读取主线程所在网页的 DOM 对象**，无法使用 `document`、`window`、`parent` 这些对象。
3.  **通信联系**：Worker 线程和主线程不在同一个上下文环境，它们不能直接共享数据，必须通过消息完成（`postMessage`）。
4.  **脚本限制**：Worker 线程不能执行 `alert()` 方法和 `confirm()` 方法，但可以使用 `XMLHttpRequest` 对象发出 AJAX 请求。
5.  **文件限制**：Worker 线程无法读取本地文件（`file://`），它所加载的脚本，必须来自网络。

## 4. 适用场景

*   **密集型数学计算**：大数据集合的排序、过滤、分析。
*   **图像处理**：Canvas 像素级操作、图片滤镜、压缩。
*   **大文件上传**：在后台进行文件切片、Hash 计算。

