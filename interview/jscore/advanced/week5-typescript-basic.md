### TypeScript

高级前端面试里的 TypeScript 重点不在“你会不会写类型注解”，而在于：

- 你是否理解 TypeScript 的边界
- 你能不能用类型系统约束业务模型
- 你会不会设计可推断、可复用、可维护的 API

如果答案只停留在“字符串、数字、接口、枚举、泛型”，深度通常不够。更有效的准备方式是把 TypeScript 看成一套**静态建模工具**，而不是 JavaScript 的语法附加题。

#### 1. TypeScript 到底解决什么问题

TypeScript 不是为了“让代码更复杂”，而是为了在开发期尽早发现以下问题：

- 参数类型传错
- 返回值不符合预期
- 对象结构不一致
- 状态分支漏处理
- 重构后调用方悄悄失效

它的本质是：**在运行前尽量把一部分错误转成编译期错误。**

但也要清楚边界：

- TypeScript 主要工作在编译阶段
- 它不会替代运行时校验
- 它不会保证后端返回的数据天然可信

所以更准确的说法是：TypeScript 提升了“开发期类型安全”，不是“彻底消灭 bug”。

#### 2. TypeScript 的几个基础边界

##### 2.1 `any`、`unknown`、`never`

这三个类型是面试里最容易问深的基础点。

```ts
let valueAny: any = 'hello'
valueAny.trim()
valueAny.notExist.deep.call()

let valueUnknown: unknown = 'hello'
// valueUnknown.trim() // error

if (typeof valueUnknown === 'string') {
  valueUnknown.trim()
}

function fail(message: string): never {
  throw new Error(message)
}
```

- `any`：放弃类型系统，几乎等于告诉编译器“别管我”
- `unknown`：安全的顶层类型，使用前必须先缩小类型范围
- `never`：不可能到达的类型，常见于抛错函数、死循环、穷尽检查

高级项目里，`unknown` 通常比 `any` 更值得优先使用，因为它能强迫你做明确的类型缩小。

##### 2.2 TypeScript 是结构化类型系统

TypeScript 关心的是“结构是否兼容”，不是“是不是同一个名义类型”。

```ts
interface Point2D {
  x: number
  y: number
}

const p = { x: 1, y: 2, z: 3 }

const point: Point2D = p
```

因为 `p` 至少满足 `Point2D` 所需结构，所以可以赋值。

这带来的好处是灵活，但也意味着你要更清楚哪些字段是“最小必要结构”，哪些是“业务上必须显式区分”的。

#### 3. 缩小类型范围比断言更重要

很多初学者一遇到报错就 `as`，这是很差的习惯。高级面试通常更看重你是否会用“类型缩小”而不是“强行断言”。

##### 3.1 常见缩小方式

```ts
function printId(id: string | number) {
  if (typeof id === 'string') {
    return id.toUpperCase()
  }

  return id.toFixed(0)
}
```

除了 `typeof`，还常见：

- `instanceof`
- `in`
- 判别字段
- 用户自定义 type predicate

##### 3.2 自定义类型守卫

```ts
type User = {
  name: string
}

function isUser(value: unknown): value is User {
  return typeof value === 'object'
    && value !== null
    && 'name' in value
}
```

这在处理接口返回、URL 参数、第三方输入时非常重要。

##### 3.3 穷尽检查

```ts
type RequestState
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: string[] }
    | { status: 'error'; message: string }

function renderState(state: RequestState) {
  switch (state.status) {
    case 'idle':
      return 'idle'
    case 'loading':
      return 'loading'
    case 'success':
      return state.data.join(',')
    case 'error':
      return state.message
    default: {
      const _exhaustiveCheck: never = state
      return _exhaustiveCheck
    }
  }
}
```

这类写法在状态管理、接口状态机、组件渲染分支里很实用。

#### 4. `type` 和 `interface` 怎么选

这个问题几乎必问，但不要只背“interface 能合并，type 不能”。

##### 4.1 `interface` 更适合

- 描述对象结构
- 需要被类实现
- 需要声明合并

##### 4.2 `type` 更适合

