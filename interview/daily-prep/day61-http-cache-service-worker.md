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

### HTTP 缓存体系

| 类型 | 头部 | 行为 |
|------|------|------|
| **强缓存** | `Cache-Control: max-age=31536000` | 不发请求，直接用本地缓存 |
| **协商缓存** | `ETag` / `If-None-Match` | 发请求，服务器返回 304 或新内容 |
| | `Last-Modified` / `If-Modified-Since` | 同上（精度低，秒级） |

### Cache-Control 常见值

| 值 | 含义 |
|----|------|
| `max-age=N` | 缓存 N 秒内有效 |
| `no-cache` | **每次都协商**（不是不缓存！） |
| `no-store` | **完全不缓存** |
| `immutable` | 缓存期内不协商（配合 hash 文件名） |
| `s-maxage=N` | CDN 缓存时间（覆盖 max-age） |
| `stale-while-revalidate=N` | 过期后先返回旧缓存，后台更新 |

### 最佳实践：HTML + 静态资源分策略

```text
HTML:       Cache-Control: no-cache（每次协商，保证拿到最新入口）
JS/CSS/IMG: Cache-Control: max-age=31536000, immutable（长期缓存 + 文件名带 hash）
API:        Cache-Control: no-store 或 max-age=0, must-revalidate
```

### Service Worker 生命周期

```text
register → install（下载缓存资源）→ waiting（等旧 SW 释放）→ activate（清理旧缓存）→ fetch（拦截请求）
```

- **install**：预缓存静态资源（`caches.open + cache.addAll`）。
- **waiting**：新 SW 安装后不会立即接管，要等所有旧页面关闭。`skipWaiting()` 可跳过。
- **activate**：清理旧版本缓存。`clients.claim()` 立即接管。

### 三种缓存策略

| 策略 | 行为 | 适用 |
|------|------|------|
| **Cache First** | 先查缓存，没有再走网络 | 静态资源、字体、图片 |
| **Network First** | 先走网络，失败用缓存 | API、HTML |
| **Stale While Revalidate** | 先返回缓存，同时后台更新 | 不太关键但需要最终一致的资源 |

## 手写 / 流程图

### 请求链路

```text
浏览器发起请求
  → Service Worker 拦截（fetch event）
    → 命中 SW 缓存？→ 返回缓存
    → 未命中 → 发到网络
      → HTTP 强缓存命中（max-age 未过期）？→ 返回 disk/memory cache
      → 过期 → 发到服务器
        → 协商缓存命中（304）？→ 返回本地缓存
        → 未命中 → 返回新资源（200）
```

### 三种策略实现

```js
// Cache First
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const clone = res.clone()
        caches.open('v1').then(cache => cache.put(e.request, clone))
        return res
      })
    )
  )
})

// Network First
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open('v1').then(cache => cache.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})

// Stale While Revalidate
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        caches.open('v1').then(cache => cache.put(e.request, res.clone()))
        return res
      })
      return cached || fetchPromise
    })
  )
})
```

## 口述题

### 1. Service Worker 常见三种缓存策略怎么选？

回答模板：

> 看资源的"新鲜度要求"。静态资源（JS/CSS/图片）用 **Cache First**——它们文件名带 hash，不会变，命中缓存直接返回最快。API 和 HTML 用 **Network First**——优先拿最新数据，网络不可用时降级到缓存，保证离线可用。介于两者之间的（比如用户头像、不常变的配置）用 **Stale While Revalidate**——先给旧的保证响应速度，同时后台静默更新，下次就是新的了。
>
> 实际项目中推荐用 Workbox 库，它封装好了这些策略，配置式使用。

### 2. `no-cache` 和 `no-store` 区别？

回答模板：

> `no-cache` 的意思不是"不缓存"，而是"可以缓存，但每次使用前必须和服务器协商验证"。浏览器会保存资源，但下次请求会带 `If-None-Match` / `If-Modified-Since` 去问服务器，服务器说没变就返回 304 用缓存，变了就返回新资源。
>
> `no-store` 才是"完全不缓存"——浏览器不保存任何副本，每次都重新下载。适合敏感数据（银行页面、密码相关 API）。日常开发中 HTML 用 `no-cache`（协商保证最新），敏感 API 用 `no-store`。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 请求链路（浏览器 → SW → HTTP 缓存 → 网络）+ 强缓存/协商缓存区别（1.5 分钟）
2. SW 生命周期（install → waiting → activate）+ skipWaiting/claim（2 分钟）
3. 三种缓存策略（Cache First / Network First / SWR）+ 适用场景（1.5 分钟）

录完后自查：

- 是否说出 no-cache ≠ 不缓存。
- 是否说出 SW 的 waiting 阶段和 skipWaiting。
- 是否说出三种策略各自适用的资源类型。
- 是否说出 HTML 用 no-cache + 静态资源用长期缓存 + hash。

## 今日复盘

今天最需要回补的 3 个点：

1. `stale-while-revalidate` HTTP 头部（和 SW 策略同名但层级不同）。
2. SW 更新时的"等旧页面关闭"问题（以及 `skipWaiting` 的风险）。
3. Cache API 和浏览器 HTTP 缓存的关系（两层独立缓存）。
