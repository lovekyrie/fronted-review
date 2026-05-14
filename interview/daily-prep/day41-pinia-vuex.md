# Day 41 Pinia / Vuex 状态管理 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 41 | Pinia / Vuex | [Vue 状态管理](../framework/vue/state-management) |

## 今日目标

- 看完 `/framework/vue/state-management`
- 输出 Pinia vs Vuex 对比表：API 形态、模块化、TypeScript 友好度、devtools
- 画一张状态分层图：local / global / server cache（React Query / SWR 思路）

## 阅读卡点

- Pinia 天然支持组合式 API，不再需要 mutations
- 大型应用的状态分层：组件内 state / 全局 store / 服务端状态缓存 / URL 状态
- 持久化要区分“同步 localStorage”还是“异步 IndexedDB”

## 速记卡 / 知识点

### Pinia vs Vuex 对比

| 维度 | Pinia | Vuex |
|------|-------|------|
| API | `defineStore` | `new Vuex.Store` |
| mutations | ❌ 不需要 | ✅ 必须通过 mutations 修改 |
| TypeScript | 天然友好 | 需要额外类型声明 |
| 模块化 | 每个 store 独立，按需导入 | 全局单 store + modules |
| devtools | ✅ 支持 | ✅ 支持 |
| 组合式 API | ✅ setup store | ❌ |
| 体积 | ~1KB | ~10KB |

### Pinia 两种 store 写法

```ts
// 1. Options Store
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (state) => state.count * 2 },
  actions: { increment() { this.count++ } }
})

// 2. Setup Store（推荐）
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
```

### 状态分层架构

| 层级 | 存储位置 | 示例 |
|------|----------|------|
| 组件状态 | `ref / reactive` | 表单输入、UI 开关 |
| 全局状态 | Pinia store | 用户信息、权限、主题 |
| 服务端缓存 | TanStack Query / SWR | API 数据、列表、分页 |
| URL 状态 | 路由 query/params | 搜索条件、页码、tab |
| 持久状态 | localStorage / IndexedDB | token、用户偏好 |

### 持久化方案

```ts
// pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)

defineStore('user', {
  state: () => ({ token: '' }),
  persist: true  // 默认 localStorage
})
```

## 手写 / 流程图

### Pinia 核心原理简示

```text
defineStore('id', setup)
  → 创建一个 reactive store 对象
  → 注册到 pinia 实例（app.use(pinia)）
  → 组件调用 useStore() → 从 pinia._stores 取已有 / 新建
  → store 内部的 ref/reactive 自动被追踪
  → 组件 render 时收集依赖，数据变化时更新
```

### Vuex 数据流

```text
Component → dispatch(action) → commit(mutation) → state 变化 → 组件更新
                 ↓
           可以异步               必须同步
```

## 口述题

### 1. 为什么 Pinia 取代了 Vuex？

回答模板：

> 三个核心原因。第一，Pinia 去掉了 mutations，action 可以直接修改 state，减少了样板代码。Vuex 强制 mutation 同步修改的设计在实际开发中增加了大量冗余代码。
>
> 第二，Pinia 对 TypeScript 的支持是天然的，store 的 state、getters、actions 都有完整类型推导。Vuex 需要额外写大量类型声明。
>
> 第三，Pinia 的模块化更自然，每个 store 是独立文件，按需导入，不存在 Vuex 的全局单 store + nested modules 的复杂结构。而且 Setup Store 写法和组件的 Composition API 完全一致，学习成本低。

### 2. 状态分层怎么讲得像"架构设计"而不是"调库"？

回答模板：

> 我会按状态的生命周期和职责来分层。组件内的 UI 状态（表单、折叠面板）用 `ref`，不需要全局化。跨组件共享的业务状态（用户信息、权限）放 Pinia store。服务端数据用 TanStack Query 这类库管理，它处理缓存、去重、自动刷新，不该混进 Pinia。URL 相关的状态（搜索条件、分页）放在路由 query 里，这样用户可以分享链接。需要跨会话持久化的（token、偏好）用 localStorage + persist 插件。
>
> 这样每层职责清晰：改 UI 不碰 store，改缓存不碰路由。面试时这么讲，面试官会觉得你有架构意识，而不是"什么数据都往 Vuex 里塞"。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Pinia 三大优势（去 mutations / TS 友好 / 模块化）（1.5 分钟）
2. 两种 store 写法 + Vuex 迁移要点（1.5 分钟）
3. 状态分层五层架构（组件/全局/服务端缓存/URL/持久化）（2 分钟）

录完后自查：

- 是否说出 Pinia 去掉 mutations 的原因。
- 是否说出 Setup Store 的写法和优势。
- 是否说出状态分层至少 4 层。
- 是否说出持久化方案（localStorage vs IndexedDB）。

## 今日复盘

今天最需要回补的 3 个点：

1. `storeToRefs` 的用途（解构 store 时保持响应性）。
2. Pinia 插件系统（如何写自定义插件做日志、持久化等）。
3. 服务端状态 vs 客户端状态的边界划分在实际项目中的应用。
