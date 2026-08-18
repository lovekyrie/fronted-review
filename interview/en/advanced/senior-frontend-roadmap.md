---
title: Senior Frontend 8-Week Roadmap
description: An 8-week systematic catch-up plan for senior frontend interviews
---

# Senior Frontend 8-Week Roadmap

## Who this is for

This roadmap is not for junior-role review. It is for senior frontend interview prep. The goal is not to keep growing the question bank, but to upgrade the current knowledge base into a material system that can support:

- explaining underlying mechanisms, not only reciting definitions
- explaining trade-offs with engineering scenes, not only listing options
- walking from code, build, test, deploy, and monitoring all the way to production results
- expanding under follow-up questions, instead of stopping at a one-layer answer

## Execution principles

- default weekly investment: `10-12 hours`
- daily study time kept to `1.5-2 hours`
- each week: `6 days of study + 1 day of review`
- every day must produce text or code, not pure reading
- all outcomes should land back in this repo first

## Weekly priorities

1. Engineering and the build chain
2. Deploy and delivery chain
3. Vue internals
4. React mechanisms
5. Advanced TypeScript
6. Browser, performance, security
7. Testing and quality assurance
8. Architecture questions and mock interviews

Optional extension: Week 9 adds an AI Agent engineering track, without changing the original 8-week main-line pace.

## Week 1

### Theme

Build chain: module system, Babel, Vite, webpack, production builds, cache strategy

### Goals

- explain the full chain of `ESM -> dev server -> bundle -> chunk -> cache`
- make the responsibility boundaries of Babel, bundler, and runtime clear
- be able to answer the core differences between Vite and webpack

### Outputs

- rewrite [build-tools.md](./week1/build-tools)
- strengthen [modules.md](./week1/modules)
- produce 1 Vite vs webpack comparison table
- produce 1 set of answers for 10-15 high-frequency follow-ups

### Official docs

- Vite Guide: https://vite.dev/guide/
- Why Vite: https://vite.dev/guide/why.html
- Features: https://vite.dev/guide/features.html
- Dependency Pre-Bundling: https://vite.dev/guide/dep-pre-bundling
- Build: https://vite.dev/guide/build
- Env and Mode: https://vite.dev/guide/env-and-mode
- webpack Concepts: https://webpack.js.org/concepts/
- webpack Code Splitting: https://webpack.js.org/guides/code-splitting/
- webpack Caching: https://webpack.js.org/guides/caching/
- Babel Config Files: https://babeljs.io/docs/config-files
- Babel Parser: https://babeljs.io/docs/babel-parser
- MDN Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

## Week 2

### Theme

Deploy and delivery: GitHub Actions, Docker, Nginx, env vars, cache, rollback

### Goals

- explain the delivery chain from `push` to go-live
- explain the split of Docker images, containers, and Nginx
- be able to state practical strategies for cache, rollback, and release governance

### Outputs

- add `interview/engineering/deployment.md`
- write a go-live retro based on `.github/workflows/deploy.yml` in this repo
- add 1 “post-go-live troubleshooting checklist”

### Official docs

- GitHub Actions: https://docs.github.com/en/actions
- Workflow Syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Docker Build Overview: https://docs.docker.com/build/concepts/overview/
- Dockerfile Reference: https://docs.docker.com/reference/builder
- Build Variables: https://docs.docker.com/build/building/variables/
- Nginx Beginner's Guide: https://nginx.org/en/docs/beginners_guide.html
- MDN HTTP Caching: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching

## Week 3

### Theme

Vue internals: reactivity, scheduling, component updates, compile-time optimizations, SSR

### Goals

- explain how track, trigger, effect, and scheduler work
- make Vue 2 vs Vue 3 reactivity differences clear
- explain the optimizations from patch flag, static hoisting, and block tree

### Outputs

- rewrite [reactivity.md](./week3/reactivity)
- add `interview/framework/vue/week3-rendering-mechanism.md`
- add 1 explainer doc for `hand-write/vue-book/reactive-system`

### Official docs

- Reactivity in Depth: https://vuejs.org/guide/extras/reactivity-in-depth.html
- Rendering Mechanism: https://vuejs.org/guide/extras/rendering-mechanism
- Computed: https://vuejs.org/guide/essentials/computed
- Watchers: https://vuejs.org/guide/essentials/watchers.html
- Performance: https://vuejs.org/guide/best-practices/performance
- SSR: https://vuejs.org/guide/scaling-up/ssr.html

## Week 4

### Theme

React mechanisms: state updates, effect, concurrency, React 19

### Goals

- explain render, commit, state queue, batching
- be able to explain stale closure, effect cleanup, and Strict Mode double invoke
- understand the value of `useTransition`, `useOptimistic`, and Server Components

### Outputs

- rewrite [hooks.md](./week4/hooks)
- rewrite [react19-features.md](../framework/react/react19-features)
- add `interview/framework/react/week4-concurrency.md`

### Official docs

- useState: https://react.dev/reference/react/useState
- useEffect: https://react.dev/reference/react/useEffect
- Queueing State Updates: https://react.dev/learn/queueing-a-series-of-state-updates
- useTransition: https://react.dev/reference/react/useTransition
- useActionState: https://react.dev/reference/react/useActionState
- useOptimistic: https://react.dev/reference/react/useOptimistic
- Server Components: https://react.dev/reference/rsc/server-components
- use server: https://react.dev/reference/rsc/use-server

