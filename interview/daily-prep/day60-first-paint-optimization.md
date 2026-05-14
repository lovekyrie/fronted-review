# Day 60 首屏性能优化 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 60 | 首屏优化 | [性能优化](../advanced/week6/performance-optimization)、[Web Vitals](../network&broswer/web-vitals) |

## 今日目标

- 看完 web.dev Optimize LCP
- 输出首屏优化 checklist：网络层 / 资源层 / 渲染层 / 运行时
- 画一张 SPA 首屏瀑布流，标注可优化阶段

## 阅读卡点

- 首屏关键资源：HTML → 关键 CSS → 关键 JS → 首屏数据 → 首屏图
- 接口提前：`<link rel="preconnect">` + `<link rel="preload">` + SSR/骨架屏
- 业务层优化：接口合并、字段瘦身、按需取数、图片格式（WebP / AVIF）

## 速记卡 / 知识点

### 首屏优化 4 层

| 层 | 优化方向 | 关键措施 |
|----|----------|----------|
| **网络层** | 减少请求 + 加速传输 | HTTP/2 / CDN / gzip / Brotli / 域名收敛 |
| **资源层** | 减少体积 + 优先加载 | Tree Shaking / Code Splitting / preload / WebP |
| **渲染层** | 减少阻塞 + 尽快显示 | SSR / 骨架屏 / 内联关键 CSS / defer JS |
| **运行时** | 减少主线程阻塞 | 虚拟列表 / Web Worker / 懒加载 / 按需加载 |

### 关键渲染路径

```text
HTML → 发现 CSS → 阻塞渲染 → CSSOM ready
HTML → 发现 JS → 阻塞解析（无 async/defer）→ JS 执行
             ↓
       两者都 ready → Render Tree → Layout → Paint → 首屏可见
```

关键：**CSS 阻塞渲染，JS 阻塞解析**。

### preload / preconnect / prefetch

| 指令 | 作用 | 时机 | 适用 |
|------|------|------|------|
| `preload` | 提前加载**当前页**必需资源 | 当前页立即 | 关键字体、LCP 图片、关键 JS |
| `preconnect` | 提前建立 TCP + TLS 连接 | 当前页 | API 域名、CDN 域名 |
| `prefetch` | 空闲时预加载**下一页**资源 | 低优先级 | 下一页路由的 JS chunk |
| `dns-prefetch` | 只做 DNS 解析 | 当前页 | 第三方域名 |

### SSR vs 骨架屏 vs Loading

| 方案 | 首屏速度 | 实现成本 | SEO | 适用 |
|------|----------|----------|-----|------|
| SSR | 最快 | 高 | ✅ | 内容页 |
| 骨架屏 | 中等 | 低 | ❌ | SPA |
| Loading spinner | 最慢感知 | 最低 | ❌ | 后台 |

## 手写 / 流程图

### SPA 首屏瀑布流 + 优化点

```text
时间 →
├── DNS + TCP + TLS ──────── [preconnect 可省]
├── HTML 下载 ──────────── [SSR 直出内容]
├── CSS 下载 + 解析 ────── [内联关键 CSS / preload]
├── JS 下载 ────────────── [Code Split / defer / preload]
├── JS 执行 ────────────── [Tree Shaking 减小体积]
├── API 请求 ──────────── [接口合并 / preconnect / 服务端预取]
├── 数据渲染 ──────────── [骨架屏占位 / 虚拟列表]
└── 图片加载 ──────────── [WebP / lazy loading / fetchpriority]
```

### 关键资源加载示例

```html
<!-- 预连接 API 域名 -->
<link rel="preconnect" href="https://api.example.com" />

<!-- 预加载关键字体 -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />

<!-- 预加载 LCP 图片 -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

<!-- 预取下一页 -->
<link rel="prefetch" href="/about.chunk.js" />

<!-- 非关键 JS defer -->
<script src="/analytics.js" defer></script>
```

## 口述题

### 1. SPA 白屏怎么优化？

回答模板：

> SPA 白屏的根因是：浏览器下载 HTML 后，还要下载 JS、执行 JS、请求 API、渲染 DOM 才能看到内容。优化从四层入手：
>
> 网络层：CDN + HTTP/2 + Brotli 压缩。资源层：Code Splitting（按路由拆分）+ Tree Shaking 减小 bundle。渲染层：内联关键 CSS（避免 CSS 阻塞首屏）、骨架屏（JS 未执行时就有内容）、SSR（服务端直出 HTML）。运行时：图片 lazy loading、非首屏组件懒加载。
>
> 最有效的单一措施是 SSR / 骨架屏——让用户在 JS 未完成前就看到内容。

### 2. `preload` / `preconnect` / `prefetch` 区别？

回答模板：

> 三者目的不同。`preload` 是告诉浏览器"当前页马上就要用这个资源，提前加载"，优先级高，适合关键字体、LCP 图片。`preconnect` 不下载资源，只提前建立连接（DNS + TCP + TLS），省掉连接时间，适合 API 域名和 CDN。`prefetch` 是"空闲时预加载下一页可能用到的资源"，优先级最低，不会影响当前页加载。
>
> 实际使用：LCP 图片 → preload，API 域名 → preconnect，下一页路由 chunk → prefetch。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 首屏优化 4 层框架（网络/资源/渲染/运行时）（2 分钟）
2. 关键渲染路径 + preload/preconnect/prefetch 区别（1.5 分钟）
3. SSR vs 骨架屏 + 业务侧落地（接口合并/图片优化）（1.5 分钟）

录完后自查：

- 是否说出 CSS 阻塞渲染、JS 阻塞解析。
- 是否说出 preload / preconnect / prefetch 各自适用场景。
- 是否说出 Code Splitting 按路由拆分。
- 是否说出骨架屏的作用（JS 未执行前就有内容）。

## 今日复盘

今天最需要回补的 3 个点：

1. `modulepreload` 和 `preload` 的区别（modulepreload 会预解析 ES Module）。
2. Critical CSS 的自动提取工具（如 critters）。
3. 接口瘦身：GraphQL / BFF 层按需取字段减少首屏数据量。
