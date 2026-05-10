# Day 52 条件类型与 infer 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 52 | 条件 / infer | [TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Conditional Types
- 手写常见工具类型：`ReturnType / Parameters / Awaited / ExtractPromise`
- 输出 `distributive conditional types`（分发条件类型）答题稿

## 阅读卡点

- `T extends U ? X : Y` 当 T 是 naked type 且是 union 时，会**分发**
- `[T] extends [U] ? X : Y` 加方括号包裹可以**关闭分发**
- `infer` 只能出现在 extends 的右侧，用于“从结构里掏出一个类型”

## 速记卡 / 知识点

<!-- 条件类型语法 / 分发规则 / infer 位置 / 与泛型组合的常见写法 -->

## 手写 / 流程图

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T
```

## 口述题

### 1. 什么是分发条件类型？什么场景需要关闭它？

> 回答模板：

### 2. `infer` 的核心价值是什么？

> 回答模板：

## 5 分钟录音顺序

1. 条件类型基础（1.5 分钟）
2. 分发行为（2 分钟）
3. infer 示例（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
