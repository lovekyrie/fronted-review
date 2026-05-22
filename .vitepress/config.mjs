import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '前端面试知识库',
  description: '我的前端复习笔记',

  // 关键配置：将根目录指向你的 interview 文件夹
  srcDir: './interview',

  // 排除的文件
  srcExclude: ['interview.md'],

  themeConfig: {
    // 1. 顶部导航栏 (Tabs)
    // 对应你的文件夹结构，点击后跳转到该分类下的第一个文件
    nav: [
      { text: '高级前端', link: '/advanced/senior-frontend-index' },
      { text: 'AI Agent', link: '/ai-agent/' },
      { text: '80days', link: '/daily-prep/day1-js-foundation-checklist' },
      { text: 'JS Core', link: '/jscore/basic/data-type' },
      { text: 'HTML & CSS', link: '/html&css/layout' },
      { text: '框架原理', link: '/framework/vue/vue3' },
      { text: '网络与浏览器', link: '/network&broswer/http-protocol' },
      { text: '算法', link: '/algorithm&data-structure/array-operation' },
      { text: '工程化', link: '/engineering/build-tools' },
    ],

    // 2. 侧边栏 (Sidebar)
    // 当路由匹配到 key (如 /jscore/) 时，显示对应的侧边栏
    sidebar: {
      '/ai-agent/': [
        {
          text: '总览',
          items: [
            { text: '学习路线', link: '/ai-agent/' },
          ],
        },
        {
          text: '基础能力',
          items: [
            { text: 'Tool 与 MCP', link: '/ai-agent/tool-and-mcp' },
            { text: 'Prompt / Parser / Memory', link: '/ai-agent/prompt-parser-memory' },
          ],
        },
        {
          text: 'RAG',
          items: [
            { text: 'RAG 工程链路', link: '/ai-agent/rag' },
          ],
        },
        {
          text: '运行时',
          items: [
            { text: 'Agent Runtime', link: '/ai-agent/agent-runtime' },
          ],
        },
        {
          text: '多 Agent',
          items: [
            { text: 'LangGraph 与多 Agent', link: '/ai-agent/langgraph-multi-agent' },
          ],
        },
        {
          text: '评估面试',
          items: [
            { text: '评估与观测', link: '/ai-agent/observability-evaluation' },
            { text: '高频面试题', link: '/ai-agent/interview-questions' },
          ],
        },
      ],

      '/daily-prep/': [
        {
          text: '总览',
          items: [
            { text: '每日模板', link: '/daily-prep/_template' },
          ],
        },
        {
          text: '阶段 1：基础打稳 (Day 1–14)',
          collapsed: true,
          items: [
            { text: 'Day 1 JS 基础', link: '/daily-prep/day1-js-foundation-checklist' },
            { text: 'Day 2 闭包/作用域/ES6', link: '/daily-prep/day2-closure-scope-es6' },
            { text: 'Day 3 异步与事件循环', link: '/daily-prep/day3-async-event-loop' },
            { text: 'Day 4 DOM/BOM/事件', link: '/daily-prep/day4-dom-bom-event' },
            { text: 'Day 5 内存与渲染', link: '/daily-prep/day5-memory-browser-render' },
            { text: 'Day 6 HTTP/缓存/跨域', link: '/daily-prep/day6-http-cache-cross-origin' },
            { text: 'Day 7 基础模拟面 1', link: '/daily-prep/day7-basic-mock-1' },
            { text: 'Day 8 HTML/CSS 布局', link: '/daily-prep/day8-html-css-layout' },
            { text: 'Day 9 语义化/兼容/动画', link: '/daily-prep/day9-semantic-compat-animation' },
            { text: 'Day 10 算法保温', link: '/daily-prep/day10-algorithm-warmup' },
            { text: 'Day 11 手写保温 1', link: '/daily-prep/day11-handwrite-warmup-1' },
            { text: 'Day 12 手写保温 2', link: '/daily-prep/day12-handwrite-warmup-2' },
            { text: 'Day 13 框架预热', link: '/daily-prep/day13-framework-preheat' },
            { text: 'Day 14 基础模拟面 2', link: '/daily-prep/day14-basic-mock-2' },
          ],
        },
        {
          text: '阶段 2：构建链路 (Day 15–21)',
          collapsed: true,
          items: [
            { text: 'Day 15 模块化', link: '/daily-prep/day15-modules-esm-cjs' },
            { text: 'Day 16 Babel', link: '/daily-prep/day16-babel-ast' },
            { text: 'Day 17 Vite 原理', link: '/daily-prep/day17-vite-principle' },
            { text: 'Day 18 webpack 核心', link: '/daily-prep/day18-webpack-core' },
            { text: 'Day 19 分割/摇树/缓存', link: '/daily-prep/day19-code-splitting-tree-shaking' },
            { text: 'Day 20 生产构建', link: '/daily-prep/day20-production-build' },
            { text: 'Day 21 构建专题复盘', link: '/daily-prep/day21-build-review' },
          ],
        },
        {
          text: '阶段 3：部署交付 (Day 22–28)',
          collapsed: true,
          items: [
            { text: 'Day 22 GitHub Actions', link: '/daily-prep/day22-github-actions' },
            { text: 'Day 23 Docker', link: '/daily-prep/day23-docker-basics' },
            { text: 'Day 24 Nginx', link: '/daily-prep/day24-nginx-config' },
            { text: 'Day 25 环境与模式', link: '/daily-prep/day25-env-and-mode' },
            { text: 'Day 26 发布与回滚', link: '/daily-prep/day26-release-rollback' },
            { text: 'Day 27 上线排障', link: '/daily-prep/day27-online-troubleshoot' },
            { text: 'Day 28 部署专题复盘', link: '/daily-prep/day28-deploy-review' },
          ],
        },
        {
          text: '阶段 4：Vue 原理 (Day 29–42)',
          collapsed: true,
          items: [
            { text: 'Day 29 Proxy/Reflect', link: '/daily-prep/day29-vue-proxy-reflect' },
            { text: 'Day 30 track/trigger', link: '/daily-prep/day30-vue-track-trigger' },
            { text: 'Day 31 调度器', link: '/daily-prep/day31-vue-scheduler' },
            { text: 'Day 32 ref/reactive/computed/watch', link: '/daily-prep/day32-vue-ref-reactive-computed-watch' },
            { text: 'Day 33 Vue 2 vs 3', link: '/daily-prep/day33-vue2-vs-vue3-reactivity' },
            { text: 'Day 34 模板编译', link: '/daily-prep/day34-vue-compiler' },
            { text: 'Day 35 Patch Flag/Block Tree', link: '/daily-prep/day35-vue-patch-flag' },
            { text: 'Day 36 渲染器 + diff', link: '/daily-prep/day36-vue-renderer' },
            { text: 'Day 37 组件更新', link: '/daily-prep/day37-vue-component-update' },
            { text: 'Day 38 mini-vue reactivity', link: '/daily-prep/day38-mini-vue-reactivity' },
            { text: 'Day 39 mini-vue renderer', link: '/daily-prep/day39-mini-vue-renderer' },
            { text: 'Day 40 Vue Router', link: '/daily-prep/day40-vue-router' },
            { text: 'Day 41 Pinia/Vuex', link: '/daily-prep/day41-pinia-vuex' },
            { text: 'Day 42 SSR + Vue 复盘', link: '/daily-prep/day42-vue-ssr-review' },
          ],
        },
        {
          text: '阶段 5：React 机制 (Day 43–49)',
          collapsed: true,
          items: [
            { text: 'Day 43 render/commit', link: '/daily-prep/day43-react-render-commit' },
            { text: 'Day 44 state queue', link: '/daily-prep/day44-react-state-queue' },
            { text: 'Day 45 useEffect 陷阱', link: '/daily-prep/day45-react-useeffect' },
            { text: 'Day 46 memo/callback', link: '/daily-prep/day46-react-memo-callback' },
            { text: 'Day 47 并发渲染', link: '/daily-prep/day47-react-concurrent' },
            { text: 'Day 48 React 19 新特性', link: '/daily-prep/day48-react19-features' },
            { text: 'Day 49 RSC + React 复盘', link: '/daily-prep/day49-react-rsc-review' },
          ],
        },
        {
          text: '阶段 6：TypeScript (Day 50–56)',
          collapsed: true,
          items: [
            { text: 'Day 50 类型基础', link: '/daily-prep/day50-ts-basics' },
            { text: 'Day 51 泛型与约束', link: '/daily-prep/day51-ts-generics' },
            { text: 'Day 52 条件/infer', link: '/daily-prep/day52-ts-conditional-infer' },
            { text: 'Day 53 映射类型', link: '/daily-prep/day53-ts-mapped' },
            { text: 'Day 54 模板字面量', link: '/daily-prep/day54-ts-template-literal' },
            { text: 'Day 55 工具类型', link: '/daily-prep/day55-ts-utility-types' },
            { text: 'Day 56 类型设计复盘', link: '/daily-prep/day56-ts-design-review' },
          ],
        },
        {
          text: '阶段 7：性能与安全 (Day 57–63)',
          collapsed: true,
          items: [
            { text: 'Day 57 事件循环细节', link: '/daily-prep/day57-event-loop-detail' },
            { text: 'Day 58 渲染流水线', link: '/daily-prep/day58-browser-render-pipeline' },
            { text: 'Day 59 Web Vitals', link: '/daily-prep/day59-web-vitals' },
            { text: 'Day 60 首屏优化', link: '/daily-prep/day60-first-paint-optimization' },
            { text: 'Day 61 缓存 + Service Worker', link: '/daily-prep/day61-http-cache-service-worker' },
            { text: 'Day 62 XSS/CSRF/CSP', link: '/daily-prep/day62-xss-csrf-csp' },
            { text: 'Day 63 性能/安全复盘', link: '/daily-prep/day63-perf-security-review' },
          ],
        },
        {
          text: '阶段 8：测试保障 (Day 64–70)',
          collapsed: true,
          items: [
            { text: 'Day 64 测试分层', link: '/daily-prep/day64-test-layering' },
            { text: 'Day 65 Vitest 基础', link: '/daily-prep/day65-vitest-basics' },
            { text: 'Day 66 Vue 组件测试', link: '/daily-prep/day66-vue-component-testing' },
            { text: 'Day 67 Mock/覆盖率', link: '/daily-prep/day67-mock-coverage' },
            { text: 'Day 68 Playwright E2E', link: '/daily-prep/day68-playwright-e2e' },
            { text: 'Day 69 handwrite 补测试', link: '/daily-prep/day69-handwrite-promise-test' },
            { text: 'Day 70 测试专题复盘', link: '/daily-prep/day70-testing-review' },
          ],
        },
        {
          text: '阶段 9：架构与模拟面 (Day 71–80)',
          collapsed: true,
          items: [
            { text: 'Day 71 大文件上传', link: '/daily-prep/day71-scenario-file-upload' },
            { text: 'Day 72 虚拟列表', link: '/daily-prep/day72-scenario-virtual-list' },
            { text: 'Day 73 权限体系', link: '/daily-prep/day73-scenario-permission' },
            { text: 'Day 74 微前端/跨端', link: '/daily-prep/day74-micro-frontend' },
            { text: 'Day 75 监控/可观测性', link: '/daily-prep/day75-monitoring-observability' },
            { text: 'Day 76 项目 STAR', link: '/daily-prep/day76-project-review-star' },
            { text: 'Day 77 简历 + HR', link: '/daily-prep/day77-resume-hr-practice' },
            { text: 'Day 78 模拟面 1', link: '/daily-prep/day78-mock-interview-1' },
            { text: 'Day 79 模拟面 2', link: '/daily-prep/day79-mock-interview-2' },
            { text: 'Day 80 最终复盘', link: '/daily-prep/day80-final-review' },
          ],
        },
      ],

      '/jscore/': [
        {
          text: '基础 (Basic)',
          items: [
            // 这里对应 interview/jscore/basic/this.md
            { text: '数据类型', link: '/jscore/basic/data-type' },
            { text: 'This 关键字', link: '/jscore/basic/this' },
            { text: '原型链', link: '/jscore/basic/prototype' },
            { text: '作用域', link: '/jscore/basic/scope-closure' },
            { text: 'ES6', link: '/jscore/basic/es6' },
            { text: 'Event Loop', link: '/jscore/basic/event-loop' },
            { text: '异步编程', link: '/jscore/basic/async-program' },
            { text: 'DOM/BOM 与 Web API', link: '/jscore/basic/dom-bom-webapi' },
            { text: '事件机制', link: '/jscore/basic/event-mechanism' },
            { text: '内存管理', link: '/jscore/basic/memory-management' },
            { text: '其他 Web API', link: '/jscore/basic/other-web-apis' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: '闭包', link: '/jscore/advanced/closure' },
            { text: '函数式编程', link: '/jscore/advanced/functional-programming' },
            { text: '设计模式', link: '/jscore/advanced/design-pattern' },
            { text: '模块化', link: '/jscore/advanced/modules' },
            { text: 'TypeScript 基础', link: '/jscore/advanced/typescript-basic' },
            { text: 'Promise', link: '/jscore/advanced/promise' },
            { text: 'Generator', link: '/jscore/advanced/generator' },
            { text: 'Async/Await', link: '/jscore/advanced/async-await' },
            { text: 'Web Worker', link: '/jscore/advanced/web-worker' },
            { text: 'Web Assembly', link: '/jscore/advanced/web-assembly' },
            { text: 'Web Socket', link: '/jscore/advanced/web-socket' },
          ],
        },
      ],

      '/html&css/': [
        {
          text: '布局',
          items: [
            { text: '常用布局', link: '/html&css/layout' },
            { text: '语义化标签', link: '/html&css/semantic-tag' },
            { text: 'HTML5 新特性', link: '/html&css/html5-feature' },
            { text: 'css动画', link: '/html&css/animation' },
            { text: 'css盒模型', link: '/html&css/box-model' },
            { text: '浏览器兼容性', link: '/html&css/browser-compatibility' },
            { text: '响应式设计', link: '/html&css/responsive-design' },
          ],
        },
      ],

      '/framework/': [
        {
          text: 'Vue',
          items: [
            { text: 'Vue 3', link: '/framework/vue/vue3' },
            { text: '响应式原理', link: '/framework/vue/reactivity' },
            { text: '生命周期', link: '/framework/vue/lifecycles' },
            { text: '路由', link: '/framework/vue/router' },
            { text: '状态管理', link: '/framework/vue/state-management' },
            { text: '性能优化', link: '/framework/vue/performance-optimization' },
            { text: 'dom-diff', link: '/framework/vue/dom-diff' },
            { text: '组件通信', link: '/framework/vue/components-communication' },
          ],
        },
        {
          text: 'React',
          items: [
            { text: '基础概念', link: '/framework/react/basics' },
            { text: '虚拟DOM', link: '/framework/react/virtual-dom' },
            { text: 'Hooks', link: '/framework/react/hooks' },
            { text: 'React 19 新特性', link: '/framework/react/react19-features' },
            { text: '状态管理', link: '/framework/react/state-management' },
            { text: '性能优化', link: '/framework/react/performance-optimization' },
            { text: '路由', link: '/framework/react/router' },
          ],
        },
      ],

      '/handwrite/': [
        {
          text: '手写方法实现',
          items: [
            { text: 'map', link: '/handwrite/array-map' },
            { text: 'filter', link: '/handwrite/array-filter' },
            { text: 'reduce', link: '/handwrite/array-reduce' },
            { text: 'some', link: '/handwrite/array-some' },
            { text: 'reduce-filter', link: '/handwrite/reduce-filter' },
            { text: 'reduce-map', link: '/handwrite/reduce-map' },
            { text: 'reduce-flat', link: '/handwrite/reduce-flat' },
            { text: '防抖', link: '/handwrite/debounce' },
            { text: '节流', link: '/handwrite/throttle' },
            { text: 'call', link: '/handwrite/call' },
            { text: 'bind', link: '/handwrite/bind' },
            { text: 'new', link: '/handwrite/new' },
            { text: 'instanceof', link: '/handwrite/instanceof' },
            { text: '判断数据类型', link: '/handwrite/judge-data-type' },
            { text: 'Object.assign', link: '/handwrite/object-assign' },
            { text: 'promisify', link: '/handwrite/promisify' },
          ],
        },
      ],

      '/algorithm&data-structure/': [
        {
          text: '操作',
          items: [
            { text: '数组操作', link: '/algorithm&data-structure/array-operation' },
            { text: '字符串操作', link: '/algorithm&data-structure/string-operation' },
            { text: '链表操作', link: '/algorithm&data-structure/linked-operation' },
          ],
        },
        {
          text: '算法',
          items: [
            { text: '排序', link: '/algorithm&data-structure/sort' },
            { text: '双指针', link: '/algorithm&data-structure/two-pointers' },
            { text: '滑动窗口', link: '/algorithm&data-structure/sliding-window' },
            { text: '动态规划', link: '/algorithm&data-structure/dynamic-programming' },
            { text: '贪心算法', link: '/algorithm&data-structure/greedy-algorithm' },
            { text: '回溯算法', link: '/algorithm&data-structure/backtracking' },
            { text: '分治算法', link: '/algorithm&data-structure/divide-and-conquer' },
          ],
        },
        {
          text: '数据结构',
          items: [
            { text: '数组', link: '/algorithm&data-structure/array' },
            { text: '树', link: '/algorithm&data-structure/binary-tree' },
            { text: '链表', link: '/algorithm&data-structure/linked-list' },
            { text: '栈', link: '/algorithm&data-structure/stack' },
            { text: '队列', link: '/algorithm&data-structure/queue' },
          ],
        },
      ],

      '/engineering/': [
        {
          text: '工程化',
          items: [
            { text: '构建工具', link: '/engineering/build-tools' },
            { text: 'Webpack vs Vite 深入', link: '/engineering/webpack-vs-vite' },
            { text: '前端规范化', link: '/engineering/frontend-standardization' },
            { text: '自动化测试', link: '/engineering/automated-testing' },
            { text: '包管理工具', link: '/engineering/package-manage' },
            { text: 'CI/CD', link: '/engineering/CI-CD' },
            { text: 'GIT', link: '/engineering/git' },
          ],
        },
      ],

      '/network&broswer/': [
        {
          text: '网络与浏览器',
          items: [
            { text: 'HTTP 协议', link: '/network&broswer/http-protocol' },
            { text: '缓存机制', link: '/network&broswer/cache-mechanism' },
            { text: '浏览器渲染', link: '/network&broswer/broswer-render' },
            { text: '性能优化', link: '/network&broswer/performance-optimization' },
            { text: 'Web Vitals', link: '/network&broswer/web-vitals' },
            { text: '异常监控与处理', link: '/network&broswer/error-monitoring' },
            { text: '可观测性系统', link: '/network&broswer/observability-system' },
            { text: '浏览器存储', link: '/network&broswer/broswer-storage' },
            { text: '跨域', link: '/network&broswer/cross-origin' },
            { text: 'Web 安全', link: '/network&broswer/web-safe' },
          ],
        },
      ],

      '/scenarios/': [
        {
          text: '业务场景题',
          items: [
            { text: '总览', link: '/scenarios/index' },
            { text: '大文件处理', link: '/scenarios/file-upload' },
            { text: '海量数据渲染', link: '/scenarios/massive-data-rendering' },
            { text: '权限管理体系', link: '/scenarios/permission-system' },
            { text: '复杂交互', link: '/scenarios/complex-interaction' },
            { text: '系统设计题', link: '/scenarios/system-design' },
          ],
        },
      ],

      '/advanced/': [
        {
          text: '高级前端 8 周',
          items: [
            { text: '8 周索引', link: '/advanced/senior-frontend-index' },
            { text: '路线图', link: '/advanced/senior-frontend-roadmap' },
          ],
        },
        {
          text: 'Week 1 构建链路',
          items: [
            { text: '概览', link: '/advanced/week1/roadmap' },
            { text: '构建工具', link: '/advanced/week1/build-tools' },
            { text: '模块化', link: '/advanced/week1/modules' },
            { text: '按小时清单', link: '/advanced/week1/hourly' },
          ],
        },
        {
          text: 'Week 2 部署交付',
          items: [
            { text: '概览', link: '/advanced/week2/roadmap' },
            { text: 'CI/CD', link: '/advanced/week2/ci-cd' },
            { text: '部署', link: '/advanced/week2/deployment' },
          ],
        },
        {
          text: 'Week 3 Vue 原理',
          items: [
            { text: '概览', link: '/advanced/week3/roadmap' },
            { text: '响应式原理', link: '/advanced/week3/reactivity' },
            { text: '渲染机制', link: '/advanced/week3/rendering-mechanism' },
          ],
        },
        {
          text: 'Week 4 React 机制',
          items: [
            { text: '概览', link: '/advanced/week4/roadmap' },
            { text: 'Hooks', link: '/advanced/week4/hooks' },
            { text: '并发机制', link: '/advanced/week4/concurrency' },
          ],
        },
        {
          text: 'Week 5 TypeScript',
          items: [
            { text: '概览', link: '/advanced/week5/roadmap' },
            { text: '基础', link: '/advanced/week5/typescript-basic' },
            { text: '类型设计', link: '/advanced/week5/typescript-design' },
          ],
        },
        {
          text: 'Week 6 性能安全',
          items: [
            { text: '概览', link: '/advanced/week6/roadmap' },
            { text: '性能优化', link: '/advanced/week6/performance-optimization' },
            { text: '安全专题', link: '/advanced/week6/security' },
          ],
        },
        {
          text: 'Week 7 测试保障',
          items: [
            { text: '概览', link: '/advanced/week7/roadmap' },
            { text: '测试策略', link: '/advanced/week7/testing-strategy' },
          ],
        },
        {
          text: 'Week 8 题库',
          items: [
            { text: '概览', link: '/advanced/week8/roadmap' },
            { text: '高级前端题库', link: '/advanced/week8/question-bank' },
          ],
        },
        {
          text: '基础与题库',
          items: [
            { text: '基础打稳 14 天', link: '/sprint-14-days' },
            { text: '50 题速记', link: '/high-frequency-50' },
            { text: '每日口述题单', link: '/daily-oral-sets-14' },
            { text: '项目复盘', link: '/project-review' },
            { text: '手写代码', link: '/handwrite/array-map' },
            { text: 'HR 面试问题', link: '/hr-questions' },
          ],
        },
        {
          text: '前沿与进阶',
          items: [
            { text: 'SSR / SSG', link: '/advanced/ssr-ssg' },
            { text: '微前端', link: '/advanced/micro-frontend' },
            { text: '移动端与跨端', link: '/advanced/mobile-and-cross-platform' },
            { text: 'CSS 进阶', link: '/advanced/css-advanced' },
            { text: 'AI Agent 工程专题', link: '/ai-agent/' },
          ],
        },
      ],
    },

    // 开启本地搜索
    search: {
      provider: 'local',
    },
  },
})
