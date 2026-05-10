# Webpack vs Vite 深入对比

## 一、核心差异对比表

| 维度 | Webpack | Vite |
|------|---------|------|
| **架构** | bundle 模式（先打包再serve） | ESM 模式（浏览器直接请求源文件） |
| **开发启动** | 构建完整 bundle（慢） | 按需编译（快） |
| **热更新** | WebSocket + HMR Runtime（全量更新） | ESM + WebSocket（模块级精准更新） |
| **生产构建** | Webpack（JS bundle） | Rollup/Rolldown（更好 tree-shaking） |
| **配置文件** | webpack.config.js | vite.config.ts |

---

## 二、Webpack 构建流程

1. 读取配置与入口。
2. 从入口递归构建依赖图（Scope Eval）。
3. 使用 Loader 转换非 JS 资源（file-loader/url-loader/babel-loader）。
4. 在生命周期钩子（compile/compilation/seal）中执行 Plugin。
5. 输出 chunk / assets。

**核心概念区分：**
- **Loader**：模块级别转换器（把 A 文件内容变成 JS 模块字符串返回）。
- **Plugin**：构建生命周期扩展（在编译/编译完成/输出阶段做增强）。

```js
// Loader 示例
module.exports = function simpleLoader(source) {
  return source.replace('__BUILD_TIME__', JSON.stringify(Date.now()))
}

// Plugin 示例
class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('BuildTimePlugin', (stats) => {
      console.log('build done in ms:', stats.endTime - stats.startTime)
    })
  }
}
```

---

## 三、Tree Shaking 原理

- 基于 ES Module **静态依赖分析**（import 在模块顶层，不能在条件语句中）。
- 标记未使用导出（`usedExports: true`），再在压缩阶段（ Terser ）删除死代码。
- 生效条件：ESM 输出格式 + 无副作用或正确声明 `sideEffects`。

```json
// package.json
{
  "sideEffects": ["./src/styles.css", "*.module.css"]
}
```

> **面试追问**：为什么 CommonJS 不能 Tree Shaking？——因为 require() 是运行时求值，可以在条件语句中使用，静态分析不可靠。

---

## 四、Vite 为什么快（原理）

### 开发阶段
1. **利用浏览器 ESM**：浏览器直接请求源文件，不需要先打包。
2. **依赖预构建（Dep Pre-Bundling）**：用 `esbuild` 把 `node_modules` 中的 CommonJS 转成 ESM，同时合并小模块减少请求数。
3. **按需编译**：只编译当前请求的模块及其依赖，不是全量构建。

```bash
# 预构建产物在 node_modules/.vite/deps/
ls node_modules/.vite/deps/
```

### 生产阶段
- 使用 **Rollup**（或 Vite 3+ 的 **Rolldown**，Rust 实现）打包。
- Rollup 输出格式更干净，更适合库；Webpack 输出更适合应用。

---

## 五、HMR（热模块替换）原理对比

### Webpack HMR
```
Dev Server
  ↓ WebSocket 连接
  ↓ 客户端 HMR Runtime（注入到页面）
  ↓ 检测到文件变化 → 通知 HMR Runtime
  ↓ HMR Runtime 通过 WebSocket 请求新模块
  → 新模块 hash → check() → hot() 更新模块
  → 失败则 page reload
```

**问题**：所有受影响的模块都会被替换，即使只改了一个组件的模板。

### Vite HMR
```
文件变化
  → Vite Server 接收到 WebSocket 通知
  → 找到受影响的模块（通过模块图）
  → 只向浏览器发送"更新"消息（模块 ID + 新的源码）
  → 浏览器直接替换 ESM 模块缓存
  → 不需要请求新文件（已经在内存中）
```

**优势**：精准替换，只更新变化的模块，不影响其他模块状态。

---

## 六、Vite 5 + Rolldown 迁移细节

### Rolldown 是什么
- Rust 重写的 Rollup，目标：**完全兼容 Rollup API，但速度提升 10-100 倍**。
- Vite 3+ 已经开始将生产构建从 Rollup 切换到 Rolldown。
- Rolldown 还在发展中，部分插件可能不兼容。

### 迁移注意点
```bash
# Vite 5 特性
- 默认使用 Rollup 4
- 移除对 Node 14/16 的支持
- 更好的 Rollup 插件兼容
```

> **面试追问**：为什么不一直用 esbuild？——esbuild 对于大型应用的支持还不完善，Tree Shaking 和代码分割不如 Rollup/Rolldown。

---

## 七、Bundle 策略（Code Splitting）

### 三种分割方式
```js
// 1. 入口分割
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
}

// 2. 动态 import（推荐）
const module = await import('./heavy.js')

// 3. SplitChunksPlugin
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

### Preloading
```js
// 预加载下一个路由
<link rel="modulepreload" href="/routes/dashboard.js">

// 预加载关键资源
<link rel="preload" href="critical.css" as="style">
```

---

## 八、面试回答模板

1. **开发体验**：先讲启动速度差异（Vite 1s vs Webpack 30s），再讲 HMR 精准度。
2. **底层机制**：Webpack 是 bundle-first，Vite 是 ESM-native + 预构建。
3. **生产构建**：Rollup/Rolldown tree-shaking 更好，Webpack 生态更全。
4. **场景选择**：新项目 / 小型项目 / Vue3 项目建议 Vite，大型遗留项目 / 复杂定制建议 Webpack。

> **加分点**：能说出 Vite 的 esbuild 依赖预构建原理，以及 Rolldown 正在成为 Vite 生产构建的核心。
