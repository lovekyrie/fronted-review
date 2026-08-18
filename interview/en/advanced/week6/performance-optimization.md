### Frontend Performance Optimization

For senior frontend interviews, performance optimization cannot stop at “compress images, lazy load, code split”. A better way to answer is:

1. first say which metrics you care about
2. then say how you locate bottlenecks
3. finally say how you optimize and trade off for different bottlenecks

In other words, performance optimization is not “reciting an optimization checklist”. You need this chain:

`metric anomaly -> collect data -> locate bottleneck -> pick optimizations -> verify gains -> keep monitoring`

#### 1. Which metrics to look at first

Without metrics, so-called optimization easily becomes a gut feeling.

##### 1.1 Core Web Vitals

The three metrics most often asked in modern frontend interviews:

- `LCP`: Largest Contentful Paint, time to paint the largest content
- `INP`: Interaction to Next Paint, delay from interaction to the next paint
- `CLS`: Cumulative Layout Shift, cumulative layout shift

A rough reading:

- LCP looks at “how soon the main first-screen content appears”
- INP looks at “how soon the page responds after a user action”
- CLS looks at “whether the page jumps around”

##### 1.2 Other common metrics

- `FCP`: First Contentful Paint
- `TTFB`: Time to First Byte
- `TBT`: Total Blocking Time
- custom business metrics: search-result first screen time, time to first clickable, time to first chart render

A better senior-interview framing is not “more metrics is better”, but: **different pages and business scenarios have different key metrics. Content pages care more about LCP; interaction-heavy pages care more about INP.**

#### 2. How to locate a performance problem first

Locate before you optimize, or you easily go the wrong way.

##### 2.1 First tell which layer is slow

You can roughly split into four kinds:

1. **Slow network**: too many requests, assets too large, poor cache, weak CDN
2. **Slow parse and execute**: large JS, long main-thread tasks, high init cost
3. **Slow render**: style calc, layout, paint, composite cost is high
4. **Slow interaction**: heavy event handlers, long state-update chains, rendering blocking input

##### 2.2 Common locating tools

- Chrome DevTools Performance
- Network panel
- Lighthouse
- PerformanceObserver
- Web Vitals collection
- error monitoring and RUM platforms

In interviews, do not only say “I use Lighthouse”. Lighthouse is better as a baseline check. Complex performance issues usually still need:

- request waterfall
- main-thread flame chart
- long tasks
- sources of layout shift
- real-user sampling data

#### 3. Understand performance from the browser render pipeline

To show a page, the browser roughly goes through:

`HTML parse -> DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite`

This chain explains why many optimizations work.

##### 3.1 Layout / Reflow

When element size or position changes, the browser may need to recompute layout.

Easy triggers include:

- frequently changing `width`, `height`, `top`, `left`
- alternating reads and writes of layout info, causing layout thrashing
- large-scale reflow of many nodes

```js
const width = element.offsetWidth
element.style.width = `${width + 10}px`
```

If this kind of read/write happens in a loop, performance will be poor.

##### 3.2 Paint

After layout, the browser still has to paint pixels.

High-cost scenes include:

- large-area shadows and blur
- complex gradients
- lots of stacked images
- high-frequency color or background changes

##### 3.3 Composite

Some animations can stay in the composite stage, without relayout or repainting the whole page.

Properties that are usually better for animation:

- `transform`
- `opacity`

That is why animation optimization often says “prefer transform over top/left”.

#### 4. First-screen load optimization

##### 4.1 Network layer

When first screen is slow, look at the resource-load chain first:

- too many serial requests
- first-screen JS / CSS too large
- images too large
- whether CDN is hit
- whether compression is used correctly

Common actions:

- enable gzip / brotli
- image compression and modern formats
- CDN distribution
- reduce the number of critical first-screen requests
- `preconnect` / `preload`

```html
<link rel="preconnect" href="https://api.example.com">
<link rel="preload" href="/assets/critical.css" as="style">
```

##### 4.2 Code layer

A lot of slow first screens are essentially too-heavy JS init.

Common problems:

- main bundle too large
- routes not split
- large components loaded on first screen
- charts, editors, SDKs initialized too early

Common actions:

- route-level code splitting
- dynamic import of infrequent modules
- delay init of non-critical features
- split vendor and async chunks

```js
const Editor = lazy(() => import('./Editor'))
```

##### 4.3 SSR / SSG / CSR trade-offs

First-screen performance often ties to the rendering strategy.

- `CSR`: fully rendered on the client, simpler interaction model, but first screen depends on JS
- `SSR`: first-screen HTML is visible sooner, but server cost is higher and hydration is more complex
- `SSG`: fits docs, marketing pages, content pages

A better senior-interview answer is: **not every page should SSR. It depends on whether the page is SEO-heavy, first-screen-heavy, or real-time-interaction-heavy.**

#### 5. Interaction performance optimization

This is the part that now separates people more than first screen alone.

##### 5.1 Why INP gets worse

Common causes:

- long tasks on the main thread after a click
- heavy computation in event handlers
- one interaction triggering a large state update
- large lists re-rendering
- layout and paint cost too high

##### 5.2 Common optimization actions

