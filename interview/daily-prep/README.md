# 高级前端 80 天 Daily Prep

沿用 `sprint-14-days` + `advanced/senior-frontend-roadmap` 拆分的每日执行清单。每天一个 `dayN-<slug>.md`，由四段组成：**输入 → 输出 → 演练 → 复盘**。

## 使用规则

- 每日预算：**2–3 小时**
- 技术栈侧重：**Vue 主 / React 副**
- 每天必须有**可见产出**：速记卡 / 流程图 / 手写片段 / 录音
- 每 7 天出现一次模拟面或阶段复盘，用来堵漏
- 模板见 [`_template.md`](./_template)

## 阶段总览

| 阶段 | 天数 | 主题 | 指向 |
|------|------|------|------|
| 1. 基础打稳 | Day 1–14 | JS / 浏览器 / HTML&CSS / 算法手写 | [`sprint-14-days`](../sprint-14-days) |
| 2. 构建链路 | Day 15–21 | 模块化 / Babel / Vite / webpack | [`advanced/week1`](../advanced/week1/roadmap) |
| 3. 部署交付 | Day 22–28 | GitHub Actions / Docker / Nginx | [`advanced/week2`](../advanced/week2/roadmap) |
| 4. Vue 原理 | Day 29–42 | 响应式 / 编译 / 渲染 / mini-vue | [`advanced/week3`](../advanced/week3/roadmap) |
| 5. React 机制 | Day 43–49 | render / effect / 并发 / React 19 | [`advanced/week4`](../advanced/week4/roadmap) |
| 6. TypeScript | Day 50–56 | 泛型 / 条件 / 映射 / 类型设计 | [`advanced/week5`](../advanced/week5/roadmap) |
| 7. 性能与安全 | Day 57–63 | 事件循环 / Web Vitals / XSS/CSRF | [`advanced/week6`](../advanced/week6/roadmap) |
| 8. 测试保障 | Day 64–70 | 分层 / Vitest / Playwright | [`advanced/week7`](../advanced/week7/roadmap) |
| 9. 架构与模拟面 | Day 71–80 | 场景 / 微前端 / 监控 / 模拟面 | [`advanced/week8`](../advanced/week8/roadmap) |

## 每日清单索引

### 阶段 1：基础打稳

- [Day 1 JS 数据类型 / this / 原型链](./day01-js-foundation-checklist)
- [Day 2 闭包 / 作用域 / ES6](./day02-closure-scope-es6)
- [Day 3 异步与事件循环](./day03-async-event-loop)
- [Day 4 DOM / BOM / 事件机制](./day04-dom-bom-event)
- [Day 5 内存管理与浏览器渲染](./day05-memory-browser-render)
- [Day 6 HTTP / 缓存 / 跨域 / 存储](./day06-http-cache-cross-origin)
- [Day 7 基础模拟面 1](./day07-basic-mock-1)
- [Day 8 HTML/CSS 高频布局](./day08-html-css-layout)
- [Day 9 语义化 / 兼容性 / 动画](./day09-semantic-compat-animation)
- [Day 10 算法保温 1](./day10-algorithm-warmup)
- [Day 11 手写保温 1](./day11-handwrite-warmup-1)
- [Day 12 手写保温 2](./day12-handwrite-warmup-2)
- [Day 13 Vue / React 基础预热](./day13-framework-preheat)
- [Day 14 基础模拟面 2](./day14-basic-mock-2)

### 阶段 2：构建链路

- [Day 15 ESM vs CommonJS vs UMD](./day15-modules-esm-cjs)
- [Day 16 Babel：AST / preset / plugin](./day16-babel-ast)
- [Day 17 Vite 原理](./day17-vite-principle)
- [Day 18 webpack 核心](./day18-webpack-core)
- [Day 19 代码分割 / Tree Shaking / 缓存](./day19-code-splitting-tree-shaking)
- [Day 20 生产构建实战](./day20-production-build)
- [Day 21 构建专题追问复盘](./day21-build-review)

### 阶段 3：部署交付

- [Day 22 GitHub Actions](./day22-github-actions)
- [Day 23 Docker 基础](./day23-docker-basics)
- [Day 24 Nginx 配置](./day24-nginx-config)
- [Day 25 环境变量与构建模式](./day25-env-and-mode)
- [Day 26 发布与回滚](./day26-release-rollback)
- [Day 27 上线排障 checklist](./day27-online-troubleshoot)
- [Day 28 部署专题复盘](./day28-deploy-review)

