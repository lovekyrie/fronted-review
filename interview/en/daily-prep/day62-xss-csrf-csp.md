# Day 62 XSS / CSRF / CSP execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 62 | XSS / CSRF / CSP | [Web security](../network&broswer/web-safe), [Security](../advanced/week6/security) |

## Today's goals

- Finish MDN XSS / CSRF / CSP
- Produce a comparison table of the three attacks: trigger location, damage, frontend defense, backend defense
- Write 1 frontend security checklist (input validation / output escaping / SameSite / CSP / HttpOnly / Token)

## Reading notes

- XSS splits into stored / reflected / DOM-based; the frontend can only partly stop DOM-based XSS
- CSRF’s core is “the browser automatically attaches cookies”, so SameSite + Token are the main defenses
- CSP `script-src 'self'` blocks most inline injection, but you still need nonce / hash to allow legitimate inline scripts

## Cheat sheet / knowledge

### Three kinds of XSS

| Type | Injection point | Stored | Example |
|------|----------|------|------|
| **Stored** | Server database | Persistent | Inject `<script>` in comments |
| **Reflected** | URL params | Not stored | Search `?q=<script>alert(1)</script>` |
| **DOM-based** | Client JS | Does not go through the server | `innerHTML = location.hash` |

### XSS defense

| Layer | Measure |
|----|------|
| Output escaping | HTML entity encoding (`<` → `&lt;`); avoid `innerHTML` |
| CSP | `script-src 'self'` forbids inline scripts |
| HttpOnly | Set HttpOnly on cookies so JS cannot read them |
| Input validation | Allowlist filtering (mainly backend) |
| Framework defaults | React escapes by default; watch Vue `v-html` |

### How a CSRF attack works

```text
User logs into site A → browser stores A's cookie
→ user visits malicious site B → B's page sends a request to A
→ browser automatically attaches A's cookie → A treats it as a user action
```

### CSRF defense

| Measure | How it works |
|------|------|
| **SameSite Cookie** | `SameSite=Lax/Strict`; cross-site requests do not send the cookie |
| **CSRF Token** | Form includes a server-generated token the attacker cannot get |
| **Origin / Referer check** | Server checks the source origin |
| **CAPTCHA / second confirmation** | Add a human check on sensitive actions |

### Common CSP directives

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

### Frontend security checklist

```text
□ Do not render user input with innerHTML / v-html
□ Cookie: HttpOnly + Secure + SameSite=Lax
□ Ship a CSP header
□ Sensitive actions carry a CSRF Token
□ API origins: CORS allowlist
□ Third-party scripts: integrity check (SRI)
□ Avoid eval / new Function / document.write
```

## Handwritten / flowcharts

### XSS defense: output-escaping helper

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

### CSRF attack flow

```text
User's browser
  ├─ already logged into bank.com (cookie: session=xxx)
  ├─ visits evil.com
  │   └─ <img src="https://bank.com/transfer?to=hacker&amount=10000">
  │       → the browser automatically attaches bank.com's cookie!
  └─ bank.com receives the request, treats it as a user action → transfer succeeds
  
Defense: SameSite=Lax → cross-site GET does not send the cookie → attack fails
```

## Oral questions

### 1. Where is the frontend’s XSS defense boundary?

Answer template:

> The frontend can stop DOM-based XSS: do not render user input with `innerHTML`; use `textContent` instead. React/Vue escape by default, but `dangerouslySetInnerHTML` / `v-html` are exceptions — the data must be trusted. The frontend can also ship CSP as a last line of defense to block inline script execution.
>
> Stored and reflected XSS are mainly a backend job: the backend must allowlist user input and escape output in a context-aware way (HTML / JS / URL / CSS contexts have different rules). Frontend escaping is a fallback, not a substitute for backend checks.

### 2. What are the main CSRF defenses?

Answer template:

> The recommended combo is **SameSite Cookie + CSRF Token**. SameSite=Lax keeps cookies off cross-site POST, which blocks most CSRF. Lax still sends cookies on cross-site GET navigations, so sensitive actions must not use GET.
>
> A CSRF Token is a server-generated random token in the form. The attacker cannot obtain it on their own page, so forged requests are rejected. Using both covers the most cases. Extra measures: Origin/Referer checks and a second confirmation on sensitive actions.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Three XSS types (stored/reflected/DOM) + defenses (escaping/CSP/HttpOnly) (2 min)
2. CSRF attack mechanics + defense (SameSite + Token) (1.5 min)
3. Practical CSP config + frontend security checklist (1.5 min)

After recording, self-check:

- Did you state the difference among the three XSS types.
- Did you say CSRF’s core is “the browser automatically attaches cookies”.
- Did you explain what SameSite=Lax does.
- Did you mention CSP nonce allowing legitimate inline scripts.

## Today's recap

The 3 points that most need review today:

1. How to use Subresource Integrity (SRI) `integrity`.
2. How CORS relates to security (CORS is not a security mechanism; it relaxes the same-origin policy).
3. Clickjacking defense (`X-Frame-Options` / CSP `frame-ancestors`).
