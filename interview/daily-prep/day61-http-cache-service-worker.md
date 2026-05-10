# Day 61 HTTP 缓存 + Service Worker 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 61 | 缓存 + SW | [缓存机制](../network&broswer/cache-mechanism)、[浏览器存储](../network&broswer/broswer-storage) |

## 今日目标

- 看完 MDN HTTP Caching + Service Worker API
- 画一张“浏览器 → Service Worker → HTTP 缓存 → 网络”的请求链路
- 输出 Service Worker 三种常见策略：Cache First / Network First / Stale While Revalidate

## 阅读卡点

- SW 是请求代理，可以拦截 fetch 并决定走网络还是走 Cache API
- SW 更新机制：install → waiting → activate，强刷不会立即替换老 SW
- `Cache-Control: no-cache` 并不是“不缓存”，是“每次协商”；`no-store` 才是完全不缓存

## 速记卡 / 知识点

<!-- SW 生命周期 / 三种缓存策略 / Cache API / 离线能力边界 -->

## 手写 / 流程图

```js
self.addEventListener('fetch', e => {
  // Cache First: caches.match(e.request) || fetch(e.request)
})
```

## 口述题

### 1. Service Worker 常见三种缓存策略怎么选？

> 回答模板：

### 2. `no-cache` 和 `no-store` 区别？

> 回答模板：

## 5 分钟录音顺序

1. 请求链路（1.5 分钟）
2. SW 生命周期（2 分钟）
3. 三种策略适用场景（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
