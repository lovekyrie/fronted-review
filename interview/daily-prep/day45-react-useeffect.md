# Day 45 useEffect 陷阱与 Strict Mode 双执行 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 45 | useEffect 陷阱 | [Week 4 Hooks](../advanced/week4/hooks)、[React Hooks](../framework/react/hooks) |

## 今日目标

- 看完 React useEffect 官方文档（重点“Specifying reactive dependencies”）
- 输出 useEffect 三大坑清单：依赖不全 / cleanup 漏写 / 对象/函数引用不稳
- 解释 Strict Mode 双执行的目的：帮你发现**不幂等**的 effect

## 阅读卡点

- 所有在 effect 内读取的响应式值都应进入依赖数组；用 `useEffectEvent`（React 19）隔离不想触发的
- cleanup 的目的是“让每次 effect 执行像第一次”，常用于订阅 / 定时器 / 竞态请求
- Strict Mode 双 mount 用于发现你忘写的 cleanup

## 速记卡 / 知识点

### useEffect 执行时机

```text
组件 render → DOM 更新 → 浏览器绘制 → useEffect 异步执行
                                      ↑ 不阻塞绘制

对比 useLayoutEffect:
组件 render → DOM 更新 → useLayoutEffect 同步执行 → 浏览器绘制
                         ↑ 阻塞绘制
```

### cleanup 执行时机

1. **组件卸载时**：执行 cleanup。
2. **依赖变化时**：先执行**旧 effect 的 cleanup**，再执行**新 effect**。
3. 顺序：旧 cleanup → 新 effect。

### 三大坑清单

| 坑 | 表现 | 修复 |
|----|------|------|
| 依赖不全 | effect 内读了 state/props 但没加到 deps | 把所有响应式值加入 deps，或用 `useEffectEvent` |
| cleanup 漏写 | 订阅/定时器/请求没清理 → 内存泄漏/竞态 | return cleanup 函数 |
| 对象/函数引用不稳 | 每次 render 创建新对象/函数 → effect 无限执行 | `useMemo` / `useCallback` 稳定引用 |

### Strict Mode 双执行

- **仅开发模式**下，React 会 mount → unmount → mount 组件。
- 目的：暴露**不幂等**的 effect（如 cleanup 没写、重复订阅、重复请求）。
- 如果你的 effect 正确写了 cleanup，双执行不会有副作用。

## 手写 / 流程图

### 竞态请求处理

```jsx
useEffect(() => {
  const controller = new AbortController()
  
  async function fetchData() {
    try {
      const res = await fetch(`/api/user/${id}`, {
        signal: controller.signal
      })
      const data = await res.json()
      setUser(data)  // 只有未取消才设值
    } catch (e) {
      if (e.name !== 'AbortError') throw e
    }
  }
  
  fetchData()
  
  return () => controller.abort()  // 依赖变化时取消上一次请求
}, [id])
```

### 不稳定引用的坑

```jsx
// ❌ 每次 render 都创建新对象 → effect 无限执行
useEffect(() => {
  fetch('/api', { headers: { token } })
}, [{ token }])  // 每次都是新引用！

// ✅ 用 useMemo 稳定引用
const headers = useMemo(() => ({ token }), [token])
useEffect(() => {
  fetch('/api', { headers })
}, [headers])
```

### useEffect vs useLayoutEffect

```jsx
// useEffect: 异步，不阻塞绘制。适合大多数场景
useEffect(() => {
  document.title = `Count: ${count}`
}, [count])

// useLayoutEffect: 同步，阻塞绘制。适合读/写 DOM 布局
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  // 基于 rect 调整位置，避免闪烁
}, [])
```

## 口述题

### 1. useEffect 的 cleanup 到底在什么时候执行？

回答模板：

> 两个时机。第一，组件**卸载**时执行 cleanup。第二，依赖变化导致 effect **重新执行前**，先执行旧 effect 的 cleanup，再执行新 effect。
>
> 这个设计的目的是让每次 effect 的执行环境都是"干净的"。比如订阅了某个 id 的 WebSocket，id 变化时要先取消旧订阅，再建新订阅。如果不写 cleanup，就会同时存在多个订阅，造成内存泄漏和数据错乱。
>
> 一个记忆口诀：cleanup 清理的是"上一次"的副作用，为"这一次"腾出干净的环境。

### 2. 为什么 Strict Mode 要双执行？它暴露了什么？

回答模板：

> Strict Mode 在开发模式下会让组件 mount → unmount → mount，effect 也会执行两次。目的是暴露不幂等的副作用：如果你的 effect 正确写了 cleanup（取消订阅、清除定时器、abort 请求），双执行后状态应该和执行一次完全一样。
>
> 如果双执行后出现了 bug（重复请求、重复订阅、DOM 多了一份内容），说明你的 cleanup 有问题。这在 Concurrent 模式下尤其重要，因为 React 可能在渲染过程中中断并重新开始，effect 必须是幂等的。
>
> 生产环境不会双执行，所以不影响线上性能。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. useEffect 时机（异步，DOM 更新后浏览器绘制后）+ 和 useLayoutEffect 区别（2 分钟）
2. 三大坑（依赖不全 / cleanup 漏写 / 引用不稳）+ 竞态请求修复（2 分钟）
3. Strict Mode 双执行目的 + 幂等性要求（1 分钟）

录完后自查：

- 是否说出 cleanup 在"依赖变化前"和"卸载时"执行。
- 是否说出竞态请求用 AbortController 处理。
- 是否说出 Strict Mode 暴露不幂等 effect。
- 是否说出 useLayoutEffect 阻塞绘制、适合 DOM 读写。

## 今日复盘

今天最需要回补的 3 个点：

1. `useEffectEvent`（React 19 实验）的用法：隔离不想触发 effect 的值。
2. effect 内异步函数的写法（不能直接 async，要包一层）。
3. `useInsertionEffect` 的适用场景（CSS-in-JS 库注入样式）。
