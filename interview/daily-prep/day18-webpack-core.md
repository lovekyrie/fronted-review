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

<!-- 核心概念 5 个 / loader 执行顺序（从右往左）/ plugin 常见 tap 点 / chunk 类型 -->

## 手写 / 流程图

```text
entry → 解析依赖 → loader 链 → module graph → SplitChunks → output
```

## 口述题

### 1. loader 和 plugin 的本质区别？

> 回答模板：

### 2. 怎么设计能长效缓存的 chunk 策略？

> 回答模板：

## 5 分钟录音顺序

1. 核心概念 5 个（2 分钟）
2. 代码分割 + 缓存策略（2 分钟）
3. loader 执行顺序和 plugin 生命周期（1 分钟）

## 今日复盘

1. 
2. 
3. 
