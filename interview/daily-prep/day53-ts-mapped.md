# Day 53 映射类型与 keyof

## 今日目标

- 看完 TS Mapped Types
- 手写 `Partial / Required / Readonly / Pick / Record`
- 理解 `-readonly` / `-?` 移除修饰符的语法

## 按顺序阅读

1. [TS 类型设计](../advanced/week5/typescript-design)

## 实操与自测

**检查点**

- 映射类型基础语法：`{ [K in keyof T]: ... }`
- `keyof` 对 interface / type / class 行为一致，但对 `{}` 是 `never`
- `as` 子句（remapping）可以配合模板字面量类型改 key 名

**先独立完成，再对照专题**

- 映射类型基础语法 — [参考章节](../advanced/week5/typescript-design#day-53-映射类型基础语法)
- 修饰符增删 — [参考章节](../advanced/week5/typescript-design#day-53-修饰符增删)
- Key Remapping（as 子句，TS 4.1+） — [参考章节](../advanced/week5/typescript-design#day-53-key-remapping-as-子句-ts-4-1)
- 内置工具类型实现 — [参考章节](../advanced/week5/typescript-design#day-53-内置工具类型实现)
- 5 个内置工具类型手写 — [参考章节](../advanced/week5/typescript-design#day-53-5-个内置工具类型手写)
- DeepPartial 递归实现 — [参考章节](../advanced/week5/typescript-design#day-53-deeppartial-递归实现)
- DeepReadonly — [参考章节](../advanced/week5/typescript-design#day-53-deepreadonly)
- 实战：API 响应类型生成 — [参考章节](../advanced/week5/typescript-design#day-53-实战-api-响应类型生成)

**脱稿口述题**

- 1. Partial 和 DeepPartial 实现差别？
- 2. 映射类型什么时候配合 remapping？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 映射类型语法 + `[K in keyof T]` 的含义（1.5 分钟）
2. 修饰符（readonly / ? 的增删）+ key remapping（as 子句）（2 分钟）
3. DeepPartial / DeepReadonly 递归思路 + 实战案例（1.5 分钟）

录完后自查：

- 是否说出 `-readonly` / `-?` 移除修饰符的语法。
- 是否说出 as 子句可以改名和过滤。
- 是否说出 Deep 系列需要条件类型 + 递归。
- 是否能手写 Partial 和 Pick。

## 复盘

今天最需要回补的 3 个点：

1. `keyof` 对 `{}` / `object` / `unknown` 的不同结果。
2. 映射类型中 `as` 配合 `Exclude` 实现 Omit 的写法。
3. 映射类型中保持元组类型（映射数组时要特殊处理索引签名）。
