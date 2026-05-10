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

<!-- Vite dev server / 预构建 / HMR / 生产构建用 Rollup 的原因 -->

## 手写 / 流程图

```text
浏览器请求 /src/main.ts
  → Vite dev server 拦截
  → esbuild 转 TS/JSX
  → 返回 ESM
  → 浏览器继续请求依赖
```

## 口述题

### 1. 为什么 Vite 开发阶段通常比 webpack 更快？

> 回答模板：

### 2. Vite 生产构建为什么不用 esbuild 而用 Rollup？

> 回答模板：

## 5 分钟录音顺序

1. Vite 设计哲学（1.5 分钟）
2. 预构建 + HMR（2 分钟）
3. 和 webpack 差异（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
