# Day 15 ESM vs CommonJS vs UMD 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 15 | 模块化 | [模块化](../advanced/week1/modules)、[webpack vs Vite](../engineering/webpack-vs-vite) |

## 今日目标

- 看完 `/advanced/week1/modules`、MDN Modules
- 输出模块规范对照表：导入导出语法 / 加载时机 / 循环依赖行为 / 打包产物差异
- 能讲清“Node 环境里为什么 require 和 import 行为不同”

## 阅读卡点

- ESM 是**静态分析**，CJS 是**动态执行**；这是 tree-shaking 能否生效的根本原因
- ESM 的“值是绑定”，CJS 的“值是拷贝”，在循环依赖时表现不同
- Node 16+ 的 `.mjs` / `"type": "module"` 带来的 interop 问题

## 速记卡 / 知识点

<!-- ESM / CJS / AMD / UMD / SystemJS 对比矩阵 -->

## 手写 / 流程图

```js
// 演示 ESM 的 live binding：a.mjs 导出变量，b.mjs 导入后，a 修改能被 b 看到
```

## 口述题

### 1. 为什么 ESM 能做 tree-shaking 而 CJS 不行？

> 回答模板：

### 2. ESM 和 CJS 循环依赖的行为差别是什么？

> 回答模板：

## 5 分钟录音顺序

1. 模块规范演进（1 分钟）
2. ESM vs CJS 差异（2 分钟）
3. 工程打包的 interop 处理（2 分钟）

## 今日复盘

1. 
2. 
3. 
