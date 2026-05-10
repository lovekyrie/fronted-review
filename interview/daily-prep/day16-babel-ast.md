# Day 16 Babel：AST / preset / plugin 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 16 | Babel | [构建工具](../advanced/week1/build-tools)、[webpack vs Vite](../engineering/webpack-vs-vite) |

## 今日目标

- 看完 Babel 配置文档、Babel Parser
- 输出 Babel 三阶段流程图：parse → transform → generate
- 用一个真实的 preset-env 转换案例做 AST 解读

## 阅读卡点

- `preset-env` + `core-js` 的组合只负责**语法降级**和**polyfill 注入**，两者职责不同
- Babel 不负责打包，只负责**单文件的语法改写**
- `@babel/runtime` 和 `@babel/plugin-transform-runtime` 解决重复注入辅助代码的问题

## 速记卡 / 知识点

<!-- AST 节点结构 / preset vs plugin / targets / useBuiltIns 模式 -->

## 手写 / 流程图

```text
source code → parse → AST → visitor transform → codegen → new code
```

## 口述题

### 1. `preset-env` 到底做了什么？和 `core-js` 什么关系？

> 回答模板：

### 2. 为什么要用 `@babel/plugin-transform-runtime`？

> 回答模板：

## 5 分钟录音顺序

1. Babel 三阶段（1.5 分钟）
2. preset-env + core-js 协作（2 分钟）
3. 和 bundler / runtime 的职责分界（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
