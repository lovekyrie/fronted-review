# Day 74 微前端 + 移动端跨端 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 74 | 微前端 / 跨端 | [微前端](../advanced/micro-frontend)、[移动端跨端](../advanced/mobile-and-cross-platform) |

## 今日目标

- 看完 `/advanced/micro-frontend`、`/advanced/mobile-and-cross-platform`
- 输出微前端方案对比表：qiankun / Module Federation / Web Components / iframe
- 输出跨端三条线：Hybrid (WebView) / RN / Flutter / 小程序

## 阅读卡点

- 微前端要解决：子应用隔离、通信、样式隔离、资源共享、登录态
- MF 是构建期共享依赖，qiankun 是运行期沙箱；各有生态和心智成本
- 跨端要看**业务形态**：重交互 → 原生；重展示 → H5 / 小程序

## 速记卡 / 知识点

### 微前端四种方案对比

| 方案 | 原理 | 隔离 | 通信 | 适用 |
|------|------|------|------|------|
| **iframe** | 天然沙箱 | 最强 | postMessage | 简单集成、对隔离要求极高 |
| **qiankun** | 运行时沙箱 + HTML entry | JS/CSS 沙箱 | 全局状态 / CustomEvent | 多团队独立部署 |
| **Module Federation** | 构建时共享模块 | 无隔离 | 共享状态 | 同技术栈、共享依赖 |
| **Web Components** | Shadow DOM 隔离 | CSS 隔离 | 属性 / 事件 | 跨框架组件库 |

### 微前端核心问题

| 问题 | 解决方案 |
|------|----------|
| **JS 沙箱** | qiankun: Proxy 快照 / iframe 沙箱 |
| **CSS 隔离** | Shadow DOM / CSS Modules / 命名空间前缀 |
| **子应用通信** | 主应用 props 下发 / 全局 EventBus / 共享 Store |
| **路由分发** | 主应用监听路由前缀，分发到对应子应用 |
| **资源共享** | MF 共享 React/Vue；qiankun externals |
| **登录态** | 主应用统一登录，cookie 共享或 token 下发 |

### 跨端三条线

| 路线 | 技术 | 特点 | 适用 |
|------|------|------|------|
| **Hybrid** | WebView + JSBridge | 开发快，性能一般 | 重展示、轻交互 |
| **原生渲染** | React Native / Weex | 接近原生性能 | 中等交互复杂度 |
| **自绘引擎** | Flutter | 高性能，跨平台一致 | 重交互、重动画 |
| **小程序** | 微信/支付宝 | 生态内分发 | 轻应用、营销 |

## 手写 / 流程图

### 微前端架构图

```text
主应用（路由分发 + 全局 Layout + 登录态）
  ├─ /app-a/* → 子应用 A（Vue 3，独立仓库/部署）
  │   ├─ mount(container) → 渲染到指定容器
  │   └─ unmount() → 清理
  ├─ /app-b/* → 子应用 B（React 18，独立仓库/部署）
  └─ /app-c/* → 子应用 C（Angular，独立仓库/部署）

qiankun 流程：
  registerMicroApps([
    { name: 'app-a', entry: '//a.example.com', container: '#sub', activeRule: '/app-a' }
  ])
  → 匹配路由 → 加载 HTML entry → 执行 JS → 调用 bootstrap/mount
  → 路由切换 → 调用 unmount → 加载新子应用
```

### 子应用生命周期

```ts
// 子应用入口
let app: App | null = null

export async function bootstrap() {
  // 初始化（只调用一次）
}

export async function mount(props: { container: HTMLElement }) {
  app = createApp(Root)
  app.mount(props.container.querySelector('#app')!)
}

export async function unmount() {
  app?.unmount()
  app = null
}
```

## 口述题

### 1. 你为什么选 qiankun / MF？

回答模板：

> 看团队情况。如果多团队、多技术栈、独立部署——选 **qiankun**。它运行时加载，子应用完全独立，可以 Vue + React 混用，有 JS/CSS 沙箱。缺点是沙箱有性能开销，子应用需要改造导出生命周期函数。
>
> 如果同技术栈、需要共享依赖——选 **Module Federation**。它构建时共享模块，React / Vue 只加载一份，运行时直接 import 远程组件。缺点是没有隔离，版本冲突要自己处理。
>
> 如果只是简单嵌入第三方页面——直接用 **iframe**，隔离最强但通信最弱。实际项目中没有银弹，根据业务形态选最简单的方案。

### 2. H5 和小程序怎么共用逻辑？

回答模板：

> 三层分离。UI 层各写各的（H5 用 Vue/React，小程序用原生或 Taro/uni-app），逻辑层抽成纯 TS 的 service / utils / hooks，两端共享。数据层（API 请求、状态管理）也抽成独立包。
>
> 如果想一套代码多端运行，用跨端框架：**Taro**（React 语法 → 小程序/H5/RN）或 **uni-app**（Vue 语法 → 全平台）。但要注意：跨端框架的"一次编写多端运行"在复杂场景下一定会有平台差异，要预留条件编译的空间。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 微前端核心问题（JS 沙箱 / CSS 隔离 / 通信 / 路由）（1.5 分钟）
2. 四种方案对比 + 选型建议（2 分钟）
3. 跨端三条线 + H5/小程序共用策略（1.5 分钟）

录完后自查：

- 是否说出 qiankun 和 MF 的核心区别（运行时 vs 构建时）。
- 是否说出 JS 沙箱和 CSS 隔离的实现。
- 是否说出跨端框架的局限性。
- 是否说出根据业务形态选方案。

## 今日复盘

今天最需要回补的 3 个点：

1. qiankun 的 Proxy 沙箱具体原理（快照沙箱 vs Proxy 沙箱的区别）。
2. Module Federation 在 Vite 中的使用（vite-plugin-federation）。
3. Taro 3 和 uni-app 的架构差异。
