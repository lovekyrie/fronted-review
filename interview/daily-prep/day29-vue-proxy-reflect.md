# Day 29 Vue 3 Proxy / Reflect 与响应式入口 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 29 | Proxy / Reflect | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 看完 Vue Reactivity in Depth、`/framework/vue/reactivity`
- 输出 Proxy 13 个 trap 速记卡，标注响应式常用的 4 个：`get / set / has / deleteProperty`
- 对比 Vue 2 `Object.defineProperty` 和 Vue 3 Proxy 的差异

## 阅读卡点

- `Reflect` 的作用不只是“调用默认行为”，还有让 `this` 正确指向 receiver 的副作用
- Proxy 对数组索引 / length 的代理不是“天生”能用，Vue 3 做了特殊处理
- 只有访问到的属性才会触发 getter，深响应是“按需”生成的

## 速记卡 / 知识点

### Proxy 常用 trap

| trap | 触发场景 | 响应式意义 |
|------|----------|------------|
| `get` | 读取属性：`state.count` | 收集依赖，按需把深层对象转成响应式 |
| `set` | 写入属性：`state.count = 1` | 判断新增/修改，触发对应依赖 |
| `has` | `key in state` | 追踪 `in` 操作依赖 |
| `deleteProperty` | `delete state.name` | 删除属性后触发更新 |
| `ownKeys` | `Object.keys(state)` / `for...in` | 追踪对象 key 集合变化 |

- Vue 3 用 Proxy 代理整个对象，能拦截新增属性、删除属性、数组索引、`length`、`Map/Set` 等更多操作。
- Vue 2 用 `Object.defineProperty` 劫持已有属性，新属性和删除属性不能天然触发，所以才需要 `Vue.set` 这类补丁。
- Proxy 的深响应不是初始化时把所有层级递归代理完，而是在 `get` 时按需把子对象转成 reactive。
- `reactive` 适合对象、数组、`Map`、`Set`；`ref` 适合基础值或需要整体替换的值；`shallowReactive/shallowRef` 只追踪第一层。
- `readonly` 也是基于代理，只允许读取和依赖收集，不允许写入；常用于暴露只读状态。
- `Reflect.get(target, key, receiver)` 不只是默认读取，还能让 getter 里的 `this` 指向代理对象，保证嵌套依赖继续被收集。
- `Reflect.set` 会返回布尔值，符合 Proxy `set` trap 的返回约定；直接 `target[key] = value` 容易丢掉默认语义。
- 不要把“Proxy 性能更好”当作唯一结论，更准确的是：Proxy 让响应式语义更完整，初始化成本也更可控。

## 手写 / 流程图

```js
function reactive(target) {
  return new Proxy(target, {
    get(t, k, r) {
      track(t, k)
      const value = Reflect.get(t, k, r)
      return isObject(value) ? reactive(value) : value
    },
    set(t, k, v, r) {
      const oldValue = t[k]
      const hadKey = Object.prototype.hasOwnProperty.call(t, k)
      const ok = Reflect.set(t, k, v, r)

      if (!hadKey) trigger(t, k, 'add')
      else if (oldValue !== v) trigger(t, k, 'set')

      return ok
    },
    deleteProperty(t, k) {
      const hadKey = Object.prototype.hasOwnProperty.call(t, k)
      const ok = Reflect.deleteProperty(t, k)
      if (hadKey && ok) trigger(t, k, 'delete')
      return ok
    },
  })
}
```

```text
读取 state.user.name
  -> get(state, 'user')：track user，返回 reactive(user)
  -> get(user, 'name')：track name

修改 state.user.name
  -> set(user, 'name')
  -> trigger(user, 'name')
  -> 触发依赖这个字段的 effect / component update
```

## 口述题

### 1. Vue 3 为什么换成 Proxy？

> 回答模板：Vue 2 的 `Object.defineProperty` 是劫持已有属性的 getter/setter，所以初始化时要递归处理已有 key，新增属性、删除属性、数组索引和 `length` 都不是天然可拦截的，需要 `Vue.set`、数组方法重写等补丁。Vue 3 换成 Proxy 后是代理整个对象，可以拦截 `get/set/has/deleteProperty/ownKeys` 等更多操作，对新增、删除、遍历、数组、`Map/Set` 的语义支持更完整。同时深层对象可以在读取时按需代理，不必一开始把整棵对象树全部递归处理。面试里我不会只说“性能更好”，而会强调它解决的是响应式覆盖范围和语义完整性。

### 2. 为什么 Proxy 的 handler 里要用 Reflect 而不是直接 `target[key]`？

> 回答模板：`Reflect` 可以理解为对对象默认操作的标准化调用。`Reflect.get(target, key, receiver)` 保留了原始读取语义，并且会把 `receiver` 传给 getter，让 getter 里的 `this` 指向代理对象，而不是原始对象。这样 getter 内部再访问其他属性时，依然能走代理并完成依赖收集。`Reflect.set` 也会返回布尔值，符合 Proxy `set` trap 的约定。直接写 `target[key]` 或 `target[key] = value` 在简单场景能跑，但在访问器属性、继承、只读失败等场景会破坏默认语义。

## 5 分钟录音顺序

1. Proxy 13 trap + 常用 4 个（2 分钟）
2. Reflect 与 receiver（1.5 分钟）
3. Vue 2 vs Vue 3 响应式差异（1.5 分钟）

## 今日复盘

1. 最容易被追问：Proxy 不是“自动让所有事情变响应式”，数组和集合类型仍然需要 Vue 做专门代理逻辑。
2. 当前短板：要能把 `get/set/has/deleteProperty/ownKeys` 分别对应到读取、写入、`in`、删除、遍历依赖。
3. 下一次补充：接到 Day30，说明 Proxy 触发的 `track/trigger` 具体把依赖存到哪里。
