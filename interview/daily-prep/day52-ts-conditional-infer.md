# Day 52 条件类型与 infer

## 今日目标

- 看完 TS Conditional Types
- 手写常见工具类型：`ReturnType / Parameters / Awaited / ExtractPromise`
- 输出 `distributive conditional types`（分发条件类型）答题稿

## 按顺序阅读

1. [TS 类型设计](../advanced/week5/typescript-design)

## 实操与自测

**检查点**

- `T extends U ? X : Y` 当 T 是 naked type 且是 union 时，会**分发**
- `[T] extends [U] ? X : Y` 加方括号包裹可以**关闭分发**
- `infer` 只能出现在 extends 的右侧，用于“从结构里掏出一个类型”

**先独立完成，再对照专题**

- 条件类型语法 — [参考章节](../advanced/week5/typescript-design#day-52-条件类型语法)
- 分发条件类型（Distributive） — [参考章节](../advanced/week5/typescript-design#day-52-分发条件类型-distributive)
- infer 关键字 — [参考章节](../advanced/week5/typescript-design#day-52-infer-关键字)
- infer 在不同位置的推断规则 — [参考章节](../advanced/week5/typescript-design#day-52-infer-在不同位置的推断规则)
- 常见工具类型实现 — [参考章节](../advanced/week5/typescript-design#day-52-常见工具类型实现)

**脱稿口述题**

- 1. 什么是分发条件类型？什么场景需要关闭它？
- 2. `infer` 的核心价值是什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 条件类型语法 + 分发规则 + 关闭分发的 `[]` 技巧（1.5 分钟）
2. infer 核心概念 + 4 个示例（ReturnType / Parameters / Awaited / Flatten）（2 分钟）
3. 协变逆变位置的推断差异（1.5 分钟）

录完后自查：

- 是否说出分发条件类型的触发条件（naked type parameter + union）。
- 是否说出 `[]` 包裹关闭分发。
- 是否说出 infer 只能在 extends 右侧。
- 是否说出协变位置推联合、逆变位置推交叉。

## 复盘

今天最需要回补的 3 个点：

1. `infer` 在模板字面量类型中的应用（如 `'GET /api/user'` 解析出方法和路径）。
2. 递归条件类型的深度限制（TS 默认最多 50 层递归）。
3. `NoInfer<T>` 工具类型（TS 5.4+），阻止某个位置参与推断。
