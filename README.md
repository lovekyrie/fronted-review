# fronted-review

前端知识巩固 - 面向高级前端面试的系统化知识库

## 项目目录结构

```
interview/                         # VitePress 文档 (面试知识库)
├── index.md                       # 首页
├── interview.md                   # 面试总览
│
├── advanced/                      # 高级前端 8 周专项
│   ├── senior-frontend-index.md   # 8周索引
│   ├── senior-frontend-roadmap.md # 路线图
│   ├── week1/                     # Week 1: 构建链路
│   ├── week2/                     # Week 2: 部署与交付
│   ├── week3/                     # Week 3: Vue 原理
│   ├── week4/                     # Week 4: React 机制
│   ├── week5/                     # Week 5: TypeScript 进阶
│   ├── week6/                     # Week 6: 浏览器/性能/安全
│   ├── week7/                     # Week 7: 测试与质量保障
│   ├── week8/                     # Week 8: 题库与模拟
│   ├── css-advanced.md            # CSS 进阶
│   ├── micro-frontend.md          # 微前端
│   ├── mobile-and-cross-platform.md # 移动端与跨端
│   └── ssr-ssg.md                 # SSR / SSG
│
├── jscore/                        # JavaScript 核心
│   ├── basic/                     # 基础概念
│   │   ├── data-type.md          # 数据类型与类型系统
│   │   ├── this.md               # this 指向与绑定机制
│   │   ├── prototype.md          # 原型与原型链
│   │   ├── scope-closure.md      # 作用域、闭包与内存管理
│   │   ├── es6.md                # ES6 新特性深度剖析
│   │   ├── event-loop.md         # 事件循环与任务调度
│   │   ├── async-program.md      # 异步编程
│   │   ├── dom-bom-webapi.md     # DOM/BOM 与 Web API
│   │   ├── event-mechanism.md    # 事件机制
│   │   ├── memory-management.md  # 内存管理
│   │   └── other-web-apis.md     # 其他 Web API
│   └── advanced/                  # 进阶概念
│       ├── closure.md            # 闭包
│       ├── promise.md            # Promise
│       ├── async-await.md        # async/await
│       ├── design-pattern.md     # 设计模式
│       ├── functional-programming.md # 函数式编程
│       ├── generator.md          # Generator
│       ├── web-worker.md         # Web Worker
│       ├── web-socket.md         # Web Socket
│       └── web-assembly.md       # Web Assembly
│
├── framework/                     # 框架原理
│   ├── vue/                      # Vue
│   │   ├── vue3.md              # Vue 3 核心
│   │   ├── dom-diff.md         # 虚拟 DOM 与 Diff 算法
│   │   ├── lifecycles.md        # 生命周期
│   │   ├── router.md            # 路由
│   │   ├── state-management.md   # 状态管理
│   │   ├── components-communication.md # 组件通信
│   │   └── performance-optimization.md # 性能优化
│   └── react/                    # React
│       ├── basics.md            # 基础概念
│       ├── virtual-dom.md       # 虚拟 DOM
│       ├── hooks.md             # Hooks
│       ├── state-management.md   # 状态管理
│       ├── performance-optimization.md # 性能优化
│       ├── router.md            # 路由
│       └── react19-features.md   # React 19 新特性
│
├── network&broswer/              # 网络与浏览器
│   ├── http-protocol.md         # HTTP 协议
│   ├── cache-mechanism.md       # 缓存机制
│   ├── broswer-render.md        # 浏览器渲染原理
│   ├── broswer-storage.md       # 浏览器存储
│   ├── web-vitals.md           # Web Vitals 指标
│   ├── error-monitoring.md     # 异常监控与处理
│   ├── cross-origin.md         # 跨域
│   └── web-safe.md             # Web 安全
│
├── engineering/                  # 工程化
│   ├── webpack-vs-vite.md     # Webpack vs Vite 对比
│   ├── automated-testing.md    # 自动化测试
│   ├── frontend-standardization.md # 前端规范化
│   ├── package-manage.md       # 包管理工具
│   └── git.md                   # Git 使用
│
├── algorithm&data-structure/    # 算法与数据结构
│   ├── array.md               # 数组
│   ├── array-operation.md      # 数组操作
│   ├── linked-list.md          # 链表
│   ├── linked-operation.md     # 链表操作
│   ├── binary-tree.md          # 二叉树
│   ├── sort.md                 # 排序算法
│   ├── dynamic-programming.md  # 动态规划
│   ├── backtracking.md         # 回溯算法
│   ├── greedy-algorithm.md      # 贪心算法
│   ├── divide-and-conquer.md   # 分治算法
│   ├── sliding-window.md       # 滑动窗口
│   ├── two-pointers.md         # 双指针
│   ├── stack.md                # 栈
│   ├── queue.md                # 队列
│   ├── string-operation.md     # 字符串操作
│   └── [其他]                   # divide-and-conquer 等
│
├── html&css/                    # HTML & CSS
│   ├── layout.md              # 常用布局
│   ├── semantic-tag.md        # 语义化标签
│   ├── html5-feature.md        # HTML5 新特性
│   ├── animation.md           # CSS 动画
│   ├── box-model.md           # CSS 盒模型
│   ├── browser-compatibility.md # 浏览器兼容性
│   └── responsive-design.md    # 响应式设计
│
├── handwrite/                   # 手写代码实现
│   ├── array-map.md          # 手写 map
│   ├── array-filter.md        # 手写 filter
│   ├── array-reduce.md        # 手写 reduce
│   ├── array-some.md          # 手写 some
│   ├── debounce.md            # 防抖
│   ├── throttle.md             # 节流
│   ├── call.md                # 手写 call
│   ├── bind.md                # 手写 bind
│   ├── new.md                  # 手写 new
│   ├── instanceof.md          # 手写 instanceof
│   ├── curry.md               # 柯里化
│   ├── partial.md             # 偏函数
│   ├── curry-placeholder.md   # 柯里化占位符
│   ├── event-emitter.md       # 事件订阅
│   ├── promisify.md           # promisify
│   ├── singleton.md           # 单例模式
│   ├── shuffle.md             # shuffle
│   ├── fibonacci.md           # 斐波那契
│   ├── fibonacci-dp.md        # 斐波那契 DP
│   ├── img-lazyload.md        # 图片懒加载
│   ├── private-variable.md    # 私有变量
│   ├── object-assign.md       # Object.assign
│   ├── judge-data-type.md     # 判断数据类型
│   ├── easy-co.md             # 简易 co
│   ├── es6-class.md           # ES6 class
│   ├── optimization-async.md  # async 优化
│   └── reduce-*.md           # reduce 相关操作
│
├── scenarios/                    # 业务场景题
│   ├── index.md               # 总览
│   ├── file-upload.md        # 大文件处理
│   ├── massive-data-rendering.md # 海量数据渲染
│   ├── permission-system.md   # 权限管理体系
│   ├── complex-interaction.md # 复杂交互
│   └── system-design.md       # 系统设计题
│
├── sprint-14-days.md           # 14天冲刺路线图
├── daily-oral-sets-14.md        # 每日口述题单
├── high-frequency-50.md         # 高频50题速记
├── project-review.md           # 项目复盘 STAR 模板
└── hr-questions.md              # HR 面试高频问题
```

