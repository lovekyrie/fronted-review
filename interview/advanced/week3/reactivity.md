### Vue 3 响应式原理

高级前端面试里，Vue 响应式不能只停在“数据变了视图自动更新”。更好的回答方式是把它拆成一条链路：

`reactive/ref 创建响应式数据 -> 读取时 track 收集依赖 -> 修改时 trigger 触发依赖 -> scheduler 调度副作用 -> 组件 render effect 重新执行 -> 虚拟 DOM diff 并 patch`

这条链路能解释大部分追问：为什么 `computed` 有缓存、为什么 `watch` 适合副作用、为什么 DOM 更新不是同步立刻发生、为什么 Vue 3 不再需要 `Vue.set`。

#### 1. Vue 2 和 Vue 3 的响应式差异

##### 1.1 Vue 2：`Object.defineProperty`

Vue 2 的核心是递归遍历对象属性，用 `Object.defineProperty` 劫持 getter / setter。

这个方案能工作，但有几个天然限制：

- 初始化时就要递归处理已有属性
- 新增属性和删除属性无法天然被拦截
- 数组索引和 `length` 修改不好处理，需要重写数组方法
- `Map`、`Set` 这类集合类型支持很弱

所以 Vue 2 才会有 `Vue.set`、数组方法重写等历史包袱。

##### 1.2 Vue 3：`Proxy`

Vue 3 改成基于 `Proxy` 代理整个对象。

它能拦截的不只是属性读写，还包括：

- `get`
- `set`
- `has`
- `deleteProperty`
- `ownKeys`
- `Map` / `Set` 的读取、写入、遍历

这带来的直接变化是：

- 新增属性可以触发更新
- 删除属性可以触发更新
- 数组索引和 `length` 更容易处理
- 集合类型也能进入响应式系统
- 不需要像 Vue 2 那样启动时完整递归劫持所有属性

面试里不要只说“Vue 3 用 Proxy 性能更好”。更准确的说法是：**Proxy 扩大了可拦截操作的范围，响应式语义更完整，很多 Vue 2 的特殊补丁不再需要。**

#### 2. Vue 3 响应式的核心数据结构

Vue 3 的依赖关系可以理解成三层映射：

```ts
WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>
```

也就是：

```text
targetMap
  -> target 原始对象
    -> key 被访问的属性
      -> dep 依赖这个属性的副作用集合
```

一个简化版本大概是这样：

```ts
const targetMap = new WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>()

function track(target: object, key: PropertyKey) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

function trigger(target: object, key: PropertyKey) {
  const depsMap = targetMap.get(target)
  const dep = depsMap?.get(key)

  dep?.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    }
    else {
      effect.run()
    }
  })
}
```

这里有几个关键点：

- `WeakMap` 的 key 是原始对象，方便对象被释放时一起被 GC
- `Map` 的 key 是具体属性，保证依赖粒度可以细到属性级
- `Set` 用来去重，同一个 effect 不会在同一个依赖集合里重复出现
- `trigger` 不一定立即执行 effect，它可能交给 scheduler 调度

#### 3. `reactive`、`ref` 和浅层响应式

##### 3.1 `reactive`

`reactive` 适合对象、数组、`Map`、`Set` 这类结构化数据。

```ts
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: {
    name: 'Alice',
  },
})

state.count++
state.user.name = 'Bob'
```

使用 `reactive` 时要注意两个问题。

第一，不能随意替换整个响应式对象引用：

```ts
let state = reactive({ count: 0 })

state = reactive({ count: 1 }) // 原来依赖 state 的地方不会自动跟着换引用
```

第二，直接解构会丢失响应式连接：

```ts
const state = reactive({ count: 0 })
const { count } = state

state.count++
console.log(count) // 仍然是旧值
```

如果需要解构，通常用 `toRefs` 或 `toRef` 保留连接。

##### 3.2 `ref`

`ref` 本质上是把值包成带 `.value` 的响应式对象。

```ts
import { ref } from 'vue'

const count = ref(0)

count.value++
```

