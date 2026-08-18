### Frontend Security

In senior frontend interviews, security questions are not about reciting attack definitions, but about making these clear:

- what preconditions make the attack possible
- why the browser allows this kind of attack to happen
- what frontend, backend, gateway, and browser security policies each own

A better way to answer is to understand security inside “trust boundaries”.

#### 1. The core lens for frontend security

Frontend security is essentially handling three kinds of boundary:

1. **Untrusted input**: URLs, forms, rich text, third-party scripts, API responses
2. **Sensitive operations**: login, transfer, password change, posting, deletion
3. **Sensitive information**: tokens, cookies, user privacy, API permissions, internal config

If you can state these three boundaries first, XSS, CSRF, CSP, clickjacking, and token leaks can all be connected.

#### 2. XSS: why the browser executes attacker code

The essence of XSS is: **the app treats attacker-provided content as executable code or as HTML / JS to interpret.**

Common types:

- reflected XSS
- stored XSS
- DOM-based XSS

##### 2.1 Reflected XSS

The malicious script comes from a request parameter and is returned as-is into the page by the server.

```txt
https://example.com/search?q=<script>alert(1)</script>
```

##### 2.2 Stored XSS

Malicious content is stored in the database, then shown on other users’ pages.

For example comment sections, bios, rich text.

##### 2.3 DOM-based XSS

The problem happens in frontend code, and does not necessarily go through a server template.

```js
document.body.innerHTML = location.hash.slice(1)
```

As long as the attacker can control `hash`, they may inject malicious HTML.

#### 3. How to prevent XSS

##### 3.1 The most important principle: treat all input as untrusted by default

Do not treat “user input”, “URL params”, or “API response text” as safe HTML by default.

##### 3.2 Prefer safe DOM APIs

Safer:

```js
element.textContent = userInput
```

High risk:

```js
element.innerHTML = userInput
document.write(userInput)
```

##### 3.3 Escape correctly for the output context

XSS defense is not a simple global replace. You have to look at the output context:

- HTML text context
- HTML attribute context
- URL context
- JavaScript context

A common mistake: an escape that is safe in one context is not necessarily safe in another.

##### 3.4 Rich text must be whitelist-sanitized

If the product really needs to render rich text, you should not “fully trust” the backend or user input. Run it through a mature sanitizer with tag, attribute, and protocol allowlists.

##### 3.5 CSP is the last constraint, not the first line of defense

CSP can restrict script sources and reduce the chance that injected scripts actually run, but it cannot replace output safety.

#### 4. CSP: restrict where scripts can run from

CSP’s goal is to reduce the chance that “even if injected, it can execute directly”.