## 高级前端 8 周专项

面向高级前端面试的系统化补强计划：

| 周次 | 主题 | 核心目标 |
|------|------|----------|
| Week 1 | 构建链路 | ESM -> dev server -> bundle -> chunk -> cache |
| Week 2 | 部署与交付 | GitHub Actions -> Docker -> Nginx -> 回滚 |
| Week 3 | Vue 原理 | track/trigger/effect/scheduler、编译优化 |
| Week 4 | React 机制 | render/commit/state queue/batching、并发能力 |
| Week 5 | TypeScript 进阶 | 类型系统、泛型设计、工具类型、业务建模 |
| Week 6 | 浏览器/性能/安全 | 事件循环、渲染流水线、Web Vitals、XSS/CSRF |
| Week 7 | 测试与质量保障 | Vitest、组件测试、E2E、CI 测试策略 |
| Week 8 | 架构题与模拟面试 | 30题高频问答、3轮模拟面试 |

## 模块深度状态

| 模块 | 深度 | 说明 |
|------|------|------|
| advanced/ | ⭐⭐⭐ | 完整高级内容，8周结构清晰 |
| jscore/basic/ | ⭐⭐ | 已升级高级内容（高频追问、底层原理） |
| jscore/advanced/ | ⭐⭐ | 部分有深度（closure、promise） |
| framework/ | ⭐ | API使用+表面原理，缺调度/并发/编译器 |
| engineering/ | ⭐ | 工具使用层，缺链路+取舍+风险 |
| network&broswer/ | ⭐ | 概念层，缺渲染流水线、Web Vitals 深度 |
| algorithm/ | ⭐ | 实现层，缺复杂度分析、工程取舍 |
| html&css/ | ⭐ | 基础内容 |

## VSCode Vim 配置

VSCode Vim 配置已移至 [vscode-vim.setting.json](./vscode-vim.setting.json)
