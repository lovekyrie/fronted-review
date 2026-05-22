---
title: 高级前端 8 周路线图
description: 面向高级前端面试的 8 周系统化补强计划
---

# 高级前端 8 周路线图

## 适用目标

这份路线图面向的不是基础岗复习，而是高级前端面试准备。目标不是继续扩大题库，而是把当前知识库升级成一套可以支撑以下能力的材料体系：

- 能解释底层机制，不只会背定义
- 能结合工程场景说明取舍，不只会列方案
- 能从代码、构建、测试、部署、监控一路讲到线上结果
- 能在追问下持续展开，而不是停在一层答案

## 执行原则

- 每周默认投入 `10-12 小时`
- 每天学习时长控制在 `1.5-2 小时`
- 每周 `6 天学习 + 1 天复盘`
- 每天必须有文本或代码产出，不做纯阅读
- 所有成果优先沉淀回当前仓库

## 周优先级

1. 工程化与构建链路
2. 部署与交付链路
3. Vue 原理
4. React 机制
5. TypeScript 进阶
6. 浏览器、性能、安全
7. 测试与质量保障
8. 架构题与模拟面试

可选扩展：Week 9 增加 AI Agent 工程化能力线，不改变原 8 周主线节奏。

## Week 1

### 主题

构建链路：模块系统、Babel、Vite、webpack、生产构建、缓存策略

### 目标

- 讲清 `ESM -> dev server -> bundle -> chunk -> cache` 的完整链路
- 明确 Babel、bundler、runtime 的职责边界
- 能回答 Vite 和 webpack 的核心差异

### 产出

- 重写 [build-tools.md](./week1/build-tools)
- 补强 [modules.md](./week1/modules)
- 形成 1 份 Vite 与 webpack 对照表
- 形成 1 份 10-15 题高频追问答案

### 官方文档

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

### 主题

部署与交付：GitHub Actions、Docker、Nginx、环境变量、缓存、回滚

### 目标

- 讲清从 `push` 到上线的交付链路
- 解释 Docker 镜像、容器、Nginx 分工
- 能说出缓存、回滚、发布治理的实战策略

### 产出

- 新增 `interview/engineering/deployment.md`
- 基于仓库中的 `.github/workflows/deploy.yml` 写一篇上线复盘
- 补 1 份“上线后排障 checklist”

### 官方文档

- GitHub Actions: https://docs.github.com/en/actions
- Workflow Syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Docker Build Overview: https://docs.docker.com/build/concepts/overview/
- Dockerfile Reference: https://docs.docker.com/reference/builder
- Build Variables: https://docs.docker.com/build/building/variables/
- Nginx Beginner's Guide: https://nginx.org/en/docs/beginners_guide.html
- MDN HTTP Caching: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching

## Week 3

### 主题

Vue 原理：响应式、调度、组件更新、编译优化、SSR

### 目标

- 讲清 track、trigger、effect、scheduler 的工作方式
- 明确 Vue 2 和 Vue 3 响应式差异
- 说清 patch flag、静态提升、block tree 带来的优化点

### 产出

- 重写 [reactivity.md](./week3/reactivity)
- 新增 `interview/framework/vue/week3-rendering-mechanism.md`
- 为 `hand-write/vue-book/reactive-system` 补 1 份讲解文档

### 官方文档

- Reactivity in Depth: https://vuejs.org/guide/extras/reactivity-in-depth.html
- Rendering Mechanism: https://vuejs.org/guide/extras/rendering-mechanism
- Computed: https://vuejs.org/guide/essentials/computed
- Watchers: https://vuejs.org/guide/essentials/watchers.html
- Performance: https://vuejs.org/guide/best-practices/performance
- SSR: https://vuejs.org/guide/scaling-up/ssr.html

## Week 4

### 主题

React 机制：状态更新、effect、并发能力、React 19

### 目标

- 讲清 render、commit、state queue、batching
- 能解释 stale closure、effect cleanup、Strict Mode 双执行
- 理解 `useTransition`、`useOptimistic`、Server Components 的价值

### 产出

- 重写 [hooks.md](./week4/hooks)
- 重写 [react19-features.md](../framework/react/react19-features)
- 新增 `interview/framework/react/week4-concurrency.md`

### 官方文档

- useState: https://react.dev/reference/react/useState
- useEffect: https://react.dev/reference/react/useEffect
- Queueing State Updates: https://react.dev/learn/queueing-a-series-of-state-updates
- useTransition: https://react.dev/reference/react/useTransition
- useActionState: https://react.dev/reference/react/useActionState
- useOptimistic: https://react.dev/reference/react/useOptimistic
- Server Components: https://react.dev/reference/rsc/server-components
- use server: https://react.dev/reference/rsc/use-server

## Week 5

### 主题

