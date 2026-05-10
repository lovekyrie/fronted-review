# Day 55 工具类型手写 + JS → TS 改造 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 55 | 工具类型 | [TS 类型设计](../advanced/week5/typescript-design)、[TS 基础](../advanced/week5/typescript-basic) |

## 今日目标

- 手写 15 个常用工具类型：`Partial / Required / Readonly / Pick / Omit / Exclude / Extract / NonNullable / ReturnType / Parameters / Awaited / Record / ConstructorParameters / ThisParameterType / OmitThisParameter`
- 把 `hand-write/` 里 2 个 JS 示例改写为严格 TS 版
- 输出 JS → TS 改造 checklist

## 阅读卡点

- `Omit` 的内部是 `Pick<T, Exclude<keyof T, K>>`，不是原生内置魔法
- `Exclude` / `Extract` 基于分发条件类型
- 改造 JS 到 TS，优先补 API 边界类型，函数内部用推断即可

## 速记卡 / 知识点

<!-- 15 个工具类型的一句话总结 + 底层实现 -->

## 手写 / 流程图

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## 口述题

### 1. 你常用的 5 个工具类型分别怎么实现？

> 回答模板：

### 2. JS 改 TS 的时候你先从哪里下手？

> 回答模板：

## 5 分钟录音顺序

1. 工具类型 5 组分类（2 分钟）
2. 其中 3 个实现（1.5 分钟）
3. JS→TS 改造流程（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
