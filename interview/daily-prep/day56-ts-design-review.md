# Day 56 TS 类型设计实战 + 追问复盘 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 56 | 类型设计复盘 | [Week 5 路线图](../advanced/week5/roadmap)、[TS 基础](../advanced/week5/typescript-basic)、[TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 挑一个组件或函数（表单 / 表格 / fetch 封装），用 TS 做类型设计
- 汇总 Day 50–55，形成《TypeScript 方向 15 题答题本》
- 输出“为什么类型设计 ≠ 会写 TS”的答题稿

## 阅读卡点

- 类型设计关注的是**接口使用体验**，不是“能跑”
- 推断 > 显式标注；让调用方不用手动传泛型
- “避免 any” 不是目标，“让错误在调用处而不是内部报出来”才是

## 速记卡 / 知识点

### 类型设计 5 原则

1. **推断优先**：让 TS 自动推断，减少手动标注。函数内部用推断，边界（参数/返回值）加标注。
2. **窄类型优于宽类型**：用 `'success' | 'error'` 而不是 `string`，用 discriminated union 而不是可选属性。
3. **不可能的状态不可表达**：用类型系统排除非法组合（如 loading 和 error 不能同时为 true）。
4. **错误在调用处报出**：泛型约束 + 条件类型让错误信息出现在使用者写代码的地方，而不是库的内部。
5. **最小暴露面**：只导出必要的类型，内部实现类型用 `type` 而不是 `export type`。

### 典型反模式

| 反模式 | 问题 | 修正 |
|--------|------|------|
| 到处 `any` | 失去类型安全 | 用 `unknown` + 缩窄 |
| 过度 `as` 断言 | 欺骗编译器 | 改善类型定义 |
| 可选属性滥用 | 状态不明确 | discriminated union |
| 泛型参数过多 | 调用方困惑 | 利用推断减少参数 |
| 类型和实现分离 | 类型和代码不一致 | `typeof` / `satisfies` 从实现提取 |

### 不可能的状态不可表达

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

## 手写 / 流程图

### 强类型 EventEmitter

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

### 强类型 fetch 封装

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

## 口述题

### 1. 一个好的 TS API 应该长什么样？

回答模板：

> 三个标准。第一，调用方不需要手动传泛型——TS 能从参数自动推断出所有类型。比如 `pick(obj, ['name', 'age'])`，T 和 K 都从参数推断。第二，错误信息在调用处报出——如果传错参数，报错应该指向调用方的代码行，而不是库的内部实现。这需要在泛型约束上做好设计。第三，不可能的用法编译不过——比如只接受特定字符串字面量、禁止传 null、禁止重复 key 等，用类型系统在编译阶段拦截。
>
> 本质上好的 TS API 就是"调用方写着舒服、改着安全"。

### 2. 你用过哪些"能让错误尽早报出来"的技巧？

回答模板：

> 五个。第一，discriminated union 替代可选属性，让非法状态组合在类型层面不可表达。第二，`as const` + 字面量类型缩窄，比如路由配置里让路径是字面量而不是 string。第三，exhaustive check（`assertNever`），新增枚举值时忘处理就编译报错。第四，`satisfies` 操作符（TS 4.9+），既做类型检查又保留字面量推断。第五，泛型约束 + 条件类型，让不合法的参数组合直接在函数签名上报错。

## 8 分钟录音顺序（TS 专题总结）

1. 类型基础（type vs interface / union 缩窄 / as const）（1.5 分钟）
2. 泛型（3 动机 / extends 约束 / 推断方向）（2 分钟）
3. 条件类型 + infer（分发规则 / ReturnType / Awaited 实现）（2 分钟）
4. 映射类型 + 模板字面量（修饰符 / remapping / 路由参数推导）（1.5 分钟）
5. 类型设计 3 原则（推断优先 / 窄类型 / 不可能状态不可表达）（1 分钟）

## 今日复盘

TS 方向最容易被击穿的 3 题：

1. "手写 Omit 类型"——需要说出 Pick + Exclude 的组合，不能只背结果。
2. "分发条件类型什么时候触发？怎么关闭？"——需要说出 naked type parameter + `[]` 包裹。
3. "给一个实际场景设计类型（如 fetch 封装）"——需要现场写出泛型 + 条件类型的完整签名。

本周新增的 3 个"为什么"：

1. 为什么 TS 选择结构类型（structural typing）而不是名义类型（nominal typing）？（和 JS 的鸭子类型一致）
2. 为什么工具类型的底层只需要映射 + 条件 + infer 三种技术？（它们构成了类型层面的图灵完备子集）
3. 为什么"推断优先"是好的 API 设计原则？（减少调用方负担 + 避免类型标注和实际值不一致）
