# Day 75 监控 / 错误追踪 / 可观测性 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 75 | 监控 / 可观测性 | [错误监控](../network&broswer/error-monitoring)、[可观测性](../network&broswer/observability-system) |

## 今日目标

- 看完 `/network&broswer/error-monitoring`、`/observability-system`
- 输出前端可观测性三柱：日志 / 指标 / 链路（Logs / Metrics / Traces）
- 画一张错误上报链路图：捕获 → 聚合 → 上报 → 消费

## 阅读卡点

- 前端错误来源：JS error、Promise rejection、资源加载失败、接口错误、白屏
- 上报时机要用 `sendBeacon` / `fetch keepalive`，避免卸载时丢失
- 日志要带 release 版本和 sourcemap，否则线上堆栈无意义

## 速记卡 / 知识点

### 可观测性三柱

| 柱 | 含义 | 前端工具 |
|----|------|----------|
| **Logs** | 错误日志、用户行为日志 | Sentry / 自建 SDK |
| **Metrics** | 性能指标、业务指标 | web-vitals / PerformanceObserver |
| **Traces** | 请求链路追踪 | 分布式 trace-id（前后端串联） |

### 前端错误分类

| 类型 | 捕获方式 |
|------|----------|
| JS 运行时错误 | `window.onerror` / `window.addEventListener('error')` |
| Promise 未捕获 | `window.addEventListener('unhandledrejection')` |
| 资源加载失败 | `window.addEventListener('error', ..., true)`（捕获阶段） |
| 接口错误 | 请求拦截器（axios interceptor） |
| 白屏 | 定时采样 DOM 节点 / MutationObserver |
| 框架错误 | Vue `errorHandler` / React `ErrorBoundary` |

### 错误上报设计

```text
1. 捕获：全局监听 + 框架 hook
2. 格式化：错误信息 + 堆栈 + 用户信息 + 页面 URL + 时间 + release 版本
3. 聚合：相同错误 fingerprint 合并，避免重复
4. 采样：非 P0 错误按比例采样（10%-100%）
5. 上报：sendBeacon / fetch keepalive（页面卸载也能发）
6. 消费：日志服务 → 聚合 → 告警 → SourceMap 还原堆栈
```

### 上报时机

| 方式 | 场景 |
|------|------|
| `navigator.sendBeacon(url, data)` | 页面卸载时（最推荐） |
| `fetch(url, { keepalive: true })` | 替代 sendBeacon |
| 批量缓冲 + 定时上报 | 非紧急日志（降低请求数） |
| 立即上报 | P0 错误（白屏 / 支付失败） |

### SourceMap 还原

```text
线上 JS 是压缩的 → 堆栈行号无意义
→ 构建时生成 .map 文件，上传到 Sentry / 日志服务
→ 错误上报时带 release 版本 → 服务端用 source-map 还原真实堆栈
→ .map 文件不发布到 CDN（安全）
```

## 手写 / 流程图

### 错误采集链路

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

### 简易错误 SDK

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

## 口述题

### 1. 前端可观测性你会怎么分层？

回答模板：

> 三柱。**Logs**——错误日志 + 用户行为日志。JS 错误、Promise 未捕获、资源加载失败、接口错误，用全局监听 + 框架 hook 捕获，sendBeacon 上报到 Sentry 或自建日志服务。**Metrics**——性能指标（LCP/INP/CLS）用 web-vitals 采集，业务指标（PV/UV/转化率）用埋点。**Traces**——前后端用同一个 trace-id 串联请求链路，方便排查跨服务问题。
>
> 关键是要有完整的消费链路：采集 → 聚合 → 告警 → 排查。只采集不看等于没做。

### 2. 白屏怎么监控？

回答模板：

> 三种方案。第一，**定时采样 DOM**——页面加载后 3-5 秒，检查 body 下是否有有效子节点（排除空 div）。如果没有就认为白屏，上报。第二，**MutationObserver**——监听 DOM 变化，如果长时间没有新节点插入就触发白屏告警。第三，**LCP + 兜底**——如果 LCP 超过 10 秒还没上报，大概率是白屏。
>
> 实际项目中最常用第一种：在 `DOMContentLoaded` 后定时检查关键 DOM 元素是否存在。比如 SPA 的根节点 `#app` 下有没有真实内容。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 可观测性三柱（Logs / Metrics / Traces）（1.5 分钟）
2. 错误采集链路（捕获 → 格式化 → 聚合 → 上报 → SourceMap 还原）（2 分钟）
3. 性能指标采集 + 白屏监控 + 告警策略（1.5 分钟）

录完后自查：

- 是否说出错误的 5 种来源和捕获方式。
- 是否说出 sendBeacon 的优势。
- 是否说出 SourceMap 还原的流程。
- 是否说出白屏监控的方案。

## 今日复盘

今天最需要回补的 3 个点：

1. 采样策略的设计（P0 错误 100% 上报，P1 按 10% 采样）。
2. 用户行为回放（rrweb）的原理和应用。
3. 前端 APM（Application Performance Monitoring）与后端 APM 的串联。
