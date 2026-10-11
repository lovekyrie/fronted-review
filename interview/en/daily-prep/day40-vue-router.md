# Day 40 Vue Router Internals

## Goals

- Finish `/en/framework/vue/router`
- Produce a comparison table of hash / history / memory modes
- Draw a full chain diagram from `push` to `<router-view>` update

## Read in order

1. [Vue Router](../framework/vue/router)

## Practice and self-check

**Checkpoints**

- Hash mode needs no backend help, but the URL has `#`; history mode needs the server to fall back to `index.html`
- `<router-view>` gets the current match via dependency injection; switching routes triggers its own reactive update
- Navigation guard order: beforeEach → beforeRouteLeave → beforeResolve → afterEach

**Produce or redraw from memory**

- Three routing modes — [reference section](../framework/vue/router#day-40-three-routing-modes)
- Full navigation guard order — [reference section](../framework/vue/router#day-40-full-navigation-guard-order)
- How router-view updates — [reference section](../framework/vue/router#day-40-how-router-view-updates)
- Dynamic routes + lazy loading — [reference section](../framework/vue/router#day-40-dynamic-routes-lazy-loading)
- Minimal hash router — [reference section](../framework/vue/router#day-40-minimal-hash-router)
- Chain from push to router-view update — [reference section](../framework/vue/router#day-40-chain-from-push-to-router-view-update)

**Answer aloud without reading a reference answer**

- 1. What is the difference between hash and history mode?
- 2. Walk through navigation guard order?

**Recording drill**

Record in this order; do not restructure on the fly:

1. Three modes + how to choose (1.5 minutes)
2. Full navigation guard order (walk through the 10 steps) (2 minutes)
3. Lazy loading + route-level code splitting + router-view reactive update (1.5 minutes)

Self-check after recording:

- Did you say hash needs no backend, history needs fallback?
- Did you name at least 7 guard steps?
- Did you say `beforeRouteEnter` cannot access this?
- Did you say route lazy loading is dynamic import?

## Recap

Three points to fill in today:

1. `scrollBehavior` restoring scroll position after a route change.
2. Using `addRoute / removeRoute` dynamic routes in a permission system.
3. `<router-view v-slot>` used with `<Transition>` and `<KeepAlive>`.
