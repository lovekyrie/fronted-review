# Day 55 工具类型手写 + JS → TS 改造

## 今日目标

- 手写 15 个常用工具类型：`Partial / Required / Readonly / Pick / Omit / Exclude / Extract / NonNullable / ReturnType / Parameters / Awaited / Record / ConstructorParameters / ThisParameterType / OmitThisParameter`
- 把 `hand-write/` 里 2 个 JS 示例改写为严格 TS 版
- 输出 JS → TS 改造 checklist

## 按顺序阅读

1. [TS 类型设计](../advanced/week5/typescript-design)
2. [TS 基础](../advanced/week5/typescript-basic)

## 实操与自测

**检查点**

- `Omit` 的内部是 `Pick<T, Exclude<keyof T, K>>`，不是原生内置魔法
- `Exclude` / `Extract` 基于分发条件类型
- 改造 JS 到 TS，优先补 API 边界类型，函数内部用推断即可

**先独立完成，再对照专题**

- 15 个工具类型分 5 组 — [参考章节](../advanced/week5/typescript-design#day-55-15-个工具类型分-5-组)
- 底层实现分类 — [参考章节](../advanced/week5/typescript-design#day-55-底层实现分类)
- 15 个工具类型实现 — [参考章节](../advanced/week5/typescript-design#day-55-15-个工具类型实现)
- JS → TS 改造 Checklist — [参考章节](../advanced/week5/typescript-design#day-55-js-→-ts-改造-checklist)

**脱稿口述题**

- 1. 你常用的 5 个工具类型分别怎么实现？
- 2. JS 改 TS 的时候你先从哪里下手？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 工具类型 5 组分类 + 底层三种技术（映射/分发/infer）（2 分钟）
2. 手写 Partial / Omit / ReturnType 三个实现（1.5 分钟）
3. JS → TS 改造流程（从边界入手 + 渐进式）（1.5 分钟）

录完后自查：

- 是否说出三种底层技术：映射、分发条件、infer。
- 是否说出 Omit = Pick + Exclude 的组合。
- 是否说出 JS 改 TS 先改 API 边界。
- 是否说出开启 strict 模式的重要性。

## 复盘

今天最需要回补的 3 个点：

1. `ConstructorParameters` 和 `InstanceType` 的实际使用场景（工厂函数、DI 容器）。
2. `satisfies` 操作符（TS 4.9+）在类型检查中的妙用。
3. 第三方库类型声明（`.d.ts`）的编写和 `declare module` 的用法。
