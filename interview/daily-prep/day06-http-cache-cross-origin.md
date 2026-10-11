# Day 6 HTTP / 缓存 / 跨域 / 存储

## 今日目标

- 看完 `/network&broswer/http-protocol`、`/cache-mechanism`、`/cross-origin`、`/broswer-storage`
- 输出一张“从输入 URL 到页面展示”的简版流程图
- 输出一页《缓存答题模板》（强缓存 / 协商缓存 / 资源版本化）

## 按顺序阅读

1. [HTTP 协议](../network&broswer/http-protocol)
2. [缓存机制](../network&broswer/cache-mechanism)
3. [跨域](../network&broswer/cross-origin)
4. [浏览器存储](../network&broswer/broswer-storage)

## 实操与自测

**检查点**

- HTTP/1.1 队头阻塞、HTTP/2 多路复用、HTTP/3 QUIC 解决的是不同层的问题
- 强缓存 `Cache-Control` 优先级高于 `Expires`；协商缓存 `ETag` 优先级高于 `Last-Modified`
- CORS 预检触发条件：非简单请求方法 / 自定义头 / 非简单 Content-Type

**先独立完成，再对照专题**

- HTTP 版本差异 — [参考章节](../network&broswer/http-protocol#day-6-http-版本差异)
- 常见状态码 — [参考章节](../network&broswer/http-protocol#day-6-常见状态码)
- 缓存两层模型 — [参考章节](../network&broswer/cache-mechanism#day-6-缓存两层模型)
- CORS 跨域 — [参考章节](../network&broswer/cross-origin#day-6-cors-跨域)
- 浏览器存储对比 — [参考章节](../network&broswer/broswer-storage#day-6-浏览器存储对比)
- 从输入 URL 到页面展示 — [参考章节](../network&broswer/http-protocol#day-6-从输入-url-到页面展示)
- 缓存决策流程图 — [参考章节](../network&broswer/cache-mechanism#day-6-缓存决策流程图)

**脱稿口述题**

- 1. 强缓存和协商缓存怎么搭配？
- 2. 预检请求什么时候触发？

**录音练习**

按这个顺序录，不要临场重新组织：

1. HTTP 版本差异（1.1 队头阻塞 → 2 多路复用 → 3 QUIC）（1.5 分钟）
2. 缓存两层模型 + 版本化策略（2 分钟）
3. CORS 简单/预检请求 + 触发条件（1.5 分钟）

录完后自查：

- 是否说出强缓存和协商缓存的优先级关系。
- 是否说出 ETag 优先于 Last-Modified。
- 是否说出预检请求的 3 个触发条件。
- 是否说出 HTML no-cache + JS/CSS hash 的工程实践。

## 复盘

今天最需要回补的 3 个点：

1. HTTP/2 多路复用的具体实现（帧、流、二进制分帧层）。
2. `SameSite` 三个值的区别及对第三方 Cookie 的影响。
3. Service Worker 与 HTTP 缓存的交互顺序。