它常用于：

- 基础类型
- 需要整体替换的对象
- 组合式函数的返回值

模板里会自动解包 `ref`，但在 JavaScript / TypeScript 里仍然要通过 `.value` 访问。

##### 3.3 `shallowRef` 和 `shallowReactive`

浅层响应式只追踪第一层。

```ts
import { shallowRef } from 'vue'

const user = shallowRef({
  name: 'Alice',
})

user.value.name = 'Bob' // 不触发更新
user.value = { name: 'Tom' } // 触发更新
```

它适合：

- 大型不可变数据
- 第三方库实例
- 不希望 Vue 深度代理的对象
- 只关心根引用变化的场景

高级面试里可以补一句：**不是所有对象都应该被深度响应式代理。对外部实例、大对象和不可变数据，浅层响应式或 `markRaw` 往往更合适。**

#### 4. `track` 和 `trigger` 到底追踪什么

Vue 3 不只是追踪“读了某个属性”。不同操作会对应不同的依赖类型。

##### 4.1 普通属性

```ts
effect(() => {
  console.log(state.count)
})

state.count++
```

读取 `state.count` 时会收集 `count` 这个 key；修改 `state.count` 时会触发这个 key 对应的 effect。

##### 4.2 新增和删除属性

```ts
effect(() => {
  console.log(Object.keys(state))
})

state.age = 18
delete state.name
```

这里 effect 依赖的不是某个具体值，而是对象的 key 集合。Vue 内部会用类似 `ITERATE_KEY` 的特殊 key 追踪遍历依赖。

所以新增、删除属性时，除了触发具体 key，也要触发遍历相关依赖。

##### 4.3 数组

数组复杂在两个地方：

- 读取索引依赖具体 index
- 遍历或访问长度依赖 `length`

例如：

```ts
effect(() => {
  console.log(list.length)
})

list.push(1)
```

`push` 不只是新增了某个索引，还改变了 `length`，因此依赖 `length` 的 effect 也要重新执行。

##### 4.4 `Map` 和 `Set`

集合类型会涉及 `get`、`set`、`add`、`delete`、`forEach`、迭代器等操作。

```ts
const map = reactive(new Map<string, number>())

effect(() => {
  console.log(map.size)
})

map.set('count', 1)
```

`map.size` 依赖的是集合结构变化，而不是某个普通属性。Vue 3 对集合类型有专门的代理逻辑，这也是 `Proxy` 相比 `Object.defineProperty` 更适合现代响应式系统的原因之一。

#### 5. `ReactiveEffect` 和 effect 栈

响应式系统里真正被收集的不是组件，也不是函数本身，而是 `ReactiveEffect`。

可以把它理解成一个可被收集、可被调度、可被停止的副作用包装器。

```ts
class ReactiveEffect {
  active = true
  deps: Set<ReactiveEffect>[] = []

  constructor(
    public fn: () => unknown,
    public scheduler?: () => void,
  ) {}

  run() {
    if (!this.active) return this.fn()

    effectStack.push(this)
    activeEffect = this

    const result = this.fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    return result
  }

  stop() {
    if (!this.active) return

    this.deps.forEach(dep => dep.delete(this))
    this.deps.length = 0
    this.active = false
  }
}
```

```ts
const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined
```

真实实现会更复杂，因为要处理：

- 嵌套 effect
- 依赖清理
- 防止重复收集
- 防止递归触发
- effect 停止后的依赖释放

##### 5.1 为什么需要 effect 栈

如果 effect 可以嵌套，只用一个 `activeEffect` 会被覆盖。

```ts
effect(() => {
  effect(() => {
    console.log(state.inner)
  })

  console.log(state.outer)
})
```

因此 Vue 内部需要维护 effect 栈，进入 effect 时压栈，执行完再恢复上一个 effect。

##### 5.2 为什么要清理依赖

依赖不是只增不减的。

```ts
effect(() => {
  if (state.visible) {
    console.log(state.name)
  }
  else {
    console.log(state.age)
  }
})
```

