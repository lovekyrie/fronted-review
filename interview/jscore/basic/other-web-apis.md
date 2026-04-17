# 其他高频 Web API：IntersectionObserver / MutationObserver / sendBeacon

## 一、IntersectionObserver（可见性观察）

### 典型场景

- 图片懒加载。
- 曝光埋点。
- 无限滚动加载。

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

## 二、MutationObserver（DOM 变更观察）

### 典型场景

- 监听第三方组件注入内容。
- 监控节点增删做自动增强处理。

```js
const mo = new MutationObserver((mutations) => {
  for (const m of mutations) console.log(m.type, m.target)
})
mo.observe(document.body, { childList: true, subtree: true })
```

## 三、navigator.sendBeacon（卸载时可靠上报）

### 典型场景

- 页面关闭前上报日志/埋点。
- 避免 `fetch` 在页面卸载时被中断。

```js
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/api/track', JSON.stringify({ event: 'page_hide' }))
  }
})
```

## 四、面试要点

- `sendBeacon` 是异步非阻塞，适合小体积数据，不适合大 payload。
- `IntersectionObserver` 比 scroll 监听更省性能。
- `MutationObserver` 要控制观察范围，避免高频回调开销。
