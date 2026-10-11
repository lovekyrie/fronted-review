# Day 21 构建专题追问复盘

## 今日目标

- 汇总 Day 15–20 的所有输出，形成《构建链路 15 题答题本》
- 做一次 30 分钟自追问：每个答案问“为什么”，不能停在一层
- 录一段 8 分钟录音：把 ESM → dev server → bundle → chunk → cache 一口气讲完

## 按顺序阅读

1. [Week 1 路线图](../advanced/week1/roadmap)
2. [构建工具](../advanced/week1/build-tools)
3. [模块化](../advanced/week1/modules)

## 实操与自测

**检查点**

- 面试里最容易被击穿的是“为什么 Vite 快”后面的追问：那生产为什么不快？
- “Tree Shaking”问到底是问你对**静态分析 + sideEffects + 纯函数**的综合理解
- 构建题很容易被拉到**缓存失效排查**或**上线性能问题**的实战题

**先独立完成，再对照专题**

- 构建链路 15 题答题本

**脱稿口述题**

- 1. ESM → dev server → bundle → chunk → cache 完整链路
- 2. 随机抽 3 道构建追问（自己挑最弱的）

**模拟流程与评分**

### 构建链路 15 题答题本

1. **ESM 和 CommonJS 区别**：ESM 是语法级静态模块，利于 tree-shaking；CommonJS 是运行时加载，兼容强但静态分析弱。
2. **Babel 做什么**：Babel 做 AST 级语法转换，不负责完整依赖图打包；polyfill 解决运行时 API 缺失。
3. **Loader 和 Plugin 区别**：Loader 转换单个模块内容，Plugin 介入构建生命周期做全局能力扩展。
4. **Vite 为什么开发快**：开发态基于浏览器原生 ESM 按需加载，启动时不需要先打完整 bundle。
5. **Vite 生产为什么不一定更快**：生产仍要构建完整依赖图，做拆包、压缩、hash、sourcemap，瓶颈不再只是 dev server。
6. **依赖预构建解决什么**：把 CommonJS/UMD 转成 ESM，并合并零散依赖，减少开发态请求碎片。
7. **webpack 核心模型**：从 entry 建依赖图，再通过 loader/plugin/chunk 生成可部署产物。
8. **Tree-shaking 生效条件**：ESM 静态结构、无副作用或正确 `sideEffects` 标记、压缩阶段删除死代码。
9. **动态 import 为什么能拆包**：它提供异步边界，构建器可以把这段依赖图切成独立 chunk。
10. **代码分割目的**：降低首屏下载和解析成本，把低频代码延后加载，而不是为了 chunk 数量好看。
11. **长缓存策略**：HTML 短缓存或不强缓存，带 contenthash 的静态资源长缓存，并保留旧资源支持回滚。
12. **runtime chunk 价值**：把模块映射运行时代码抽出，避免业务小改动导致大 chunk hash 连锁变化。
13. **source map 策略**：生产生成但不公开暴露，和 release 绑定上传监控平台用于还原堆栈。
14. **构建变慢怎么查**：区分依赖安装、类型检查、转译、插件、压缩、sourcemap、I/O 上传等环节。
15. **缓存失效怎么查**：看 HTML 缓存、资源 hash、CDN 刷新、旧资源保留、service worker 和 Nginx 头。

```text
源码入口
  -> 模块解析：ESM / CJS / alias / extensions
  -> 代码转换：TS / JSX / Vue SFC / CSS / assets
  -> 开发态：
       Vite dev server -> 原生 ESM 按需加载 -> HMR
     生产态：
       依赖图 -> tree-shaking -> code splitting -> minify -> hash -> source map
  -> dist 产物：
       index.html + assets/*.hash.js + assets/*.hash.css
  -> 发布：
       上传 CDN/Nginx -> 配缓存头 -> 绑定 release -> 监控 sourcemap
  -> 用户访问：
       HTML 获取最新资源引用 -> 静态资源命中长缓存
```

**录音练习**

1. 模块化演进（1 分钟）
2. Babel + bundler 分工（1.5 分钟）
3. Vite / webpack 差异（2 分钟）
4. 代码分割 + tree shaking（1.5 分钟）
5. 缓存策略（2 分钟）

## 复盘

最容易被击穿的 3 个问题：

1. Vite 开发快的原因能讲，但容易漏掉“依赖预构建”和“生产仍然 bundle”。
2. Tree-shaking 容易停在“ESM 静态分析”，需要继续讲副作用、导入方式和压缩删除。
3. 缓存策略容易只说 hash，缺少 HTML、CDN、旧资源保留、回滚之间的联动。

本周新增的 3 个“为什么”：

1. 为什么 runtime chunk 会影响长缓存稳定性？
2. 为什么 source map 要和 release 绑定，而不是只保留一份最新 map？
3. 为什么代码分割不是越细越好？
