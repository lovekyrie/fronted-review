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

### 条件类型语法

```ts
T extends U ? X : Y
// 如果 T 可赋值给 U，结果是 X，否则是 Y
```

### 分发条件类型（Distributive）

```ts
type ToArray<T> = T extends any ? T[] : never

// T 是联合类型时会分发：
type R = ToArray<string | number>
// = (string extends any ? string[] : never) | (number extends any ? number[] : never)
// = string[] | number[]

// 关闭分发：用 [] 包裹
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type R2 = ToArrayNonDist<string | number>
// = (string | number)[]
```

分发条件：T 是 **naked type parameter**（裸类型参数）且 T 是联合类型时自动分发。

### infer 关键字

`infer` 只能出现在条件类型的 `extends` 右侧，用于从结构中"掏出"一个类型。

```ts
// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// 提取函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never

// 提取 Promise 内部类型（递归解包）
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

// 提取数组元素类型
type ElementOf<T> = T extends (infer E)[] ? E : never

// 提取第一个参数类型
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never
```

### infer 在不同位置的推断规则

| 位置 | 推断结果 |
|------|----------|
| 协变位置（返回值） | 推断为联合类型 |
| 逆变位置（参数） | 推断为交叉类型 |

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never
type R1 = Foo<{ a: string; b: number }>  // string | number（协变：联合）

type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never
type R2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>  // string & number = never（逆变：交叉）
```

## 手写 / 流程图

### 常见工具类型实现

```ts
// 1. ReturnType
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never

// 2. Parameters
type MyParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any ? P : never

// 3. Awaited（递归解包 Promise）
type MyAwaited<T> =
  T extends Promise<infer U> ? MyAwaited<U> : T

// 4. ExtractPromise（从联合中提取 Promise 类型）
type ExtractPromise<T> = T extends Promise<any> ? T : never
type R = ExtractPromise<string | Promise<number> | boolean>  // Promise<number>

// 5. Flatten（数组扁平化类型）
type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T
type R2 = Flatten<number[][][]>  // number
```

## 口述题

### 1. 什么是分发条件类型？什么场景需要关闭它？

回答模板：

> 当条件类型 `T extends U ? X : Y` 中的 T 是裸类型参数（没有被 `[]` / `Promise` 等包裹），且 T 传入联合类型时，条件会对联合的**每个成员分别执行**，最后合并结果。比如 `ToArray<string | number>` 得到 `string[] | number[]`。
>
> 需要关闭分发的场景：你希望把联合类型当作一个整体处理。比如 `IsUnion<T>` 判断 T 是不是联合类型，就需要 `[T] extends [T]` 的技巧。或者你想得到 `(string | number)[]` 而不是 `string[] | number[]`，用 `[T] extends [any]` 关闭分发。

### 2. `infer` 的核心价值是什么？

回答模板：

> `infer` 让你能从一个复杂类型中**提取出子类型**，就像类型层面的模式匹配。比如 `T extends Promise<infer U>` 就是问"如果 T 是一个 Promise，帮我把里面的类型取出来叫 U"。
>
> 它的价值在于：不需要手动指定子类型，让 TS 自动推断。这使得像 `ReturnType`、`Parameters`、`Awaited` 这种工具类型成为可能。高级用法是递归 infer（如递归解包 Promise）和在不同位置利用协变/逆变规则。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 条件类型语法 + 分发规则 + 关闭分发的 `[]` 技巧（1.5 分钟）
2. infer 核心概念 + 4 个示例（ReturnType / Parameters / Awaited / Flatten）（2 分钟）
3. 协变逆变位置的推断差异（1.5 分钟）

录完后自查：

- 是否说出分发条件类型的触发条件（naked type parameter + union）。
- 是否说出 `[]` 包裹关闭分发。
- 是否说出 infer 只能在 extends 右侧。
- 是否说出协变位置推联合、逆变位置推交叉。

## 今日复盘

今天最需要回补的 3 个点：

1. `infer` 在模板字面量类型中的应用（如 `'GET /api/user'` 解析出方法和路径）。
2. 递归条件类型的深度限制（TS 默认最多 50 层递归）。
3. `NoInfer<T>` 工具类型（TS 5.4+），阻止某个位置参与推断。
