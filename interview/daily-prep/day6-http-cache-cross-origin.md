# Day 6 HTTP / 缓存 / 跨域 / 存储 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 6 | HTTP / 缓存 / 跨域 / 存储 | [HTTP 协议](../network&broswer/http-protocol)、[缓存机制](../network&broswer/cache-mechanism)、[跨域](../network&broswer/cross-origin)、[浏览器存储](../network&broswer/broswer-storage) |

## 今日目标

- 看完 `/network&broswer/http-protocol`、`/cache-mechanism`、`/cross-origin`、`/broswer-storage`
- 输出一张“从输入 URL 到页面展示”的简版流程图
- 输出一页《缓存答题模板》（强缓存 / 协商缓存 / 资源版本化）

## 阅读卡点

- HTTP/1.1 队头阻塞、HTTP/2 多路复用、HTTP/3 QUIC 解决的是不同层的问题
- 强缓存 `Cache-Control` 优先级高于 `Expires`；协商缓存 `ETag` 优先级高于 `Last-Modified`
- CORS 预检触发条件：非简单请求方法 / 自定义头 / 非简单 Content-Type

## 速记卡 / 知识点

### HTTP 版本差异

| 版本 | 核心特点 | 解决的问题 |
|------|----------|------------|
| HTTP/1.1 | 持久连接、管线化 | 减少 TCP 握手，但存在队头阻塞 |
| HTTP/2 | 多路复用、头压缩 (HPACK)、服务器推送 | 解决应用层队头阻塞 |
| HTTP/3 | QUIC（基于 UDP）、零 RTT 连接 | 解决传输层队头阻塞 |

### 常见状态码

- **200**：成功。**204**：成功无内容。**206**：范围请求。
- **301**：永久重定向。**302**：临时重定向。**304**：未修改（协商缓存命中）。
- **400**：请求错误。**401**：未认证。**403**：禁止。**404**：未找到。
- **500**：服务器内部错误。**502**：网关错误。**504**：网关超时。

### 缓存两层模型

```text
浏览器发起请求
  → 检查强缓存（Cache-Control / Expires）
    → 命中：直接返回 200 (from cache)，不请求服务器
    → 未命中：发起协商缓存请求（带 ETag / Last-Modified）
      → 服务器 304：未修改，用本地缓存
      → 服务器 200：返回新资源
```

| 类型 | 字段 | 优先级 |
|------|------|--------|
| 强缓存 | `Cache-Control: max-age=xxx` | 高于 `Expires` |
| 协商缓存 | `ETag` / `If-None-Match` | 高于 `Last-Modified` |

**工程实践**：HTML 不缓存（`no-cache`），JS/CSS 强缓存 + 文件名带 hash（版本化），图片/字体长缓存。

### CORS 跨域

**简单请求**（不触发预检）：
- 方法：GET / HEAD / POST
- Content-Type：`text/plain` / `multipart/form-data` / `application/x-www-form-urlencoded`
- 无自定义头

**预检请求 (OPTIONS)** 触发条件：非简单方法（PUT / DELETE）、自定义头、`Content-Type: application/json`。

服务器关键响应头：

```text
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### 浏览器存储对比

| 维度 | Cookie | localStorage | sessionStorage | IndexedDB |
|------|--------|-------------|----------------|-----------|
| 大小 | ~4KB | ~5MB | ~5MB | 无硬性上限 |
| 生命周期 | 可设过期 | 永久 | 会话级 | 永久 |
| 随请求发送 | 是 | 否 | 否 | 否 |
| 适用 | 身份/跟踪 | 用户偏好 | 临时状态 | 大量结构化数据 |

Cookie 安全：`HttpOnly`（禁 JS 读取）、`Secure`（仅 HTTPS）、`SameSite`（Lax / Strict / None+Secure）。

## 手写 / 流程图

### 从输入 URL 到页面展示

```text
1. 用户输入 URL
2. DNS 解析（浏览器缓存 → OS 缓存 → hosts → 递归查询）
3. TCP 三次握手 + TLS 握手（HTTPS）
4. 发送 HTTP 请求
5. 服务器处理并返回响应
6. 浏览器解析 HTML → 构建 DOM Tree
7. 解析 CSS → 构建 CSSOM
8. DOM + CSSOM → Render Tree
9. Layout（计算几何信息）
10. Paint（绘制像素）
11. Composite（合成图层，展示页面）
```

### 缓存决策流程图

```text
请求资源
  ├─ Cache-Control: max-age 未过期？
  │    └─ 是 → 200 (from disk/memory cache)
  │    └─ 否 → 带 If-None-Match (ETag) 请求服务器
  │              ├─ 资源未变 → 304 Not Modified
  │              └─ 资源已变 → 200 + 新资源
  └─ 无缓存头 → 正常请求 200
```

## 口述题

### 1. 强缓存和协商缓存怎么搭配？

回答模板：

> 缓存分两层。第一层是强缓存，通过 `Cache-Control: max-age` 控制，在有效期内浏览器直接用本地缓存，不会请求服务器，性能最好。`Expires` 也能做强缓存但优先级低于 `Cache-Control`，且依赖客户端时间。
>
> 第二层是协商缓存，强缓存失效后触发。浏览器带上 `If-None-Match`（对应 ETag）或 `If-Modified-Since`（对应 Last-Modified）请求服务器。如果资源未变，服务器返回 304，浏览器继续用本地缓存。ETag 优先级高于 Last-Modified，因为它基于内容哈希更精确。
>
> 工程实践上，HTML 入口文件设 `no-cache`（每次协商），JS/CSS 用强缓存 + 文件名带 content hash（内容变了 hash 变，URL 就变，绕过旧缓存），图片和字体用长缓存。

### 2. 预检请求什么时候触发？

回答模板：

> CORS 中把请求分为简单请求和非简单请求。简单请求只需要服务器返回 `Access-Control-Allow-Origin` 就行。非简单请求会先发一个 OPTIONS 预检请求。
>
> 触发预检的条件有三类：一是请求方法不是 GET / HEAD / POST；二是有自定义请求头（比如 `Authorization`、`X-Token`）；三是 Content-Type 不属于 `text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded`，最常见就是 `application/json`。
>
> 预检请求的响应需要包含 `Access-Control-Allow-Methods`、`Access-Control-Allow-Headers` 等。可以通过 `Access-Control-Max-Age` 设置预检缓存时间，避免每次都发 OPTIONS。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. HTTP 版本差异（1.1 队头阻塞 → 2 多路复用 → 3 QUIC）（1.5 分钟）
2. 缓存两层模型 + 版本化策略（2 分钟）
3. CORS 简单/预检请求 + 触发条件（1.5 分钟）

录完后自查：

- 是否说出强缓存和协商缓存的优先级关系。
- 是否说出 ETag 优先于 Last-Modified。
- 是否说出预检请求的 3 个触发条件。
- 是否说出 HTML no-cache + JS/CSS hash 的工程实践。

## 今日复盘

今天最需要回补的 3 个点：

1. HTTP/2 多路复用的具体实现（帧、流、二进制分帧层）。
2. `SameSite` 三个值的区别及对第三方 Cookie 的影响。
3. Service Worker 与 HTTP 缓存的交互顺序。
