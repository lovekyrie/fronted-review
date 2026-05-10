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

<!-- HTTP 方法 / 状态码 / 缓存两层模型 / CORS / Cookie SameSite / Storage 差异 -->

## 手写 / 流程图

```text
URL → DNS → TCP/TLS → HTTP → 解析 → 渲染
```

## 口述题

### 1. 强缓存和协商缓存怎么搭配？

> 回答模板：

### 2. 预检请求什么时候触发？

> 回答模板：

## 5 分钟录音顺序

1. HTTP 协议与版本差异（1.5 分钟）
2. 缓存两层模型 + 版本化策略（2 分钟）
3. CORS 流程（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
