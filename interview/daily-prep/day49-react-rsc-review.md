# Day 49 RSC + React 专题追问复盘 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 49 | RSC + 复盘 | [React 19 新特性](../framework/react/react19-features)、[Week 4 路线图](../advanced/week4/roadmap)、[SSR/SSG](../advanced/ssr-ssg) |

## 今日目标

- 看完 React Server Components、`use server`
- 汇总 Day 43–48，形成《React 方向 15 题答题本》
- 录一段 8 分钟录音：从 setState 到屏幕显示的完整链路

## 阅读卡点

- RSC 不是 SSR；它能**直接在服务端执行组件**并把序列化结果流到客户端
- “Server Component / Client Component”通过 `"use client"` 标注区分
- RSC 的收益：减少 bundle、安全访问数据层；代价：序列化限制、心智变化

## 速记卡 / 知识点

<!-- RSC 模型 / 序列化边界 / 和 Next.js App Router 的关系 / 适用场景 -->

## 手写 / 流程图

<!-- 一张 RSC 渲染链路图：server render → stream → client hydrate -->

## 口述题

### 1. RSC 和 SSR 的本质区别？

> 回答模板：

### 2. 3 道自抽追问

> 回答模板：

## 8 分钟录音顺序（React 专题总结）

1. setState 到 commit（2 分钟）
2. useEffect 陷阱（1.5 分钟）
3. memo 三件套（1.5 分钟）
4. 并发渲染（1.5 分钟）
5. React 19 + RSC（1.5 分钟）

## 今日复盘

React 方向最容易被击穿的 3 题：

1. 
2. 
3. 

本周新增的 3 个“为什么”：

1. 
2. 
3. 
