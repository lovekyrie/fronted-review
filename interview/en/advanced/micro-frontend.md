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
