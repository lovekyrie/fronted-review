### 浏览器缓存机制
浏览器缓存分为强缓存和协商缓存，用于提高网页加载速度和减少服务器压力。

#### 1. 强缓存
##### 1.1 基本概念
```http
# 强缓存响应头
Cache-Control: max-age=31536000
Expires: Wed, 21 Oct 2023 07:28:00 GMT
```

##### 1.2 缓存控制
```http
# 禁止缓存
Cache-Control: no-store

# 强制验证
Cache-Control: no-cache

# 私有缓存
Cache-Control: private

# 公共缓存
Cache-Control: public

# 最大过期时间
Cache-Control: max-age=3600

# 共享最大过期时间
Cache-Control: s-maxage=3600
```

#### 2. 协商缓存
##### 2.1 基本概念
```http
# 请求头
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 响应头
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

##### 2.2 验证过程
```http
# 第一次请求
GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Content-Length: 1234

# 第二次请求
GET /index.html HTTP/1.1
Host: example.com
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

HTTP/1.1 304 Not Modified
```

#### 3. 缓存流程
##### 3.1 强缓存流程
```plaintext
1. 浏览器发起请求
2. 检查强缓存是否过期
   - 未过期：直接使用缓存
   - 已过期：进入协商缓存
3. 返回缓存内容
```

##### 3.2 协商缓存流程
```plaintext
1. 浏览器发起请求
2. 检查协商缓存
   - 资源未修改：返回304
   - 资源已修改：返回200和新资源
3. 更新缓存
```

#### 4. 缓存策略
##### 4.1 静态资源
```http
# HTML文件
Cache-Control: no-cache

# CSS/JS文件
Cache-Control: max-age=31536000

# 图片文件
Cache-Control: max-age=31536000
```

##### 4.2 动态资源
```http
# API响应
Cache-Control: no-store

# 用户数据
Cache-Control: private, no-cache
```

#### 5. 最佳实践
1. 合理设置缓存时间
2. 使用版本号或哈希
3. 区分静态和动态资源
4. 实现缓存更新机制
5. 处理缓存失效
6. 考虑CDN缓存
7. 监控缓存命中率
8. 优化缓存策略
9. 处理缓存冲突
10. 实现缓存预热

#### 6. 常见面试题
1. **强缓存和协商缓存的区别**
   - 验证方式
   - 响应状态
   - 使用场景
   - 性能影响

2. **如何选择合适的缓存策略**
   - 资源类型
   - 更新频率
   - 用户需求
   - 服务器负载

3. **如何处理缓存问题**
   - 缓存穿透
   - 缓存击穿
   - 缓存雪崩
   - 缓存更新 

#### 7. 高频补充：Cache-Control 易混指令

- `no-store`：完全不缓存（最严格）。
- `no-cache`：可以缓存，但使用前必须向服务器再验证。
- `max-age=0`：通常等价于“立刻过期，需要再验证”。
- `immutable`：资源在过期前保证不变（常配合带 hash 的静态资源）。

```http
Cache-Control: public, max-age=31536000, immutable
```

#### 8. 高频补充：前端发布缓存策略（强烈建议掌握）

1. **HTML**：`no-cache`（保证拿到最新入口）。
2. **JS/CSS/图片**：文件名带 content hash + 长缓存（`max-age=31536000, immutable`）。
3. **接口数据**：按业务敏感度决定 `no-store` / `private, no-cache`。

#### 9. 高频补充：浏览器缓存位置

- Memory Cache：读取最快，生命周期短。
- Disk Cache：可跨进程/重启持久化。
- Service Worker Cache：可编程缓存，适合离线与精细化策略。

> 面试可补一句：浏览器到底命中哪层缓存由实现策略决定，前端主要通过响应头影响缓存行为。

## 每日练习参考

### Day 61：HTTP 缓存体系

| 类型 | 头部 | 行为 |
|------|------|------|
| **强缓存** | `Cache-Control: max-age=31536000` | 不发请求，直接用本地缓存 |
| **协商缓存** | `ETag` / `If-None-Match` | 发请求，服务器返回 304 或新内容 |
| | `Last-Modified` / `If-Modified-Since` | 同上（精度低，秒级） |

### Day 61：Cache-Control 常见值

| 值 | 含义 |
|----|------|
| `max-age=N` | 缓存 N 秒内有效 |
| `no-cache` | **每次都协商**（不是不缓存！） |
| `no-store` | **完全不缓存** |
| `immutable` | 缓存期内不协商（配合 hash 文件名） |
| `s-maxage=N` | CDN 缓存时间（覆盖 max-age） |
| `stale-while-revalidate=N` | 过期后先返回旧缓存，后台更新 |

### Day 61：最佳实践：HTML + 静态资源分策略

```text
HTML:       Cache-Control: no-cache（每次协商，保证拿到最新入口）
JS/CSS/IMG: Cache-Control: max-age=31536000, immutable（长期缓存 + 文件名带 hash）
API:        Cache-Control: no-store 或 max-age=0, must-revalidate
```

### Day 61：Service Worker 生命周期

```text
register → install（下载缓存资源）→ waiting（等旧 SW 释放）→ activate（清理旧缓存）→ fetch（拦截请求）
```

- **install**：预缓存静态资源（`caches.open + cache.addAll`）。
- **waiting**：新 SW 安装后不会立即接管，要等所有旧页面关闭。`skipWaiting()` 可跳过。
- **activate**：清理旧版本缓存。`clients.claim()` 立即接管。

### Day 61：三种缓存策略

| 策略 | 行为 | 适用 |
|------|------|------|
| **Cache First** | 先查缓存，没有再走网络 | 静态资源、字体、图片 |
| **Network First** | 先走网络，失败用缓存 | API、HTML |
| **Stale While Revalidate** | 先返回缓存，同时后台更新 | 不太关键但需要最终一致的资源 |

### Day 61：请求链路

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

### Day 61：三种策略实现

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

### Day 6：缓存两层模型

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

### Day 6：缓存决策流程图

```text
请求资源
  ├─ Cache-Control: max-age 未过期？
  │    └─ 是 → 200 (from disk/memory cache)
  │    └─ 否 → 带 If-None-Match (ETag) 请求服务器
  │              ├─ 资源未变 → 304 Not Modified
  │              └─ 资源已变 → 200 + 新资源
  └─ 无缓存头 → 正常请求 200
```