TypeScript 进阶：类型系统、泛型设计、工具类型、业务建模

### 目标

- 能熟练解释条件类型、映射类型、模板字面量类型
- 能用 `infer` 和泛型约束设计更稳的 API
- 把“会写 TS”提升成“会设计类型”

### 产出

- 重写 [typescript-basic.md](./week5/typescript-basic)
- 新增 `interview/jscore/advanced/week5-typescript-design.md`
- 至少将 2 个 JS 示例改写为更严格的 TS 版本

### 官方文档

- Types from Types: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
- Conditional Types: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- Mapped Types: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
- Template Literal Types: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html

## Week 6

### 主题

浏览器、性能、安全：事件循环、渲染流水线、缓存、Service Worker、Web Vitals、XSS、CSRF、CSP

### 目标

- 讲清浏览器渲染与事件循环的细节
- 能把性能指标与具体优化动作对应起来
- 能说明 XSS、CSRF、CSP 在前端工程中的真实边界

### 产出

- 重写 [performance-optimization.md](./week6/performance-optimization)
- 新增 `interview/network&broswer/week6-security.md`
- 形成 1 份性能排障 checklist

### 官方文档

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

### 主题

测试与质量保障：Vitest、组件测试、E2E、CI 测试策略

### 目标

- 讲清单测、组件测试、E2E 的分层边界
- 能说明 mock、覆盖率、flaky test 的取舍
- 在当前仓库中补出最小可运行测试样例

### 产出

- 新增 `interview/engineering/week7-testing-strategy.md`
- 为 `hand-write/promise` 或 `hand-write/simulate/eventEmitter.js` 补测试
- 形成 1 份“前端测试分层策略”答题稿

### 官方文档

- Vitest Features: https://vitest.dev/guide/features
- Vitest Mocking: https://vitest.dev/guide/mocking
- Vitest Coverage: https://vitest.dev/guide/coverage.html
- Playwright Writing Tests: https://playwright.dev/docs/writing-tests

## Week 8

### 主题

架构题与模拟面试：状态边界、渲染策略、BFF、监控体系、团队协作

### 目标

- 把前 7 周的知识组织成可表达的架构答案
- 能在项目题里自然带出监控、测试、构建、部署和性能
- 完成至少 3 轮模拟面试

### 产出

- 新增 `interview/plan/week8-senior-frontend-question-bank.md`
- 形成 30 题高级前端高频问答
- 形成 1 份最终查漏补缺清单

### 官方文档

- 本周不新增主题文档，回看前 7 周官方文档和仓库沉淀内容

## Week 9 可选

### 主题

AI Agent 工程化：Tool、MCP、Prompt、Parser、Memory、RAG、SSE、LangGraph、多 Agent、评估观测

### 目标

- 讲清 Agent 从用户输入到工具执行、检索增强、流式交互和评估复盘的完整链路
- 能区分 Tool calling、MCP、RAG、Memory、Runtime、LangGraph 和多 Agent 的职责边界
- 从前端工程师视角说明 Agent UI、SSE 事件、人工确认、引用展示、错误恢复和任务回放
- 能回答 Agent 面试题，不停留在“会调用大模型接口”

### 产出

- 学习 [AI Agent 工程专题](../ai-agent/)
- 整理 1 份 Tool/MCP 与 RAG 的工程链路口述稿
- 设计 1 套 Agent SSE 事件协议草案
- 准备 10-15 题 AI Agent 高频问答

### 学习入口

- [AI Agent 学习路线](../ai-agent/)
- [Tool 与 MCP](../ai-agent/tool-and-mcp)
- [Prompt / Parser / Memory](../ai-agent/prompt-parser-memory)
- [RAG 工程链路](../ai-agent/rag)
- [Agent Runtime](../ai-agent/agent-runtime)
- [LangGraph 与多 Agent](../ai-agent/langgraph-multi-agent)
- [评估与观测](../ai-agent/observability-evaluation)
- [AI Agent 高频面试题](../ai-agent/interview-questions)

## 每周复盘模板

每周最后一天固定完成以下四项：

1. 列出本周最容易被追问击穿的 3 个问题
2. 记录本周新增的 3 个“为什么”
3. 标记需要回填到仓库的文件
4. 录一段 10 分钟自述，主题是本周最核心的机制链路

## 最终验收

完成 8 周后，你至少要能稳定回答以下问题：

- 为什么 Vite 开发阶段通常比 webpack 更快
- 生产环境的缓存与版本策略应该怎么设计
- Vue 3 响应式为什么选 Proxy
- React 的 effect 为什么会带来常见陷阱
- TypeScript 高级类型怎样服务于真实组件设计
- 前端性能指标如何与具体优化动作对应
- 为什么高覆盖率不等于高质量
- 一个真实项目从开发到上线的完整链路是什么
