# Mobile adaptation and cross-end

## 1. Mobile adaptation

### The 1px problem

On high-DPR screens CSS `1px` looks thick. Fix with `transform: scale` or a viewport trick.

### rem / vw

- `rem`: scale from the root font size. Common in older codebases.
- `vw`: computed from viewport width. Simpler for responsive layouts.

### Safe area

Notched devices need `env(safe-area-inset-*)`.

```css
.footer {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

## 2. Cross-end (enough for interviews)

- Mini programs: two threads (logic vs view, talking across the bridge).
- React Native: JS drives native views.
- Flutter: its own renderer; more consistent across platforms.

## 3. How to answer

Tie it to a mobile project you shipped: problem → approach → result. That beats reciting terms.

## Daily practice reference

### Day 74: Three cross-platform lines

| Line | Tech | Traits | Fits |
|------|------|------|------|
| **Hybrid** | WebView + JSBridge | Fast to ship, average perf | Heavy presentation, light interaction |
| **Native render** | React Native / Weex | Near-native perf | Medium interaction |
| **Self-drawn engine** | Flutter | High perf, consistent across platforms | Heavy interaction / animation |
| **Mini program** | WeChat / Alipay | Distribution inside the ecosystem | Light apps, marketing |
