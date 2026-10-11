# Micro-frontends: idea and landing

## 1. Why

- Several teams in parallel without a tightly coupled monorepo.
- Mixed stacks and gradual migration.
- Sub-apps deploy on their own, so releases get faster.

## 2. Iframe pain

- Awkward communication (`postMessage` is expensive).
- Routing and history are split.
- Style and UX feel disconnected; SEO is weak.

## 3. Mainstream options

- **Qiankun**: on single-spa; runtime integration and sandboxing.
- **Module Federation**: share modules at build/runtime; good for component reuse.

## 4. Core problems

### Sandbox

- JS isolation: keep sub-apps off the global object.
- Style isolation: prefixes, Shadow DOM, CSS Modules, etc.

### Communication

- A shared event bus or state hub.
- Cross-app: business data only, not implementation details.

## 5. How to answer

Name both the gain and the extra complexity. That shows you can trade off in production.

## Daily practice reference

### Day 74: Four micro-frontend options

| Option | Idea | Isolation | Communication | Fits |
|------|------|------|------|------|
| **iframe** | Native sandbox | Strongest | postMessage | Simple embed, isolation is critical |
| **qiankun** | Runtime sandbox + HTML entry | JS/CSS sandbox | Global state / CustomEvent | Multi-team independent deploy |
| **Module Federation** | Share modules at build time | No isolation | Shared state | Same stack, shared deps |
| **Web Components** | Shadow DOM isolation | CSS isolation | Props / events | Cross-framework component libs |

### Day 74: Core problems

| Problem | Approach |
|------|----------|
| **JS sandbox** | qiankun: Proxy snapshot / iframe sandbox |
| **CSS isolation** | Shadow DOM / CSS Modules / namespace prefix |
| **Sub-app communication** | Host props / global EventBus / shared Store |
| **Route dispatch** | Host watches route prefix, dispatches to the matching sub-app |
| **Shared assets** | MF shares React/Vue; qiankun externals |
| **Login state** | Host owns login; share cookie or pass token down |

### Day 74: Architecture

```text
Host (route dispatch + global Layout + login state)
  ├─ /app-a/* → sub-app A (Vue 3, own repo/deploy)
  │   ├─ mount(container) → render into the given container
  │   └─ unmount() → cleanup
  ├─ /app-b/* → sub-app B (React 18, own repo/deploy)
  └─ /app-c/* → sub-app C (Angular, own repo/deploy)

qiankun flow:
  registerMicroApps([
    { name: 'app-a', entry: '//a.example.com', container: '#sub', activeRule: '/app-a' }
  ])
  → match route → load HTML entry → run JS → call bootstrap/mount
  → route change → call unmount → load the next sub-app
```

### Day 74: Sub-app lifecycle

```ts
// sub-app entry
let app: App | null = null

export async function bootstrap() {
  // init (called once)
}

export async function mount(props: { container: HTMLElement }) {
  app = createApp(Root)
  app.mount(props.container.querySelector('#app')!)
}

export async function unmount() {
  app?.unmount()
  app = null
}
```
