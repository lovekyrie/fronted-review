# Day 30 Vue track / trigger / effect 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 30 | track / trigger | [响应式原理](../advanced/week3/reactivity) |

## 今日目标

- 读 `@vue/reactivity` 的 `effect.ts`（源码或 mini 实现）
- 画一张依赖收集 + 触发更新的完整流程图
- 输出 `activeEffect / effectStack / targetMap / depsMap / dep` 的关系图

## 阅读卡点

- `activeEffect` 是个全局变量，effect 嵌套时需要**栈结构**恢复
- `targetMap: WeakMap<object, depsMap>`、`depsMap: Map<key, dep>`、`dep: Set<effect>`
- `trigger` 要先把 set 拷贝成数组再遍历，防止遍历中 effect 增删导致死循环

## 速记卡 / 知识点

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

## 手写 / 流程图

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

## 口述题

### 1. 依赖收集的数据结构为什么是 `WeakMap<obj, Map<key, Set<effect>>>`？

> 回答模板：这套结构正好对应“哪个对象的哪个属性被哪些副作用依赖”。第一层用 `WeakMap`，key 是原始对象，这样对象不再被使用时不会因为依赖表被强引用而无法回收。第二层用 `Map`，key 是具体属性，能做到属性级依赖收集，避免对象任意字段变化都触发所有 effect。第三层用 `Set` 存 effect，是为了去重，同一个 effect 多次读取同一属性也只收集一次。这个结构让 Vue 可以在读取时建立精准关系，在写入时只触发真正相关的副作用。

### 2. effect 嵌套时为什么需要栈？

> 回答模板：因为 `activeEffect` 是一个全局当前指针，普通 effect 执行时它指向当前 effect 就够了。但如果 effect 里又执行了另一个 effect，内层会覆盖 `activeEffect`。内层结束后，如果不恢复外层 effect，后续读取的依赖就会被错误收集到内层 effect 上。栈结构可以在进入 effect 时 push，执行结束后 pop，并恢复上一个 effect。这样嵌套场景下，父 effect 和子 effect 的依赖边界才不会混乱。

## 5 分钟录音顺序

1. track 流程（2 分钟）
2. trigger 流程（1.5 分钟）
3. effect 栈 + cleanup（1.5 分钟）

## 今日复盘

1. 最容易被追问：依赖不是存在 Proxy 上，而是存在全局 `targetMap` 里，Proxy 只是拦截读写入口。
2. 当前短板：cleanup 的意义要能讲清楚，尤其是条件分支依赖切换时为什么要清旧依赖。
3. 下一次补充：接到 Day31，说明 trigger 后为什么组件更新通常不会立即同步 patch DOM。
