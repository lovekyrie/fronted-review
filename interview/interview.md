---
layout: doc
title: 前端面试复习指南
description: 系统化的前端面试知识体系与复习路径
---

# 🚀 前端面试复习指南

## 🎯 高级前端专项入口

- [高级前端 8 周路线图](./plan/senior-frontend-roadmap)
- [Week 1 按小时执行清单](./plan/week1-build-hourly)

如果目标是高级前端面试，建议优先按照上面的专项路线推进，再把下面的知识图谱作为查漏补缺索引使用。

## 🗓️ 核心知识图谱

### 1. JavaScript 核心 (重中之重)
> 考察频率：⭐⭐⭐⭐⭐ | 难度系数：⭐⭐⭐⭐

- **基础概念**
  - [数据类型](./jscore/basic/data-type)：原理（堆栈）、检测（typeof/instanceof）、转换（ToPrimitive）
  - [作用域与闭包](./jscore/basic/scope-closure)：词法作用域、执行上下文、闭包应用与内存泄漏
  - [原型与原型链](./jscore/basic/prototype)：继承方式（组合/寄生）、new 原理、类（Class）
  - [This 关键字](./jscore/basic/this)：四种绑定规则、箭头函数差异
  - [事件循环](./jscore/basic/event-loop)：宏任务/微任务执行顺序、Node.js 差异
  - [异步编程](./jscore/basic/async-program)：Promise/A+ 规范、async/await 原理、手写 Promise
  - [ES6+ 新特性](./jscore/basic/es6)：let/const、解构、Proxy、Map/Set、Module

- **进阶概念**
  - [TypeScript 基础](./jscore/advanced/week5-typescript-basic)：泛型、高级类型、类型设计与判别联合
  - [函数式编程](./jscore/advanced/functional-programming)：纯函数、柯里化、高阶函数
  - [设计模式](./jscore/advanced/design-pattern)：单例、观察者、发布订阅、代理模式

### 2. HTML & CSS (基石)
> 考察频率：⭐⭐⭐ | 难度系数：⭐⭐⭐

- **HTML**
  - [语义化标签](./html&css/semantic)：SEO、无障碍访问
  - [HTML5 新特性](./html&css/html5)：Web Worker、Service Worker、Canvas

- **CSS**
  - [盒模型](./html&css/box-model)：标准/怪异盒模型、BFC 原理
  - [布局系统](./html&css/layout)：Flexbox 全解、Grid 网格布局、水平垂直居中
  - [响应式设计](./html&css/responsive)：媒体查询、rem/em/vw 适配方案
  - [层叠上下文](./html&css/stacking)：z-index、定位
  - [动画与绘图](./html&css/animation)：Transition、Animation、Canvas vs SVG

### 3. 框架原理 (深度考察)
> 考察频率：⭐⭐⭐⭐⭐ | 难度系数：⭐⭐⭐⭐⭐

- **Vue.js**
  - [Vue 3 核心](./framework/vue/vue3)：Composition API、Teleport、Suspense
  - [响应式原理](./framework/vue/week3-reactivity)：Object.defineProperty vs Proxy
  - [虚拟 DOM](./framework/vue/dom-diff)：Diff 算法、PatchFlag、更新过程
  - [生态系统](./framework/vue/router)：Vue Router、状态管理与生态配合

- **React**
  - [核心原理](./framework/react/basics)：Fiber、Reconciliation、组件模型
  - [Hooks](./framework/react/week4-hooks)：useState、useEffect 原理、自定义 Hooks
  - [状态管理](./framework/react/state-management)：Redux (Thunk/Saga)、Zustand、Context API
  - [性能优化](./framework/react/performance-optimization)：useMemo/useCallback、React.memo

### 4. 浏览器与网络 (区分度高)
> 考察频率：⭐⭐⭐⭐ | 难度系数：⭐⭐⭐⭐

- **网络协议**
  - [HTTP 体系](./network&broswer/http-protocol)：HTTP/1.1 vs 2.0 vs 3.0、HTTPS 加密流程
  - [缓存机制](./network&broswer/cache-mechanism)：强缓存、协商缓存、缓存命中策略
  - [浏览器存储](./network&broswer/broswer-storage)：Cookie、LocalStorage、SessionStorage、IndexedDB

- **浏览器原理**
  - [渲染流程](./network&broswer/broswer-render)：DOM/CSSOM -> Render Tree -> Layout -> Paint -> Composite
  - [跨域解决方案](./network&broswer/cross-origin)：CORS、JSONP、Nginx 反向代理
  - [Web 安全](./network&broswer/web-safe)：XSS、CSRF、ClickJacking 防御
  - [性能指标](./network&broswer/week6-performance-optimization)：FCP、LCP、CLS、TTI 及优化手段

### 5. 前端工程化 (实战必备)
> 考察频率：⭐⭐⭐⭐ | 难度系数：⭐⭐⭐⭐

- **构建工具**
  - [构建工具总览](./engineering/week1-build-tools)：Webpack、Vite、Babel、Tree Shaking、Code Splitting
  
- **研发流程**
  - [包管理](./engineering/package-manage)：npm vs yarn vs pnpm (软硬链接)
  - [Git 协作](./engineering/git)：分支策略、提交规范、协作流程
  - [CI/CD](./engineering/week2-ci-cd)：GitHub Actions、Docker 部署、Nginx 配置

### 6. 算法与数据结构 (大厂敲门砖)
> 考察频率：⭐⭐⭐ | 难度系数：⭐⭐⭐⭐⭐

- [数据结构](./algorithm&data-structure/array)：数组、链表、树、栈、队列
- [核心算法](./algorithm&data-structure/sort)：排序、二分查找、双指针、滑动窗口、动态规划
- [手写代码](./handwrite/debounce)：防抖节流、深拷贝、EventEmitter、Promise

## 📚 复习策略

### 高级前端建议顺序

1. 工程化与构建链路
2. 部署与交付链路
3. Vue / React 原理
4. TypeScript 进阶
5. 浏览器、性能、安全
6. 测试与质量保障
7. 架构题与模拟面试

### 使用方式

- 先按 [高级前端 8 周路线图](./plan/senior-frontend-roadmap) 推进
- 再按 [Week 1 按小时执行清单](./plan/week1-build-hourly) 开始落地
- 每学完一周，都把新增理解回填到对应专题文档
- 算法和手写代码保持手感即可，不再作为主投入方向
