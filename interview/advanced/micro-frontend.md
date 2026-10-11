# 微前端：原理与落地

## 一、为什么需要微前端

- 多团队并行开发，降低主仓库耦合。
- 支持技术栈共存和渐进迁移。
- 子应用可独立部署，提高发布效率。

## 二、Iframe 的痛点

- 通信复杂（`postMessage` 成本高）。
- 路由与历史记录割裂。
- 样式和交互体验割裂，SEO 能力弱。

## 三、主流方案

- **Qiankun**：基于 single-spa，强调运行时接入与沙箱隔离。
- **Module Federation**：构建时/运行时共享模块，适合组件级复用。

## 四、核心问题

### 沙箱隔离

- JS 隔离：防止子应用污染全局对象。
- 样式隔离：前缀约束、Shadow DOM、CSS Modules 等。

### 通信机制

- 统一事件总线或状态中心。
- 明确边界：跨应用只传业务数据，不传实现细节。

## 五、面试回答建议

讲清楚“引入微前端的收益”和“额外复杂度成本”，体现你有工程权衡能力。

## 每日练习参考

### Day 74：微前端四种方案对比

| 方案 | 原理 | 隔离 | 通信 | 适用 |
|------|------|------|------|------|
| **iframe** | 天然沙箱 | 最强 | postMessage | 简单集成、对隔离要求极高 |
| **qiankun** | 运行时沙箱 + HTML entry | JS/CSS 沙箱 | 全局状态 / CustomEvent | 多团队独立部署 |
| **Module Federation** | 构建时共享模块 | 无隔离 | 共享状态 | 同技术栈、共享依赖 |
| **Web Components** | Shadow DOM 隔离 | CSS 隔离 | 属性 / 事件 | 跨框架组件库 |

### Day 74：微前端核心问题

| 问题 | 解决方案 |
|------|----------|
| **JS 沙箱** | qiankun: Proxy 快照 / iframe 沙箱 |
| **CSS 隔离** | Shadow DOM / CSS Modules / 命名空间前缀 |
| **子应用通信** | 主应用 props 下发 / 全局 EventBus / 共享 Store |
| **路由分发** | 主应用监听路由前缀，分发到对应子应用 |
| **资源共享** | MF 共享 React/Vue；qiankun externals |
| **登录态** | 主应用统一登录，cookie 共享或 token 下发 |

### Day 74：微前端架构图

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

### Day 74：子应用生命周期

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
