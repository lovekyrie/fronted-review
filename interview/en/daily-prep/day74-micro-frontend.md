# Day 74 micro-frontends + mobile / cross-platform — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 74 | Micro-frontends / cross-platform | [Micro-frontends](../advanced/micro-frontend), [Mobile & cross-platform](../advanced/mobile-and-cross-platform) |

## Today's goals

- Finish `/en/advanced/micro-frontend`, `/en/advanced/mobile-and-cross-platform`
- Output a micro-frontend comparison: qiankun / Module Federation / Web Components / iframe
- Output three cross-platform lines: Hybrid (WebView) / RN / Flutter / mini programs

## Reading checkpoints

- Micro-frontends must solve: sub-app isolation, communication, style isolation, shared assets, login state
- MF shares deps at build time; qiankun sandboxes at runtime — different ecosystems and mental cost
- Cross-platform follows **product shape**: heavy interaction → native; heavy presentation → H5 / mini program

## Cheat sheet / knowledge

### Four micro-frontend options

| Option | Idea | Isolation | Communication | Fits |
|------|------|------|------|------|
| **iframe** | Native sandbox | Strongest | postMessage | Simple embed, isolation is critical |
| **qiankun** | Runtime sandbox + HTML entry | JS/CSS sandbox | Global state / CustomEvent | Multi-team independent deploy |
| **Module Federation** | Share modules at build time | No isolation | Shared state | Same stack, shared deps |
| **Web Components** | Shadow DOM isolation | CSS isolation | Props / events | Cross-framework component libs |

### Core problems

| Problem | Approach |
|------|----------|
| **JS sandbox** | qiankun: Proxy snapshot / iframe sandbox |
| **CSS isolation** | Shadow DOM / CSS Modules / namespace prefix |
| **Sub-app communication** | Host props / global EventBus / shared Store |
| **Route dispatch** | Host watches route prefix, dispatches to the matching sub-app |
| **Shared assets** | MF shares React/Vue; qiankun externals |
| **Login state** | Host owns login; share cookie or pass token down |

### Three cross-platform lines

| Line | Tech | Traits | Fits |
|------|------|------|------|
| **Hybrid** | WebView + JSBridge | Fast to ship, average perf | Heavy presentation, light interaction |
| **Native render** | React Native / Weex | Near-native perf | Medium interaction |
| **Self-drawn engine** | Flutter | High perf, consistent across platforms | Heavy interaction / animation |
| **Mini program** | WeChat / Alipay | Distribution inside the ecosystem | Light apps, marketing |

## Handwritten / flow

### Architecture

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

### Sub-app lifecycle

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

## Spoken questions

### 1. Why qiankun vs MF?

Answer template:

> Depends on the team. Multi-team, mixed stacks, independent deploy — pick **qiankun**. It loads at runtime, sub-apps are fully independent, Vue + React can mix, and you get JS/CSS sandboxes. Cost: sandbox overhead, and sub-apps must export lifecycle functions.
>
> Same stack, need shared deps — pick **Module Federation**. It shares modules at build time, React / Vue load once, and you import remote components at runtime. Cost: no isolation; version conflicts are yours.
>
> Simple third-party embed — just use **iframe**: strongest isolation, weakest communication. No silver bullet; pick the simplest option for the product.

### 2. How do H5 and mini programs share logic?

Answer template:

> Split three layers. UI is written per platform (H5 in Vue/React, mini programs native or Taro/uni-app). Logic is pure TS services / utils / hooks shared by both. Data (API client, state) is its own package too.
>
> For one codebase on many targets, use a cross-platform framework: **Taro** (React syntax → mini program / H5 / RN) or **uni-app** (Vue syntax → all platforms). Caveat: “write once, run everywhere” always hits platform gaps in complex cases — leave room for conditional compilation.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Core micro-frontend problems (JS sandbox / CSS isolation / communication / routing) (1.5 min)
2. Four options + how to choose (2 min)
3. Three cross-platform lines + H5 / mini-program sharing (1.5 min)

After recording, self-check:

- Did you state the core difference between qiankun and MF (runtime vs build time).
- Did you explain JS sandbox and CSS isolation.
- Did you mention limits of cross-platform frameworks.
- Did you say the choice follows product shape.

## Today's recap

The 3 points that most need a follow-up today:

1. qiankun Proxy sandbox internals (snapshot sandbox vs Proxy sandbox).
2. Module Federation in Vite (`vite-plugin-federation`).
3. Architecture differences between Taro 3 and uni-app.
