# Day 62 XSS / CSRF / CSP 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 62 | XSS / CSRF / CSP | [Web 安全](../network&broswer/web-safe)、[安全专题](../advanced/week6/security) |

## 今日目标

- 看完 MDN XSS / CSRF / CSP
- 输出三种攻击对比表：触发位置、危害、前端防御、后端防御
- 写 1 份前端安全 checklist（输入校验 / 输出转义 / SameSite / CSP / HttpOnly / Token）

## 阅读卡点

- XSS 分存储型 / 反射型 / DOM 型，前端只能防住 DOM 型的部分
- CSRF 的核心是“浏览器会自动带 cookie”，所以 SameSite + Token 是主力
- CSP 的 `script-src 'self'` 能挡掉大部分 inline 注入，但要配合 nonce / hash 允许合法 inline

## 速记卡 / 知识点

### XSS 三类

| 类型 | 注入位置 | 存储 | 示例 |
|------|----------|------|------|
| **存储型** | 服务端数据库 | 持久化 | 评论区注入 `<script>` |
| **反射型** | URL 参数 | 不存储 | 搜索 `?q=<script>alert(1)</script>` |
| **DOM 型** | 客户端 JS | 不经服务端 | `innerHTML = location.hash` |

### XSS 防御

| 层 | 措施 |
|----|------|
| 输出转义 | HTML 实体编码（`<` → `&lt;`），避免 `innerHTML` |
| CSP | `script-src 'self'` 禁止 inline 脚本 |
| HttpOnly | Cookie 设 HttpOnly，JS 无法读取 |
| 输入校验 | 白名单过滤（后端为主） |
| 框架自带 | React 默认转义、Vue v-html 需注意 |

### CSRF 攻击原理

```text
用户登录 A 站 → 浏览器存了 A 的 cookie
→ 用户访问恶意 B 站 → B 站页面发请求到 A
→ 浏览器自动带上 A 的 cookie → A 以为是用户操作
```

### CSRF 防御

| 措施 | 原理 |
|------|------|
| **SameSite Cookie** | `SameSite=Lax/Strict`，跨站请求不带 cookie |
| **CSRF Token** | 表单带服务端生成的 token，攻击者拿不到 |
| **Origin / Referer 校验** | 服务端检查来源域名 |
| **验证码 / 二次确认** | 关键操作增加人机验证 |

### CSP 常用指令

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.example.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
```

| 指令 | 控制 |
|------|------|
| `default-src` | 默认策略 |
| `script-src` | JS 来源（`'nonce-xxx'` 允许特定 inline） |
| `style-src` | CSS 来源 |
| `img-src` | 图片来源 |
| `connect-src` | XHR / fetch / WebSocket 来源 |
| `frame-ancestors` | 谁能嵌套本页（防 clickjacking） |

### 前端安全 Checklist

```text
□ 不使用 innerHTML / v-html 渲染用户输入
□ Cookie 设 HttpOnly + Secure + SameSite=Lax
□ 部署 CSP 头部
□ 敏感操作带 CSRF Token
□ API 域名加 CORS 白名单
□ 第三方脚本用 integrity 校验（SRI）
□ 避免 eval / new Function / document.write
```

## 手写 / 流程图

### XSS 防御：输出转义函数

```js
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  }
  return str.replace(/[&<>"']/g, ch => map[ch])
}
```

### CSRF 攻击流程图

```text
用户浏览器
  ├─ 已登录 bank.com（cookie: session=xxx）
  ├─ 访问 evil.com
  │   └─ <img src="https://bank.com/transfer?to=hacker&amount=10000">
  │       → 浏览器自动带 bank.com 的 cookie！
  └─ bank.com 收到请求，以为是用户操作 → 转账成功
  
防御：SameSite=Lax → 跨站 GET 请求不带 cookie → 攻击失败
```

## 口述题

### 1. XSS 的前端防御边界在哪里？

回答模板：

> 前端能防住 DOM 型 XSS：不用 `innerHTML` 渲染用户输入，用 `textContent` 代替；React/Vue 默认转义，但 `dangerouslySetInnerHTML` / `v-html` 是例外，必须确保数据可信。前端还能部署 CSP 作为最后一道防线，禁止 inline 脚本执行。
>
> 但存储型和反射型 XSS 的防线主要在后端：后端必须对用户输入做白名单过滤、对输出做上下文相关的转义（HTML / JS / URL / CSS 上下文转义规则不同）。前端转义只是兜底，不能替代后端校验。

### 2. CSRF 的主要防御手段？

回答模板：

> 最推荐的组合是 **SameSite Cookie + CSRF Token**。SameSite=Lax 让跨站 POST 请求不带 cookie，直接阻断大部分 CSRF 攻击。但 Lax 对跨站 GET 导航还是会带 cookie，所以关键操作不能用 GET。
>
> CSRF Token 是在表单中带一个服务端生成的随机 token，攻击者在自己的页面上拿不到这个 token，所以伪造请求会被拒绝。两者配合使用覆盖最全面。补充手段还有 Origin/Referer 校验和关键操作二次确认。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. XSS 三类（存储/反射/DOM）+ 防御措施（转义/CSP/HttpOnly）（2 分钟）
2. CSRF 攻击原理 + 防御（SameSite + Token）（1.5 分钟）
3. CSP 实战配置 + 前端安全 Checklist（1.5 分钟）

录完后自查：

- 是否说出 XSS 三类的区别。
- 是否说出 CSRF 的核心是"浏览器自动带 cookie"。
- 是否说出 SameSite=Lax 的作用。
- 是否说出 CSP nonce 允许合法 inline 脚本。

## 今日复盘

今天最需要回补的 3 个点：

1. Subresource Integrity（SRI）的 `integrity` 属性用法。
2. CORS 和安全的关系（CORS 不是安全机制，是同源策略的放松）。
3. Clickjacking 防御（`X-Frame-Options` / CSP `frame-ancestors`）。
