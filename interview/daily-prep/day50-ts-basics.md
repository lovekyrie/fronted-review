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

### type vs interface

| 维度 | `type` | `interface` |
|------|--------|-------------|
| 联合类型 | ✅ `type A = B \| C` | ❌ |
| 交叉类型 | ✅ `type A = B & C` | ✅ extends 多个 |
| 元组 | ✅ `type T = [string, number]` | ❌ |
| 声明合并 | ❌ | ✅ 同名自动合并 |
| 计算属性 | ✅ 映射类型 | ❌ |
| extends | ❌ | ✅ `interface A extends B` |

选型：定义对象结构用 `interface`（可扩展）；定义联合、元组、工具类型用 `type`。

### 字面量类型 + widening

```ts
let a = 'hello'        // 类型：string（widen）
const b = 'hello'      // 类型：'hello'（字面量）
const c = { x: 1 }     // 类型：{ x: number }（对象属性 widen）
const d = { x: 1 } as const  // 类型：{ readonly x: 1 }（as const 锁定）
```

### 联合类型缩窄（Narrowing）

```ts
// typeof
function fn(x: string | number) {
  if (typeof x === 'string') { /* x: string */ }
}

// instanceof
if (x instanceof Date) { /* x: Date */ }

// in
if ('name' in x) { /* x: { name: ... } */ }

// discriminated union（最推荐）
type Result = { ok: true; data: string } | { ok: false; error: string }
function handle(r: Result) {
  if (r.ok) { r.data }    // TS 自动缩窄
  else { r.error }
}
```

### 交叉类型

```ts
type A = { name: string }
type B = { age: number }
type C = A & B  // { name: string; age: number }

// 注意：基础类型交叉会得到 never
type D = string & number  // never
```

## 手写 / 流程图

### 5 个 demo

```ts
// 1. 字面量类型
type Direction = 'up' | 'down' | 'left' | 'right'

// 2. as const
const routes = ['/', '/about', '/contact'] as const
type Route = (typeof routes)[number]  // '/' | '/about' | '/contact'

// 3. discriminated union
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2
    case 'rect': return s.width * s.height
  }
}

// 4. 交叉类型合并
type WithTimestamp<T> = T & { createdAt: Date; updatedAt: Date }
type User = WithTimestamp<{ name: string; email: string }>

// 5. exhaustive check
function assertNever(x: never): never {
  throw new Error('Unexpected: ' + x)
}
```

## 口述题

### 1. type 和 interface 怎么选？

回答模板：

> 我的原则是"对象结构用 interface，其他用 type"。interface 支持声明合并（第三方库扩展类型很方便）和 extends 继承，语义上更适合描述"这个东西长什么样"。type 适合定义联合类型、元组、映射类型等 interface 做不了的事。
>
> 实际项目中，如果团队统一用 type 也没问题，两者在描述对象结构时功能基本等价。关键是保持一致性。性能上 TS 4.x 之后差异已经很小。

### 2. discriminated union 比普通 union 好在哪？

回答模板：

> 普通 union 只能用 typeof / instanceof / in 缩窄，对于复杂对象类型很难精确区分。discriminated union 通过一个共同的"标签字段"（如 `kind` / `type` / `ok`），TS 能自动根据标签值缩窄到具体的分支类型。
>
> 好处有三：第一，TS 自动推断，不需要类型断言。第二，配合 switch + exhaustive check（`default: assertNever(x)`），新增分支时忘记处理会编译报错。第三，代码可读性好，一看标签就知道是哪种情况。实际项目中 API 响应、状态机、Redux action 都很适合用。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. type vs interface 对比 + 选型原则（1.5 分钟）
2. 字面量类型 + widening + as const（1.5 分钟）
3. 联合缩窄四种方式 + discriminated union + exhaustive check（2 分钟）

录完后自查：

- 是否说出 interface 支持声明合并、type 支持联合元组。
- 是否说出 as const 关闭 widening。
- 是否说出 discriminated union 用标签字段缩窄。
- 是否说出 exhaustive check 的写法。

## 今日复盘

今天最需要回补的 3 个点：

1. `unknown` 和 `any` 的区别（unknown 是类型安全的 any，必须缩窄后才能使用）。
2. `never` 的使用场景（exhaustive check、不可能到达的分支、空联合）。
3. 枚举 `enum` vs 联合类型的取舍（联合类型更轻量，enum 有运行时值）。
