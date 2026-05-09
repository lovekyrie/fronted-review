### 前端安全

高级前端面试里的安全题，重点不是背攻击定义，而是讲清楚：

- 攻击成立的前提是什么
- 浏览器为什么会允许这类攻击发生
- 前端、后端、网关、浏览器安全策略各自负责什么

更好的回答方式是把安全问题放到“信任边界”里理解。

#### 1. 前端安全的核心视角

前端安全本质上在处理三类边界：

1. **不可信输入**：URL、表单、富文本、第三方脚本、接口返回
2. **敏感操作**：登录、转账、改密码、发帖、删除
3. **敏感信息**：token、cookie、用户隐私、接口权限、内部配置

如果你能先把这三个边界说清楚，后面的 XSS、CSRF、CSP、点击劫持、token 泄漏就都能串起来。

#### 2. XSS：为什么浏览器会执行攻击代码

XSS 的本质是：**应用把攻击者提供的内容当成了可执行代码或可解释的 HTML / JS。**

常见类型：

- 反射型 XSS
- 存储型 XSS
- DOM 型 XSS

##### 2.1 反射型 XSS

恶意脚本来自请求参数，并被服务器原样返回到页面。

```txt
https://example.com/search?q=<script>alert(1)</script>
```

##### 2.2 存储型 XSS

恶意内容被存进数据库，再在其他用户页面里展示出来。

例如评论区、个人简介、富文本内容。

##### 2.3 DOM 型 XSS

问题发生在前端代码里，不一定经过服务端模板。

```js
document.body.innerHTML = location.hash.slice(1)
```

只要攻击者能控制 `hash`，就可能注入恶意 HTML。

#### 3. XSS 怎么防

##### 3.1 最重要的原则：默认所有输入都不可信

不要把“用户输入”“URL 参数”“接口返回文本”默认当成安全 HTML。

##### 3.2 优先使用安全的 DOM API

更安全：

```js
element.textContent = userInput
```

高风险：

```js
element.innerHTML = userInput
document.write(userInput)
```

##### 3.3 做对上下文相关的转义

XSS 防御不是简单全局 replace，而是要看输出上下文：

- HTML 文本上下文
- HTML 属性上下文
- URL 上下文
- JavaScript 上下文

错误常见点是：在一个上下文下安全的转义，在另一个上下文下未必安全。

##### 3.4 富文本必须做白名单清洗

如果业务真的需要渲染富文本，不应该“全信”后端或用户输入。要经过成熟 sanitizer 做标签、属性、协议白名单过滤。

##### 3.5 CSP 是最后一道限制，不是第一道防线

CSP 能限制脚本来源、减少注入脚本执行成功的概率，但它不能替代输出安全。

#### 4. CSP：限制脚本能从哪里执行

CSP 的目标是减少“即使被注入也能直接执行”的机会。

