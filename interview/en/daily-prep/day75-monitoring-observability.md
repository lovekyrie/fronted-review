# Day 75 monitoring / error tracking / observability — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 75 | Monitoring / observability | [Error monitoring](../network&broswer/error-monitoring), [Observability](../network&broswer/observability-system) |

## Today's goals

- Finish `/en/network&broswer/error-monitoring`, `/en/observability-system`
- Output the three pillars of frontend observability: logs / metrics / traces
- Draw an error-report pipeline: capture → aggregate → report → consume

## Reading checkpoints

- Frontend error sources: JS error, Promise rejection, resource load failure, API error, white screen
- Report with `sendBeacon` / `fetch keepalive` so unload does not drop events
- Logs must carry a release version and sourcemap, or production stacks are useless

## Cheat sheet / knowledge

### Three pillars

| Pillar | Meaning | Frontend tools |
|----|------|----------|
| **Logs** | Error logs, user-behavior logs | Sentry / in-house SDK |
| **Metrics** | Perf metrics, business metrics | web-vitals / PerformanceObserver |
| **Traces** | Request tracing | Distributed trace-id (frontend + backend) |

### Error types

| Type | How to catch |
|------|----------|
| JS runtime | `window.onerror` / `window.addEventListener('error')` |
| Unhandled Promise | `window.addEventListener('unhandledrejection')` |
| Resource load failure | `window.addEventListener('error', ..., true)` (capture phase) |
| API error | Request interceptor (axios interceptor) |
| White screen | Periodic DOM sampling / MutationObserver |
| Framework error | Vue `errorHandler` / React `ErrorBoundary` |

### Error-report design

```text
1. Capture: global listeners + framework hooks
2. Format: message + stack + user + page URL + time + release
3. Aggregate: merge by fingerprint so duplicates collapse
4. Sample: non-P0 errors sampled (10%-100%)
5. Report: sendBeacon / fetch keepalive (still sends on unload)
6. Consume: log service → aggregate → alert → SourceMap the stack
```

### When to report

| Method | Scene |
|------|------|
| `navigator.sendBeacon(url, data)` | Page unload (preferred) |
| `fetch(url, { keepalive: true })` | sendBeacon alternative |
| Buffer + timer | Non-urgent logs (fewer requests) |
| Immediate | P0 errors (white screen / payment failure) |

### SourceMap restore

```text
Production JS is minified → line numbers in the stack are useless
→ emit .map at build time, upload to Sentry / log service
→ reports carry a release → server restores the real stack with source-map
→ do not publish .map to the CDN (security)
```

## Handwritten / flow

### Capture pipeline

```text
Browser runtime
  ├─ window.onerror → JS error
  ├─ unhandledrejection → Promise error
  ├─ addEventListener('error', capture) → resource load error
  ├─ Vue errorHandler → component error
  └─ axios interceptor → API error
       ↓
SDK formats
  { message, stack, url, line, col, release, userId, timestamp }
       ↓
Aggregate + sample (fingerprint dedupe, 10% sample for non-P0)
       ↓
sendBeacon / fetch keepalive
       ↓
Log service (Elasticsearch / ClickHouse)
       ↓
SourceMap restore + alert (DingTalk / email)
```

### Minimal error SDK

```ts
class ErrorTracker {
  private buffer: any[] = []
  private timer: ReturnType<typeof setTimeout> | null = null

  init() {
    window.onerror = (msg, url, line, col, error) => {
      this.report({ type: 'js', message: String(msg), stack: error?.stack, url, line, col })
    }
    window.addEventListener('unhandledrejection', (e) => {
      this.report({ type: 'promise', message: String(e.reason) })
    })
    window.addEventListener('error', (e) => {
      if (e.target && (e.target as any).src) {
        this.report({ type: 'resource', url: (e.target as any).src })
      }
    }, true)
  }

  report(data: Record<string, any>) {
    this.buffer.push({ ...data, timestamp: Date.now(), release: __RELEASE__ })
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), 5000)
    }
  }

  flush() {
    if (this.buffer.length === 0) return
    const payload = JSON.stringify(this.buffer)
    navigator.sendBeacon('/api/logs', payload)
    this.buffer = []
    this.timer = null
  }
}
```

## Spoken questions

### 1. How would you layer frontend observability?

Answer template:

> Three pillars. **Logs** — error logs + user-behavior logs. JS errors, unhandled Promises, resource failures, API errors: global listeners + framework hooks, sendBeacon to Sentry or an in-house log service. **Metrics** — perf (LCP/INP/CLS) via web-vitals; business (PV/UV/conversion) via tracking. **Traces** — one trace-id across frontend and backend so cross-service issues are searchable.
>
> The consume path has to exist: capture → aggregate → alert → debug. Capture with nobody looking is the same as not doing it.

### 2. How do you monitor white screens?

Answer template:

> Three options. First, **periodic DOM sampling** — 3-5s after load, check whether body has real children (ignore empty divs). None → white screen, report. Second, **MutationObserver** — watch DOM mutations; if nothing new lands for a long time, fire a white-screen alert. Third, **LCP + fallback** — if LCP has not reported after 10s, it is likely a white screen.
>
> Most teams use the first: after `DOMContentLoaded`, poll for a key node. For an SPA, whether `#app` actually has content.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Three pillars (Logs / Metrics / Traces) (1.5 min)
2. Error pipeline (capture → format → aggregate → report → SourceMap) (2 min)
3. Perf metrics + white-screen monitoring + alerting (1.5 min)

After recording, self-check:

- Did you name 5 error sources and how to catch them.
- Did you mention why sendBeacon helps.
- Did you walk through SourceMap restore.
- Did you describe a white-screen approach.

## Today's recap

The 3 points that most need a follow-up today:

1. Sampling design (P0 100%, P1 at 10%).
2. Session replay (rrweb) — idea and use.
3. Tying frontend APM to backend APM.
