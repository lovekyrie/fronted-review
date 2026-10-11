# Day 62 XSS / CSRF / CSP

## 今日目标

- 看完 MDN XSS / CSRF / CSP
- 输出三种攻击对比表：触发位置、危害、前端防御、后端防御
- 写 1 份前端安全 checklist（输入校验 / 输出转义 / SameSite / CSP / HttpOnly / Token）

## 按顺序阅读

1. [Web 安全](../network&broswer/web-safe)
2. [安全专题](../advanced/week6/security)

## 实操与自测

**检查点**

- XSS 分存储型 / 反射型 / DOM 型，前端只能防住 DOM 型的部分
- CSRF 的核心是“浏览器会自动带 cookie”，所以 SameSite + Token 是主力
- CSP 的 `script-src 'self'` 能挡掉大部分 inline 注入，但要配合 nonce / hash 允许合法 inline

**先独立完成，再对照专题**

- XSS 三类 — [参考章节](../network&broswer/web-safe#day-62-xss-三类)
- XSS 防御 — [参考章节](../network&broswer/web-safe#day-62-xss-防御)
- CSRF 攻击原理 — [参考章节](../network&broswer/web-safe#day-62-csrf-攻击原理)
- CSRF 防御 — [参考章节](../network&broswer/web-safe#day-62-csrf-防御)
- CSP 常用指令 — [参考章节](../network&broswer/web-safe#day-62-csp-常用指令)
- 前端安全 Checklist — [参考章节](../advanced/week6/security#day-62-前端安全-checklist)
- XSS 防御：输出转义函数 — [参考章节](../network&broswer/web-safe#day-62-xss-防御-输出转义函数)
- CSRF 攻击流程图 — [参考章节](../network&broswer/web-safe#day-62-csrf-攻击流程图)

**脱稿口述题**

- 1. XSS 的前端防御边界在哪里？
- 2. CSRF 的主要防御手段？

**录音练习**

按这个顺序录，不要临场重新组织：

1. XSS 三类（存储/反射/DOM）+ 防御措施（转义/CSP/HttpOnly）（2 分钟）
2. CSRF 攻击原理 + 防御（SameSite + Token）（1.5 分钟）
3. CSP 实战配置 + 前端安全 Checklist（1.5 分钟）

录完后自查：

- 是否说出 XSS 三类的区别。
- 是否说出 CSRF 的核心是"浏览器自动带 cookie"。
- 是否说出 SameSite=Lax 的作用。
- 是否说出 CSP nonce 允许合法 inline 脚本。

## 复盘

今天最需要回补的 3 个点：

1. Subresource Integrity（SRI）的 `integrity` 属性用法。
2. CORS 和安全的关系（CORS 不是安全机制，是同源策略的放松）。
3. Clickjacking 防御（`X-Frame-Options` / CSP `frame-ancestors`）。
