# Day 27 Production Troubleshooting Checklist Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 27 | Production troubleshooting | [Deployment](../advanced/week2/deployment), [Error monitoring](../network&broswer/error-monitoring) |

## Today's goals

- Collect the Day 22–26 deploy chain into a **post-release troubleshooting checklist** (sorted by priority)
- List the Top 10 production issues + how to debug them: blank screen / asset 404 / API CORS / cache mix-up / missing env vars / gzip not working / intranet health checks / certificates / CDN not fetching origin / users stuck on old version
- Write it as a Markdown template you can send to a teammate as-is

## Reading pitfalls

- A blank screen must be split into three root causes: **JS errors**, **API failures**, and **asset load failures**
- About 90% of cache mix-ups come from `index.html` being strongly cached. Be able to name the debug commands immediately
- Certificate issues need the specific `SSL handshake` failure error code

## Cheat sheet / key points

### Post-release troubleshooting checklist

| Issue | Typical symptoms | Fast diagnosis | Common fix |
|------|----------|----------|----------|
| Blank screen | Empty page, console errors | DevTools Console, monitored error stacks | Rollback, fix JS exceptions, add compatibility |
| JS asset 404 | `app.hash.js` fails to load | Network status codes | Restore old assets, fix publish path/CDN |
| Missing CSS | No styles or broken layout | Network CSS, MIME type | Fix asset paths, Nginx type config |
| API failure | Page stuck loading, empty data | Network 4xx/5xx, API domain | Fix the API, gateway, or env vars |
| CORS error | Console CORS errors | Preflight OPTIONS and response headers | Add CORS config or a proxy |
| Cache mix-up | Some users mix new and old | `index.html` response headers and asset hashes | Fix cache headers, purge CDN, keep old assets |
| Wrong env vars | Requests go to the wrong domain | Check build artifacts and runtime config | Redeploy correct config or roll back |
| gzip/CDN issues | Slow loads, compression not applied | `content-encoding`, CDN origin fetch | Fix Nginx/CDN config |
| Certificate issues | HTTPS fails | Browser security panel, cert chain | Renew the cert, fix domain binding |
| Users on old version | Still broken after rollback | Service worker, browser cache | Clear SW, adjust cache strategy |

- Blank-screen first split into three: JS runtime errors, core assets failing to load, and API/config errors that keep the app from starting.
- For asset 404s, check whether "new HTML references a hashed file that was not uploaded" or "old HTML references an old hashed file that was deleted".
- If users still see the old page, first check whether `index.html` is strongly cached, then CDN, service worker, and browser cache.
- Split API failures into network failure, CORS failure, auth failure, and business 5xx. Do not lump them as "the API is down".
- Env-var mistakes usually show up as the wrong request domain, the wrong flag state, or staging config flowing into production.
- Stop the bleeding before the root cause: if a core path is down, roll back or switch traffic first, then find the full cause in the review.

## Handwritten / flow diagrams

```text
User report / monitoring alert
  -> Reproduce: env, account, browser, region, version
  -> Classify:
       JS: Console, error monitoring, source map
       Assets: Network, 404, MIME, CDN
       Network: API status, CORS, auth, gateway
       Cache: index.html, hash, CDN, service worker
       Config: env, config.js, domain, flags
  -> Judge impact: all users / gradual / one tenant / one browser
  -> Action: fix config / purge CDN / roll back / hot fix
  -> Verify: critical path + metrics recovered
```

## Oral questions

### 1. A user says "it is a blank screen on open". How do you debug?

> Answer template: I would first confirm impact: all users, some users, some browsers, or gradual-rollout users. Then debug in three buckets. First, Console and error monitoring: is there a JS runtime exception, and can source maps restore the stack? Second, Network: are entry HTML, JS, and CSS 200? Are there hashed-asset 404s, MIME errors, or CDN issues? Third, APIs and config: did the config file, user-info API, or permission API that startup depends on fail? If a core path is fully down, roll back to the last stable version first, then keep locating the cause. Do not stare only at code; also check cache, env vars, Nginx, and CDN.

### 2. You shipped, but users still see the old page. What might cause that?

> Answer template: I would suspect the cache chain first. First, is `index.html` strongly cached? If HTML did not update, users will keep loading old hashed assets. Second, is the CDN still caching old HTML or not fetching origin correctly? Third, browser cache and service worker, especially PWA or offline caches intercepting requests. Fourth, did the deploy actually switch to the new image or new static directory, vs the script succeeding while the old container still runs? Fixes are usually adjusting HTML cache headers, purging CDN, handling the service worker, and confirming new-version assets line up with the release.

## 5-minute recording outline

1. The three-way troubleshooting split (1.5 minutes)
2. Typical blank-screen chain (2 minutes)
3. Typical cache mix-up chain (1.5 minutes)

## Today's review

1. Most likely follow-up: a blank screen is not one root cause. You must quickly split it into JS, assets, APIs, cache, and config.
2. Current gap: troubleshooting needs concrete commands or evidence, such as Network response headers, error-monitoring release, and container image tags.
3. Next to add: Day 28 should walk the full deploy chain smoothly and turn it into a 15-question answer book.
