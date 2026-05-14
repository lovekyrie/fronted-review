# Day 33 Vue 2 vs Vue 3 响应式对比 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 33 | Vue 2 vs 3 | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 对照 Vue 2 `Observer / Dep / Watcher` 和 Vue 3 `reactive / dep / effect` 架构
- 输出一张迁移常见问题清单（数组 / 新增属性 / Set Map 支持 / 深响应时机 / 性能）
- 能讲清 Vue 2 的 `Vue.set` 为什么存在、Vue 3 为什么不需要

## 阅读卡点

- Vue 2 `Object.defineProperty` 的两大限制：不能监听新增/删除、不能监听数组索引
- Vue 2 重写 7 个数组方法绕开索引问题，Vue 3 用 Proxy 天然支持
- Vue 3 响应式是**按需**生成的（懒代理），对大对象更友好

## 速记卡 / 知识点

### Vue 2 vs Vue 3 响应式角色对照

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

## 手写 / 流程图

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

## 口述题

### 1. Vue 3 响应式比 Vue 2 解决了哪些具体问题？

> 回答模板：Vue 3 主要解决的是 Vue 2 `Object.defineProperty` 覆盖范围不完整的问题。Vue 2 只能劫持初始化时已有的属性，所以新增属性、删除属性不能天然触发更新，数组索引和 `length` 也不好处理，只能通过 `Vue.set` 和重写数组方法补齐。Vue 3 用 Proxy 代理整个对象，可以拦截 `get/set/has/deleteProperty/ownKeys` 等操作，对新增、删除、遍历、数组和集合类型支持更完整。另一个变化是 Vue 3 可以按需代理深层对象，不需要初始化时递归处理整棵对象树。再加上 `ReactiveEffect` 和 scheduler，computed、watch、组件更新都能共用更统一的响应式基础。

### 2. Vue 2 里为什么有 `Vue.set` / `$set`？

> 回答模板：因为 Vue 2 的响应式是通过 `Object.defineProperty` 给已有属性定义 getter/setter。初始化时不存在的属性没有被包装，所以后面直接写 `obj.age = 18`，这个新属性没有响应式 getter/setter，自然不会触发依赖更新。`Vue.set(obj, 'age', 18)` 的作用就是在运行时给这个新 key 补上响应式定义，并手动通知依赖更新。Vue 3 使用 Proxy 后，新增属性本身会进入 `set` trap，所以不再需要这个 API。

## 5 分钟录音顺序

1. Vue 2 响应式架构（2 分钟）
2. Vue 2 的痛点（1.5 分钟）
3. Vue 3 如何解决（1.5 分钟）

## 今日复盘

1. 最容易被追问：Vue 3 不是简单“性能比 Vue 2 好”，而是响应式可拦截操作范围更完整，架构也更统一。
2. 当前短板：数组部分不能只说 Proxy 天然支持，要知道 Vue 仍然对数组方法、length、索引依赖做了特殊处理。
3. 下一次补充：接到 Day34，进入模板编译，把响应式触发后的 render function 和 vnode 链路讲清楚。
