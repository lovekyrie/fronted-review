# 错误监控与前端异常处理

高级前端面试里的错误监控，不应该只停留在“`window.onerror` + 上报接口”。更完整的回答方式是：

`异常采集 -> 上下文补充 -> 去重/采样 -> 上报 -> 聚合告警 -> Source Map 还原 -> 版本关联 -> 排障与回滚`

真正的价值不在“我能采到错误”，而在“我能用这套系统帮助线上治理”。

## 一、前端异常体系要覆盖什么

前端异常至少分四类：

1. **JS 运行时错误**
2. **Promise 未处理异常**
3. **资源加载错误**
4. **框架层错误**

还可以继续扩展到：

- 白屏
- 路由异常
- 接口异常
- 自定义业务异常

如果系统只收集 `window.onerror`，覆盖面是明显不够的。

## 二、常见采集入口

### 1. JS 运行时错误

```js
window.onerror = function (message, source, lineno, colno, error) {
  reportError({
    type: 'js_error',
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
  })
}
```

适合捕获同步执行中的运行时错误。

### 2. Promise 未处理异常

```js
window.addEventListener('unhandledrejection', (event) => {
  reportError({
    type: 'unhandledrejection',
    reason: String(event.reason),
    stack: event.reason?.stack,
  })
})
```

如果只采 `window.onerror`，这类错误会漏掉。

### 3. 资源加载错误

```js
window.addEventListener(
  'error',
  (event) => {
    const target = event.target

    if (target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement) {
      reportError({
        type: 'resource_error',
        tagName: target.tagName,
        url: target.src || target.href,
      })
    }
  },
  true,
)
```

这里通常要用捕获阶段，因为资源错误不会像普通冒泡事件那样好拿。

### 4. 框架层错误

React：

```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    reportError({
      type: 'react_error',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }
}
```

Vue：

```js
app.config.errorHandler = (error, instance, info) => {
  reportError({
    type: 'vue_error',
    message: error.message,
    stack: error.stack,
    info,
  })
}
```

框架层错误的价值在于能补到组件树、组件栈、响应式上下文这些更贴近业务的信息。

## 三、异常上报时除了错误本身，还要带什么

一个真正能用于排障的错误事件，通常至少要带这些上下文：

- 页面 URL
- 路由信息
- 用户标识或匿名 session id
- 浏览器 / 系统 / 设备
- 网络状态
- 构建版本
- commit SHA 或 release id
- 环境标识
- 触发时间

如果这些上下文没有一起上报，后续排障成本会显著变高。

## 四、为什么 Source Map 一定要和版本绑定

线上压缩代码的堆栈通常不可直接阅读：

- 文件名经过 hash
- 行列号是压缩后的产物坐标
- 代码可能被合并、压缩、混淆

Source Map 的作用是把“线上压缩堆栈”映射回“源码位置”。但它只有在下面条件成立时才有用：

1. 这份 Source Map 对应的正是线上正在运行的版本
2. 上报里带了足够准确的 release/version 信息
3. 监控平台能根据版本拿到正确的映射文件

所以面试里更准确的说法不是“上传 Source Map 就行”，而是：**Source Map 必须和构建版本、发布版本、错误事件强绑定。**

## 五、监控系统不能原样上报所有错误

如果一发生异常就无脑上报，监控系统本身会被流量打爆，且对排障没有帮助。

### 1. 去重

同一类错误短时间内可能反复触发。

常见去重维度：

- message
- stack
- 页面
- release

### 2. 采样

并不是每条错误都值得 100% 上报。

常见采样策略：

- 按环境：测试环境全量，生产环境采样
- 按错误类型：致命错误高采样，普通警告低采样
- 按用户或页面：高价值页面更高采样

### 3. 限流

异常风暴时，监控 SDK 自己也要能降级，否则会反过来拖慢业务。

## 六、上报通道怎么设计

### 1. 优先不阻塞主链路

原则是：监控失败不能影响业务。

常见方式：

- `navigator.sendBeacon`
- 异步 `fetch`
- 图片打点降级

```js
navigator.sendBeacon('/monitor', JSON.stringify(payload))
```

### 2. 批量上报

多条事件合并后统一发送：

- 减少请求数
- 降低上报开销
- 便于服务端聚合

### 3. 离线与失败重试

高级一点的监控系统会考虑：

- 上报失败重试
- 本地队列缓存
- 页面关闭前尽力发送

## 七、错误监控和性能监控怎么协同

高级前端面试里，很少只问“采错”，更常问“治理闭环”。

常见协同方式：

- 同一 release 关联错误率和性能指标
- 某次发布后错误率飙升，同时 LCP / INP 恶化
- 某页面错误集中出现，同时接口失败率升高

也就是说，错误监控不是孤立系统，而是可观测性的一部分。

## 八、白屏和“看起来没报错但页面不可用”的问题

很多事故并不表现成明显 JS 异常，而是：

- 页面白屏
- 核心区域空白
- 路由切换失败
- 静态资源 404

所以错误监控还应该补这类探针：

- 根节点是否渲染成功
- 首屏关键内容是否出现
- 路由加载是否超时
- 静态资源加载失败比例