- 联合类型
- 交叉类型
- 条件类型
- 映射类型
- 模板字面量类型

```ts
interface User {
  id: number
  name: string
}

type UserStatus = 'active' | 'disabled'
type UserWithStatus = User & { status: UserStatus }
```

更工程化的回答方式是：**描述对象契约时优先考虑 `interface`，表达组合、变换、联合时优先考虑 `type`。**

#### 5. 泛型的重点不在写 `<T>`

泛型真正的价值是：**在保持类型约束的同时保留信息。**

##### 5.1 基本泛型

```ts
function identity<T>(value: T): T {
  return value
}
```

这只是起点。高级面试更爱追问的是泛型约束和推断。

##### 5.2 泛型约束

```ts
function getLength<T extends { length: number }>(value: T) {
  return value.length
}
```

`extends` 在这里不是继承语义，而是“约束 T 至少满足某种结构”。

##### 5.3 多个泛型参数

```ts
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

这个例子很常见，因为它把几个核心能力串起来了：

- 泛型
- `keyof`
- 约束
- 索引访问类型

#### 6. 类型系统里的“从类型生成类型”

这是高级 TypeScript 的核心区分点。

##### 6.1 `keyof`

`keyof` 用来拿到对象类型的键联合。

```ts
type User = {
  id: number
  name: string
}

type UserKeys = keyof User
// 'id' | 'name'
```

##### 6.2 `typeof`

在类型上下文里，`typeof` 用于从值推导类型。

```ts
const config = {
  apiBase: '/api',
  timeout: 3000,
}

type Config = typeof config
```

##### 6.3 索引访问类型

```ts
type User = {
  id: number
  name: string
}

type UserId = User['id']
```

如果把它和 `keyof` 结合，就能写出非常常用的泛型工具函数。

##### 6.4 `as const`

```ts
const roles = ['admin', 'user', 'guest'] as const
type Role = typeof roles[number]
```

`as const` 的价值是让字面量信息尽可能被保留下来，而不是被扩大成普通 `string[]`。

#### 7. 条件类型和 `infer`

这是很多中级前端和高级前端拉开差距的点。

##### 7.1 条件类型

```ts
type MessageOf<T> = T extends { message: unknown } ? T['message'] : never
```

语义是：如果 `T` 满足某结构，就返回对应类型，否则返回 `never`。

##### 7.2 `infer`

`infer` 用来在条件类型中“声明一个待推断的类型变量”。

```ts
type ReturnTypeOf<T>
  = T extends (...args: any[]) => infer R ? R : never

type Result = ReturnTypeOf<() => Promise<string>>
// Promise<string>
```

你可以把它理解成：在匹配一个类型模式时，把里面某部分提取出来。

##### 7.3 分布式条件类型

```ts
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// string[] | number[]
```

当条件类型作用在联合类型上时，通常会对联合成员逐个分发处理。这就是很多工具类型看起来“神奇”的原因之一。

#### 8. 映射类型和模板字面量类型

##### 8.1 映射类型

映射类型的本质是：**遍历一个键集合，再生成一个新类型。**

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type MyPartial<T> = {
  [K in keyof T]?: T[K]
}
```

这也是 `Readonly<T>`、`Partial<T>` 这类工具类型的来源。

##### 8.2 模板字面量类型

```ts
type EventName<T extends string> = `on${Capitalize<T>}`

type UserEvent = EventName<'click' | 'change'>
// 'onClick' | 'onChange'
```

这类能力在以下场景很有价值：

- 事件名约束
- 路由名约束
- 表单字段路径
- 组件 props 组合

##### 8.3 key remapping

```ts
type PrefixKeys<T> = {
  [K in keyof T as `app_${string & K}`]: T[K]
}
```

这说明映射类型不只是“复制一份结构”，还可以重命名键。

#### 9. 判别联合是业务建模利器

在前端项目里，很多状态本质上都适合用判别联合建模。

```ts
type FetchResult<T>
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: string }
```

这样做的好处：

- 各状态下可访问字段更明确
- 组件渲染分支更安全
- 更容易做穷尽检查

