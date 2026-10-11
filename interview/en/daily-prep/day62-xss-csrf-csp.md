# Day 62 XSS / CSRF / CSP execution log

## Goals

- Finish MDN XSS / CSRF / CSP
- Produce a comparison table of the three attacks: trigger location, damage, frontend defense, backend defense
- Write 1 frontend security checklist (input validation / output escaping / SameSite / CSP / HttpOnly / Token)

## Read in order

1. [Web security](../network&broswer/web-safe)
2. [Security](../advanced/week6/security)

## Practice and self-check

**Checkpoints**

- XSS splits into stored / reflected / DOM-based; the frontend can only partly stop DOM-based XSS
- CSRF’s core is “the browser automatically attaches cookies”, so SameSite + Token are the main defenses
- CSP `script-src 'self'` blocks most inline injection, but you still need nonce / hash to allow legitimate inline scripts

**Produce or redraw from memory**

- Three kinds of XSS — [reference section](../network&broswer/web-safe#day-62-three-kinds-of-xss)
- XSS defense — [reference section](../network&broswer/web-safe#day-62-xss-defense)
- How a CSRF attack works — [reference section](../network&broswer/web-safe#day-62-how-a-csrf-attack-works)
- CSRF defense — [reference section](../network&broswer/web-safe#day-62-csrf-defense)
- Common CSP directives — [reference section](../network&broswer/web-safe#day-62-common-csp-directives)
- Frontend security checklist — [reference section](../advanced/week6/security#day-62-frontend-security-checklist)
- XSS defense: output-escaping helper — [reference section](../network&broswer/web-safe#day-62-xss-defense-output-escaping-helper)
- CSRF attack flow — [reference section](../network&broswer/web-safe#day-62-csrf-attack-flow)

**Answer aloud without reading a reference answer**

- 1. Where is the frontend’s XSS defense boundary?
- 2. What are the main CSRF defenses?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Three XSS types (stored/reflected/DOM) + defenses (escaping/CSP/HttpOnly) (2 min)
2. CSRF attack mechanics + defense (SameSite + Token) (1.5 min)
3. Practical CSP config + frontend security checklist (1.5 min)

After recording, self-check:

- Did you state the difference among the three XSS types.
- Did you say CSRF’s core is “the browser automatically attaches cookies”.
- Did you explain what SameSite=Lax does.
- Did you mention CSP nonce allowing legitimate inline scripts.

## Recap

The 3 points that most need review today:

1. How to use Subresource Integrity (SRI) `integrity`.
2. How CORS relates to security (CORS is not a security mechanism; it relaxes the same-origin policy).
3. Clickjacking defense (`X-Frame-Options` / CSP `frame-ancestors`).
