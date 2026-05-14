# Day 17 Vite 原理 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 17 | Vite | [构建工具](../advanced/week1/build-tools)、[Week 1 路线图](../advanced/week1/roadmap)、[webpack vs Vite](../engineering/webpack-vs-vite) |

## 今日目标

- 看完 Vite Guide / Why Vite / Features / Dependency Pre-Bundling
- 画一张 Vite dev server 工作流程图
- 写 Vite vs webpack 对照表（上半部分：开发阶段）

## 阅读卡点

- Vite 开发阶段不打包，利用浏览器原生 ESM，这是“冷启动快”的根因
- 预构建（esbuild）解决两件事：CJS → ESM 转换 + 合并多文件减少请求
- HMR：Vite 只让受影响模块失效，而 webpack 需要重新 bundle 受影响的 chunk

## 速记卡 / 知识点

### Vite 开发阶段原理

```text
1. 利用浏览器原生 ESM，不打包源码
2. 预构建（esbuild）：把 CJS 依赖转 ESM + 合并多文件减少请求
3. 按需编译：浏览器请求哪个模块才编译哪个
4. HMR：通过 WebSocket 推送变更，只让受影响模块失效
```

### 预构建（Dependency Pre-Bundling）

用 esbuild（Go 编写，极快）解决两个问题：
- **CJS → ESM**：第三方包多是 CJS 格式，浏览器不能直接用。
- **合并请求**：lodash-es 有几百个小文件，预构建合成一个文件，避免浏览器发几百个请求。

缓存在 `node_modules/.vite/` 目录，依赖不变不会重新构建。

### HMR 对比

| 维度 | Vite | webpack |
|------|------|---------|
| 更新范围 | 只让受影响模块失效 | 重新 bundle 受影响 chunk |
| 速度 | 与项目大小无关（O(1)） | 与 chunk 大小正相关 |
| 传输 | WebSocket 推更新信息 | WebSocket 推新 chunk |

### 生产构建

- 用 **Rollup** 而不是 esbuild，因为 Rollup 的代码分割、tree-shaking、CSS 处理等生态更成熟。
- Vite 5+ 开始实验性支持 Rolldown（Rust 实现的 Rollup 兼容打包器）。

### Vite vs webpack 对照

| 维度 | Vite | webpack |
|------|------|---------|
| 开发启动 | 秒级（不打包源码） | 分钟级（全量打包） |
| 开发编译 | 按需（浏览器请求时） | 全量 bundle |
| HMR | 模块级，极快 | chunk 级，较慢 |
| 生产打包 | Rollup | webpack 自身 |
| 配置复杂度 | 低（约定优于配置） | 高（灵活但繁琐） |
| 生态 | 快速增长 | 最成熟 |

## 手写 / 流程图

### Vite Dev Server 完整流程

```text
浏览器请求 /src/main.ts
  → Vite dev server 拦截请求
  → 检查是否是第三方依赖
    → 是：重定向到 /.vite/deps/xxx.js（预构建产物）
    → 否：esbuild 即时编译 TS/JSX → 返回 ESM
  → 浏览器执行 ESM，发现 import 语句
  → 继续请求依赖模块（按需加载）
  → 源码修改时：
    → Vite 通过 WebSocket 通知浏览器
    → 浏览器只重新请求变更的模块
    → 模块级 HMR 生效
```

### Vite 插件 API 简示

```js
// vite.config.ts
export default {
  plugins: [{
    name: 'my-plugin',
    transform(code, id) {
      // 类似 Rollup 插件，对模块内容做转换
      if (id.endsWith('.md')) {
        return `export default ${JSON.stringify(code)}`
      }
    },
    configureServer(server) {
      // 开发阶段：自定义中间件
      server.middlewares.use('/api', (req, res) => {
        res.end('hello')
      })
    }
  }]
}
```

## 口述题

### 1. 为什么 Vite 开发阶段通常比 webpack 更快？

回答模板：

> webpack 在开发阶段需要先把所有模块打包成 bundle 再启动 dev server，项目越大启动越慢。Vite 的策略完全不同：它利用浏览器原生 ESM，不打包源码，启动时只做依赖预构建（esbuild，极快），源码按浏览器请求按需编译。
>
> 所以 Vite 的冷启动时间基本与项目规模无关。HMR 也是模块级别的，只让变更的模块失效，速度同样与项目大小无关。而 webpack 的 HMR 需要重新 bundle 受影响的 chunk，项目越大越慢。

### 2. Vite 生产构建为什么不用 esbuild 而用 Rollup？

回答模板：

> esbuild 虽然编译速度极快，但在生产构建需要的一些高级特性上还不够成熟，比如代码分割策略（动态 import 的 chunk 合并）、CSS 代码分割、HTML 处理、以及丰富的插件生态。Rollup 在这些方面经过多年打磨，tree-shaking 也是最好的。
>
> 所以 Vite 的设计是：开发阶段用 esbuild 追求速度，生产构建用 Rollup 追求质量。未来 Rolldown（Rust 实现的 Rollup 兼容）成熟后，可能统一开发和生产的编译工具。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Vite 设计哲学（不打包源码 + 原生 ESM + 按需编译）（1.5 分钟）
2. 预构建（esbuild 做 CJS→ESM + 合并请求）+ HMR 模块级更新（2 分钟）
3. 和 webpack 对比（启动、HMR、生产构建）+ 为什么生产用 Rollup（1.5 分钟）

录完后自查：

- 是否说出 Vite 冷启动快的根因是不打包源码。
- 是否说出预构建解决的两个问题。
- 是否说出 HMR 的模块级更新 vs webpack 的 chunk 级。
- 是否说出生产用 Rollup 的原因。

## 今日复盘

今天最需要回补的 3 个点：

1. Vite 插件 API 和 Rollup 插件 API 的兼容性和差异（`configureServer` 等 Vite 独有钩子）。
2. `optimizeDeps` 配置的使用场景（手动指定需要预构建的依赖）。
3. Vite 的 SSR 支持和 `vite-node` 的原理。