## Week 5

### Theme

Advanced TypeScript: type system, generic design, utility types, business modeling

### Goals

- be able to explain conditional types, mapped types, and template literal types fluently
- be able to design more stable APIs with `infer` and generic constraints
- upgrade from “can write TS” to “can design types”

### Outputs

- rewrite [typescript-basic.md](./week5/typescript-basic)
- add `interview/jscore/advanced/week5-typescript-design.md`
- rewrite at least 2 JS examples into stricter TS versions

### Official docs

- Types from Types: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
- Conditional Types: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- Mapped Types: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
- Template Literal Types: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html

## Week 6

### Theme

Browser, performance, security: event loop, render pipeline, cache, Service Worker, Web Vitals, XSS, CSRF, CSP

### Goals

- explain browser rendering and the event loop in detail
- be able to map performance metrics to concrete optimization actions
- be able to state the real boundaries of XSS, CSRF, and CSP in frontend engineering

### Outputs

- rewrite [performance-optimization.md](./week6/performance-optimization)
- add `interview/network&broswer/week6-security.md`
- produce 1 performance-troubleshooting checklist

### Official docs

- MDN Microtasks: https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
- MDN HTTP Caching: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
- MDN Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Web Vitals: https://web.dev/articles/vitals?hl=en
- LCP: https://web.dev/articles/lcp?hl=en
- Optimize LCP: https://web.dev/articles/optimize-lcp?hl=en
- INP: https://web.dev/inp/
- CLS: https://web.dev/articles/cls
- Lighthouse Overview: https://developer.chrome.com/docs/lighthouse/overview?hl=en
- MDN XSS: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS
- MDN CSRF: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF
- MDN CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP

## Week 7

### Theme

Testing and quality assurance: Vitest, component tests, E2E, CI test strategy

### Goals

- explain the layering boundaries of unit tests, component tests, and E2E
- be able to state the trade-offs of mocks, coverage, and flaky tests
- add a minimal runnable test sample in this repo

### Outputs

- add `interview/engineering/week7-testing-strategy.md`
- add tests for `hand-write/promise` or `hand-write/simulate/eventEmitter.js`
- produce 1 “frontend test-layering strategy” answer draft

### Official docs

- Vitest Features: https://vitest.dev/guide/features
- Vitest Mocking: https://vitest.dev/guide/mocking
- Vitest Coverage: https://vitest.dev/guide/coverage.html
- Playwright Writing Tests: https://playwright.dev/docs/writing-tests

## Week 8

### Theme

Architecture questions and mock interviews: state boundaries, rendering strategy, BFF, observability, team collaboration

### Goals

- organize the previous 7 weeks into architecture answers you can actually say
- naturally bring monitoring, testing, build, deploy, and performance into project questions
- complete at least 3 mock interviews

### Outputs

- add `interview/plan/week8-senior-frontend-question-bank.md`
- produce 30 high-frequency senior frontend Q&As
- produce 1 final gap-filling checklist

### Official docs

- This week does not add new topic docs. Review the previous 7 weeks of official docs and what landed in the repo.

## Week 9 optional

### Theme

AI Agent engineering: Tool, MCP, Prompt, Parser, Memory, RAG, SSE, LangGraph, multi-agent, evaluation and observability

### Goals

- explain the full chain from user input to tool execution, retrieval augmentation, streaming interaction, and evaluation/review
- be able to distinguish the responsibility boundaries of Tool calling, MCP, RAG, Memory, Runtime, LangGraph, and multi-agent
- from a frontend engineer’s view, explain Agent UI, SSE events, human confirmation, citation display, error recovery, and task replay
- be able to answer Agent interview questions, not stopping at “can call an LLM API”

### Outputs

- study the [AI Agent engineering track](../ai-agent/)
- organize 1 oral draft of the Tool/MCP and RAG engineering chain
- design 1 draft Agent SSE event protocol
- prepare 10-15 high-frequency AI Agent Q&As

### Learning entry points

- [AI Agent learning path](../ai-agent/)
- [Tool and MCP](../ai-agent/tool-and-mcp)
- [Prompt / Parser / Memory](../ai-agent/prompt-parser-memory)
- [RAG engineering pipeline](../ai-agent/rag)
- [Agent Runtime](../ai-agent/agent-runtime)
- [LangGraph and multi-agent](../ai-agent/langgraph-multi-agent)
- [Evaluation and observability](../ai-agent/observability-evaluation)
- [AI Agent high-frequency interview questions](../ai-agent/interview-questions)

## Weekly review template

On the last day of each week, always finish these four items:

1. list the 3 questions most likely to break you under follow-up this week
2. record 3 new “whys” added this week
3. mark files that need to be filled back into the repo
4. record a 10-minute self-narration on this week’s core mechanism chain

## Final acceptance

After 8 weeks, you should at least be able to answer these stably:

- why Vite is usually faster than webpack in the development phase
- how production cache and versioning strategy should be designed
- why Vue 3 reactivity chose Proxy
- why React effects bring common pitfalls
- how advanced TypeScript types serve real component design
- how frontend performance metrics map to concrete optimization actions
- why high coverage is not high quality
- what a real project’s full chain from development to go-live looks like
