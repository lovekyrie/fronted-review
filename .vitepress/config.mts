import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "前端面试知识库",
  description: "我的前端复习笔记",
  
  // 关键配置：将根目录指向你的 interview 文件夹
  srcDir: './interview',

  themeConfig: {
    // 1. 顶部导航栏 (Tabs)
    // 对应你的文件夹结构，点击后跳转到该分类下的第一个文件
    nav: [
      { text: 'JS Core', link: '/jscore/basic/this' },
      { text: 'HTML & CSS', link: '/html&css/layout' },
      { text: '框架原理', link: '/framework/vue/reactivity' },
      { text: '算法', link: '/algorithm&data-structure/sort' },
      { text: '工程化', link: '/engineering/webpack/loader' }
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
            {text: '作用域', link: '/jscore/basic/scope-closure'},
            {text: 'ES6', link: '/jscore/basic/es6'},
            {text: 'Event Loop', link: '/jscore/basic/event-loop'},
            {text: '异步编程', link: '/jscore/basic/async-program'},
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '闭包', link: '/jscore/advanced/closure' },
            {text: 'Promise', link: '/jscore/advanced/promise'},
            {text: 'Generator', link: '/jscore/advanced/generator'},
            {text: 'Async/Await', link: '/jscore/advanced/async-await'},
            {text: 'Web Worker', link: '/jscore/advanced/web-worker'},
            {text: 'Web Assembly', link: '/jscore/advanced/web-assembly'},
            {text: 'Web Socket', link: '/jscore/advanced/web-socket'},
          ]
        }
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
          ]
        }
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
            { text: '组件通信', link: '/framework/vue/component-communication' },
          ]
        },
        {
          text: 'React',
          items: [
            { text: '虚拟DOM', link: '/framework/react/virtual-dom' },
            { text: '路由', link: '/framework/react/router' },
            { text: 'Hooks', link: '/framework/react/hooks' },
            { text: '状态管理', link: '/framework/react/state-management' },
            { text: '性能优化', link: '/framework/react/performance-optimization' },
          ]
        }
      ]
    },

    // 开启本地搜索
    search: {
      provider: 'local'
    }
  }
})