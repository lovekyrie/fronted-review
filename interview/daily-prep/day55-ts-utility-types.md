# Day 55 工具类型手写 + JS → TS 改造 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 55 | 工具类型 | [TS 类型设计](../advanced/week5/typescript-design)、[TS 基础](../advanced/week5/typescript-basic) |

## 今日目标

- 手写 15 个常用工具类型：`Partial / Required / Readonly / Pick / Omit / Exclude / Extract / NonNullable / ReturnType / Parameters / Awaited / Record / ConstructorParameters / ThisParameterType / OmitThisParameter`
- 把 `hand-write/` 里 2 个 JS 示例改写为严格 TS 版
- 输出 JS → TS 改造 checklist

## 阅读卡点

- `Omit` 的内部是 `Pick<T, Exclude<keyof T, K>>`，不是原生内置魔法
- `Exclude` / `Extract` 基于分发条件类型
- 改造 JS 到 TS，优先补 API 边界类型，函数内部用推断即可

## 速记卡 / 知识点

### 15 个工具类型分 5 组

| 分组 | 类型 | 一句话 |
|------|------|--------|
| **属性修饰** | `Partial<T>` | 所有属性变可选 |
| | `Required<T>` | 所有属性变必填 |
| | `Readonly<T>` | 所有属性变只读 |
| **选取** | `Pick<T, K>` | 从 T 选取 K 对应属性 |
| | `Omit<T, K>` | 从 T 排除 K 对应属性 |
| | `Record<K, T>` | 构造 key 为 K、值为 T 的对象 |
| **联合操作** | `Exclude<U, E>` | 从联合 U 中移除 E |
| | `Extract<U, E>` | 从联合 U 中提取 E |
| | `NonNullable<T>` | 移除 null 和 undefined |
| **函数** | `ReturnType<T>` | 提取函数返回类型 |
| | `Parameters<T>` | 提取函数参数元组 |
| | `ConstructorParameters<T>` | 提取构造函数参数 |
| | `ThisParameterType<T>` | 提取 this 参数类型 |
| | `OmitThisParameter<T>` | 移除 this 参数 |
| **异步** | `Awaited<T>` | 递归解包 Promise |

### 底层实现分类

```text
基于映射类型：Partial / Required / Readonly / Pick / Record
基于条件类型（分发）：Exclude / Extract / NonNullable
基于条件类型 + infer：ReturnType / Parameters / Awaited / ConstructorParameters
组合：Omit = Pick + Exclude
```

## 手写 / 流程图

### 15 个工具类型实现

```ts
// 属性修饰
type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyRequired<T> = { [K in keyof T]-?: T[K] }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// 选取
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>
type MyRecord<K extends keyof any, T> = { [P in K]: T }

// 联合操作（分发条件类型）
type MyExclude<T, U> = T extends U ? never : T
type MyExtract<T, U> = T extends U ? T : never
type MyNonNullable<T> = T extends null | undefined ? never : T

// 函数（infer）
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never
type MyParameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never
type MyThisParameterType<T> =
  T extends (this: infer U, ...args: any) => any ? U : unknown
type MyOmitThisParameter<T> =
  T extends (this: any, ...args: infer A) => infer R ? (...args: A) => R : T

// 异步（递归 infer）
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T
```

### JS → TS 改造 Checklist

```text
1. 启用 strict 模式（tsconfig.json: "strict": true）
2. 从 API 边界开始：函数参数 + 返回值 + props 接口
3. 把 any 替换为 unknown，再逐步缩窄
4. 定义核心业务类型（User / Order / ApiResponse）
5. 利用 typeof / ReturnType / Parameters 从运行时代码提取类型
6. 配置 ESLint TS 规则（no-explicit-any / strict-boolean-expressions）
7. 渐进式：先 .js → .ts，再逐步补类型
```

## 口述题

### 1. 你常用的 5 个工具类型分别怎么实现？

回答模板：

> `Partial<T>` 用映射类型 `{ [K in keyof T]?: T[K] }`，遍历所有 key 加 `?`。`Pick<T, K>` 也是映射类型 `{ [P in K]: T[P] }`，但只遍历传入的 K。`Omit<T, K>` 是组合：先用 `Exclude<keyof T, K>` 从 key 联合中排除，再 `Pick`。
>
> `Exclude<T, U>` 基于分发条件类型：`T extends U ? never : T`，联合类型分发后把匹配 U 的成员变成 never 移除。`ReturnType<T>` 用条件类型 + infer：`T extends (...args: any) => infer R ? R : never`，从函数签名中提取返回类型。
>
> 核心就三种技术：映射类型做属性变换、分发条件类型做联合过滤、infer 做结构提取。

### 2. JS 改 TS 的时候你先从哪里下手？

回答模板：

> 先改 API 边界，后改内部实现。具体步骤：第一步，开启 strict 模式，让 TS 报出所有隐式 any。第二步，定义核心业务类型（User / Order 这些），因为它们被到处引用。第三步，给函数签名加类型——参数和返回值，函数内部 TS 通常能自动推断。第四步，把 any 替换为 unknown，强迫自己缩窄后使用。
>
> 关键原则是渐进式：不要一次全改，先 rename .js → .ts，忍受一些 any，每次 PR 改一部分。优先改被依赖最多的模块（utils / api / types），效果最大。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 工具类型 5 组分类 + 底层三种技术（映射/分发/infer）（2 分钟）
2. 手写 Partial / Omit / ReturnType 三个实现（1.5 分钟）
3. JS → TS 改造流程（从边界入手 + 渐进式）（1.5 分钟）

录完后自查：

- 是否说出三种底层技术：映射、分发条件、infer。
- 是否说出 Omit = Pick + Exclude 的组合。
- 是否说出 JS 改 TS 先改 API 边界。
- 是否说出开启 strict 模式的重要性。

## 今日复盘

今天最需要回补的 3 个点：

1. `ConstructorParameters` 和 `InstanceType` 的实际使用场景（工厂函数、DI 容器）。
2. `satisfies` 操作符（TS 4.9+）在类型检查中的妙用。
3. 第三方库类型声明（`.d.ts`）的编写和 `declare module` 的用法。