当 `visible` 从 `true` 变成 `false` 后，这个 effect 应该依赖 `age`，不应该继续依赖 `name`。所以每次 effect 重新执行前，都要清理旧依赖，再收集新依赖。

#### 6. 调度器：为什么数据变了 DOM 不一定立刻变

很多面试会追问：修改响应式数据后，DOM 是同步更新的吗？

答案是：**响应式依赖会被同步触发，但组件更新通常会进入异步队列，被批量刷新。**

##### 6.1 组件更新本质是 render effect

组件渲染可以简化理解成：

```ts
effect(
  () => {
    const vnode = render()
    patch(prevVNode, vnode)
  },
  {
    scheduler: queueJob,
  },
)
```

组件渲染函数执行时读取响应式数据，读取过程会 `track`。当数据变化时，`trigger` 找到组件的 render effect，但不会每次都马上重新渲染，而是交给 scheduler。

##### 6.2 为什么要批量更新

```ts
state.count++
state.count++
state.count++
```

如果每次修改都立刻 patch DOM，会产生很多无意义的中间状态。Vue 会把同一个组件的更新任务放进队列并去重，在同一轮微任务里统一刷新。

这就是为什么下面代码里，立即读取 DOM 可能还是旧值：

```ts
count.value++

await nextTick()
// 这里再读取 DOM，才能拿到更新后的结果
```

##### 6.3 `flush` 时机

`watch` 和 `watchEffect` 可以通过 `flush` 控制回调执行时机：

- `pre`：默认值，组件 DOM 更新前执行
- `post`：组件 DOM 更新后执行，适合读取更新后的 DOM
- `sync`：同步执行，通常慎用，容易失去批量更新收益

```ts
watch(
  count,
  () => {
    console.log(el.value?.textContent)
  },
  { flush: 'post' },
)
```

高级回答里要把这点和 `nextTick` 串起来：**Vue 的调度队列通常基于微任务刷新，`nextTick` 等的是本轮更新队列完成，而不是让数据变响应式。**

#### 7. `computed` 的实现重点

`computed` 不是普通函数缓存。它本质上是一个懒执行的 effect。

##### 7.1 懒执行和缓存

```ts
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
```

核心机制可以简化成：

```ts
function computed(getter) {
  let value
  let dirty = true

  const effect = new ReactiveEffect(getter, () => {
    if (!dirty) {
      dirty = true
      trigger(obj, 'value')
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effect.run()
        dirty = false
      }

      track(obj, 'value')
      return value
    },
  }

  return obj
}
```

这段逻辑解释了三个问题：

- 第一次读取 `.value` 才会执行 getter
- 依赖没变时，多次读取直接返回缓存
- 依赖变化时，不是马上重新计算，而是先把 `dirty` 标记为 `true`

##### 7.2 `computed` 为什么可以继续被依赖

组件里使用 `computed`：

```ts
const total = computed(() => price.value * count.value)
```

模板读取 `total` 时，组件 render effect 会依赖 `total.value`。当 `price` 或 `count` 变化时，`computed` 内部 effect 先被标记为 dirty，再触发依赖 `total.value` 的外层 effect 更新。

所以它有两层依赖：

- `computed getter` 依赖原始响应式数据
- 使用 `computed.value` 的地方依赖这个 computed ref

##### 7.3 `computed` 的使用边界

`computed` 适合描述“由已有状态推导出的值”。

适合：

- 过滤、排序、聚合
- class / style 派生
- 表单展示值
- 权限、状态、UI 分支判断

不适合：

- 发请求
- 写 localStorage
- 修改其他响应式状态
- 操作 DOM
- 发送埋点

这些属于副作用，应该放在 `watch` 或事件处理里。

#### 8. `watch` 和 `watchEffect`

`watch` 与 `computed` 最大的区别是：`computed` 负责派生值，`watch` 负责副作用。

##### 8.1 `watch`

`watch` 的特点是来源明确、默认懒执行。

