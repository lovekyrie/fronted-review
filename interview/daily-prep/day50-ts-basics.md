# Day 50 TS 类型基础 / 字面量 / 联合 / 交叉

## 今日目标

- 看完 TS Handbook 的 Types from Types 起始章节
- 输出 type / interface 差异对比表
- 写 5 个小 demo：字面量类型 / 联合 / 交叉 / 字面量 widening / as const

## 按顺序阅读

1. [TS 基础](../advanced/week5/typescript-basic)

## 实操与自测

**检查点**

- `interface` 支持声明合并，`type` 不支持，但 `type` 可以写联合和元组
- 联合类型的缩窄要配合 typeof / instanceof / in / discriminated union
- `as const` 把字面量 widen 行为关闭，得到最精确的字面量类型

**先独立完成，再对照专题**

- type vs interface — [参考章节](../advanced/week5/typescript-basic#day-50-type-vs-interface)
- 字面量类型 + widening — [参考章节](../advanced/week5/typescript-basic#day-50-字面量类型-widening)
- 联合类型缩窄（Narrowing） — [参考章节](../advanced/week5/typescript-basic#day-50-联合类型缩窄-narrowing)
- 交叉类型 — [参考章节](../advanced/week5/typescript-basic#day-50-交叉类型)
- 5 个 demo — [参考章节](../advanced/week5/typescript-basic#day-50-5-个-demo)

**脱稿口述题**

- 1. type 和 interface 怎么选？
- 2. discriminated union 比普通 union 好在哪？

**录音练习**

按这个顺序录，不要临场重新组织：

1. type vs interface 对比 + 选型原则（1.5 分钟）
2. 字面量类型 + widening + as const（1.5 分钟）
3. 联合缩窄四种方式 + discriminated union + exhaustive check（2 分钟）

录完后自查：

- 是否说出 interface 支持声明合并、type 支持联合元组。
- 是否说出 as const 关闭 widening。
- 是否说出 discriminated union 用标签字段缩窄。
- 是否说出 exhaustive check 的写法。

## 复盘

今天最需要回补的 3 个点：

1. `unknown` 和 `any` 的区别（unknown 是类型安全的 any，必须缩窄后才能使用）。
2. `never` 的使用场景（exhaustive check、不可能到达的分支、空联合）。
3. 枚举 `enum` vs 联合类型的取舍（联合类型更轻量，enum 有运行时值）。
