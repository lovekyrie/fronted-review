# Day 63 性能与安全专题追问复盘 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 63 | 性能 + 安全复盘 | [Week 6 路线图](../advanced/week6/roadmap)、[性能优化](../advanced/week6/performance-optimization)、[安全专题](../advanced/week6/security) |

## 今日目标

- 汇总 Day 57–62，形成《性能 + 安全 20 题答题本》
- 出一份“性能排障 checklist”：从用户反馈到定位根因
- 录一段 8 分钟录音：Web Vitals 指标 → 优化动作 → 真实案例

## 阅读卡点

- 性能题容易被拉到**实战**：你具体帮哪个页面提升过，怎么量化的
- 安全题容易被拉到**边界**：前端能防什么、后端必须防什么
- 面试里“你做过的性能优化”的答题结构：**指标 → 原因 → 方案 → 收益**

## 速记卡 / 知识点

### 性能排障 Checklist

```text
1. 用户反馈 / 监控告警
   → 确认指标：LCP / INP / CLS / TTFB？哪个差？
2. 定位阶段
   → Chrome Performance 录制 → 看火焰图 → 找长任务
   → Network 瀑布流 → 找慢请求 / 大资源
   → Lighthouse 跑分 → 看建议
3. 归因
   → 网络问题？资源问题？渲染问题？运行时问题？
4. 方案
   → 选对应层的优化手段（网络/资源/渲染/运行时）
5. 验收
   → A/B 测试 / 前后对比 → 用指标量化收益
```

### 安全 Checklist

```text
□ XSS: 不用 innerHTML 渲染用户输入 + CSP + HttpOnly
□ CSRF: SameSite=Lax + CSRF Token + 关键操作不用 GET
□ 注入: 参数化查询 / ORM（后端）
□ CORS: 白名单限制 Access-Control-Allow-Origin
□ 依赖: npm audit / Snyk 扫描第三方依赖
□ HTTPS: 全站 HTTPS + HSTS
□ 敏感数据: 不在 localStorage 存 token（用 HttpOnly cookie）
```

### 面试答题结构：指标 → 原因 → 方案 → 收益

```text
"我们首页 LCP 从 4.2s 优化到 2.1s"
  指标：LCP P75 = 4.2s（CrUX 数据）
  原因：LCP 元素是首屏大图，未 preload；JS bundle 280KB 阻塞渲染
  方案：1) 图片 preload + WebP  2) Code Split 按路由拆分  3) 关键 CSS 内联
  收益：LCP P75 降到 2.1s，转化率提升 8%
```

## 手写 / 流程图

### 性能排障流程图

```text
用户反馈"页面慢"
  ├─ 首屏慢？
  │   ├─ Lighthouse 跑 LCP → > 2.5s
  │   │   ├─ TTFB 高？→ 服务端 / CDN 问题
  │   │   ├─ 资源大？→ 压缩 / Code Split / 图片优化
  │   │   └─ 渲染阻塞？→ 关键 CSS 内联 / JS defer
  │   └─ 检查 CLS → > 0.1 → 图片无尺寸 / 字体跳动
  ├─ 交互卡？
  │   ├─ Performance 录制 → 找长任务（> 50ms）
  │   │   ├─ JS 计算密集？→ Web Worker / 任务拆分
  │   │   └─ DOM 操作多？→ 虚拟列表 / 批量更新
  │   └─ INP > 200ms → 事件 handler 优化
  └─ 整体慢？
      └─ Network → 瀑布流分析 → 接口合并 / 并行 / 缓存
```

### 性能优化 STAR 模板

```text
Situation: 电商首页 LCP P75 = 4.2s，用户跳出率高
Task:      优化到 2.5s 以下
Action:
  1. 用 Lighthouse + CrUX 定位瓶颈 → 首屏大图未 preload + JS 280KB
  2. 图片：preload + WebP + CDN + srcset 响应式
  3. JS：按路由 Code Split，首屏 chunk 从 280KB 降到 90KB
  4. CSS：Critical CSS 内联，非关键 CSS async 加载
  5. API：preconnect 域名 + 首屏接口服务端预取（SSR）
Result:    LCP P75 降到 2.1s，跳出率降低 15%，转化率提升 8%
```

## 口述题

### 1. 你主导过的一次性能优化

回答模板（STAR）：

> **Situation**：我们电商首页的 LCP P75 在 4.2 秒左右，用户反馈打开慢，跳出率较高。
>
> **Task**：我负责把 LCP 优化到 2.5 秒以下。
>
> **Action**：第一步用 Lighthouse 和 CrUX 数据定位瓶颈，发现两个主要原因：首屏大图没有 preload 且是 PNG 格式，JS bundle 有 280KB 阻塞渲染。第二步做了三件事：图片换 WebP + 加 preload + fetchpriority="high"；按路由做 Code Splitting，首屏 chunk 从 280KB 降到 90KB；关键 CSS 内联，非关键 CSS 异步加载。第三步给 API 域名加了 preconnect。
>
> **Result**：LCP P75 降到 2.1 秒，跳出率降低 15%，上线后持续用 web-vitals RUM 监控。

### 2. 3 道自抽追问

**Q: 如果优化后 LCP 还是不达标，下一步怎么办？**

> 考虑 SSR / 流式渲染让 HTML 直出内容，跳过 JS 执行阶段。或者用 Edge 渲染把服务端逻辑推到离用户更近的节点，减少 TTFB。

**Q: 你怎么保证上线后性能不劣化？**

> 三个手段。CI 集成 Lighthouse CI，每次 PR 自动跑分，分数下降不允许合并。线上用 web-vitals RUM 持续监控，设告警阈值。定期做 Bundle Analyzer 检查，防止依赖体积悄悄变大。

**Q: 前端安全和性能有冲突吗？**

> 有时候有。比如 CSP 严格模式禁止 inline 脚本，但内联关键 CSS/JS 是性能优化手段——需要用 nonce/hash 兼容。又比如 SRI 校验第三方脚本保证完整性，但如果 CDN 更新了文件 hash 不匹配会导致加载失败。需要在安全和性能之间找平衡。

## 8 分钟录音顺序（性能 + 安全专题）

1. 事件循环一帧 + 渲染流水线 5 步（2 分钟）
2. Web Vitals 三大指标 + 阈值 + 优化动作（1.5 分钟）
3. 首屏优化 4 层 + HTTP 缓存 + SW 策略（2 分钟）
4. XSS / CSRF / CSP 快速过一遍（1.5 分钟）
5. STAR 真实优化案例（1 分钟）

## 今日复盘

最容易被击穿的 3 题：

1. "你做过的性能优化具体量化数据是什么？"——必须有指标数字（LCP 从 X 降到 Y）。
2. "no-cache 和 no-store 区别？SW 三种策略怎么选？"——缓存细节容易混淆。
3. "XSS 前端能防到什么程度？存储型 XSS 前端能防吗？"——需要说清前后端边界。

本周新增的 3 个"为什么"：

1. 为什么 CSS 阻塞渲染但不阻塞 DOM 解析？（渲染需要 CSSOM，但 DOM 可以继续构建）
2. 为什么 SameSite=Lax 是默认值而不是 Strict？（Strict 太严格，正常导航也不带 cookie，用户体验差）
3. 为什么 Service Worker 不能立即接管页面？（防止新旧版本代码不一致导致 bug）