```ts
watch(
  () => props.userId,
  async (userId, oldUserId, onCleanup) => {
    const controller = new AbortController()

    onCleanup(() => {
      controller.abort()
    })

    await fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    })
  },
  { immediate: true },
)
```

它适合：

- 监听某个明确的数据源
- 根据参数变化发请求
- 同步外部状态
- 处理需要旧值和新值对比的逻辑

##### 8.2 `watchEffect`

`watchEffect` 会立即执行，并自动收集同步执行期间读取到的响应式依赖。

```ts
watchEffect(() => {
  console.log(user.value.name)
  console.log(route.params.id)
})
```

它适合依赖来源比较分散、但副作用逻辑比较直接的场景。

需要注意：`watchEffect` 只会自动收集同步阶段读取到的依赖。异步函数里 `await` 后再读取的响应式数据，不一定会被追踪到。

```ts
watchEffect(async () => {
  console.log(query.value) // 会被追踪

  await fetch('/api')

  console.log(page.value) // 不应依赖这种隐式追踪
})
```

##### 8.3 `watch`、`watchEffect`、`computed` 怎么选

- 需要一个可缓存的派生值：用 `computed`
- 需要监听明确来源并执行副作用：用 `watch`
- 需要自动收集多个依赖并执行副作用：用 `watchEffect`
- 需要读取更新后的 DOM：`watch` 配合 `flush: 'post'`
- 需要取消上一次异步任务：使用 `onCleanup`

#### 9. 深度监听和性能

`watch` 监听对象时，最容易踩坑的是深度监听。

```ts
watch(
  () => state.user,
  () => {
    // 只在 state.user 引用变化时触发
  },
)
```

如果要监听内部属性变化，需要：

```ts
watch(
  () => state.user.name,
  () => {
    // 只关心 name
  },
)
```

或者：

```ts
watch(
  () => state.user,
  () => {
    // 深度遍历 user 里的属性
  },
  { deep: true },
)
```

`deep: true` 的本质是递归遍历对象，让内部属性都被读取，从而完成依赖收集。对象越大，遍历成本越高。

所以高级面试里可以这样回答：**能监听具体字段就不要默认深度监听；深度监听不是魔法，而是用遍历换依赖收集。**

#### 10. 响应式和组件更新的完整链路

可以用一个例子串起来：

```ts
const count = ref(0)
const double = computed(() => count.value * 2)

watch(count, (value) => {
  console.log('count changed:', value)
})
```

模板里使用：

```vue
<template>
  <div>{{ double }}</div>
</template>
```

当执行 `count.value++` 时：

1. `ref` 的 setter 触发 `trigger`
2. 依赖 `count.value` 的 `computed` effect 被调度，标记 `dirty`
3. 依赖 `count.value` 的 `watch` job 被加入调度队列
4. 依赖 `double.value` 的组件 render effect 被加入更新队列
5. 同一轮更新中任务被去重并按顺序刷新
6. render 重新读取 `double.value`
7. `computed` 发现 `dirty`，重新计算并缓存
8. 生成新 vnode，执行 diff 和 patch
9. `nextTick` 之后可以读取更新后的 DOM

这比“数据变了页面变了”更接近高级面试需要的回答。

#### 11. 常见高级追问

##### 11.1 Vue 3 为什么不需要 `Vue.set`

因为 `Proxy` 可以拦截新增属性的 `set` 操作。Vue 2 的 `Object.defineProperty` 只能劫持已有属性，所以新增属性需要 `Vue.set` 手动补响应式。

##### 11.2 为什么 `computed` 有缓存，方法没有缓存

`computed` 内部有懒执行 effect 和 `dirty` 标记。依赖不变时读取 `.value` 会直接返回上次结果。

方法只是普通函数，模板重新渲染时调用一次就执行一次，没有依赖级缓存。

##### 11.3 为什么 `watch` 适合副作用