比起 `data?: T; error?: string; loading: boolean` 这种松散结构，判别联合通常更稳。

#### 10. 工具类型要会用，更要知道为什么

常用工具类型包括：

- `Partial<T>`
- `Required<T>`
- `Readonly<T>`
- `Pick<T, K>`
- `Omit<T, K>`
- `Record<K, V>`
- `Exclude<T, U>`
- `Extract<T, U>`
- `NonNullable<T>`
- `ReturnType<T>`
- `Parameters<T>`

不要只会背名字。更好的准备方式是理解它们背后的三类思路：

1. 通过 `keyof` 和映射类型重塑对象结构
2. 通过条件类型过滤联合成员
3. 通过 `infer` 提取函数或容器内部类型

#### 11. 真实项目里的类型设计重点

##### 11.1 优先让类型可推断

比起把每个地方都手写得很满，更好的设计通常是：

- 函数签名能推断参数和返回值
- hooks 能保留调用方传入的信息
- 组件 API 不要求用户写多余泛型

如果一个 API 每次都要调用方手工补很多类型，通常说明设计还不够好。

##### 11.2 不要滥用断言

```ts
const user = response as User
```

这类写法在很多项目里都存在，但它只是“告诉编译器相信我”，并没有真的验证返回值结构。

更稳的做法是：

- 先用 `unknown`
- 再做运行时校验
- 最后缩小成目标类型

##### 11.3 前后端边界要分层

推荐分清：

- 接口原始类型 `ApiUser`
- 前端域模型 `User`
- 表单模型 `UserFormValues`
- 展示层派生类型

不要让“一份后端 DTO 类型”直接贯穿所有前端层级，否则后期会很僵硬。

##### 11.4 严格模式是值得开的

如果没有 `strict`，很多类型安全收益会被显著削弱。

高级面试里可以顺手提到这些常见配置价值：

- `strict`
- `noImplicitAny`
- `strictNullChecks`
- `noUncheckedIndexedAccess`

#### 12. 当前仓库里暴露出的 TypeScript 特征

这个仓库里已经有少量 `.ts` 练习文件，比如 `js-of-30-days/no3/implementation1.ts`，但整体上还没有形成完整的 TypeScript 进阶专题，更多还是“给 JS 加注解”的层次。

如果要往高级前端面试方向补，这一块应该继续加强：

- 用 TS 重写更多手写题和工具函数
- 为复杂返回值、状态流、事件模型建立类型约束
- 训练“通过类型生成类型”的能力，而不是只写接口

#### 13. 高频面试题

##### 13.1 `any` 和 `unknown` 的区别是什么

`any` 基本等于退出类型系统，什么都能做；`unknown` 代表“我现在不知道具体类型”，使用前必须先缩小范围，所以更安全。

##### 13.2 `type` 和 `interface` 怎么选

描述对象契约时通常优先 `interface`；表达联合、交叉、条件、映射、模板字面量这类类型变换时通常优先 `type`。

##### 13.3 为什么很多高级类型最终都离不开 `keyof`、条件类型和 `infer`

因为复杂类型设计本质上就是三件事：拿到键集合、按条件筛选、从结构里提取某部分类型。

##### 13.4 为什么说 TypeScript 不能替代运行时校验

因为 TypeScript 在编译后会被擦除，运行时拿到的网络数据、URL 参数、localStorage 数据依然可能不可信。

##### 13.5 判别联合适合解决什么问题

它特别适合建模“有限状态集合”，比如请求状态、组件模式、表单步骤、弹窗状态，因为每个分支都有清晰字段边界。

#### 14. 面试回答建议

被问 TypeScript 时，不要从“基本类型有哪些”开场。更稳的结构是：

1. 先说 TypeScript 解决什么问题，以及它的边界
2. 再说类型缩小、泛型、`keyof`、条件类型这些核心机制
3. 再讲判别联合或工具类型怎样落到真实业务建模
4. 最后补一条经验：怎样避免 `any` 泛滥、怎样设计更好推断的 API

这样答案才会从“会用 TypeScript”升级成“会用类型系统设计前端代码”。
