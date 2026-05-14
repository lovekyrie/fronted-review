# Day 38 手写 mini-vue reactivity 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 38 | mini-vue reactivity | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 在仓库 `hand-write/` 下新建一个 mini-vue-reactivity 目录（或更新 `vue-book/reactive-system`）
- 实现 `reactive / ref / effect / computed / watch` 五件套
- 写 3 个测试用例：基础响应 / 嵌套 effect / computed 缓存

## 阅读卡点

- 必须实现 `effectStack` 才能处理嵌套 effect
- `cleanup` 是优化点，每次 run 前先把自己从 deps 里清掉，再重新收集
- `computed` 用 `dirty` 标志 + 惰性求值，必须让访问者能收到它的 trigger

## 速记卡 / 知识点

### 依赖收集数据结构

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

### 五件套关系图

```text
reactive(obj)  → Proxy → get 时 track / set 时 trigger
ref(val)       → { _value, get value() → track, set value() → trigger }
effect(fn)     → 创建 ReactiveEffect → 立即执行 fn → 访问响应数据 → 收集依赖
computed(fn)   → 惰性 effect + dirty 标志 + 缓存值
watch(source, cb) → effect + scheduler 里调 cb
```

### 实现要点

| 模块 | 核心 | 易错点 |
|------|------|--------|
| `reactive` | Proxy get/set | 嵌套对象递归代理、已代理对象去重 |
| `ref` | 类实例 + get/set | 自动 unwrap、和 reactive 互操作 |
| `effect` | activeEffect + effectStack | 嵌套 effect 时 activeEffect 混乱 |
| `computed` | dirty + lazy effect | 必须让访问者也能收到 trigger |
| `watch` | effect + scheduler | oldValue / newValue 对比、immediate |

## 手写 / 流程图

### reactive + effect + computed 核心实现

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

## 口述题

### 1. 你手写 mini-vue 时踩过哪些坑？

回答模板：

> 三个典型的坑。第一个是**嵌套 effect**：如果内层 effect 执行完后直接把 `activeEffect` 设为 null，外层 effect 就收集不到依赖了。必须用 `effectStack` 栈来管理。
>
> 第二个是 **cleanup**：如果条件渲染 `flag ? a : b`，当 flag 从 true 变 false 时，a 的依赖应该被清除，否则 a 变化还会触发无关更新。每次 effect.run() 前要先把自己从所有 deps 中移除，再重新收集。
>
> 第三个是 **computed 的 dirty 调度**：computed 是惰性的，getter 不应该立即执行。但当依赖变化时，需要把 dirty 设为 true，并且 trigger 自己的 'value'，让引用 computed 的 effect 知道该更新了。

### 2. 嵌套 effect 为什么需要栈？

回答模板：

> 考虑 `effect(() => { effect(() => { b.value }) ; a.value })`。外层 effect 执行时 `activeEffect` 指向外层。进入内层 effect 时切换成内层。如果内层执行完后直接把 `activeEffect` 设为 null，那外层后续访问 `a.value` 时 `activeEffect` 已经是 null，依赖就收集不到了。
>
> 用栈的方式：进入 effect 前 push，执行完 pop，`activeEffect` 始终指向栈顶，就能正确处理嵌套。Vue 源码里用的也是这个思路。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 五件套关系图 + 数据结构（WeakMap → Map → Set）（2 分钟）
2. 三个踩坑点（嵌套 effect / cleanup / computed dirty）（2 分钟）
3. 和 Vue 源码的差距（调度优先级 / 批量更新 / ref unwrap）（1 分钟）

录完后自查：

- 是否说出 WeakMap → Map → Set 的三层结构。
- 是否说出 effectStack 解决嵌套问题。
- 是否说出 cleanup 解决条件分支的过期依赖。
- 是否说出 computed 的 dirty + scheduler 机制。

## 今日复盘

今天最需要回补的 3 个点：

1. `ref` 的自动 unwrap 在 reactive 内部的处理逻辑。
2. `watch` 的 `immediate / flush: 'post'` 实现差异。
3. 源码中 `triggerEffects` 的排序逻辑（computed effect 优先执行）。