因为 `watch` 的目标不是产生一个值，而是在响应式数据变化后执行外部动作，比如请求、缓存写入、日志、DOM 访问、第三方实例同步。

##### 11.4 `watchEffect` 和 `watch` 的区别

`watch` 显式指定监听来源，能拿到新旧值，默认懒执行。

`watchEffect` 自动收集同步执行期间读取到的依赖，会立即执行，但依赖来源没有 `watch` 直观。

##### 11.5 DOM 更新为什么要等 `nextTick`

数据变化会触发依赖，但组件渲染更新通常会进入 scheduler 队列。Vue 会在微任务中批量刷新更新任务，避免同一轮多次状态变更导致多次 DOM patch。

`nextTick` 等的是这批更新任务完成。

##### 11.6 `reactive` 解构为什么会丢响应式

`reactive` 的响应式依赖来自代理对象的 getter。直接解构得到的是普通值，后续访问不再经过代理对象，自然无法继续 track。

要保留连接，可以使用 `toRef` 或 `toRefs`。

##### 11.7 深度响应式一定好吗

不一定。深度代理会让嵌套对象也进入响应式系统，适合普通业务状态；但对于大型数据、不可变数据、类实例、第三方库对象，深度代理可能增加成本或破坏对象语义。

这时可以考虑 `shallowRef`、`shallowReactive`、`markRaw`。

#### 12. 面试回答模板

如果面试官问“Vue 3 响应式原理”，可以按这个顺序回答：

1. Vue 3 用 `Proxy` 创建响应式代理，读取属性时进入 `track`，修改属性时进入 `trigger`
2. 依赖关系存在 `WeakMap -> Map -> Set` 结构里，粒度可以细到对象的某个 key
3. 被收集的依赖是 `ReactiveEffect`，组件渲染、`computed`、`watch` 都可以建立在 effect 之上
4. `trigger` 后不一定马上执行副作用，组件更新通常通过 scheduler 进入队列，批量去重后在微任务中刷新
5. `computed` 是懒执行 effect，通过 `dirty` 标记实现缓存和失效
6. `watch` / `watchEffect` 主要用于副作用，区别在于监听来源是否显式、是否默认立即执行、是否需要新旧值
7. 相比 Vue 2，Vue 3 能天然处理新增属性、删除属性、数组索引、`Map` / `Set`，不再需要 `Vue.set`

这样回答既有主链路，也能承接后续追问。

## 每日练习参考

### Day 29：Proxy 常用 trap

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

### Day 29：补充笔记

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

### Day 30：知识补充

- Vue 3 响应式依赖结构可以概括成：`WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>`。
- `WeakMap` 的 key 是原始对象，避免对象已经不可达时还被依赖表强引用，利于 GC。
- `Map` 的 key 是具体属性，保证依赖粒度细到属性级，而不是对象任意字段变化都全量触发。
- `Set` 存 effect，天然去重，避免同一个 effect 被重复收集到同一个依赖集合。
- `activeEffect` 表示当前正在执行的副作用；只有 effect 执行期间读取响应式数据，才会被 track。
- effect 嵌套时需要 `effectStack`，子 effect 执行完要恢复父 effect，否则依赖会被收集到错误 effect 上。
- `track` 做的是“读取时建立关系”：target -> key -> activeEffect。
- `trigger` 做的是“写入时找到关系并执行”：target -> key -> effects；如果 effect 有 scheduler，就交给 scheduler。
- cleanup 的作用是清理旧依赖，避免条件分支切换后 effect 仍然订阅已经不再读取的属性。
- `trigger` 遍历 dep 前通常要复制一份集合，避免 effect 执行过程中重新收集或删除依赖导致死循环。

### Day 30：动手示例

```text
reactive.get → track(target, key) → depsMap[key].add(activeEffect)
reactive.set → trigger(target, key) → [...dep].forEach(run)
```

