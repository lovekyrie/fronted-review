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
