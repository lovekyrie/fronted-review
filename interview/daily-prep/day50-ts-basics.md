# Day 50 TS 类型基础 / 字面量 / 联合 / 交叉 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 50 | 类型基础 | [TS 基础](../advanced/week5/typescript-basic) |

## 今日目标

- 看完 TS Handbook 的 Types from Types 起始章节
- 输出 type / interface 差异对比表
- 写 5 个小 demo：字面量类型 / 联合 / 交叉 / 字面量 widening / as const

## 阅读卡点

- `interface` 支持声明合并，`type` 不支持，但 `type` 可以写联合和元组
- 联合类型的缩窄要配合 typeof / instanceof / in / discriminated union
- `as const` 把字面量 widen 行为关闭，得到最精确的字面量类型

## 速记卡 / 知识点

<!-- type vs interface / union narrowing / literal types / as const -->

## 手写 / 流程图

```ts
type Result = { ok: true; data: string } | { ok: false; error: string }
// 基于 ok 字段的 discriminated union 缩窄
```

## 口述题

### 1. type 和 interface 怎么选？

> 回答模板：

### 2. discriminated union 比普通 union 好在哪？

> 回答模板：

## 5 分钟录音顺序

1. type vs interface（1.5 分钟）
2. 字面量 + widening（1.5 分钟）
3. 联合缩窄（2 分钟）

## 今日复盘

1. 
2. 
3. 
