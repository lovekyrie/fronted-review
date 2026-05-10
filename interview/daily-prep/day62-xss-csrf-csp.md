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

<!-- XSS 三类 + 防御 / CSRF 防御矩阵 / CSP 常用 directive / Token 策略 -->

## 手写 / 流程图

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-xyz'
Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax
```

## 口述题

### 1. XSS 的前端防御边界在哪里？

> 回答模板：

### 2. CSRF 的主要防御手段？

> 回答模板：

## 5 分钟录音顺序

1. XSS 三类 + 防御（2 分钟）
2. CSRF 机制 + 防御（1.5 分钟）
3. CSP 实战配置（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
