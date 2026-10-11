# Day 54 模板字面量类型

## 今日目标

- 看完 TS Template Literal Types
- 手写 `Join / Split / CamelCase / KebabCase` 字符串工具类型
- 做一个路由参数类型推导 demo：`/user/:id/post/:postId` → `{ id: string; postId: string }`

## 按顺序阅读

1. [TS 类型设计](../advanced/week5/typescript-design)

## 实操与自测

**检查点**

- 模板字面量类型和字符串字面量的 `${}` 语法一致，但只能在类型位置
- 常配合 `infer` 用于模式提取
- 注意 union 分发：`T extends \`\${infer H}.\${infer T}\` ? ... : ...`

**先独立完成，再对照专题**

- 模板字面量类型语法 — [参考章节](../advanced/week5/typescript-design#day-54-模板字面量类型语法)
- 内置字符串工具类型 — [参考章节](../advanced/week5/typescript-design#day-54-内置字符串工具类型)
- infer + 模板字面量 = 字符串模式匹配 — [参考章节](../advanced/week5/typescript-design#day-54-infer-模板字面量-字符串模式匹配)
- 路由参数类型推导 — [参考章节](../advanced/week5/typescript-design#day-54-路由参数类型推导)
- CamelCase — [参考章节](../advanced/week5/typescript-design#day-54-camelcase)
- KebabCase — [参考章节](../advanced/week5/typescript-design#day-54-kebabcase)
- Join — [参考章节](../advanced/week5/typescript-design#day-54-join)
- 实战：事件类型 — [参考章节](../advanced/week5/typescript-design#day-54-实战-事件类型)

**脱稿口述题**

- 1. 模板字面量类型典型用途？
- 2. 路由参数类型怎么推导？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 模板字面量语法 + 联合分发 + 内置工具（Capitalize 等）（1 分钟）
2. infer + 递归做字符串匹配（Split / CamelCase）（2 分钟）
3. 实战案例（路由参数推导 / 事件名转换）（2 分钟）

录完后自查：

- 是否说出模板字面量 + 联合会自动分发。
- 是否说出 infer 在模板字面量中做模式匹配。
- 是否说出路由参数推导的递归思路。
- 是否提到 Capitalize / Uncapitalize 等内置工具。

## 复盘

今天最需要回补的 3 个点：

1. 模板字面量类型的性能问题（大联合排列组合会导致类型爆炸）。
2. `infer` 在模板字面量中的贪婪匹配规则（从左到右，最短匹配）。
3. 实际项目中模板字面量的边界（过于复杂的类型体操会降低 IDE 性能和可维护性）。