否则你会遇到“用户完全打不开页面，但错误平台没报什么”的情况。

## 九、异常告警不等于异常上报

这是系统治理里很容易混淆的一点。

- **上报**：把事件送到平台
- **聚合**：按版本、页面、错误类型做归并
- **告警**：超过阈值后通知人

告警策略至少要考虑：

- 错误率阈值
- 新版本发布窗口
- 高价值页面单独阈值
- 是否和业务指标联动

否则告警要么太吵，要么完全不敏感。

## 十、高级面试常见追问

### Q1：`window.onerror` 能捕获所有错误吗？

不能。Promise 未处理异常要靠 `unhandledrejection`，资源加载错误要单独监听，框架层错误也需要对应入口。

### Q2：为什么 Source Map 不能直接公开暴露？

因为它可能泄漏源码结构和业务实现细节。更稳的做法是上传到监控平台，按版本授权还原。

### Q3：如何防止监控系统影响主链路？

异步上报、批量、限流、采样、降级开关、失败不阻塞业务。

### Q4：怎么判断一个错误值得告警？

要看错误级别、用户影响范围、页面价值、是否新版本引入、是否和业务损失相关，而不是只看“有没有报错”。

## 十一、面试回答建议

如果被问错误监控，不要只答“我会接 Sentry”。更稳的结构是：

1. 先说异常覆盖面
2. 再说采集、上报、版本映射
3. 再说去重、采样、限流
4. 最后补告警、排障和回滚的闭环

这样答案会从“会接监控 SDK”升级成“理解线上治理体系”。

## 每日练习参考

### Day 75：前端错误分类

| 类型 | 捕获方式 |
|------|----------|
| JS 运行时错误 | `window.onerror` / `window.addEventListener('error')` |
| Promise 未捕获 | `window.addEventListener('unhandledrejection')` |
| 资源加载失败 | `window.addEventListener('error', ..., true)`（捕获阶段） |
| 接口错误 | 请求拦截器（axios interceptor） |
| 白屏 | 定时采样 DOM 节点 / MutationObserver |
| 框架错误 | Vue `errorHandler` / React `ErrorBoundary` |

### Day 75：错误上报设计

```text
1. 捕获：全局监听 + 框架 hook
2. 格式化：错误信息 + 堆栈 + 用户信息 + 页面 URL + 时间 + release 版本
3. 聚合：相同错误 fingerprint 合并，避免重复
4. 采样：非 P0 错误按比例采样（10%-100%）
5. 上报：sendBeacon / fetch keepalive（页面卸载也能发）
6. 消费：日志服务 → 聚合 → 告警 → SourceMap 还原堆栈
```

### Day 75：上报时机

| 方式 | 场景 |
|------|------|
| `navigator.sendBeacon(url, data)` | 页面卸载时（最推荐） |
| `fetch(url, { keepalive: true })` | 替代 sendBeacon |
| 批量缓冲 + 定时上报 | 非紧急日志（降低请求数） |
| 立即上报 | P0 错误（白屏 / 支付失败） |

### Day 75：SourceMap 还原

```text
线上 JS 是压缩的 → 堆栈行号无意义
→ 构建时生成 .map 文件，上传到 Sentry / 日志服务
→ 错误上报时带 release 版本 → 服务端用 source-map 还原真实堆栈
→ .map 文件不发布到 CDN（安全）
```

### Day 75：错误采集链路

```text
浏览器运行
  ├─ window.onerror → JS 错误
  ├─ unhandledrejection → Promise 错误
  ├─ addEventListener('error', capture) → 资源加载错误
  ├─ Vue errorHandler → 组件错误
  └─ axios interceptor → API 错误
       ↓
SDK 格式化
  { message, stack, url, line, col, release, userId, timestamp }
       ↓
聚合 + 采样（fingerprint 去重，10% 采样非 P0）
       ↓
sendBeacon / fetch keepalive
       ↓
日志服务（Elasticsearch / ClickHouse）
       ↓
SourceMap 还原 + 告警（钉钉 / 邮件）
```

### Day 75：简易错误 SDK

```ts
class ErrorTracker {
  private buffer: any[] = []
  private timer: ReturnType<typeof setTimeout> | null = null

  init() {
    window.onerror = (msg, url, line, col, error) => {
      this.report({ type: 'js', message: String(msg), stack: error?.stack, url, line, col })
    }
    window.addEventListener('unhandledrejection', (e) => {
      this.report({ type: 'promise', message: String(e.reason) })
    })
    window.addEventListener('error', (e) => {
      if (e.target && (e.target as any).src) {
        this.report({ type: 'resource', url: (e.target as any).src })
      }
    }, true)
  }

  report(data: Record<string, any>) {
    this.buffer.push({ ...data, timestamp: Date.now(), release: __RELEASE__ })
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), 5000)
    }
  }

  flush() {
    if (this.buffer.length === 0) return
    const payload = JSON.stringify(this.buffer)
    navigator.sendBeacon('/api/logs', payload)
    this.buffer = []
    this.timer = null
  }
}
```
