# Other high-frequency Web APIs: IntersectionObserver / MutationObserver / sendBeacon

## 1. IntersectionObserver (visibility)

### Typical uses

- Image lazy load.
- Impression tracking.
- Infinite scroll.

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log('visible:', entry.target)
    }
  })
})
io.observe(document.querySelector('#target'))
```

## 2. MutationObserver (DOM changes)

### Typical uses

- Watch content injected by a third-party widget.
- Auto-enhance nodes when they are added or removed.

```js
const mo = new MutationObserver((mutations) => {
  for (const m of mutations) console.log(m.type, m.target)
})
mo.observe(document.body, { childList: true, subtree: true })
```

## 3. navigator.sendBeacon (reliable report on unload)

### Typical uses

- Send logs / analytics when the page is closing.
- Avoid `fetch` being cancelled during unload.

```js
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/api/track', JSON.stringify({ event: 'page_hide' }))
  }
})
```

## 4. Interview points

- `sendBeacon` is async and non-blocking. Good for small payloads, not large ones.
- `IntersectionObserver` is cheaper than listening to scroll.
- Keep `MutationObserver` scoped; a wide tree plus frequent callbacks is expensive.
