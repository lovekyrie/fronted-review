# Day 20 生产构建实战 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 20 | 生产构建 | [构建工具](../advanced/week1/build-tools)、[按小时清单](../advanced/week1/hourly) |

## 今日目标

- 看完 Vite Build / Env and Mode、webpack Caching
- 整理仓库现有 Vite 配置（`.vitepress` 或 其他项目），补注释说明每一项作用
- 写一张 Vite vs webpack 的**生产构建**对照表

## 阅读卡点

- `mode` 决定 `process.env.NODE_ENV`，但 Vite 额外有 `.env.[mode]` 的加载顺序
- source map 的 7 种类型要能讲出生产环境应该用哪种（`hidden-source-map` 最常见）
- 构建产物要同时考虑 **体积 / 请求数 / 缓存命中率** 三个维度

## 速记卡 / 知识点

- 生产构建的目标不是“能跑”，而是同时满足：体积可控、缓存稳定、可排障、可回滚。
- Vite 的 `mode` 决定加载哪组 `.env` 文件，`NODE_ENV` 决定依赖和框架是否进入生产分支；两者相关但不是一回事。
- 前端环境变量会被打进浏览器产物，不能放 secret、私有 token、数据库密码；只适合放公开 base URL、环境标识、特性开关。
- 代码分割优先从路由级动态导入、重型组件、低频功能、第三方大依赖入手；拆包太细会增加请求调度成本。
- 长缓存的基本策略是：HTML 不强缓存或短缓存，带 `contenthash` 的 JS/CSS/图片长缓存，旧资源保留一段时间用于回滚。
- 生产 source map 不建议直接公开暴露；常见做法是构建时生成，发布到监控平台或受控存储，线上只通过 release/version 映射还原堆栈。
- 产物分析要看三类问题：首屏 chunk 是否过大、重复依赖是否被打进多个 chunk、低频依赖是否进入首屏路径。
- 压缩只能解决“最后一层体积”，真正影响首屏的还有请求优先级、资源缓存、JS 解析执行成本和渲染阻塞。

## 手写 / 流程图

```ts
// 典型生产构建 vite.config.ts 关键点：sourcemap、chunk、输出命名
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: mode !== 'production' ? true : 'hidden',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor-vue'
            return 'vendor'
          }
        },
      },
    },
  },
}))
```

```text
源码
  -> env/mode 注入
  -> TS/Babel/Vue SFC 转换
  -> 依赖图分析
  -> tree-shaking
  -> code splitting
  -> minify + hash + sourcemap
  -> dist 产物
  -> CDN/Nginx 发布
```

## 口述题

### 1. 生产 source map 怎么处理？

> 回答模板：生产 source map 的价值是线上报错还原源码位置，但风险是源码结构和业务逻辑可能被暴露。所以我不会简单把 `.map` 文件公开放在 CDN 上。更稳的做法是构建时生成 source map，把它和 release 版本一起上传到错误监控平台或受控存储，线上报错时用压缩后的行列号、文件名、release 去匹配对应的 map。这样既能排障，又能控制访问权限。不同环境策略也不同：开发环境直接开，测试环境可公开辅助调试，生产环境更倾向 `hidden` 或上传后删除公开文件。

### 2. 产物优化你会从哪 3 个维度入手？

> 回答模板：我会先看体积、请求、缓存三个维度。体积上看首屏 chunk、第三方依赖、重复依赖和 tree-shaking 是否生效；请求上看是否按路由和低频功能拆包，是否因为拆得太碎导致额外调度成本；缓存上看 HTML 和静态资源策略是否分开，静态资源是否有 contenthash，vendor chunk 是否稳定。最后再结合 Lighthouse、bundle analyzer、线上 RUM 指标验证，不会只看构建后的文件大小。

## 5 分钟录音顺序

1. env / mode 模型（1 分钟）
2. 产物拆分 + chunk 策略（2 分钟）
3. source map + 产物分析（2 分钟）

## 今日复盘

1. 最容易被追问：Vite 开发快不等于生产不用打包，生产阶段仍要面对 Rollup 的拆包、hash、压缩和 source map 策略。
2. 当前短板：manualChunks 不能只机械拆 `vendor`，要结合首屏路径、依赖体积、缓存稳定性和请求数权衡。
3. 下一次补充：找一个真实项目产物，用 analyzer 标出首屏大 chunk、重复依赖和可延迟加载模块。
