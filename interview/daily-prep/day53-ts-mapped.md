# Day 53 映射类型与 keyof 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 53 | 映射类型 | [TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Mapped Types
- 手写 `Partial / Required / Readonly / Pick / Record`
- 理解 `-readonly` / `-?` 移除修饰符的语法

## 阅读卡点

- 映射类型基础语法：`{ [K in keyof T]: ... }`
- `keyof` 对 interface / type / class 行为一致，但对 `{}` 是 `never`
- `as` 子句（remapping）可以配合模板字面量类型改 key 名

## 速记卡 / 知识点

### 映射类型基础语法

```ts
type Mapped<T> = {
  [K in keyof T]: T[K]  // 遍历 T 的所有 key，值类型保持
}
```

### 修饰符增删

```ts
// 添加 readonly
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// 移除 readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

// 添加可选
type Partial<T> = { [K in keyof T]?: T[K] }

// 移除可选
type Required<T> = { [K in keyof T]-?: T[K] }
```

### Key Remapping（as 子句，TS 4.1+）

```ts
// 改变 key 名
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
// { name: string } → { getName: () => string }

// 过滤 key（返回 never 的 key 会被移除）
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}
// OmitByType<{ a: string; b: number }, string> → { b: number }
```

### 内置工具类型实现

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Record<K extends keyof any, T> = { [P in K]: T }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## 手写 / 流程图

### 5 个内置工具类型手写

```ts
// 1. Partial
type MyPartial<T> = { [K in keyof T]?: T[K] }

// 2. Required
type MyRequired<T> = { [K in keyof T]-?: T[K] }

// 3. Readonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// 4. Pick
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

// 5. Record
type MyRecord<K extends keyof any, T> = { [P in K]: T }
```

### DeepPartial 递归实现

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// 使用
type Config = { db: { host: string; port: number }; debug: boolean }
type PartialConfig = DeepPartial<Config>
// { db?: { host?: string; port?: number }; debug?: boolean }
```

### DeepReadonly

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T
```

### 实战：API 响应类型生成

```ts
// 从接口类型自动生成查询参数类型
type QueryParams<T> = {
  [K in keyof T as T[K] extends string | number ? K : never]?: T[K]
}

interface User { id: number; name: string; avatar: File }
type UserQuery = QueryParams<User>  // { id?: number; name?: string }
```

## 口述题

### 1. Partial 和 DeepPartial 实现差别？

回答模板：

> `Partial<T>` 只处理第一层：`{ [K in keyof T]?: T[K] }`，嵌套对象内部的属性仍然是必填的。`DeepPartial<T>` 需要递归：先判断 `T[K]` 是不是对象类型，如果是就递归处理 `DeepPartial<T[K]>`，否则直接返回。
>
> 实现上关键是条件类型 + 递归：`T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T`。需要注意数组和 Date 等特殊对象的处理——通常加一个判断 `T extends Array<infer U> ? Array<DeepPartial<U>>` 的分支。

### 2. 映射类型什么时候配合 remapping？

回答模板：

> 两种场景。第一，需要改变 key 名称，比如自动生成 getter：`getXxx`，用模板字面量 + `as` 子句实现。第二，需要按值类型过滤 key，比如只保留值是 string 类型的属性，让不符合条件的 key 映射为 `never`，never key 会自动被移除。
>
> Remapping 是 TS 4.1 引入的，之前只能先 Extract/Exclude keyof 再 Pick，现在一步就能完成，代码更简洁。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 映射类型语法 + `[K in keyof T]` 的含义（1.5 分钟）
2. 修饰符（readonly / ? 的增删）+ key remapping（as 子句）（2 分钟）
3. DeepPartial / DeepReadonly 递归思路 + 实战案例（1.5 分钟）

录完后自查：

- 是否说出 `-readonly` / `-?` 移除修饰符的语法。
- 是否说出 as 子句可以改名和过滤。
- 是否说出 Deep 系列需要条件类型 + 递归。
- 是否能手写 Partial 和 Pick。

## 今日复盘

今天最需要回补的 3 个点：

1. `keyof` 对 `{}` / `object` / `unknown` 的不同结果。
2. 映射类型中 `as` 配合 `Exclude` 实现 Omit 的写法。
3. 映射类型中保持元组类型（映射数组时要特殊处理索引签名）。
