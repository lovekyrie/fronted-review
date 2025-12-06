---
layout: doc
title: 前端面试复习指南
description: 系统化的前端面试知识体系与复习路径
---

# 🚀 前端面试复习指南

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
  - [TypeScript 基础](./jscore/advanced/typescript)：泛型、高级类型、装饰器
  - [函数式编程](./jscore/advanced/functional)：纯函数、柯里化、高阶函数
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
  - [响应式原理](./framework/vue/reactivity)：Object.defineProperty vs Proxy
  - [虚拟 DOM](./framework/vue/vdom)：Diff 算法 (双端/最长递增子序列)、PatchFlag
  - [生态系统](./framework/vue/ecosystem)：Vue Router (Hash/History)、Pinia/Vuex 状态管理

- **React**
  - [核心原理](./framework/react/core)：Fiber 架构、Reconciliation、合成事件
  - [Hooks](./framework/react/hooks)：useState、useEffect 原理、自定义 Hooks
  - [状态管理](./framework/react/state)：Redux (Thunk/Saga)、Zustand、Context API
  - [性能优化](./framework/react/performance)：useMemo/useCallback、React.memo

### 4. 浏览器与网络 (区分度高)
> 考察频率：⭐⭐⭐⭐ | 难度系数：⭐⭐⭐⭐

- **网络协议**
  - [HTTP 体系](./network/http)：HTTP/1.1 vs 2.0 vs 3.0、HTTPS 加密流程 (TLS/SSL)
  - [TCP/IP](./network/tcp)：三次握手/四次挥手、UDP 区别
  - [缓存机制](./network/cache)：强缓存 (Cache-Control)、协商缓存 (Etag/Last-Modified)

- **浏览器原理**
  - [渲染流程](./browser/render)：DOM/CSSOM -> Render Tree -> Layout -> Paint -> Composite
  - [跨域解决方案](./browser/cors)：CORS、JSONP、Nginx 反向代理
  - [Web 安全](./browser/security)：XSS、CSRF、ClickJacking 防御
  - [性能指标](./browser/performance)：FCP、LCP、CLS、TTI 及优化手段

### 5. 前端工程化 (实战必备)
> 考察频率：⭐⭐⭐⭐ | 难度系数：⭐⭐⭐⭐

- **构建工具**
  - [Webpack](./engineering/webpack)：Loader vs Plugin、HMR 原理、性能优化 (Tree Shaking/Code Splitting)
  - [Vite](./engineering/vite)：ESM 开发服务器原理、Rollup 打包
  
- **研发流程**
  - [包管理](./engineering/package)：npm vs yarn vs pnpm (软硬链接)
  - [规范化](./engineering/lint)：ESLint、Prettier、Git Hooks (Husky)
  - [CI/CD](./engineering/cicd)：GitHub Actions、Docker 部署、Nginx 配置

### 6. 算法与数据结构 (大厂敲门砖)
> 考察频率：⭐⭐⭐ | 难度系数：⭐⭐⭐⭐⭐

- [数据结构](./algorithm/structure)：数组、链表、树 (二叉树/Trie)、栈/队列
- [核心算法](./algorithm/core)：排序 (快排/归并)、二分查找、双指针、滑动窗口、动态规划
- [手写代码](./algorithm/handwrite)：防抖节流、深拷贝、EventEmitter、Promise.all

## 📚 复习策略

### 第一阶段：夯实基础 (2周)
- **重点**：JS Core、HTML/CSS
- **目标**：能手写常见 API，理解底层原理 (如闭包、原型链)。
- **行动**：通读本知识库基础章节，完成 LeetCode 简单题 Top 20。

### 第二阶段：框架深潜 (2周)
- **重点**：Vue/React 原理、源码阅读
- **目标**：不仅会用，更懂"为什么"。能解释 Diff 算法，理解 Hooks 陷阱。
- **行动**：阅读框架源码解析文章，尝试实现简易版 Vue/React。

### 第三阶段：全栈与工程化 (1周)
- **重点**：浏览器原理、网络、Webpack、部署
- **目标**：建立完整的"输入 URL 到页面展示"的全链路知识体系。
- **行动**：配置一个完整的 Webpack 项目，尝试 Docker 部署。

### 第四阶段：模拟与冲刺 (1周)
- **重点**：算法突击、项目复盘、模拟面试
- **目标**：流畅表达项目难点，算法题能给出最优解。
- **行动**：整理项目亮点 (STAR 法则)，进行模拟面试，查漏补缺。
