# Day 74 micro-frontends + mobile / cross-platform — execution log

## Goals

- Finish `/en/advanced/micro-frontend`, `/en/advanced/mobile-and-cross-platform`
- Output a micro-frontend comparison: qiankun / Module Federation / Web Components / iframe
- Output three cross-platform lines: Hybrid (WebView) / RN / Flutter / mini programs

## Read in order

1. [Micro-frontends](../advanced/micro-frontend)
2. [Mobile & cross-platform](../advanced/mobile-and-cross-platform)

## Practice and self-check

**Checkpoints**

- Micro-frontends must solve: sub-app isolation, communication, style isolation, shared assets, login state
- MF shares deps at build time; qiankun sandboxes at runtime — different ecosystems and mental cost
- Cross-platform follows **product shape**: heavy interaction → native; heavy presentation → H5 / mini program

**Produce or redraw from memory**

- Four micro-frontend options — [reference section](../advanced/micro-frontend#day-74-four-micro-frontend-options)
- Core problems — [reference section](../advanced/micro-frontend#day-74-core-problems)
- Three cross-platform lines — [reference section](../advanced/mobile-and-cross-platform#day-74-three-cross-platform-lines)
- Architecture — [reference section](../advanced/micro-frontend#day-74-architecture)
- Sub-app lifecycle — [reference section](../advanced/micro-frontend#day-74-sub-app-lifecycle)

**Answer aloud without reading a reference answer**

- 1. Why qiankun vs MF?
- 2. How do H5 and mini programs share logic?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Core micro-frontend problems (JS sandbox / CSS isolation / communication / routing) (1.5 min)
2. Four options + how to choose (2 min)
3. Three cross-platform lines + H5 / mini-program sharing (1.5 min)

After recording, self-check:

- Did you state the core difference between qiankun and MF (runtime vs build time).
- Did you explain JS sandbox and CSS isolation.
- Did you mention limits of cross-platform frameworks.
- Did you say the choice follows product shape.

## Recap

The 3 points that most need a follow-up today:

1. qiankun Proxy sandbox internals (snapshot sandbox vs Proxy sandbox).
2. Module Federation in Vite (`vite-plugin-federation`).
3. Architecture differences between Taro 3 and uni-app.
