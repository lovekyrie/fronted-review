# 性能监控与前端异常处理

## 一、错误采集体系

### 1) JS 运行时错误

- `window.onerror`：捕获同步错误。
- `window.addEventListener('unhandledrejection')`：捕获 Promise 未处理异常。
- `try...catch`：包裹关键业务逻辑。

### 2) 框架层错误

- React：`ErrorBoundary` 捕获渲染树错误。
- Vue：`app.config.errorHandler` 统一处理。

## 二、上报策略

- 上报字段：错误信息、堆栈、页面 URL、用户 ID、版本号、设备信息。
- 去重与采样：防止同类错误雪崩上报。
- 异常上报通道：优先异步、失败重试、离线队列。

## 三、SourceMap 还原原理

- 线上代码通常压缩混淆，堆栈不可读。
- 错误平台拿到压缩堆栈后，结合对应版本 SourceMap 反查原始源码位置。
- 关键点：SourceMap 要和构建版本强绑定。

## 四、面试易问

### Q1：`window.onerror` 能捕获所有错误吗？

不能。异步 Promise 错误需 `unhandledrejection`，资源加载错误也要单独监听。

### Q2：如何防止监控系统影响业务？

采样、限流、批量上报、降级开关，保证监控失败不影响主链路。
