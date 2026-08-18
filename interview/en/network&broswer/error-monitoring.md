# Error Monitoring and Frontend Exception Handling

In senior frontend interviews, error monitoring should not stop at “`window.onerror` + a report API”. A more complete answer is:

`collect exceptions -> enrich context -> dedupe/sample -> report -> aggregate and alert -> restore with Source Map -> bind to a version -> troubleshoot and roll back`

The real value is not “I can collect errors”, but “I can use this system to govern production”.

## 1. What a Frontend Exception System Must Cover

Frontend exceptions fall into at least four categories:

1. **JS runtime errors**
2. **Unhandled Promise rejections**
3. **Resource load errors**
4. **Framework-level errors**

You can also extend to:

- White screen
- Routing exceptions
- API exceptions
- Custom business exceptions

If the system only collects `window.onerror`, coverage is clearly insufficient.

## 2. Common Collection Entry Points

### 1. JS Runtime Errors

```js
window.onerror = function (message, source, lineno, colno, error) {
  reportError({
    type: 'js_error',
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
  })
}
```

Suitable for capturing runtime errors during synchronous execution.

### 2. Unhandled Promise Rejections

```js
window.addEventListener('unhandledrejection', (event) => {
  reportError({
    type: 'unhandledrejection',
    reason: String(event.reason),
    stack: event.reason?.stack,
  })
})
```

If you only collect `window.onerror`, these errors will be missed.

### 3. Resource Load Errors

```js
window.addEventListener(
  'error',
  (event) => {
    const target = event.target

    if (target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement) {
      reportError({
        type: 'resource_error',
        tagName: target.tagName,
        url: target.src || target.href,
      })
    }
  },
  true,
)
```

This usually needs the capture phase, because resource errors are not as easy to get as normal bubbling events.

### 4. Framework-Level Errors

React:

```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    reportError({
      type: 'react_error',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }
}
```

Vue:

```js
app.config.errorHandler = (error, instance, info) => {
  reportError({
    type: 'vue_error',
    message: error.message,
    stack: error.stack,
    info,
  })
}
```

The value of framework-level errors is that they can add component tree, component stack, and reactive context — information closer to the business.

## 3. What Else to Send Besides the Error Itself

An error event that is actually useful for troubleshooting usually needs at least this context:

- Page URL
- Route information
- User identifier or anonymous session id
- Browser / OS / device
- Network status
- Build version
- Commit SHA or release id
- Environment identifier
- Trigger time

If this context is not reported together, later troubleshooting cost rises sharply.

## 4. Why Source Maps Must Be Bound to a Version

Stacks from production minified code are usually not readable as-is:

- File names are hashed
- Line and column numbers refer to the minified artifact
- Code may be bundled, minified, and obfuscated

A Source Map maps a “production minified stack” back to a “source location”. It is only useful when all of the following hold:

1. This Source Map corresponds to the exact version running in production
2. The report includes accurate enough release/version information
3. The monitoring platform can fetch the correct mapping file by version

So the more accurate interview answer is not “just upload a Source Map”, but: **Source Maps must be tightly bound to the build version, the release version, and the error event.**

## 5. A Monitoring System Must Not Report Every Error As-Is

If every exception is reported blindly, the monitoring system itself will be flooded, and it will not help troubleshooting.

### 1. Deduplication

The same class of error may fire repeatedly in a short time.

Common dedupe dimensions:

- message
- stack
- page
- release

### 2. Sampling

Not every error is worth 100% reporting.

Common sampling strategies:

- By environment: full volume in test, sampled in production
- By error type: high sample rate for fatal errors, low for ordinary warnings
- By user or page: higher sample rate for high-value pages

### 3. Rate Limiting

During an exception storm, the monitoring SDK itself must be able to degrade, or it will slow down the product.

## 6. How to Design the Reporting Channel

### 1. Prefer Not Blocking the Main Path

Principle: monitoring failure must not affect the product.

Common approaches:

- `navigator.sendBeacon`
- Async `fetch`
- Image-beacon fallback

```js
navigator.sendBeacon('/monitor', JSON.stringify(payload))
```

### 2. Batch Reporting

Merge multiple events and send them together:

- Fewer requests
- Lower reporting overhead
- Easier server-side aggregation

### 3. Offline and Failure Retry

A more advanced monitoring system will consider:

- Retry on report failure
- Local queue cache
- Best-effort send before the page unloads

## 7. How Error Monitoring Works with Performance Monitoring

In senior frontend interviews, the question is rarely only “collect errors”; it is more often “close the governance loop”.

Common ways they work together:

- Correlate error rate and performance metrics on the same release
- After a release, error rate spikes while LCP / INP also degrade
- Errors concentrate on one page while API failure rate rises

In other words, error monitoring is not an isolated system; it is part of observability.

## 8. White Screens and “No Error Reported, but the Page Is Unusable”

Many incidents do not show up as obvious JS exceptions, but as:

- A white screen
- A blank core region
- Failed route transitions
- Static resource 404s

So error monitoring should also add probes like:

- Whether the root node rendered successfully
- Whether first-screen critical content appeared
- Whether route loading timed out
- The failure rate of static resource loads

Otherwise you will hit “users cannot open the page at all, but the error platform reports almost nothing”.

## 9. Alerting Is Not the Same as Reporting

This is easy to mix up in system governance.

- **Report**: send events to the platform
- **Aggregate**: merge by version, page, and error type
- **Alert**: notify people after a threshold is crossed

Alert policy should at least consider:

- Error-rate thresholds
- New-release windows
- Separate thresholds for high-value pages
- Whether to correlate with business metrics

Otherwise alerts are either too noisy or completely insensitive.

## 10. Common Senior Interview Follow-ups

### Q1: Can `window.onerror` catch every error?

No. Unhandled Promise rejections need `unhandledrejection`, resource load errors need a separate listener, and framework-level errors need their own entry points.

### Q2: Why should Source Maps not be exposed publicly?

They can leak source structure and business implementation details. A safer approach is to upload them to the monitoring platform and restore stacks by version with authorization.

### Q3: How do you keep monitoring from affecting the main path?

Async reporting, batching, rate limiting, sampling, a degrade switch, and never blocking the product on failure.

### Q4: How do you decide an error is worth alerting on?

Look at severity, user impact, page value, whether a new version introduced it, and whether it correlates with business loss — not just “whether an error was reported”.

## 11. Interview Answer Tips

If asked about error monitoring, do not only say “I would integrate Sentry”. A more solid structure is:

1. Start with exception coverage
2. Then collection, reporting, and version mapping
3. Then deduplication, sampling, and rate limiting
4. Finally close the loop with alerting, troubleshooting, and rollback

That upgrades the answer from “I can plug in a monitoring SDK” to “I understand a production governance system”.
