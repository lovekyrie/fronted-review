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
