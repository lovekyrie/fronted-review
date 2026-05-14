# Day 54 模板字面量类型 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 54 | 模板字面量 | [TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Template Literal Types
- 手写 `Join / Split / CamelCase / KebabCase` 字符串工具类型
- 做一个路由参数类型推导 demo：`/user/:id/post/:postId` → `{ id: string; postId: string }`

## 阅读卡点

- 模板字面量类型和字符串字面量的 `${}` 语法一致，但只能在类型位置
- 常配合 `infer` 用于模式提取
- 注意 union 分发：`T extends \`\${infer H}.\${infer T}\` ? ... : ...`

## 速记卡 / 知识点

### 模板字面量类型语法

```ts
type Greeting = `Hello, ${string}`  // 匹配 "Hello, xxx"
type EventName = `on${Capitalize<string>}`  // "onClick" | "onChange" | ...

// 联合自动分发
type Color = 'red' | 'blue'
type Size = 'sm' | 'lg'
type Style = `${Color}-${Size}`  // "red-sm" | "red-lg" | "blue-sm" | "blue-lg"
```

### 内置字符串工具类型

| 类型 | 作用 | 示例 |
|------|------|------|
| `Uppercase<S>` | 全大写 | `'hello'` → `'HELLO'` |
| `Lowercase<S>` | 全小写 | `'HELLO'` → `'hello'` |
| `Capitalize<S>` | 首字母大写 | `'hello'` → `'Hello'` |
| `Uncapitalize<S>` | 首字母小写 | `'Hello'` → `'hello'` |

### infer + 模板字面量 = 字符串模式匹配

```ts
// 提取第一个字符
type FirstChar<S> = S extends `${infer F}${infer _}` ? F : never

// 按分隔符拆分
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S]

type R = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
```

## 手写 / 流程图

### 路由参数类型推导

```ts
type ExtractParams<S extends string> =
  S extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
    : S extends `${infer _}:${infer Param}`
      ? { [K in Param]: string }
      : {}

type R = ExtractParams<'/user/:id/post/:postId'>
// { id: string; postId: string }
```

### CamelCase

```ts
type CamelCase<S extends string> =
  S extends `${infer H}-${infer T}`
    ? `${Lowercase<H>}${CamelCase<Capitalize<T>>}`
    : S

type R = CamelCase<'foo-bar-baz'>  // 'fooBarBaz'
```

### KebabCase

```ts
type KebabCase<S extends string> =
  S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
      ? `${Lowercase<H>}${KebabCase<T>}`
      : `${Lowercase<H>}-${KebabCase<T>}`
    : S

type R = KebabCase<'fooBarBaz'>  // 'foo-bar-baz'
```

### Join

```ts
type Join<T extends string[], D extends string> =
  T extends [infer F extends string, ...infer R extends string[]]
    ? R['length'] extends 0
      ? F
      : `${F}${D}${Join<R, D>}`
    : ''

type R = Join<['a', 'b', 'c'], '.'>  // 'a.b.c'
```

### 实战：事件类型

```ts
type EventMap = {
  click: { x: number; y: number }
  change: { value: string }
}

type EventHandler<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void
}

type Handlers = EventHandler<EventMap>
// { onClick: (payload: { x: number; y: number }) => void; onChange: ... }
```

## 口述题

### 1. 模板字面量类型典型用途？

回答模板：

> 三个典型场景。第一，生成联合类型：把多个字面量联合组合成所有排列组合，比如 CSS 类名 `'red-sm' | 'red-lg' | 'blue-sm' | 'blue-lg'`。第二，配合 infer 做字符串模式匹配：从路由路径提取参数、拆分字符串、转换命名风格（camelCase ↔ kebab-case）。第三，用 `as` remapping 生成新 key 名：比如从 `{ click: ... }` 自动生成 `{ onClick: ... }`。
>
> 本质上模板字面量类型让 TS 的类型系统有了"字符串处理"能力，配合递归可以做很多以前不可能的事。

### 2. 路由参数类型怎么推导？

回答模板：

> 用模板字面量 + infer + 递归。匹配模式 `${_}:${Param}/${Rest}`，把 `:` 后面到 `/` 前的部分提取为参数名，然后递归处理剩余部分。基本 case 是 `${_}:${Param}`（最后一个参数）和不匹配时返回空对象。
>
> 比如 `/user/:id/post/:postId` 第一次匹配到 `id` 和剩余 `post/:postId`，递归再匹配到 `postId`，最终合并为 `{ id: string; postId: string }`。Next.js 和 vue-router 的类型系统都用了类似的技巧。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 模板字面量语法 + 联合分发 + 内置工具（Capitalize 等）（1 分钟）
2. infer + 递归做字符串匹配（Split / CamelCase）（2 分钟）
3. 实战案例（路由参数推导 / 事件名转换）（2 分钟）

录完后自查：

- 是否说出模板字面量 + 联合会自动分发。
- 是否说出 infer 在模板字面量中做模式匹配。
- 是否说出路由参数推导的递归思路。
- 是否提到 Capitalize / Uncapitalize 等内置工具。

## 今日复盘

今天最需要回补的 3 个点：

1. 模板字面量类型的性能问题（大联合排列组合会导致类型爆炸）。
2. `infer` 在模板字面量中的贪婪匹配规则（从左到右，最短匹配）。
3. 实际项目中模板字面量的边界（过于复杂的类型体操会降低 IDE 性能和可维护性）。
