### CSS Animation
CSS animation is a technique that creates motion by changing CSS properties.

#### 1. Transition Animation
##### 1.1 Basic Syntax
```css
.element {
  /* transition property */
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  transition-delay: 0s;

  /* shorthand */
  transition: all 0.3s ease 0s;
}
```

##### 1.2 Transition Properties
```css
.element {
  /* specify transition properties */
  transition-property: width, height, background-color;

  /* duration */
  transition-duration: 0.3s;
  transition-duration: 300ms;

  /* timing function */
  transition-timing-function: ease;
  transition-timing-function: linear;
  transition-timing-function: ease-in;
  transition-timing-function: ease-out;
  transition-timing-function: ease-in-out;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  /* delay */
  transition-delay: 0.2s;
}
```

#### 2. Keyframe Animation
##### 2.1 Basic Syntax
```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 0.5s ease-out;
}
```

##### 2.2 Animation Properties
```css
.element {
  /* animation name */
  animation-name: slideIn;

  /* duration */
  animation-duration: 0.5s;

  /* timing function */
  animation-timing-function: ease-out;

  /* delay */
  animation-delay: 0.2s;

  /* iteration count */
  animation-iteration-count: 1;
  animation-iteration-count: infinite;

  /* direction */
  animation-direction: normal;
  animation-direction: reverse;
  animation-direction: alternate;
  animation-direction: alternate-reverse;

  /* fill mode */
  animation-fill-mode: none;
  animation-fill-mode: forwards;
  animation-fill-mode: backwards;
  animation-fill-mode: both;

  /* play state */
  animation-play-state: running;
  animation-play-state: paused;

  /* shorthand */
  animation: slideIn 0.5s ease-out 0.2s infinite alternate;
}
```

#### 3. Transforms
##### 3.1 2D Transforms
```css
.element {
  /* translate */
  transform: translate(100px, 100px);
  transform: translateX(100px);
  transform: translateY(100px);

  /* rotate */
  transform: rotate(45deg);

  /* scale */
  transform: scale(1.5);
  transform: scaleX(1.5);
  transform: scaleY(1.5);

  /* skew */
  transform: skew(30deg);
  transform: skewX(30deg);
  transform: skewY(30deg);

  /* combined transforms */
  transform: translate(100px, 100px) rotate(45deg) scale(1.5);
}
```

##### 3.2 3D Transforms
```css
.element {
  /* 3D translate */
  transform: translate3d(100px, 100px, 100px);
  transform: translateZ(100px);

  /* 3D rotate */
  transform: rotate3d(1, 1, 1, 45deg);
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);

  /* 3D scale */
  transform: scale3d(1.5, 1.5, 1.5);
  transform: scaleZ(1.5);

  /* perspective */
  perspective: 1000px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
```

#### 4. Animation Effects
##### 4.1 Fade In / Fade Out
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.element {
  animation: fadeIn 0.5s ease-out;
}
```

##### 4.2 Slide Effect
```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 0.5s ease-out;
}
```

##### 4.3 Scale Effect
```css
@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.element {
  animation: scaleIn 0.5s ease-out;
}
```

#### 5. Performance Optimization
##### 5.1 Hardware Acceleration
```css
.element {
  /* enable hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
}
```

##### 5.2 Animation Performance
```css
.element {
  /* avoid reflow */
  transform: translateX(100px);
  
  /* avoid repaint */
  opacity: 0.5;
  
  /* use will-change */
  will-change: transform, opacity;
}
```

#### 6. Best Practices
1. Use transform instead of position properties
2. Avoid frequent reflows
3. Hint the browser with will-change
4. Use animation duration reasonably
5. Consider animation performance
6. Provide fallbacks
7. Mind animation accessibility
8. Manage animations with CSS variables
9. Keep animations simple
10. Test on different devices

#### 7. Common Interview Questions
1. **Differences between CSS animation and JavaScript animation**
   - CSS animation has better performance
   - CSS animation is simpler
   - JavaScript animation is more flexible
   - JavaScript animation can be more complex

2. **How to optimize animation performance**
   - Use transform
   - Avoid reflow and repaint
   - Use will-change
   - Use animation duration reasonably

3. **Accessibility considerations for animation**
   - Provide fallbacks
   - Respect user preferences
   - Avoid excessive animation
   - Provide a pause control

---

#### 8. The Composite Stage in Detail (Why transform/opacity Are Fast)

### Render Pipeline and Compositor Layers
```
JavaScript → Style → Layout → Paint → Composite
                                    ↑
                              only this stage
