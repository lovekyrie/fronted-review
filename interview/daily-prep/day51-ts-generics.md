# Day 51 TS 泛型与约束 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 51 | 泛型 | [TS 基础](../advanced/week5/typescript-basic)、[TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Handbook 的 Generics 章节
- 写 3 个泛型工具函数：`pick / pluck / deepMerge`（带约束 + 推断）
- 输出泛型设计 3 准则：只保留必要参数、用 extends 约束、让类型能自动推断

## 阅读卡点

- 泛型参数本身也可以有默认值（`T = string`）和约束（`T extends ...`）
- 函数泛型优先写在参数位置，让 TS 从参数推断，而不是强行传入
- `<T extends readonly unknown[]>` 是处理元组的惯用法

## 速记卡 / 知识点

### 泛型 3 个使用动机

1. **输入输出关联**：函数参数类型决定返回值类型（`function identity<T>(x: T): T`）。
2. **容器抽象**：`Array<T>`、`Promise<T>`、`Ref<T>` 等通用容器。
3. **约束但灵活**：`extends` 限定范围，但具体类型由调用方决定。

### 泛型约束

```ts
// 基础约束
function getLength<T extends { length: number }>(x: T): number {
  return x.length
}

// keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// 多泛型协作
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}
```

### 泛型默认值

```ts
type ApiResponse<T = unknown> = {
  code: number
  data: T
  message: string
}
// 使用时可以不传：ApiResponse → data: unknown
// 也可以指定：ApiResponse<User> → data: User
```

### 推断方向

```ts
// ✅ 让 TS 从参数推断，不需要手动传泛型
function first<T>(arr: T[]): T | undefined { return arr[0] }
const x = first([1, 2, 3])  // T 自动推断为 number

// ❌ 避免：强迫调用方手动传泛型
const y = first<number>([1, 2, 3])
```

## 手写 / 流程图

### 3 个泛型工具函数

```ts
// 1. pick：从对象中选取指定 key
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => { result[key] = obj[key] })
  return result
}

// 2. pluck：从对象数组中提取某个 key 的值
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key])
}

// 3. deepMerge（简化版）
function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const result = { ...target } as T & U
  for (const key in source) {
    const sv = source[key]
    const tv = (result as any)[key]
    if (typeof sv === 'object' && sv !== null && typeof tv === 'object' && tv !== null) {
      (result as any)[key] = deepMerge(tv, sv)
    } else {
      (result as any)[key] = sv
    }
  }
  return result
}
```

### 泛型设计 3 准则

```text
1. 只保留必要的泛型参数 — 能推断的不要求传入
2. 用 extends 约束范围 — 给泛型设边界，报错更友好
3. 让类型能自动推断 — 泛型参数放在函数参数位置
```

## 口述题

### 1. 什么时候该加泛型？

回答模板：

> 三种场景需要泛型。第一，输入和输出有类型关联——比如函数参数是什么类型，返回值就是什么类型。第二，写通用容器或工具——比如 `Array<T>`、`Ref<T>`、`pick<T, K>` 这种需要抽象但保持类型安全的场景。第三，约束但灵活——用 `extends` 限定参数范围，但具体类型由使用方决定。
>
> 反过来说，如果函数的参数和返回值类型是固定的、不需要关联，就不该加泛型，会增加无谓的复杂度。

### 2. `extends` 在泛型里有几种用法？

回答模板：

> 三种。第一，**泛型约束**：`T extends SomeType`，限制 T 必须满足某个结构，比如 `T extends { length: number }`。第二，**条件类型**：`T extends U ? X : Y`，根据 T 是否能赋值给 U 选择类型分支。第三，**keyof 约束**：`K extends keyof T`，限制 K 必须是 T 的 key 之一，这在 pick / getProperty 等工具类型里非常常用。
>
> 本质上 `extends` 在类型系统里表达的是"可赋值性"（assignability），不是面向对象的"继承"。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 泛型 3 个使用动机（输入输出关联 / 容器抽象 / 约束但灵活）（1.5 分钟）
2. extends 约束 + keyof 约束 + 多泛型协作（2 分钟）
3. 推断方向（参数位推断）+ 默认值 + 3 准则（1.5 分钟）

录完后自查：

- 是否说出泛型的 3 个使用动机。
- 是否说出 extends 的 3 种用法。
- 是否说出"让 TS 从参数推断"的原则。
- 是否能手写 pick 的泛型签名。

## 今日复盘

今天最需要回补的 3 个点：

1. 泛型在类（class）中的使用（`class Container<T> { ... }`）。
2. `<T extends readonly unknown[]>` 处理元组的惯用法。
3. 函数重载 vs 泛型的选择场景。