```js
const targetMap = new WeakMap()
let activeEffect
const effectStack = []

function effect(fn, options = {}) {
  const runner = () => {
    cleanup(runner)
    activeEffect = runner
    effectStack.push(runner)
    const result = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return result
  }

  runner.deps = []
  runner.scheduler = options.scheduler
  runner()
  return runner
}

function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, depsMap = new Map())

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, dep = new Set())

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap?.get(key)
  if (!dep) return

  const effects = new Set(dep)
  effects.forEach((effect) => {
    if (effect.scheduler) effect.scheduler(effect)
    else effect()
  })
}

function cleanup(effect) {
  effect.deps.forEach(dep => dep.delete(effect))
  effect.deps.length = 0
}
```

```text
effect 执行
  -> activeEffect = 当前 effect
  -> render / fn 读取 state.count
  -> proxy get
  -> track(state, 'count')
  -> targetMap[state]['count'].add(activeEffect)

state.count++
  -> proxy set
  -> trigger(state, 'count')
  -> 找到 dep
  -> scheduler(effect) 或 effect()
```

### Day 31：知识补充

- 响应式的 `trigger` 是同步发生的，但组件 DOM 更新通常会进入 scheduler 队列异步批量执行。
- scheduler 的核心价值是合并同一轮事件循环内的多次状态变更，避免中间状态反复 render 和 patch。
- `queueJob` 会把组件更新 job 放进队列，并用去重逻辑保证同一个 job 在一次 flush 中只执行一次。
- Vue 通过微任务触发 flush，常见理解是基于 `Promise.resolve().then(flushJobs)`。
- 组件更新 job 会按 id 排序，父组件通常先创建、id 更小，所以父组件先更新；这能避免子组件先更新后又被父组件卸载。
- `nextTick` 等的是当前 scheduler flush 对应的 promise，因此在 `await nextTick()` 后通常能读到 patch 后的 DOM。
- `flush: 'pre'` 的 watcher 在组件 DOM 更新前执行，适合基于状态做前置副作用。
- `flush: 'post'` 的 watcher 在组件 DOM 更新后执行，适合读取更新后的 DOM。
- `flush: 'sync'` 会同步执行，不走批量队列，适合极少数需要立即响应的场景，但容易造成重复触发。
- scheduler 不是让响应式变异步，而是让“副作用执行 / 组件更新”可调度。

### Day 31：动手示例

```text
setState × 3 → queueJob 去重 → microtask flush → 执行 job → flushPost → nextTick 解决
```

```js
const queue = []
let isFlushing = false
let currentFlushPromise

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush() {
  if (isFlushing) return
  currentFlushPromise = Promise.resolve().then(flushJobs)
}

function flushJobs() {
  isFlushing = true
  queue.sort((a, b) => a.id - b.id)

  try {
    for (const job of queue) job()
  }
  finally {
    queue.length = 0
    isFlushing = false
    currentFlushPromise = null
  }
}

function nextTick(fn) {
  const p = currentFlushPromise || Promise.resolve()
  return fn ? p.then(fn) : p
}
```

```text
count.value++
count.value++
count.value++
  -> trigger 3 次
  -> queueJob(renderEffect) 3 次
  -> 队列只保留 1 个组件更新 job
  -> 本轮同步代码结束
  -> 微任务 flushJobs
  -> render -> patch DOM
  -> await nextTick() 后读取最新 DOM
```

### Day 32：4 API 对照表

| API | 适合场景 | 响应边界 | 常见坑 |
|-----|----------|----------|--------|
| `ref` | 基础值、需要整体替换的对象、组合式函数返回值 | 通过 `.value` 追踪 | JS 中忘记 `.value`，解构后丢连接 |
| `reactive` | 表单、状态对象、数组、Map/Set 等结构化数据 | 通过代理对象 getter/setter 追踪 | 直接解构、整体替换引用 |
| `computed` | 由已有状态派生出的可缓存值 | 内部是懒执行 effect + dirty 缓存 | getter 有副作用，或用方法代替导致重复计算 |
| `watch` | 监听明确来源后执行副作用 | source 变化后调回调，可拿新旧值 | 误用深度监听，忘记 cleanup |
| `watchEffect` | 依赖分散但副作用简单 | 自动收集同步执行期间读取的依赖 | `await` 后读取的依赖不可靠，来源不够显式 |

