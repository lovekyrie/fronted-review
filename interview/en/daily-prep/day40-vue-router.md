# Day 40 Vue Router Internals Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 40 | Vue Router | [Vue Router](../framework/vue/router) |

## Today's goals

- Finish `/en/framework/vue/router`
- Produce a comparison table of hash / history / memory modes
- Draw a full chain diagram from `push` to `<router-view>` update

## Reading checkpoints

- Hash mode needs no backend help, but the URL has `#`; history mode needs the server to fall back to `index.html`
- `<router-view>` gets the current match via dependency injection; switching routes triggers its own reactive update
- Navigation guard order: beforeEach → beforeRouteLeave → beforeResolve → afterEach

## Cheat sheet / knowledge points

### Three routing modes

| Mode | URL | Mechanism | Backend |
|------|-----|------|----------|
| hash | `/#/about` | `hashchange` event | Not needed |
| history | `/about` | `popstate` + `pushState` | Needs fallback to index.html |
| memory | no URL change | in-memory store | Not needed |

### Full navigation guard order

```text
1. beforeRouteLeave (leaving component)
2. beforeEach (global before)
3. beforeRouteUpdate (reused component, e.g. /user/1 → /user/2)
4. beforeEnter (per-route)
5. Resolve async components
6. beforeRouteEnter (entering component, no this)
7. beforeResolve (global resolve)
8. afterEach (global after)
9. DOM update
10. beforeRouteEnter next(vm => {}) callback
```

### How router-view updates

`currentRoute` is a reactive ref → it changes on route switch → `<router-view>` injects the matched component → re-render.

### Dynamic routes + lazy loading

```js
{ path: '/user/:id', component: () => import('./User.vue') }
// get params via useRoute().params.id
```

## Hands-on / flowcharts

### Minimal hash router

```js
class MiniRouter {
  constructor(routes) {
    this.routes = routes
    this.current = window.location.hash.slice(1) || '/'
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
  push(path) { window.location.hash = path }
  match() { return this.routes.find(r => r.path === this.current) }
}
```

### Chain from push to router-view update

```text
router.push('/about')
  → history.pushState / location.hash = '#/about'
  → match the route table → find the matched component
  → update currentRoute (shallowRef)
  → router-view detects the reactive change
  → render the new component
```

## Oral questions

### 1. What is the difference between hash and history mode?

Answer template:

> Hash mode uses the part after `#` in the URL as the route path and listens with the `hashchange` event. The upside is no backend cooperation, because content after `#` is not sent to the server. The downside is an ugly URL, and changing the part before `#` will refresh the page.
>
> History mode uses HTML5 `pushState / replaceState` to change the URL and listens to browser back/forward with `popstate`. The URL is clean with no `#`, but the backend must fall back every route to `index.html`, otherwise visiting `/about` directly returns 404.
>
> Choice: most projects use history mode (with Nginx `try_files`); use hash mode for static hosting or when the backend is hard to change.

### 2. Walk through navigation guard order?

Answer template:

> Full order: first `beforeRouteLeave` on the leaving component, then global `beforeEach`, then `beforeRouteUpdate` if the component is reused (for example param change), then per-route `beforeEnter`, then resolve async components, then the entering component’s `beforeRouteEnter` (no this yet), then global `beforeResolve`, then global `afterEach`. After the DOM updates, the `beforeRouteEnter` `next(vm => {})` callback runs.
>
> Key point: `beforeEach` must call `next()` or return true, otherwise navigation hangs. `afterEach` has no next; it fits analytics.

## 5-minute recording outline

Record in this order; do not restructure on the fly:

1. Three modes + how to choose (1.5 minutes)
2. Full navigation guard order (walk through the 10 steps) (2 minutes)
3. Lazy loading + route-level code splitting + router-view reactive update (1.5 minutes)

Self-check after recording:

- Did you say hash needs no backend, history needs fallback?
- Did you name at least 7 guard steps?
- Did you say `beforeRouteEnter` cannot access this?
- Did you say route lazy loading is dynamic import?

## Today's review

Three points to fill in today:

1. `scrollBehavior` restoring scroll position after a route change.
2. Using `addRoute / removeRoute` dynamic routes in a permission system.
3. `<router-view v-slot>` used with `<Transition>` and `<KeepAlive>`.
