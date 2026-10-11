### TypeScript 类型设计

如果说 `week5-typescript-basic` 解决的是“TypeScript 有哪些核心能力”，那这一篇更关注：

- 怎么把这些能力变成真实项目里的类型设计
- 怎么设计让调用方更舒服的 API
- 怎么避免“类型看起来很强，实际不好用”

高级前端面试里，真正拉开差距的通常不是会不会写 `keyof`，而是你能不能把类型系统用在业务建模和 API 设计上。

#### 1. 类型设计的目标

一个好的类型设计，通常同时满足这几件事：

1. **能表达业务约束**
2. **能让常见调用自动推断**
3. **能让错误尽早暴露**
4. **不会把调用方逼到到处写 `as`**
5. **随着业务演进还能维护**

很多“高级类型体操”之所以在真实项目里价值不高，就是因为它们满足了第 3 条，却破坏了第 2 条和第 5 条。

#### 2. 优先设计数据模型，再设计工具类型

类型设计最容易走偏的地方，是一上来就写复杂泛型，却没有先把业务模型拆清楚。

更稳的顺序通常是：

1. 定义领域对象
2. 定义状态分支
3. 再定义派生类型和工具类型

例如用户模块，不要一份类型走天下：

```ts
type ApiUser = {
  id: number
  user_name: string
  user_email: string
  created_at: string
}

type User = {
  id: number
  name: string
  email: string
  createdAt: Date
}

type UserFormValues = {
  name: string
  email: string
}
```

这比让 `ApiUser` 直接贯穿接口层、状态层、表单层、展示层要稳得多。

#### 3. 判别联合优先于“可选字段大杂烩”

很多业务状态天然就是有限状态机。

不要写成这样：

```ts
type UserState = {
  loading?: boolean
  data?: User
  error?: string
}
```

因为它允许很多无意义组合，比如：

- `loading: true` 但同时有 `data`
- `error` 和 `data` 同时存在

更稳的写法是判别联合：

```ts
type UserState
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: User }
    | { status: 'error'; error: string }
```

好处：

- 分支更清晰
- 组件渲染更安全
- 容易做穷尽检查

#### 4. 组件 API 的类型设计

高级前端里，很多类型设计能力会体现在组件 API 上。

##### 4.1 Props 不要“既能这样又能那样”却没约束

错误示例：

```ts
type ButtonProps = {
  href?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
}
```

这样会允许很多语义不清的组合。

更稳的方式是用联合把模式拆开：

```ts
type ButtonAsLink = {
  kind: 'link'
  href: string
  onClick?: never
}

type ButtonAsAction = {
  kind: 'button'
  onClick: () => void
  href?: never
}

type ButtonProps = {
  loading?: boolean
  disabled?: boolean
} & (ButtonAsLink | ButtonAsAction)
```

这样组件在类型层就能限制非法组合。

##### 4.2 用泛型保留调用方信息

例如一个表格组件：

```ts
type Column<T> = {
  key: keyof T
  title: string
  render?: (value: T[keyof T], record: T) => string
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
}
```

调用时：

```ts
type User = {
  id: number
  name: string
}

const props: TableProps<User> = {
  data: [{ id: 1, name: 'Alice' }],
  columns: [
    { key: 'name', title: 'Name' },
  ],
}
```

这类泛型组件的核心不是“写了 `<T>`”，而是让列配置和数据结构保持联动。

#### 5. 自定义 Hook 的类型设计

Hook 类型设计最重要的是让调用方尽量少写额外注解。

##### 5.1 让返回值可推断

```ts
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)

  function toggle() {
    setValue(v => !v)
  }

  return [value, toggle] as const
}
```

这里 `as const` 的价值是保留元组语义，否则返回值更容易被推成普通数组。

##### 5.2 异步 Hook 用判别联合描述状态

```ts
type AsyncState<T>
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error }

function useRequest<T>(request: () => Promise<T>): AsyncState<T> {
  // ...
  return { status: 'idle' }
}
```

比起返回：

```ts
{
  data?: T
  loading: boolean
  error?: Error
}
```

判别联合更适合驱动 UI 分支。

#### 6. “约束调用方”不等于“逼调用方写很多类型”

这是类型设计里非常重要的一点。

如果一个 API 设计成这样：

```ts
doSomething<User, UserPayload, UserResponse, UserError>(...)
```

通常就说明类型系统没有替调用方分担复杂度，反而把复杂度暴露出去了。

更好的方向是：

- 尽量从参数推断
- 只在必须时暴露泛型
- 默认值和重载都服务于调用体验