- `ref` 本质是带 `.value` 的响应式包装，基础类型必须通过对象包装才能被 getter/setter 追踪。
- `reactive` 返回的是代理对象，响应式连接来自“访问代理对象”；直接解构得到普通值后不再经过代理。
- `toRef` / `toRefs` 可以把 `reactive` 的属性转成 ref，保留和源对象的响应式连接。
- `computed` 适合纯派生值，例如过滤、排序、聚合、class/style、权限展示；不要在 computed 里发请求、写缓存、改 DOM。
- `computed` 第一次被读取才执行 getter，依赖没变时复用缓存，依赖变化时先标记 dirty。
- `watch` 适合明确来源和副作用，例如请求、埋点、同步 localStorage、调用第三方实例。
- `watchEffect` 会立即执行并自动收集依赖，但可读性不如 `watch` 显式，复杂场景更建议明确 source。
- `deep: true` 的本质是递归读取内部属性来完成依赖收集，大对象上成本高，能监听具体字段就不要深度监听。

### Day 32：响应丢失 3 种典型场景

```js
// 1. reactive 直接解构
const state = reactive({ count: 0 })
const { count } = state // count 是普通值

// 2. watch 传入普通值
watch(state.count, () => {}) // 错，应该传 getter 或 ref
watch(() => state.count, () => {})

// 3. 替换 reactive 引用
let form = reactive({ name: 'A' })
form = reactive({ name: 'B' }) // 原依赖不会自动指向新代理
```

### Day 32：补充笔记

```js
function ref(value) {
  const r = {
    get value() {
      track(r, 'value')
      return value
    },
    set value(next) {
      if (next !== value) {
        value = next
        trigger(r, 'value')
      }
    },
  }

  return r
}

function computed(getter) {
  let value
  let dirty = true

  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        trigger(obj, 'value')
      }
    },
  })

  const obj = {
    get value() {
      if (dirty) {
        value = runner()
        dirty = false
      }

      track(obj, 'value')
      return value
    },
  }

  return obj
}
```

```text
count.value++
  -> ref setter trigger count.value
  -> computed 内部 effect 标记 dirty
  -> 使用 computed.value 的 render effect 入队
  -> render 重新读取 computed.value
  -> dirty 为 true，重新计算并缓存
```

### Day 33：Vue 2 vs Vue 3 响应式角色对照

| 维度 | Vue 2 | Vue 3 |
|------|-------|-------|
| 代理方式 | `Object.defineProperty` 劫持已有属性 | `Proxy` 代理整个对象 |
| 数据观测 | `Observer` 递归 walk 对象 | `reactive` 按需创建代理 |
| 依赖容器 | `Dep` | `dep: Set<ReactiveEffect>` |
| 副作用 | `Watcher` | `ReactiveEffect` |
| 依赖收集 | getter 中 `dep.depend()` | Proxy get 中 `track()` |
| 触发更新 | setter 中 `dep.notify()` | Proxy set/delete 中 `trigger()` |
| 新增属性 | 需要 `Vue.set` | 普通赋值即可触发 |
| 删除属性 | 需要 `Vue.delete` | `deleteProperty` 可拦截 |
| 数组 | 重写 7 个变异方法 | Proxy 拦截索引、length，并做数组特殊处理 |
| Map/Set | 支持弱 | 有专门集合代理逻辑 |

- Vue 2 初始化时会递归遍历对象已有 key，把每个 key 转成 getter/setter；对象越深，初始化成本越明显。
- Vue 3 的深响应是懒代理：读取到深层对象时才把它转成 reactive。
- Vue 2 无法天然感知新增/删除属性，因为新增 key 没有提前被 `defineProperty` 包装。
- Vue 2 对数组索引和 `length` 处理困难，所以重写 `push/pop/shift/unshift/splice/sort/reverse`。
- Vue 3 不等于“完全不用处理数组”，只是 Proxy 让索引、length、遍历等操作更容易进入统一响应式系统。
- Vue 3 的 `effect` 可以被 scheduler 调度，所以组件更新、computed、watch 都能统一建立在 effect 之上。
- 迁移时最明显变化：不再需要 `Vue.set`，但仍要注意 reactive 解构丢响应、ref `.value`、watch source 写法。