For example:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
```

A more solid senior-interview framing:

- do not rely on `'unsafe-inline'`
- do not casually allow `'unsafe-eval'`
- better to pair with nonce or hash
- `report-uri` / `report-to` can help collect violation reports

##### 4.1 Typical CSP effects

- restrict script sources
- restrict inline script execution
- restrict which sites can embed the page
- restrict objects, base tags, and resource origins

##### 4.2 Typical CSP misconceptions

- thinking CSP means you no longer need to handle XSS
- loosening the policy too much for legacy code compatibility
- forgetting to allowlist third-party script origins

#### 5. CSRF: why a request can be sent without the user clicking

The essence of CSRF is: **the browser automatically attaches the target site’s credentials, and the server mistakes the request for one the user initiated on purpose.**

Typical preconditions:

- the user is already logged in to the target site
- credentials are usually cookies sent automatically
- the attacking site tricks the user into visiting a malicious page

For example a malicious form or auto-submitted request:

```html
<form action="https://bank.example/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="to" value="attacker">
</form>
```

#### 6. How to prevent CSRF

##### 6.1 CSRF Token

The classic approach is for the server to verify a token the attacker cannot forge.

```js
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
})
```

The server must check that this token matches the current session.

##### 6.2 SameSite Cookie

An important browser-level policy:

- `SameSite=Strict`
- `SameSite=Lax`
- `SameSite=None; Secure`

Many CSRF risks can now be reduced a lot with a more reasonable SameSite policy.

##### 6.3 Check Origin / Referer

For high-risk operations, you can additionally verify the requesting site.

##### 6.4 Do not treat “we use JWT” as naturally CSRF-free

The key is not JWT itself, but how credentials are sent:

- if JWT lives in a Cookie and is sent automatically, CSRF risk remains
- if it lives in an `Authorization` header and JS attaches it on purpose, the CSRF risk model is different

A common senior-interview mistake is drawing a straight line from “JWT” to “no CSRF”.

#### 7. Boundaries of tokens, cookies, and local storage

This is a high-frequency distinction question in frontend security interviews.

##### 7.1 Cookie

Upsides:

- can set `HttpOnly`
- can set `Secure`
- can set `SameSite`

Risks:

- sent automatically, so CSRF needs attention

##### 7.2 localStorage / sessionStorage

Upsides:

- not sent automatically with requests
- simple to control

Risks:

- once XSS happens, easier to read

So do not simply say “token in localStorage is safer” or “cookies are always safer”. You really have to look at:

- which attack you mainly defend against
- whether you can do HttpOnly / SameSite
- whether you have mature XSS defenses

#### 8. Clickjacking

The essence of clickjacking is embedding your page in an iframe on a malicious site so the user mistakenly clicks a real button.

##### 8.1 Common defenses

```http
X-Frame-Options: DENY
```

Or more modern:

```http
Content-Security-Policy: frame-ancestors 'none';
```

The latter is more flexible, and more recommended.

#### 9. Dependency and supply-chain security

Frontend security is not only browser attacks. It also includes the dependency supply chain.

Common risks:

- installing a poisoned npm package
- a dependency planting a malicious postinstall script
- a third-party SDK being hijacked
- a CDN script being tampered with

Common responses:

- lock dependency versions
- review third-party dependencies
- reduce unnecessary dependencies
- SRI or origin tightening for third-party scripts
- watch security advisories

#### 10. Common frontend security misconceptions

##### 10.1 “Frontend validation means we are safe”

Frontend validation is mainly UX. Real permission and security checks must be backed by the backend.

##### 10.2 “One backend filter is enough”

It is not. Especially for rich text, DOM injection, and multiple-escape cases, the frontend is still responsible for how it renders.

##### 10.3 “CORS is a security mechanism, so it prevents CSRF”

Wrong. CORS mainly controls cross-origin response reading. It is not there to solve borrowed user identity.

##### 10.4 “Not putting the token in a Cookie is always safe”

Also wrong. That usually lowers CSRF, but exposes you more to XSS. Security is never a single-point choice. It is an overall trade-off.

#### 11. Common senior interview follow-ups

##### 11.1 What is the fundamental difference between XSS and CSRF

XSS is the attacker making your site execute malicious script. CSRF is the attacker borrowing the user’s identity to make your site execute a malicious request. The former is more code injection; the latter is more identity abuse.

##### 11.2 Why an HttpOnly Cookie can mitigate some risk

Because JavaScript cannot read an HttpOnly Cookie directly, which lowers the risk of XSS stealing credentials directly. It cannot stop malicious script from acting on business logic on the user’s behalf.

##### 11.3 Why CSP is not a silver bullet

Because CSP is more about restricting execution conditions. It does not fix wrong output logic. When the policy is too loose, its defensive value drops a lot.

##### 11.4 Why security is a layered responsibility

Because the browser, frontend code, server, gateway, and auth system each own different responsibilities. Relying on only one layer easily leaves blind spots.

#### 12. Interview answer suggestions

If you are asked about frontend security, do not recite “XSS, CSRF, clickjacking” one by one as definitions. A more solid order is:

1. first the untrusted-input, sensitive-operation, and sensitive-information boundaries the frontend faces
2. then the preconditions of the two core attacks, XSS and CSRF
3. then the responsibility boundaries of Cookie / token / CSP / SameSite
4. finally one real engineering trade-off, such as why you cannot rely only on localStorage or only on frontend filtering

That upgrades the answer from “knows attack names” to “understands the security boundary between browser and app”.