例如：

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
```

高级面试里更稳的说法：

- 不建议依赖 `'unsafe-inline'`
- 不建议随便放开 `'unsafe-eval'`
- 最好配合 nonce 或 hash
- `report-uri` / `report-to` 可以帮助收集违规报告

##### 4.1 CSP 的典型作用

- 限制脚本来源
- 限制内联脚本执行
- 限制页面被哪些站点嵌入
- 限制对象、base 标签、资源来源

##### 4.2 CSP 的典型误区

- 以为上了 CSP 就不需要处理 XSS
- 为了兼容历史代码把策略放得过宽
- 忘记处理第三方脚本来源白名单

#### 5. CSRF：为什么用户没点也能发出请求

CSRF 的本质是：**浏览器会自动携带目标站点的身份凭证，而服务器把这个请求误认为用户本人主动发起。**

典型前提：

- 用户已经登录目标站点
- 凭证通常基于 Cookie 自动携带
- 攻击站点诱导用户访问恶意页面

例如一个恶意表单或自动提交请求：

```html
<form action="https://bank.example/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="to" value="attacker">
</form>
```

#### 6. CSRF 怎么防

##### 6.1 CSRF Token

最经典做法是服务端校验一个攻击者无法伪造的 token。

```js
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
})
```

服务端需要校验这个 token 是否和当前会话匹配。

##### 6.2 SameSite Cookie

浏览器层面的重要策略：

- `SameSite=Strict`
- `SameSite=Lax`
- `SameSite=None; Secure`

很多 CSRF 风险现在可以通过更合理的 SameSite 策略明显降低。

##### 6.3 校验 Origin / Referer

对高风险操作，可以额外校验请求来源站点。

##### 6.4 不要把“用了 JWT”误认为天然没有 CSRF

关键不在 JWT 本身，而在凭证如何发送：

- 如果 JWT 放在 Cookie 里自动发送，依然有 CSRF 风险
- 如果放在 `Authorization` header 且由 JS 主动附加，CSRF 风险模型不同

高级面试里常见错误就是把“JWT”和“无 CSRF”直接画等号。

#### 7. Token、Cookie 和本地存储的边界

这是前端安全面试高频区分题。

##### 7.1 Cookie

优点：

- 可配 `HttpOnly`
- 可配 `Secure`
- 可配 `SameSite`

风险：

- 自动携带，需关注 CSRF

##### 7.2 localStorage / sessionStorage

优点：

- 不会自动随请求发送
- 控制简单

风险：

- 一旦发生 XSS，更容易被读取

所以不要简单说“token 存 localStorage 更安全”或者“cookie 一定更安全”。真正要看：

- 你主要防什么攻击
- 能否做到 HttpOnly / SameSite
- 是否有成熟 XSS 防御能力

#### 8. 点击劫持

点击劫持的本质是把你的页面嵌进恶意站点的 iframe，让用户误点真实按钮。

##### 8.1 常见防御

```http
X-Frame-Options: DENY
```

或者更现代：

```http
Content-Security-Policy: frame-ancestors 'none';
```

后者更灵活，也更推荐。

#### 9. 依赖和供应链安全

前端安全不只是浏览器攻击，还包括依赖供应链。

常见风险：

- 安装被污染的 npm 包
- 依赖被植入恶意 postinstall 脚本
- 第三方 SDK 被劫持
- CDN 脚本被篡改

常见应对：

- 锁定依赖版本
- 审核第三方依赖
- 减少不必要依赖
- 对第三方脚本做 SRI 或来源收敛
- 监控安全通告

#### 10. 前端常见安全误区

##### 10.1 “前端做了校验就安全了”

前端校验主要是提升体验，真正的权限和安全校验必须由后端兜底。

##### 10.2 “后端过滤过一次就够了”

不够。尤其是富文本、DOM 注入和多次转义场景，前端仍然要对渲染方式负责。

##### 10.3 “CORS 是安全机制，所以能防 CSRF”

不对。CORS 主要控制跨域读响应，不是用来解决用户身份被借用的问题。

##### 10.4 “不把 token 放 Cookie 就一定安全”

也不对。这样通常降低了 CSRF，但会更暴露在 XSS 风险下。安全从来不是单点选择，而是整体权衡。

#### 11. 高级面试常见追问

##### 11.1 XSS 和 CSRF 的根本区别是什么

XSS 是攻击者让你的站点执行恶意脚本；CSRF 是攻击者借用户身份让你的站点执行恶意请求。前者偏代码注入，后者偏身份滥用。

##### 11.2 为什么 HttpOnly Cookie 能缓解部分风险

因为 JavaScript 无法直接读取 HttpOnly Cookie，这能降低 XSS 直接窃取凭证的风险。但它不能解决业务逻辑被恶意脚本代操作的问题。

##### 11.3 CSP 为什么不是万能的

因为 CSP 更多是限制执行条件，不负责修复错误的输出逻辑。策略过宽时防御价值也会明显下降。

##### 11.4 为什么说安全是分层责任

因为浏览器、前端代码、服务端、网关、鉴权系统都在承担不同责任。只靠某一层很容易出现盲区。

#### 12. 面试回答建议

如果被问前端安全，不要按“XSS、CSRF、点击劫持”逐个背定义。更稳的顺序是：

1. 先说前端面对的不可信输入、敏感操作和敏感信息边界
2. 再讲 XSS 和 CSRF 这两类最核心攻击的成立前提
3. 再说 Cookie / token / CSP / SameSite 的责任边界
4. 最后补一条真实工程取舍，比如为什么不能只靠 localStorage 或只靠前端过滤

这样答案会从“知道攻击名词”升级成“理解浏览器与应用的安全边界”。
