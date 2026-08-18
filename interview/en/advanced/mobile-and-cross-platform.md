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
