# System design: component library, monitoring SDK, global dialog

## 1. Designing a shared component library

### Goals

- High reuse, themable, tree-shakable, well typed.

### Design points

- Layers: primitives, business components, utils.
- API: consistent names, consistent controlled / uncontrolled patterns.
- Style: CSS variables + design tokens.
- Engineering: docs site, unit tests, E2E, changelog, versioning.

### Bonus

- ESM exports that tree-shake well.
- a11y and i18n.

## 2. Designing a frontend monitoring SDK

### Collect

- Errors: `window.onerror`, `unhandledrejection`, framework error boundaries.
- Perf: FCP / LCP / CLS / INP, resource timing, API timing.
- Behavior: PV, route changes, key click paths.

### Report

- Sampling (by env, user, page).
- Batch + throttle (prefer `sendBeacon`).
- Offline catch-up (retry + local queue).

### Governance

- PII redaction, denylist, remote config.
- Source maps to restore stacks, tied to a version.

## 3. Designing a global dialog

### Capabilities

- Imperative API: `open`, `close`, `confirm`, `destroy`.
- Queue: serial vs parallel when several dialogs open.
- Lifecycle: open / confirm / cancel / close callbacks.
- a11y: focus trap, Esc to close, lock background scroll.

### Common traps

- Incomplete destroy → leaks.
- z-index clashes across instances.
- Double-submit on async confirm (need a loading lock).

## 4. Generic answer template

1. Define the goal and the boundary.
2. Split core modules and the main path.
3. Add stability and observability.
4. End with how it evolves and what you gain in production.
