# Day 51 TS 泛型与约束

## 今日目标

- 看完 TS Handbook 的 Generics 章节
- 写 3 个泛型工具函数：`pick / pluck / deepMerge`（带约束 + 推断）
- 输出泛型设计 3 准则：只保留必要参数、用 extends 约束、让类型能自动推断

## 按顺序阅读

1. [TS 基础](../advanced/week5/typescript-basic)
2. [TS 类型设计](../advanced/week5/typescript-design)

## 实操与自测

**检查点**

- 泛型参数本身也可以有默认值（`T = string`）和约束（`T extends ...`）
- 函数泛型优先写在参数位置，让 TS 从参数推断，而不是强行传入
- `<T extends readonly unknown[]>` 是处理元组的惯用法

**先独立完成，再对照专题**

- 泛型 3 个使用动机 — [参考章节](../advanced/week5/typescript-basic#day-51-泛型-3-个使用动机)
- 泛型约束 — [参考章节](../advanced/week5/typescript-basic#day-51-泛型约束)
- 泛型默认值 — [参考章节](../advanced/week5/typescript-basic#day-51-泛型默认值)
- 推断方向 — [参考章节](../advanced/week5/typescript-basic#day-51-推断方向)
- 3 个泛型工具函数 — [参考章节](../advanced/week5/typescript-basic#day-51-3-个泛型工具函数)
- 泛型设计 3 准则 — [参考章节](../advanced/week5/typescript-design#day-51-泛型设计-3-准则)

**脱稿口述题**

- 1. 什么时候该加泛型？
- 2. `extends` 在泛型里有几种用法？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 泛型 3 个使用动机（输入输出关联 / 容器抽象 / 约束但灵活）（1.5 分钟）
2. extends 约束 + keyof 约束 + 多泛型协作（2 分钟）
3. 推断方向（参数位推断）+ 默认值 + 3 准则（1.5 分钟）

录完后自查：

- 是否说出泛型的 3 个使用动机。
- 是否说出 extends 的 3 种用法。
- 是否说出"让 TS 从参数推断"的原则。
- 是否能手写 pick 的泛型签名。

## 复盘

今天最需要回补的 3 个点：

1. 泛型在类（class）中的使用（`class Container<T> { ... }`）。
2. `<T extends readonly unknown[]>` 处理元组的惯用法。
3. 函数重载 vs 泛型的选择场景。