### 阶段 4：Vue 原理

- [Day 29 Proxy / Reflect 与响应式入口](./day29-vue-proxy-reflect)
- [Day 30 track / trigger / effect](./day30-vue-track-trigger)
- [Day 31 调度器与异步更新](./day31-vue-scheduler)
- [Day 32 ref / reactive / computed / watch](./day32-vue-ref-reactive-computed-watch)
- [Day 33 Vue 2 vs Vue 3 响应式](./day33-vue2-vs-vue3-reactivity)
- [Day 34 模板编译流程](./day34-vue-compiler)
- [Day 35 Patch Flag / 静态提升 / Block Tree](./day35-vue-patch-flag)
- [Day 36 渲染器与 diff](./day36-vue-renderer)
- [Day 37 组件更新与调度](./day37-vue-component-update)
- [Day 38 手写 mini-vue reactivity](./day38-mini-vue-reactivity)
- [Day 39 手写 mini-vue renderer](./day39-mini-vue-renderer)
- [Day 40 Vue Router 原理](./day40-vue-router)
- [Day 41 Pinia / Vuex 状态管理](./day41-pinia-vuex)
- [Day 42 Vue SSR / Nuxt + 专题追问](./day42-vue-ssr-review)

### 阶段 5：React 机制

- [Day 43 render / commit / batching](./day43-react-render-commit)
- [Day 44 state queue 与函数式更新](./day44-react-state-queue)
- [Day 45 useEffect 陷阱](./day45-react-useeffect)
- [Day 46 useMemo / useCallback / memo](./day46-react-memo-callback)
- [Day 47 useTransition / useDeferredValue](./day47-react-concurrent)
- [Day 48 React 19 新特性](./day48-react19-features)
- [Day 49 RSC + React 专题追问](./day49-react-rsc-review)

### 阶段 6：TypeScript

- [Day 50 类型基础 / 字面量 / 联合](./day50-ts-basics)
- [Day 51 泛型与约束](./day51-ts-generics)
- [Day 52 条件类型与 infer](./day52-ts-conditional-infer)
- [Day 53 映射类型与 keyof](./day53-ts-mapped)
- [Day 54 模板字面量类型](./day54-ts-template-literal)
- [Day 55 工具类型手写 + JS→TS 改造](./day55-ts-utility-types)
- [Day 56 类型设计实战 + 追问](./day56-ts-design-review)

### 阶段 7：性能与安全

- [Day 57 事件循环细节](./day57-event-loop-detail)
- [Day 58 浏览器渲染流水线](./day58-browser-render-pipeline)
- [Day 59 Web Vitals 指标](./day59-web-vitals)
- [Day 60 首屏性能优化](./day60-first-paint-optimization)
- [Day 61 HTTP 缓存 + Service Worker](./day61-http-cache-service-worker)
- [Day 62 XSS / CSRF / CSP](./day62-xss-csrf-csp)
- [Day 63 性能与安全专题追问](./day63-perf-security-review)

### 阶段 8：测试保障

- [Day 64 测试分层](./day64-test-layering)
- [Day 65 Vitest 基础](./day65-vitest-basics)
- [Day 66 Vue 组件测试](./day66-vue-component-testing)
- [Day 67 Mock / Spy / 覆盖率](./day67-mock-coverage)
- [Day 68 Playwright E2E](./day68-playwright-e2e)
- [Day 69 为 handwrite/promise 补测试](./day69-handwrite-promise-test)
- [Day 70 测试专题追问](./day70-testing-review)

### 阶段 9：架构与模拟面

- [Day 71 场景题：大文件上传](./day71-scenario-file-upload)
- [Day 72 场景题：海量数据 / 虚拟列表](./day72-scenario-virtual-list)
- [Day 73 场景题：权限体系](./day73-scenario-permission)
- [Day 74 微前端 + 移动端跨端](./day74-micro-frontend)
- [Day 75 监控 / 可观测性](./day75-monitoring-observability)
- [Day 76 项目复盘 STAR 打磨](./day76-project-review-star)
- [Day 77 简历 + HR 面演练](./day77-resume-hr-practice)
- [Day 78 模拟面 1（纯技术）](./day78-mock-interview-1)
- [Day 79 模拟面 2（综合）](./day79-mock-interview-2)
- [Day 80 最终查漏补缺](./day80-final-review)