#### 7. 常见设计工具

##### 7.1 `keyof` + 索引访问

```ts
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(key => obj[key])
}
```

##### 7.2 条件类型做模式分支

```ts
type ValueType<T>
  = T extends { value: infer V } ? V : never
```

##### 7.3 映射类型做结构转换

```ts
type FormErrors<T> = {
  [K in keyof T]?: string
}
```

##### 7.4 模板字面量类型做命名约束

```ts
type EventName<T extends string> = `on${Capitalize<T>}`
```

这些能力本身不重要，重要的是你知道什么时候该拿来约束真实 API。

#### 8. 类型设计常见反模式

##### 8.1 一把梭 `any`

一旦公共 API 用了 `any`，下游基本就失去类型保护。

##### 8.2 到处断言

```ts
const user = data as User
```

如果这在项目里遍地都是，说明设计没有真正建立可信边界。

##### 8.3 用复杂类型掩盖坏模型

如果业务模型本身混乱，复杂类型只会让问题更难维护。

##### 8.4 对内部和外部模型不分层

把后端 DTO 直接给 UI、表单、状态机使用，会让整个系统耦合得很死。

#### 9. 如何回答“你在项目里怎么用 TypeScript”

高级面试里，比起说“我用了接口、泛型和工具类型”，更好的回答是：

1. 我先把接口层、领域层、表单层分开建模
2. 对状态流用判别联合，避免非法状态组合
3. 对组件和 Hook 的公共 API 优先做推断友好设计
4. 对高风险输入先用 `unknown`，再做运行时校验
5. 对复杂场景再用条件类型、映射类型和模板字面量类型补约束

#### 10. 高频面试题

##### 10.1 什么叫“推断友好”的 API

调用方在多数场景下不需要手写过多泛型或断言，类型能从参数和上下文自然得出。

##### 10.2 为什么判别联合比多个可选字段更稳

因为它能让状态组合收敛到有限集合，避免出现语义矛盾的对象结构。

##### 10.3 为什么类型设计要先做模型分层

因为接口返回、前端状态、表单编辑和 UI 展示的关注点不同，直接共用一份类型会导致耦合和语义混乱。

##### 10.4 类型设计和运行时校验是什么关系

类型设计负责开发期建模和约束，运行时校验负责处理不可信输入。两者互补，不能相互替代。

## 每日练习参考

### Day 52：条件类型语法

```ts
T extends U ? X : Y
// 如果 T 可赋值给 U，结果是 X，否则是 Y
```

### Day 52：分发条件类型（Distributive）

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

### Day 52：infer 关键字

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

### Day 52：infer 在不同位置的推断规则

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

### Day 52：常见工具类型实现

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

### Day 53：映射类型基础语法

```ts
type Mapped<T> = {
  [K in keyof T]: T[K]  // 遍历 T 的所有 key，值类型保持
}
```

### Day 53：修饰符增删

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

### Day 53：Key Remapping（as 子句，TS 4.1+）

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

### Day 53：内置工具类型实现

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Record<K extends keyof any, T> = { [P in K]: T }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

### Day 53：5 个内置工具类型手写

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

### Day 53：DeepPartial 递归实现

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// 使用
type Config = { db: { host: string; port: number }; debug: boolean }
type PartialConfig = DeepPartial<Config>
// { db?: { host?: string; port?: number }; debug?: boolean }
```

### Day 53：DeepReadonly

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T
```

### Day 53：实战：API 响应类型生成

```ts
// 从接口类型自动生成查询参数类型
type QueryParams<T> = {
  [K in keyof T as T[K] extends string | number ? K : never]?: T[K]
}

interface User { id: number; name: string; avatar: File }
type UserQuery = QueryParams<User>  // { id?: number; name?: string }
```

### Day 54：模板字面量类型语法

```ts
type Greeting = `Hello, ${string}`  // 匹配 "Hello, xxx"
type EventName = `on${Capitalize<string>}`  // "onClick" | "onChange" | ...

// 联合自动分发
type Color = 'red' | 'blue'
type Size = 'sm' | 'lg'
type Style = `${Color}-${Size}`  // "red-sm" | "red-lg" | "blue-sm" | "blue-lg"
```

### Day 54：内置字符串工具类型

| 类型 | 作用 | 示例 |
|------|------|------|
| `Uppercase<S>` | 全大写 | `'hello'` → `'HELLO'` |
| `Lowercase<S>` | 全小写 | `'HELLO'` → `'hello'` |
| `Capitalize<S>` | 首字母大写 | `'hello'` → `'Hello'` |
| `Uncapitalize<S>` | 首字母小写 | `'Hello'` → `'hello'` |