- split long tasks
- defer non-critical work with `requestIdleCallback` / a scheduler mindset
- debounce / throttle
- virtual lists
- decouple input state from heavy computed results
- use React transition / deferred value, or Vue scheduling reasonably

```js
function debounce(fn, delay) {
  let timer = null

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

##### 5.3 Long tasks

Main-thread tasks over about 50ms clearly hurt interaction.

If a click has to do a lot of work, common optimizations:

- chunked execution
- Web Worker
- reduce synchronous blocking logic

```js
const worker = new Worker('worker.js')
worker.postMessage(largeData)
worker.onmessage = (event) => {
  renderChart(event.data)
}
```

#### 6. Large lists and complex UI

##### 6.1 List rendering

Common large-list problems:

- too many DOM nodes
- every filter or sort fully re-renders
- every item binds complex events and style calc

Optimizations:

- virtual lists
- pagination or chunked loading
- stable keys
- reduce per-item component cost

##### 6.2 Avoid meaningless renders

Whether React or Vue, the essence is the same:

- cut unnecessary dependency propagation
- reduce unrelated component re-renders
- put state at the right level

In senior interviews you can say it directly: a lot of performance work is not “add another memo”, but “get the data flow right first”. If state boundaries are wrong, every optimization is just a patch.

#### 7. Image and media optimization

Images are often the key LCP source on content pages.

Common actions:

- compress images
- use WebP / AVIF
- serve different assets for different sizes
- lazy-load below-the-fold images
- preload the first-screen hero image
- fix dimensions to avoid layout shift

```html
<img
  src="/banner.webp"
  width="1200"
  height="600"
  loading="lazy"
  alt="banner"
>
```

Notes:

- the critical first-screen image is not necessarily a good candidate for lazy load
- images without width/height easily cause CLS

#### 8. Cache strategy and versioning

Performance optimization cannot only look at the first visit. Return visits matter too.

##### 8.1 Long cache for static assets

For hashed static assets, you can usually use a long cache:

```http
Cache-Control: public, max-age=31536000, immutable
```

The premise is that the filename changes with content, for example:

- `app.8f3e2d.js`
- `vendor.a1b2c3.css`

##### 8.2 HTML should not be strongly cached for a long time

Entry HTML usually carries the latest asset references, so it is usually a better fit for:

```http
Cache-Control: no-cache
```

Let the browser revalidate HTML every time, then decide whether to fetch new assets.

##### 8.3 Service Worker

A Service Worker can do offline cache, request intercept, and more flexible cache strategies, but it also adds update complexity:

- cleaning old caches
- activation timing
- asset version consistency
- debugging complexity

So a senior answer should not blindly say “just add a Service Worker”. It is a capability, not the default best answer.

#### 9. CLS and layout stability

Bad CLS is usually not because the page is “slow”, but because elements keep jumping while loading.

Common sources:

- images without reserved size
- ads or async modules inserting content later
- font swaps causing text reflow
- dynamically inserting a banner or toast

Optimization actions:

- give images and containers explicit width/height or aspect-ratio
- reserve skeleton space for async content
- avoid suddenly inserting elements above existing content
- use web fonts carefully, with a reasonable fallback strategy

#### 10. How to answer “what performance work have you done”

Senior interviews do not count how many terms you list. They look at whether you can tell a closed loop.

A better answer structure:

1. first the scene: which page, which business, which metric was off
2. then locating: what data found the issue
3. then actions: what you changed in network, render, code, and cache
4. finally results: how much metrics improved, and any side effects or trade-offs

For example:

- first-screen LCP from `4.8s` to `2.6s`
- main bundle from `1.2MB` to `420KB`
- search-interaction long task from `180ms` to `40ms`

That is more convincing than “I did lazy load, compressed images, and used cache”.

#### 11. High-frequency interview questions

##### 11.1 How do you investigate a slow first screen

First distinguish whether it is TTFB, asset loading, JS execution, or render that is slow, then use Network, Performance, Lighthouse, and real-user monitoring to judge the bottleneck. Do not jump straight to code splitting.

##### 11.2 Why `transform` animations are usually more stable than `top/left`

Because `transform` is more likely to stay in the composite stage, while `top/left` often trigger layout and repaint.

##### 11.3 Why images often affect LCP

Because on many pages the largest contentful element is a first-screen large image or a large heading area. If the image is heavy, loads late, has no preload, or misses CDN, LCP will be poor.

##### 11.4 Why deep performance work cannot leave data-flow design

Because many render issues are really wrong state boundaries, unrelated component updates, and overly long compute chains. Memo or caching alone cannot fix waste at the data-flow layer.

##### 11.5 Can performance work conflict with security and maintainability

Yes. For example, over-inlining assets can hurt cache strategy; over-compressing or over-asyncing can raise debugging cost; a Service Worker can make versioning more complex. A senior frontend should be able to explain these trade-offs.

#### 12. Interview answer suggestions

If you are asked about performance, do not recite “assets, network, render” by rote. A more solid order is:

1. first which metrics you look at
2. then how you locate problems
3. then optimization actions for different bottlenecks
4. finally walk one real chain with gains and trade-offs

That upgrades the answer from “knows some tricks” to “can systematically govern performance”.