### Day 33：补充笔记

```text
Vue 2:

data
  -> Observer.walk(data)
  -> defineReactive(obj, key)
  -> getter: Dep.depend() 收集 Watcher
  -> setter: Dep.notify() 通知 Watcher
  -> Watcher.update()
  -> render / patch

限制：
  新增 key 没有 getter/setter
  delete 不会触发 setter
  数组索引和 length 不好拦截
```

```text
Vue 3:

state
  -> reactive(state) 返回 Proxy
  -> get: track(target, key)
  -> set/delete/has/ownKeys: trigger(target, key, type)
  -> ReactiveEffect / scheduler
  -> render effect 入队
  -> render / patch

优势：
  新增、删除、遍历、数组、Map/Set 都能进入代理语义
  深层对象按需代理
```

### Day 38：依赖收集数据结构

```text
targetMap: WeakMap<target, Map<key, Set<ReactiveEffect>>>

WeakMap {
  target → Map {
    'count' → Set [ effect1, effect2 ]
    'name'  → Set [ effect3 ]
  }
}
```

- **WeakMap**：key 是原始对象，不影响 GC。
- **Map**：key→deps 的映射。
- **Set**：去重的 effect 集合。

### Day 38：五件套关系图

```text
reactive(obj)  → Proxy → get 时 track / set 时 trigger
ref(val)       → { _value, get value() → track, set value() → trigger }
effect(fn)     → 创建 ReactiveEffect → 立即执行 fn → 访问响应数据 → 收集依赖
computed(fn)   → 惰性 effect + dirty 标志 + 缓存值
watch(source, cb) → effect + scheduler 里调 cb
```

### Day 38：实现要点

| 模块 | 核心 | 易错点 |
|------|------|--------|
| `reactive` | Proxy get/set | 嵌套对象递归代理、已代理对象去重 |
| `ref` | 类实例 + get/set | 自动 unwrap、和 reactive 互操作 |
| `effect` | activeEffect + effectStack | 嵌套 effect 时 activeEffect 混乱 |
| `computed` | dirty + lazy effect | 必须让访问者也能收到 trigger |
| `watch` | effect + scheduler | oldValue / newValue 对比、immediate |

### Day 38：reactive + effect + computed 核心实现

```js
const targetMap = new WeakMap()
let activeEffect = null
const effectStack = []

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
  activeEffect.deps.push(deps) // 反向记录，用于 cleanup
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  const effectsToRun = new Set(deps) // 避免无限循环
  effectsToRun.forEach(effect => {
    if (effect.scheduler) effect.scheduler()
    else effect.run()
  })
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      return typeof result === 'object' && result !== null ? reactive(result) : result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) trigger(target, key)
      return result
    }
  })
}

class ReactiveEffect {
  constructor(fn, scheduler) {
    this.fn = fn
    this.scheduler = scheduler
    this.deps = []
  }
  run() {
    cleanup(this) // 清除旧依赖
    activeEffect = this
    effectStack.push(this)
    const result = this.fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return result
  }
}

function cleanup(effect) {
  effect.deps.forEach(dep => dep.delete(effect))
  effect.deps.length = 0
}

function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  if (!options.lazy) _effect.run()
  return _effect
}

function computed(getter) {
  let dirty = true, value
  const _effect = effect(getter, {
    lazy: true,
    scheduler() { dirty = true; trigger(obj, 'value') }
  })
  const obj = {
    get value() {
      track(obj, 'value')
      if (dirty) { value = _effect.run(); dirty = false }
      return value
    }
  }
  return obj
}
```
