# Day 32 ref / reactive / computed / watch 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 32 | ref/reactive/computed/watch | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 看完 Vue Computed / Watchers 文档
- 输出 4 个 API 的对照表：用法、响应边界、常见坑
- 手写最小版 `ref` + `computed`

## 阅读卡点

- `ref` 是带 `.value` 的对象包装，解构会丢响应；`reactive` 解构也会丢响应，要 `toRefs`
- `computed` 的懒计算：只有被访问时才 run，且会缓存结果
- `watch` 的 `immediate / deep / flush` 三个选项各自解决什么问题

## 速记卡 / 知识点

### 4 API 对照表

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

### 响应丢失 3 种典型场景

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

## 手写 / 流程图

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

## 口述题

### 1. `ref` 和 `reactive` 怎么选？

> 回答模板：我会先看状态形态和更新方式。基础类型优先用 `ref`，因为基础值没法被 Proxy 直接代理，需要 `.value` 包装。对象如果经常整体替换，比如接口返回的一整块数据，也可以用 `ref` 包起来；如果主要是修改对象内部字段，比如表单、筛选条件、状态对象，就更适合 `reactive`。但 `reactive` 要注意不要直接解构，不要随意替换整个代理引用，需要解构时用 `toRef` 或 `toRefs`。如果是大型不可变数据、第三方实例或不想深度代理的对象，可以考虑 `shallowRef` 或 `markRaw`。

### 2. `computed` 和 `watch` 怎么选？

> 回答模板：`computed` 用来描述派生值，要求 getter 尽量纯，它有缓存和懒计算，依赖不变时多次读取不会重复执行。比如列表过滤、总价、按钮禁用状态、class/style 都适合 computed。`watch` 用来做副作用，不是为了产生一个新值，而是在数据变化后发请求、写缓存、同步外部系统、打点或访问 DOM。如果需要明确监听来源、拿新旧值、做异步 cleanup，就用 `watch`；如果依赖来源很多且逻辑简单，可以用 `watchEffect`，但复杂场景我会优先显式 `watch`。

## 5 分钟录音顺序

1. 4 API 用法边界（2 分钟）
2. 响应丢失 3 种场景（1.5 分钟）
3. computed 懒计算 + 缓存（1.5 分钟）

## 今日复盘

1. 最容易被追问：`computed` 不是普通函数缓存，而是懒执行 effect + dirty 标记 + 对外暴露 `.value` 依赖。
2. 当前短板：`watchEffect` 的自动依赖只覆盖同步阶段，异步 `await` 后的依赖不能随便依赖隐式追踪。
3. 下一次补充：接到 Day33，把这些 API 放回 Vue 2 与 Vue 3 响应式架构差异里对比。
