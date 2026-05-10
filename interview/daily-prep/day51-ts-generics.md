# Day 51 TS 泛型与约束 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 51 | 泛型 | [TS 基础](../advanced/week5/typescript-basic)、[TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Handbook 的 Generics 章节
- 写 3 个泛型工具函数：`pick / pluck / deepMerge`（带约束 + 推断）
- 输出泛型设计 3 准则：只保留必要参数、用 extends 约束、让类型能自动推断

## 阅读卡点

- 泛型参数本身也可以有默认值（`T = string`）和约束（`T extends ...`）
- 函数泛型优先写在参数位置，让 TS 从参数推断，而不是强行传入
- `<T extends readonly unknown[]>` 是处理元组的惯用法

## 速记卡 / 知识点

<!-- 泛型参数 / 约束 / 默认值 / 推断方向 / 多泛型协作 -->

## 手写 / 流程图

```ts
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> { /* ... */ }
```

## 口述题

### 1. 什么时候该加泛型？

> 回答模板：

### 2. `extends` 在泛型里有几种用法？

> 回答模板：

## 5 分钟录音顺序

1. 泛型的 3 个使用动机（1.5 分钟）
2. 约束写法（2 分钟）
3. 推断与默认值（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
