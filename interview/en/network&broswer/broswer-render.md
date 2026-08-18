### Browser Rendering Principles
Browser rendering is the process of turning HTML, CSS, and JavaScript into a page the user can see.

#### 1. Rendering pipeline
##### 1.1 Basic flow
```plaintext
1. Build the DOM tree
   - Parse HTML
   - Create DOM nodes
   - Build the DOM tree

2. Build the CSSOM tree
   - Parse CSS
   - Create CSSOM nodes
   - Build the CSSOM tree

3. Build the render tree
   - Combine DOM and CSSOM
   - Compute styles
   - Build the render tree

4. Layout
   - Compute element positions
   - Compute element sizes
   - Determine where each element sits

5. Paint
   - Fill pixels
   - Paint text
   - Paint images

6. Composite
   - Composite layers
   - Display the page
```

##### 1.2 Reflow and repaint
```javascript
// Operations that trigger reflow
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';
element.style.padding = '10px';
element.style.border = '1px solid red';

// Operations that trigger repaint
element.style.color = 'red';
element.style.background = 'blue';
element.style.visibility = 'hidden';
element.style.opacity = '0.5';

// Avoid reflow and repaint
element.style.transform = 'translateX(100px)';
element.style.willChange = 'transform';
```

#### 2. Rendering optimization
##### 2.1 Performance optimization
```javascript
// Batch DOM updates
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment);

// Use requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Use CSS animations
.element {
  transition: transform 0.3s ease;
}
.element:hover {
  transform: translateX(100px);
}
```

##### 2.2 Layer management
```css
/* Create a new layer */
.element {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

/* Use hardware acceleration */
.element {
  transform: translate3d(0, 0, 0);
  perspective: 1000px;
}
```

#### 3. Render-blocking
##### 3.1 CSS blocking
```html
<!-- Inline critical CSS -->
<style>
  .critical {
    color: red;
  }
</style>

<!-- Load non-critical CSS asynchronously -->
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

##### 3.2 JavaScript blocking
```html
<!-- Load JavaScript asynchronously -->
<script async src="script.js"></script>

<!-- Defer JavaScript -->
<script defer src="script.js"></script>

<!-- Load JavaScript dynamically -->
<script>
  const script = document.createElement('script');
  script.src = 'script.js';
  document.body.appendChild(script);
</script>
```

#### 4. Rendering performance
##### 4.1 Performance metrics
```javascript
// Measure performance
performance.mark('start');
// Run the work
performance.mark('end');
performance.measure('operation', 'start', 'end');

// Use the Performance API
const timing = performance.timing;
const loadTime = timing.loadEventEnd - timing.navigationStart;
```

##### 4.2 Performance monitoring
```javascript
// Monitor reflow and repaint
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});
observer.observe({ entryTypes: ['layout-shift', 'paint'] });
```

#### 5. Best practices
1. Reduce reflow and repaint
2. Use CSS animations
3. Batch DOM updates
4. Use requestAnimationFrame
5. Optimize layer management
6. Reduce render-blocking
7. Use hardware acceleration
8. Optimize JavaScript execution
9. Monitor rendering performance
10. Apply progressive enhancement

#### 6. Common interview questions
1. **Browser rendering pipeline**
   - Build the DOM tree
   - Build the CSSOM tree
   - Build the render tree
   - Layout and paint

2. **How to optimize rendering performance**
   - Reduce reflow and repaint
   - Use CSS animations
   - Batch DOM updates
   - Use requestAnimationFrame

3. **How to handle render-blocking**
   - Handle CSS blocking
   - Handle JavaScript blocking
   - Optimize resource loading
   - Optimize the critical rendering path