```

**Only `transform` / `opacity` / `filter` promote to a compositor layer**:
- Do not trigger Layout (relayout)
- Do not trigger Paint (repaint pixels)
- Only apply an affine transform on the GPU

```css
/* high-performance animation (Composite only) */
.high-perf {
  transform: translateX(100px);  /* compositor layer only */
  opacity: 0.5;                  /* compositor layer only */
  filter: blur(5px);             /* handled by the GPU */
}

/* low-performance animation (triggers Layout + Paint) */
.low-perf {
  width: 100px;                 /* triggers Layout */
  background-color: red;        /* triggers Paint */
}
```

### Conditions That Create a Compositor Layer
```css
/* explicitly create a compositor layer */
.layer {
  transform: translateZ(0);          /* create manually */
  will-change: transform;            /* hint the browser */
  backface-visibility: hidden;       /* 3D context */
}

/* implicit creation: created automatically when an element is judged to "need its own layer" */
```

### Side Effects of will-change (Important)
```css
/* problems of overusing will-change */
.bad-example {
  will-change: transform, opacity, top, left, width;
  /* creates many compositor layers and consumes memory */
}

/* correct approach: use only when needed, and remove it promptly */
.optimize {
  will-change: transform;
  /* after the animation: will-change: auto */
}
```

> **High-frequency follow-up**: Why prefer transform for frequent animation? — Because transform compositing happens on the GPU and does not trigger main-thread reflow/repaint, so the animation stays smooth even when the main thread is blocked by JS.

---

#### 9. Animation Frame-Rate Analysis (Using the Performance Panel)

### Key Metric: 60fps
```javascript
// Observe in the Chrome DevTools Performance panel:
// 1. Blue bars (Scripting): JS execution time — keep them short
// 2. Purple bars (Rendering): Layout + Paint — keep them few
// 3. Green bars (Painting): actual painting
// 4. Orange line (60fps line): going over it means dropped frames
```

### Common Causes of Dropped Frames
| Cause | Fix |
|------|------|
| Frequently reading `offsetWidth` (read/write interleaving) | Separate reads and writes with `getComputedStyle` or `requestAnimationFrame` |
| Triggering Forced Reflow | Batch DOM reads/writes |
| Too many compositor layers | Release them promptly with `will-change: auto` |
| Animation area is too large | Promote only the elements that need to animate |

```javascript
// Wrong: interleaved reads/writes cause forced synchronous layout
element.style.width = element.offsetWidth + 10 + 'px'  // forced reflow!
element.style.height = element.offsetHeight + 10 + 'px'

// Correct: batch reads, then batch writes
const width = element.offsetWidth    // read
const height = element.offsetHeight // read
requestAnimationFrame(() => {
  element.style.width = width + 10 + 'px'   // write
  element.style.height = height + 10 + 'px' // write
})
```

---

#### 10. Interview Answer Template

1. **Basics**: First explain the syntax difference between transition and @keyframes (property transition vs keyframe control).
2. **Performance**: Explain that transform/opacity go through the compositor layer and do not trigger reflow/repaint.
3. **will-change trap**: Do not overuse it; it can cause memory issues.
4. **Read/write separation**: Use requestAnimationFrame to avoid forced synchronous layout.
5. **Tooling**: Use the DevTools Performance panel's frame-rate curve to locate problems.