### Day 54：infer + 模板字面量 = 字符串模式匹配

```ts
// 提取第一个字符
type FirstChar<S> = S extends `${infer F}${infer _}` ? F : never

// 按分隔符拆分
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S]

type R = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
```

### Day 54：路由参数类型推导

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

### Day 54：CamelCase

```ts
type CamelCase<S extends string> =
  S extends `${infer H}-${infer T}`
    ? `${Lowercase<H>}${CamelCase<Capitalize<T>>}`
    : S

type R = CamelCase<'foo-bar-baz'>  // 'fooBarBaz'
```

### Day 54：KebabCase

```ts
type KebabCase<S extends string> =
  S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
      ? `${Lowercase<H>}${KebabCase<T>}`
      : `${Lowercase<H>}-${KebabCase<T>}`
    : S

type R = KebabCase<'fooBarBaz'>  // 'foo-bar-baz'
```

### Day 54：Join

```ts
type Join<T extends string[], D extends string> =
  T extends [infer F extends string, ...infer R extends string[]]
    ? R['length'] extends 0
      ? F
      : `${F}${D}${Join<R, D>}`
    : ''

type R = Join<['a', 'b', 'c'], '.'>  // 'a.b.c'
```

### Day 54：实战：事件类型

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

### Day 55：15 个工具类型分 5 组

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

### Day 55：底层实现分类

```text
基于映射类型：Partial / Required / Readonly / Pick / Record
基于条件类型（分发）：Exclude / Extract / NonNullable
基于条件类型 + infer：ReturnType / Parameters / Awaited / ConstructorParameters
组合：Omit = Pick + Exclude
```

### Day 55：15 个工具类型实现

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

### Day 55：JS → TS 改造 Checklist

```text
1. 启用 strict 模式（tsconfig.json: "strict": true）
2. 从 API 边界开始：函数参数 + 返回值 + props 接口
3. 把 any 替换为 unknown，再逐步缩窄
4. 定义核心业务类型（User / Order / ApiResponse）
5. 利用 typeof / ReturnType / Parameters 从运行时代码提取类型
6. 配置 ESLint TS 规则（no-explicit-any / strict-boolean-expressions）
7. 渐进式：先 .js → .ts，再逐步补类型
```

## Day 56 practice code

```ts
// ❌ 反模式：loading + error + data 可以任意组合
type BadState = {
  loading: boolean
  error: string | null
  data: User | null
}

// ✅ 正确：用 discriminated union，每种状态只包含合法属性
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: User }
```

```ts
type EventMap = {
  login: { userId: string; timestamp: number }
  logout: void
  error: { code: number; message: string }
}

class TypedEmitter<T extends Record<string, any>> {
  private handlers = new Map<keyof T, Set<Function>>()

  on<K extends keyof T>(
    event: K,
    handler: T[K] extends void ? () => void : (payload: T[K]) => void
  ) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(handler)
    return () => this.handlers.get(event)?.delete(handler)
  }

  emit<K extends keyof T>(
    event: K,
    ...args: T[K] extends void ? [] : [payload: T[K]]
  ) {
    this.handlers.get(event)?.forEach(fn => fn(...args))
  }
}

const emitter = new TypedEmitter<EventMap>()
emitter.on('login', (payload) => { /* payload: { userId, timestamp } */ })
emitter.emit('login', { userId: '1', timestamp: Date.now() })
emitter.emit('logout')  // 无参数
```

```ts
type ApiRoutes = {
  'GET /users': { response: User[]; query: { page: number } }
  'GET /users/:id': { response: User; params: { id: string } }
  'POST /users': { response: User; body: CreateUserDto }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

function api<K extends keyof ApiRoutes>(
  route: K,
  ...args: ApiRoutes[K] extends { body: infer B }
    ? [options: { body: B }]
    : ApiRoutes[K] extends { query: infer Q }
      ? [options?: { query: Q }]
      : []
): Promise<ApiRoutes[K]['response']> {
  // 实现...
  return {} as any
}

// 使用时有完整类型提示
const users = await api('GET /users', { query: { page: 1 } })
```

### Day 51：泛型设计 3 准则

```text
1. 只保留必要的泛型参数 — 能推断的不要求传入
2. 用 extends 约束范围 — 给泛型设边界，报错更友好
3. 让类型能自动推断 — 泛型参数放在函数参数位置
```
