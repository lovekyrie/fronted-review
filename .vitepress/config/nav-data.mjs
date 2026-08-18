export const navData = [
  { zh: '高级前端', en: 'Senior Frontend', link: '/advanced/senior-frontend-index' },
  { zh: 'AI Agent', en: 'AI Agent', link: '/ai-agent/' },
  { zh: '80days', en: '80 Days', link: '/daily-prep/day01-js-foundation-checklist' },
  { zh: 'JS Core', en: 'JS Core', link: '/jscore/basic/data-type' },
  { zh: 'HTML & CSS', en: 'HTML & CSS', link: '/html&css/layout' },
  { zh: '框架原理', en: 'Frameworks', link: '/framework/vue/vue3' },
  { zh: '网络与浏览器', en: 'Network & Browser', link: '/network&broswer/http-protocol' },
  { zh: '算法', en: 'Algorithms', link: '/algorithm&data-structure/array-operation' },
  { zh: '工程化', en: 'Engineering', link: '/engineering/build-tools' },
]

export const sidebarData = {
  '/ai-agent/': [
    {
      zh: '总览',
      en: 'Overview',
      items: [
        { zh: '学习路线', en: 'Learning Path', link: '/ai-agent/' },
      ],
    },
    {
      zh: '基础能力',
      en: 'Foundations',
      items: [
        { zh: 'Tool 与 MCP', en: 'Tools & MCP', link: '/ai-agent/tool-and-mcp' },
        { zh: 'Prompt / Parser / Memory', en: 'Prompt / Parser / Memory', link: '/ai-agent/prompt-parser-memory' },
      ],
    },
    {
      zh: 'RAG',
      en: 'RAG',
      items: [
        { zh: 'RAG 工程链路', en: 'RAG Pipeline', link: '/ai-agent/rag' },
      ],
    },
    {
      zh: '运行时',
      en: 'Runtime',
      items: [
        { zh: 'Agent Runtime', en: 'Agent Runtime', link: '/ai-agent/agent-runtime' },
      ],
    },
    {
      zh: '多 Agent',
      en: 'Multi-Agent',
      items: [
        { zh: 'LangGraph 与多 Agent', en: 'LangGraph & Multi-Agent', link: '/ai-agent/langgraph-multi-agent' },
      ],
    },
    {
      zh: '评估面试',
      en: 'Eval & Interview',
      items: [
        { zh: '评估与观测', en: 'Observability & Evaluation', link: '/ai-agent/observability-evaluation' },
        { zh: '高频面试题', en: 'Interview Questions', link: '/ai-agent/interview-questions' },
      ],
    },
  ],

  '/daily-prep/': [
    {
      zh: '总览',
      en: 'Overview',
      items: [
        { zh: '每日模板', en: 'Daily Template', link: '/daily-prep/_template' },
      ],
    },
    {
      zh: '阶段 1：基础打稳 (Day 1–14)',
      en: 'Phase 1: Foundations (Day 1–14)',
      collapsed: true,
      items: [
        { zh: 'Day 1 JS 基础', en: 'Day 1 JS Basics', link: '/daily-prep/day01-js-foundation-checklist' },
        { zh: 'Day 2 闭包/作用域/ES6', en: 'Day 2 Closure / Scope / ES6', link: '/daily-prep/day02-closure-scope-es6' },
        { zh: 'Day 3 异步与事件循环', en: 'Day 3 Async & Event Loop', link: '/daily-prep/day03-async-event-loop' },
        { zh: 'Day 4 DOM/BOM/事件', en: 'Day 4 DOM / BOM / Events', link: '/daily-prep/day04-dom-bom-event' },
        { zh: 'Day 5 内存与渲染', en: 'Day 5 Memory & Rendering', link: '/daily-prep/day05-memory-browser-render' },
        { zh: 'Day 6 HTTP/缓存/跨域', en: 'Day 6 HTTP / Cache / CORS', link: '/daily-prep/day06-http-cache-cross-origin' },
        { zh: 'Day 7 基础模拟面 1', en: 'Day 7 Basic Mock 1', link: '/daily-prep/day07-basic-mock-1' },
        { zh: 'Day 8 HTML/CSS 布局', en: 'Day 8 HTML / CSS Layout', link: '/daily-prep/day08-html-css-layout' },
        { zh: 'Day 9 语义化/兼容/动画', en: 'Day 9 Semantics / Compat / Animation', link: '/daily-prep/day09-semantic-compat-animation' },
        { zh: 'Day 10 算法保温', en: 'Day 10 Algorithm Warmup', link: '/daily-prep/day10-algorithm-warmup' },
        { zh: 'Day 11 手写保温 1', en: 'Day 11 Handwrite Warmup 1', link: '/daily-prep/day11-handwrite-warmup-1' },
        { zh: 'Day 12 手写保温 2', en: 'Day 12 Handwrite Warmup 2', link: '/daily-prep/day12-handwrite-warmup-2' },
        { zh: 'Day 13 框架预热', en: 'Day 13 Framework Preheat', link: '/daily-prep/day13-framework-preheat' },
        { zh: 'Day 14 基础模拟面 2', en: 'Day 14 Basic Mock 2', link: '/daily-prep/day14-basic-mock-2' },
      ],
    },
    {
      zh: '阶段 2：构建链路 (Day 15–21)',
      en: 'Phase 2: Build Pipeline (Day 15–21)',
      collapsed: true,
      items: [
        { zh: 'Day 15 模块化', en: 'Day 15 Modules', link: '/daily-prep/day15-modules-esm-cjs' },
        { zh: 'Day 16 Babel', en: 'Day 16 Babel', link: '/daily-prep/day16-babel-ast' },
        { zh: 'Day 17 Vite 原理', en: 'Day 17 Vite Internals', link: '/daily-prep/day17-vite-principle' },
        { zh: 'Day 18 webpack 核心', en: 'Day 18 webpack Core', link: '/daily-prep/day18-webpack-core' },
        { zh: 'Day 19 分割/摇树/缓存', en: 'Day 19 Split / Tree-shaking / Cache', link: '/daily-prep/day19-code-splitting-tree-shaking' },
        { zh: 'Day 20 生产构建', en: 'Day 20 Production Build', link: '/daily-prep/day20-production-build' },
        { zh: 'Day 21 构建专题复盘', en: 'Day 21 Build Review', link: '/daily-prep/day21-build-review' },
      ],
    },
    {
      zh: '阶段 3：部署交付 (Day 22–28)',
      en: 'Phase 3: Deploy & Delivery (Day 22–28)',
      collapsed: true,
      items: [
        { zh: 'Day 22 GitHub Actions', en: 'Day 22 GitHub Actions', link: '/daily-prep/day22-github-actions' },
        { zh: 'Day 23 Docker', en: 'Day 23 Docker', link: '/daily-prep/day23-docker-basics' },
        { zh: 'Day 24 Nginx', en: 'Day 24 Nginx', link: '/daily-prep/day24-nginx-config' },
        { zh: 'Day 25 环境与模式', en: 'Day 25 Env & Mode', link: '/daily-prep/day25-env-and-mode' },
        { zh: 'Day 26 发布与回滚', en: 'Day 26 Release & Rollback', link: '/daily-prep/day26-release-rollback' },
        { zh: 'Day 27 上线排障', en: 'Day 27 Online Troubleshoot', link: '/daily-prep/day27-online-troubleshoot' },
        { zh: 'Day 28 部署专题复盘', en: 'Day 28 Deploy Review', link: '/daily-prep/day28-deploy-review' },
      ],
    },
    {
      zh: '阶段 4：Vue 原理 (Day 29–42)',
      en: 'Phase 4: Vue Internals (Day 29–42)',
      collapsed: true,
      items: [
        { zh: 'Day 29 Proxy/Reflect', en: 'Day 29 Proxy / Reflect', link: '/daily-prep/day29-vue-proxy-reflect' },
        { zh: 'Day 30 track/trigger', en: 'Day 30 track / trigger', link: '/daily-prep/day30-vue-track-trigger' },
        { zh: 'Day 31 调度器', en: 'Day 31 Scheduler', link: '/daily-prep/day31-vue-scheduler' },
        { zh: 'Day 32 ref/reactive/computed/watch', en: 'Day 32 ref / reactive / computed / watch', link: '/daily-prep/day32-vue-ref-reactive-computed-watch' },
        { zh: 'Day 33 Vue 2 vs 3', en: 'Day 33 Vue 2 vs 3', link: '/daily-prep/day33-vue2-vs-vue3-reactivity' },
        { zh: 'Day 34 模板编译', en: 'Day 34 Template Compiler', link: '/daily-prep/day34-vue-compiler' },
        { zh: 'Day 35 Patch Flag/Block Tree', en: 'Day 35 Patch Flag / Block Tree', link: '/daily-prep/day35-vue-patch-flag' },
        { zh: 'Day 36 渲染器 + diff', en: 'Day 36 Renderer + Diff', link: '/daily-prep/day36-vue-renderer' },
        { zh: 'Day 37 组件更新', en: 'Day 37 Component Update', link: '/daily-prep/day37-vue-component-update' },
        { zh: 'Day 38 mini-vue reactivity', en: 'Day 38 mini-vue Reactivity', link: '/daily-prep/day38-mini-vue-reactivity' },
        { zh: 'Day 39 mini-vue renderer', en: 'Day 39 mini-vue Renderer', link: '/daily-prep/day39-mini-vue-renderer' },
        { zh: 'Day 40 Vue Router', en: 'Day 40 Vue Router', link: '/daily-prep/day40-vue-router' },
        { zh: 'Day 41 Pinia/Vuex', en: 'Day 41 Pinia / Vuex', link: '/daily-prep/day41-pinia-vuex' },
        { zh: 'Day 42 SSR + Vue 复盘', en: 'Day 42 SSR + Vue Review', link: '/daily-prep/day42-vue-ssr-review' },
      ],
    },
    {
      zh: '阶段 5：React 机制 (Day 43–49)',
      en: 'Phase 5: React Internals (Day 43–49)',
      collapsed: true,
      items: [
        { zh: 'Day 43 render/commit', en: 'Day 43 Render / Commit', link: '/daily-prep/day43-react-render-commit' },
        { zh: 'Day 44 state queue', en: 'Day 44 State Queue', link: '/daily-prep/day44-react-state-queue' },
        { zh: 'Day 45 useEffect 陷阱', en: 'Day 45 useEffect Pitfalls', link: '/daily-prep/day45-react-useeffect' },
        { zh: 'Day 46 memo/callback', en: 'Day 46 memo / callback', link: '/daily-prep/day46-react-memo-callback' },
        { zh: 'Day 47 并发渲染', en: 'Day 47 Concurrent Rendering', link: '/daily-prep/day47-react-concurrent' },
        { zh: 'Day 48 React 19 新特性', en: 'Day 48 React 19 Features', link: '/daily-prep/day48-react19-features' },
        { zh: 'Day 49 RSC + React 复盘', en: 'Day 49 RSC + React Review', link: '/daily-prep/day49-react-rsc-review' },
      ],
    },
    {
      zh: '阶段 6：TypeScript (Day 50–56)',
      en: 'Phase 6: TypeScript (Day 50–56)',
      collapsed: true,
      items: [
        { zh: 'Day 50 类型基础', en: 'Day 50 Type Basics', link: '/daily-prep/day50-ts-basics' },
        { zh: 'Day 51 泛型与约束', en: 'Day 51 Generics & Constraints', link: '/daily-prep/day51-ts-generics' },
        { zh: 'Day 52 条件/infer', en: 'Day 52 Conditional / infer', link: '/daily-prep/day52-ts-conditional-infer' },
        { zh: 'Day 53 映射类型', en: 'Day 53 Mapped Types', link: '/daily-prep/day53-ts-mapped' },
        { zh: 'Day 54 模板字面量', en: 'Day 54 Template Literal Types', link: '/daily-prep/day54-ts-template-literal' },
        { zh: 'Day 55 工具类型', en: 'Day 55 Utility Types', link: '/daily-prep/day55-ts-utility-types' },
        { zh: 'Day 56 类型设计复盘', en: 'Day 56 Type Design Review', link: '/daily-prep/day56-ts-design-review' },
      ],
    },
    {
      zh: '阶段 7：性能与安全 (Day 57–63)',
      en: 'Phase 7: Performance & Security (Day 57–63)',
      collapsed: true,
      items: [
        { zh: 'Day 57 事件循环细节', en: 'Day 57 Event Loop Details', link: '/daily-prep/day57-event-loop-detail' },
        { zh: 'Day 58 渲染流水线', en: 'Day 58 Render Pipeline', link: '/daily-prep/day58-browser-render-pipeline' },
        { zh: 'Day 59 Web Vitals', en: 'Day 59 Web Vitals', link: '/daily-prep/day59-web-vitals' },
        { zh: 'Day 60 首屏优化', en: 'Day 60 First Paint Optimization', link: '/daily-prep/day60-first-paint-optimization' },
        { zh: 'Day 61 缓存 + Service Worker', en: 'Day 61 Cache + Service Worker', link: '/daily-prep/day61-http-cache-service-worker' },
        { zh: 'Day 62 XSS/CSRF/CSP', en: 'Day 62 XSS / CSRF / CSP', link: '/daily-prep/day62-xss-csrf-csp' },
        { zh: 'Day 63 性能/安全复盘', en: 'Day 63 Perf / Security Review', link: '/daily-prep/day63-perf-security-review' },
      ],
    },
    {
      zh: '阶段 8：测试保障 (Day 64–70)',
      en: 'Phase 8: Testing (Day 64–70)',
      collapsed: true,
      items: [
        { zh: 'Day 64 测试分层', en: 'Day 64 Test Layering', link: '/daily-prep/day64-test-layering' },
        { zh: 'Day 65 Vitest 基础', en: 'Day 65 Vitest Basics', link: '/daily-prep/day65-vitest-basics' },
        { zh: 'Day 66 Vue 组件测试', en: 'Day 66 Vue Component Testing', link: '/daily-prep/day66-vue-component-testing' },
        { zh: 'Day 67 Mock/覆盖率', en: 'Day 67 Mock / Coverage', link: '/daily-prep/day67-mock-coverage' },
        { zh: 'Day 68 Playwright E2E', en: 'Day 68 Playwright E2E', link: '/daily-prep/day68-playwright-e2e' },
        { zh: 'Day 69 handwrite 补测试', en: 'Day 69 Handwrite Tests', link: '/daily-prep/day69-handwrite-promise-test' },
        { zh: 'Day 70 测试专题复盘', en: 'Day 70 Testing Review', link: '/daily-prep/day70-testing-review' },
      ],
    },
    {
      zh: '阶段 9：架构与模拟面 (Day 71–80)',
      en: 'Phase 9: Architecture & Mocks (Day 71–80)',
      collapsed: true,
      items: [
        { zh: 'Day 71 大文件上传', en: 'Day 71 File Upload', link: '/daily-prep/day71-scenario-file-upload' },
        { zh: 'Day 72 虚拟列表', en: 'Day 72 Virtual List', link: '/daily-prep/day72-scenario-virtual-list' },
        { zh: 'Day 73 权限体系', en: 'Day 73 Permission System', link: '/daily-prep/day73-scenario-permission' },
        { zh: 'Day 74 微前端/跨端', en: 'Day 74 Micro Frontend / Cross-end', link: '/daily-prep/day74-micro-frontend' },
        { zh: 'Day 75 监控/可观测性', en: 'Day 75 Monitoring / Observability', link: '/daily-prep/day75-monitoring-observability' },
        { zh: 'Day 76 项目 STAR', en: 'Day 76 Project STAR', link: '/daily-prep/day76-project-review-star' },
        { zh: 'Day 77 简历 + HR', en: 'Day 77 Resume + HR', link: '/daily-prep/day77-resume-hr-practice' },
        { zh: 'Day 78 模拟面 1', en: 'Day 78 Mock Interview 1', link: '/daily-prep/day78-mock-interview-1' },
        { zh: 'Day 79 模拟面 2', en: 'Day 79 Mock Interview 2', link: '/daily-prep/day79-mock-interview-2' },
        { zh: 'Day 80 最终复盘', en: 'Day 80 Final Review', link: '/daily-prep/day80-final-review' },
      ],
    },
  ],

  '/jscore/': [
    {
      zh: '基础 (Basic)',
      en: 'Basics',
      items: [
        { zh: '数据类型', en: 'Data Types', link: '/jscore/basic/data-type' },
        { zh: 'This 关键字', en: 'this Keyword', link: '/jscore/basic/this' },
        { zh: '原型链', en: 'Prototype Chain', link: '/jscore/basic/prototype' },
        { zh: '作用域', en: 'Scope', link: '/jscore/basic/scope-closure' },
        { zh: 'ES6', en: 'ES6', link: '/jscore/basic/es6' },
        { zh: 'Event Loop', en: 'Event Loop', link: '/jscore/basic/event-loop' },
        { zh: '异步编程', en: 'Async Programming', link: '/jscore/basic/async-program' },
        { zh: 'DOM/BOM 与 Web API', en: 'DOM / BOM & Web APIs', link: '/jscore/basic/dom-bom-webapi' },
        { zh: '事件机制', en: 'Event Mechanism', link: '/jscore/basic/event-mechanism' },
        { zh: '内存管理', en: 'Memory Management', link: '/jscore/basic/memory-management' },
        { zh: '其他 Web API', en: 'Other Web APIs', link: '/jscore/basic/other-web-apis' },
      ],
    },
    {
      zh: '进阶',
      en: 'Advanced',
      items: [
        { zh: '闭包', en: 'Closures', link: '/jscore/advanced/closure' },
        { zh: '函数式编程', en: 'Functional Programming', link: '/jscore/advanced/functional-programming' },
        { zh: '设计模式', en: 'Design Patterns', link: '/jscore/advanced/design-pattern' },
        { zh: '模块化', en: 'Modules', link: '/jscore/advanced/modules' },
        { zh: 'TypeScript 基础', en: 'TypeScript Basics', link: '/jscore/advanced/typescript-basic' },
        { zh: 'Promise', en: 'Promise', link: '/jscore/advanced/promise' },
        { zh: 'Generator', en: 'Generator', link: '/jscore/advanced/generator' },
        { zh: 'Async/Await', en: 'Async / Await', link: '/jscore/advanced/async-await' },
        { zh: 'Web Worker', en: 'Web Worker', link: '/jscore/advanced/web-worker' },
        { zh: 'Web Assembly', en: 'WebAssembly', link: '/jscore/advanced/web-assembly' },
        { zh: 'Web Socket', en: 'WebSocket', link: '/jscore/advanced/web-socket' },
      ],
    },
  ],

  '/html&css/': [
    {
      zh: '布局',
      en: 'Layout',
      items: [
        { zh: '常用布局', en: 'Common Layouts', link: '/html&css/layout' },
        { zh: '语义化标签', en: 'Semantic Tags', link: '/html&css/semantic-tag' },
        { zh: 'HTML5 新特性', en: 'HTML5 Features', link: '/html&css/html5-feature' },
        { zh: 'css动画', en: 'CSS Animation', link: '/html&css/animation' },
        { zh: 'css盒模型', en: 'CSS Box Model', link: '/html&css/box-model' },
        { zh: '浏览器兼容性', en: 'Browser Compatibility', link: '/html&css/browser-compatibility' },
        { zh: '响应式设计', en: 'Responsive Design', link: '/html&css/responsive-design' },
      ],
    },
  ],

  '/framework/': [
    {
      zh: 'Vue',
      en: 'Vue',
      items: [
        { zh: 'Vue 3', en: 'Vue 3', link: '/framework/vue/vue3' },
        { zh: '响应式原理', en: 'Reactivity', link: '/framework/vue/reactivity' },
        { zh: '生命周期', en: 'Lifecycle', link: '/framework/vue/lifecycles' },
        { zh: '路由', en: 'Router', link: '/framework/vue/router' },
        { zh: '状态管理', en: 'State Management', link: '/framework/vue/state-management' },
        { zh: '性能优化', en: 'Performance', link: '/framework/vue/performance-optimization' },
        { zh: 'dom-diff', en: 'DOM Diff', link: '/framework/vue/dom-diff' },
        { zh: '组件通信', en: 'Component Communication', link: '/framework/vue/components-communication' },
      ],
    },
    {
      zh: 'React',
      en: 'React',
      items: [
        { zh: '基础概念', en: 'Basics', link: '/framework/react/basics' },
        { zh: '虚拟DOM', en: 'Virtual DOM', link: '/framework/react/virtual-dom' },
        { zh: 'Hooks', en: 'Hooks', link: '/framework/react/hooks' },
        { zh: 'React 19 新特性', en: 'React 19 Features', link: '/framework/react/react19-features' },
        { zh: '状态管理', en: 'State Management', link: '/framework/react/state-management' },
        { zh: '性能优化', en: 'Performance', link: '/framework/react/performance-optimization' },
        { zh: '路由', en: 'Router', link: '/framework/react/router' },
      ],
    },
  ],

  '/handwrite/': [
    {
      zh: '手写方法实现',
      en: 'Handwritten Implementations',
      items: [
        { zh: 'map', en: 'map', link: '/handwrite/array-map' },
        { zh: 'filter', en: 'filter', link: '/handwrite/array-filter' },
        { zh: 'reduce', en: 'reduce', link: '/handwrite/array-reduce' },
        { zh: 'some', en: 'some', link: '/handwrite/array-some' },
        { zh: 'reduce-filter', en: 'reduce-filter', link: '/handwrite/reduce-filter' },
        { zh: 'reduce-map', en: 'reduce-map', link: '/handwrite/reduce-map' },
        { zh: 'reduce-flat', en: 'reduce-flat', link: '/handwrite/reduce-flat' },
        { zh: '防抖', en: 'Debounce', link: '/handwrite/debounce' },
        { zh: '节流', en: 'Throttle', link: '/handwrite/throttle' },
        { zh: 'call', en: 'call', link: '/handwrite/call' },
        { zh: 'bind', en: 'bind', link: '/handwrite/bind' },
        { zh: 'new', en: 'new', link: '/handwrite/new' },
        { zh: 'instanceof', en: 'instanceof', link: '/handwrite/instanceof' },
        { zh: '判断数据类型', en: 'Type Check', link: '/handwrite/judge-data-type' },
        { zh: 'Object.assign', en: 'Object.assign', link: '/handwrite/object-assign' },
        { zh: 'promisify', en: 'promisify', link: '/handwrite/promisify' },
      ],
    },
  ],

  '/algorithm&data-structure/': [
    {
      zh: '操作',
      en: 'Operations',
      items: [
        { zh: '数组操作', en: 'Array Operations', link: '/algorithm&data-structure/array-operation' },
        { zh: '字符串操作', en: 'String Operations', link: '/algorithm&data-structure/string-operation' },
        { zh: '链表操作', en: 'Linked List Operations', link: '/algorithm&data-structure/linked-operation' },
      ],
    },
    {
      zh: '算法',
      en: 'Algorithms',
      items: [
        { zh: '排序', en: 'Sorting', link: '/algorithm&data-structure/sort' },
        { zh: '双指针', en: 'Two Pointers', link: '/algorithm&data-structure/two-pointers' },
        { zh: '滑动窗口', en: 'Sliding Window', link: '/algorithm&data-structure/sliding-window' },
        { zh: '动态规划', en: 'Dynamic Programming', link: '/algorithm&data-structure/dynamic-programming' },
        { zh: '贪心算法', en: 'Greedy', link: '/algorithm&data-structure/greedy-algorithm' },
        { zh: '回溯算法', en: 'Backtracking', link: '/algorithm&data-structure/backtracking' },
        { zh: '分治算法', en: 'Divide and Conquer', link: '/algorithm&data-structure/divide-and-conquer' },
      ],
    },
    {
      zh: '数据结构',
      en: 'Data Structures',
      items: [
        { zh: '数组', en: 'Array', link: '/algorithm&data-structure/array' },
        { zh: '树', en: 'Tree', link: '/algorithm&data-structure/binary-tree' },
        { zh: '链表', en: 'Linked List', link: '/algorithm&data-structure/linked-list' },
        { zh: '栈', en: 'Stack', link: '/algorithm&data-structure/stack' },
        { zh: '队列', en: 'Queue', link: '/algorithm&data-structure/queue' },
      ],
    },
  ],

  '/engineering/': [
    {
      zh: '工程化',
      en: 'Engineering',
      items: [
        { zh: '构建工具', en: 'Build Tools', link: '/engineering/build-tools' },
        { zh: 'Webpack vs Vite 深入', en: 'Webpack vs Vite', link: '/engineering/webpack-vs-vite' },
        { zh: '前端规范化', en: 'Frontend Standards', link: '/engineering/frontend-standardization' },
        { zh: '自动化测试', en: 'Automated Testing', link: '/engineering/automated-testing' },
        { zh: '包管理工具', en: 'Package Managers', link: '/engineering/package-manage' },
        { zh: 'CI/CD', en: 'CI/CD', link: '/engineering/CI-CD' },
        { zh: 'GIT', en: 'Git', link: '/engineering/git' },
      ],
    },
  ],

  '/network&broswer/': [
    {
      zh: '网络与浏览器',
      en: 'Network & Browser',
      items: [
        { zh: 'HTTP 协议', en: 'HTTP Protocol', link: '/network&broswer/http-protocol' },
        { zh: '缓存机制', en: 'Caching', link: '/network&broswer/cache-mechanism' },
        { zh: '浏览器渲染', en: 'Browser Rendering', link: '/network&broswer/broswer-render' },
        { zh: '性能优化', en: 'Performance', link: '/network&broswer/performance-optimization' },
        { zh: 'Web Vitals', en: 'Web Vitals', link: '/network&broswer/web-vitals' },
        { zh: '异常监控与处理', en: 'Error Monitoring', link: '/network&broswer/error-monitoring' },
        { zh: '可观测性系统', en: 'Observability', link: '/network&broswer/observability-system' },
        { zh: '浏览器存储', en: 'Browser Storage', link: '/network&broswer/broswer-storage' },
        { zh: '跨域', en: 'Cross-Origin', link: '/network&broswer/cross-origin' },
        { zh: 'Web 安全', en: 'Web Security', link: '/network&broswer/web-safe' },
      ],
    },
  ],

  '/scenarios/': [
    {
      zh: '业务场景题',
      en: 'Scenario Questions',
      items: [
        { zh: '总览', en: 'Overview', link: '/scenarios/index' },
        { zh: '大文件处理', en: 'Large File Handling', link: '/scenarios/file-upload' },
        { zh: '海量数据渲染', en: 'Massive Data Rendering', link: '/scenarios/massive-data-rendering' },
        { zh: '权限管理体系', en: 'Permission System', link: '/scenarios/permission-system' },
        { zh: '复杂交互', en: 'Complex Interaction', link: '/scenarios/complex-interaction' },
        { zh: '系统设计题', en: 'System Design', link: '/scenarios/system-design' },
      ],
    },
  ],

  '/advanced/': [
    {
      zh: '高级前端 8 周',
      en: 'Senior Frontend 8 Weeks',
      items: [
        { zh: '8 周索引', en: '8-Week Index', link: '/advanced/senior-frontend-index' },
        { zh: '路线图', en: 'Roadmap', link: '/advanced/senior-frontend-roadmap' },
      ],
    },
    {
      zh: 'Week 1 构建链路',
      en: 'Week 1 Build Pipeline',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week1/roadmap' },
        { zh: '构建工具', en: 'Build Tools', link: '/advanced/week1/build-tools' },
        { zh: 'Webpack', en: 'Webpack', link: '/advanced/week1/webpack' },
        { zh: 'Vite', en: 'Vite', link: '/advanced/week1/vite' },
        { zh: '模块化', en: 'Modules', link: '/advanced/week1/modules' },
        { zh: '按小时清单', en: 'Hourly Checklist', link: '/advanced/week1/hourly' },
      ],
    },
    {
      zh: 'Week 2 部署交付',
      en: 'Week 2 Deploy & Delivery',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week2/roadmap' },
        { zh: 'CI/CD', en: 'CI/CD', link: '/advanced/week2/ci-cd' },
        { zh: '部署', en: 'Deployment', link: '/advanced/week2/deployment' },
      ],
    },
    {
      zh: 'Week 3 Vue 原理',
      en: 'Week 3 Vue Internals',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week3/roadmap' },
        { zh: '响应式原理', en: 'Reactivity', link: '/advanced/week3/reactivity' },
        { zh: '渲染机制', en: 'Rendering', link: '/advanced/week3/rendering-mechanism' },
      ],
    },
    {
      zh: 'Week 4 React 机制',
      en: 'Week 4 React Internals',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week4/roadmap' },
        { zh: 'Hooks', en: 'Hooks', link: '/advanced/week4/hooks' },
        { zh: '并发机制', en: 'Concurrency', link: '/advanced/week4/concurrency' },
      ],
    },
    {
      zh: 'Week 5 TypeScript',
      en: 'Week 5 TypeScript',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week5/roadmap' },
        { zh: '基础', en: 'Basics', link: '/advanced/week5/typescript-basic' },
        { zh: '类型设计', en: 'Type Design', link: '/advanced/week5/typescript-design' },
      ],
    },
    {
      zh: 'Week 6 性能安全',
      en: 'Week 6 Perf & Security',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week6/roadmap' },
        { zh: '性能优化', en: 'Performance', link: '/advanced/week6/performance-optimization' },
        { zh: '安全专题', en: 'Security', link: '/advanced/week6/security' },
      ],
    },
    {
      zh: 'Week 7 测试保障',
      en: 'Week 7 Testing',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week7/roadmap' },
        { zh: '测试策略', en: 'Testing Strategy', link: '/advanced/week7/testing-strategy' },
      ],
    },
    {
      zh: 'Week 8 题库',
      en: 'Week 8 Question Bank',
      items: [
        { zh: '概览', en: 'Overview', link: '/advanced/week8/roadmap' },
        { zh: '高级前端题库', en: 'Senior Frontend Questions', link: '/advanced/week8/question-bank' },
      ],
    },
    {
      zh: '基础与题库',
      en: 'Foundations & Bank',
      items: [
        { zh: '基础打稳 14 天', en: '14-Day Foundation Sprint', link: '/sprint-14-days' },
        { zh: '50 题速记', en: '50 High-Frequency Qs', link: '/high-frequency-50' },
        { zh: '每日口述题单', en: 'Daily Oral Sets', link: '/daily-oral-sets-14' },
        { zh: '项目复盘', en: 'Project Review', link: '/project-review' },
        { zh: '手写代码', en: 'Handwritten Code', link: '/handwrite/array-map' },
        { zh: 'HR 面试问题', en: 'HR Questions', link: '/hr-questions' },
      ],
    },
    {
      zh: '前沿与进阶',
      en: 'Frontier & Advanced',
      items: [
        { zh: 'SSR / SSG', en: 'SSR / SSG', link: '/advanced/ssr-ssg' },
        { zh: '微前端', en: 'Micro Frontend', link: '/advanced/micro-frontend' },
        { zh: '移动端与跨端', en: 'Mobile & Cross-Platform', link: '/advanced/mobile-and-cross-platform' },
        { zh: 'CSS 进阶', en: 'Advanced CSS', link: '/advanced/css-advanced' },
        { zh: 'AI Agent 工程专题', en: 'AI Agent Engineering', link: '/ai-agent/' },
      ],
    },
  ],
}
