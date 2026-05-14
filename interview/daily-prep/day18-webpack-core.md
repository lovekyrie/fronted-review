# Day 18 webpack 核心概念 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 18 | webpack | [构建工具](../advanced/week1/build-tools)、[webpack vs Vite](../engineering/webpack-vs-vite) |

## 今日目标

- 看完 webpack Concepts / Code Splitting / Caching
- 画一张 webpack 构建链路图（entry → loader → module graph → chunk → asset）
- 写一个最小 webpack 配置能跑起来

## 阅读卡点

- loader 处理**单个文件**的内容转换，plugin 作用于**整个构建生命周期**
- `SplitChunksPlugin` 的默认策略和手动配置要能说出区别
- 长效缓存的关键是 `contenthash` + 分离 runtime + 稳定模块 id

## 速记卡 / 知识点

### webpack 5 大核心概念

| 概念 | 作用 |
|------|------|
| **Entry** | 构建的入口文件，从这里开始解析依赖图 |
| **Output** | 产物输出路径和文件名 |
| **Loader** | 处理非 JS 文件（CSS、图片、TS 等），对**单个文件**做内容转换 |
| **Plugin** | 作用于**整个构建生命周期**，做打包优化、资源管理、注入环境变量等 |
| **Mode** | `development` / `production`，自动开启对应优化 |

### Loader 执行顺序

- **从右往左、从下往上**执行。
- `use: ['style-loader', 'css-loader', 'sass-loader']`：先 sass → css → style。
- Loader 本质是一个函数：`(source) => transformedSource`。

### Plugin 生命周期

Plugin 通过 `compiler.hooks` 和 `compilation.hooks` 注册回调（tap）：

```text
初始化 → compile → make（构建模块图）→ seal（优化）→ emit（输出文件）→ done
```

常见 Plugin：`HtmlWebpackPlugin`、`MiniCssExtractPlugin`、`DefinePlugin`、`BundleAnalyzerPlugin`。

### Chunk 类型

| 类型 | 来源 |
|------|------|
| Entry chunk | 每个 entry 生成一个 |
| Async chunk | 动态 `import()` 生成 |
| Runtime chunk | webpack 运行时代码（模块加载机制） |
| Vendor chunk | `SplitChunksPlugin` 分离的第三方库 |

### SplitChunksPlugin 默认策略

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 20000,      // 最小 20KB 才分割
    maxAsyncRequests: 30, // 并行请求上限
    cacheGroups: {
      vendors: { test: /node_modules/, priority: -10 },
      default: { minChunks: 2, priority: -20, reuseExistingChunk: true }
    }
  }
}
```

### 长效缓存策略

```text
1. 文件名用 contenthash：内容不变 hash 不变
2. 分离 runtime chunk：避免业务代码变动导致 vendor hash 变
3. 稳定模块 id：moduleIds: 'deterministic'
4. vendor 单独分包：第三方库变化频率低
```

## 手写 / 流程图

### webpack 构建链路

```text
entry (src/index.js)
  → 递归解析 import / require → 构建 Module Graph
  → 每个模块经过 Loader 链转换
  → Module Graph → 优化 → SplitChunks 分割 Chunk
  → 每个 Chunk → Template → Asset（JS/CSS 文件）
  → emit 输出到 dist/
```

### 最小 webpack 配置

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single'
  }
}
```

## 口述题

### 1. loader 和 plugin 的本质区别？

回答模板：

> Loader 处理的是**单个文件的内容转换**，本质是一个函数，接收文件内容字符串，返回转换后的字符串。比如 `babel-loader` 把 ES6+ 转成 ES5，`css-loader` 把 CSS 转成 JS 模块。执行顺序是从右到左。
>
> Plugin 作用于**整个构建的生命周期**，通过 `compiler.hooks` 注册回调，可以在编译、优化、产出等各个阶段介入。比如 `HtmlWebpackPlugin` 在 emit 阶段生成 HTML，`MiniCssExtractPlugin` 把 CSS 提取成独立文件。
>
> 简单说：Loader 做文件级的转换，Plugin 做构建级的扩展。

### 2. 怎么设计能长效缓存的 chunk 策略？

回答模板：

> 长效缓存的核心是让"内容不变的文件，hash 不变，浏览器能一直用缓存"。具体做法有四步：
>
> 第一，文件名用 `contenthash`，内容变了 hash 才变。第二，把 webpack runtime 分离成单独的 chunk（`runtimeChunk: 'single'`），避免业务代码变动导致 vendor chunk 的 hash 连带变化。第三，用 `moduleIds: 'deterministic'` 保证模块 id 稳定。第四，用 `SplitChunksPlugin` 把第三方库分离成 vendor chunk，因为 node_modules 变化频率远低于业务代码。
>
> 最终效果：用户第一次访问加载全部，后续只有改动过的业务 chunk 需要重新下载。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 五大核心概念（Entry / Output / Loader / Plugin / Mode）（2 分钟）
2. 代码分割（SplitChunks）+ 长效缓存四步策略（2 分钟）
3. Loader 执行顺序（右到左）+ Plugin 生命周期钩子（1 分钟）

录完后自查：

- 是否说出 Loader 是文件级转换、Plugin 是构建级扩展。
- 是否说出 Loader 从右到左执行。
- 是否说出 contenthash + runtimeChunk + deterministic moduleIds。
- 是否说出 SplitChunksPlugin 的 cacheGroups 概念。

## 今日复盘

今天最需要回补的 3 个点：

1. webpack 的 Module Federation（模块联邦）在微前端中的应用。
2. `resolve.alias` 和 `externals` 的使用场景差异。
3. webpack 5 的持久缓存（`cache: { type: 'filesystem' }`）原理。
