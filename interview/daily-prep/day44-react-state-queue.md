# Day 44 React state queue 与函数式更新 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 44 | state queue | [Week 4 Hooks](../advanced/week4/hooks)、[React Hooks](../framework/react/hooks) |

## 今日目标

- 看完 React useState / Queueing State Updates
- 做 3 道输出题（连续 `setCount(count + 1)` × 3 vs `setCount(c => c + 1)` × 3）
- 输出 stale state / stale closure 的典型案例 + 修复方式

## 阅读卡点

- `setState` 只是把更新入队，本次 render 内 state 不变
- 直接值更新会用**本次 render 快照**的 state，函数式更新用**队列累积**的 state
- 函数式更新天然能解决“连点 3 次按钮只加 1”的老问题

## 速记卡 / 知识点

### state 更新模型

```text
setState(value) → 创建 Update { action: value } → 入队 fiber.updateQueue
                                                   ↓
                                         本次 render 不变，下次 render 处理队列
```

- React 的 state 在一次 render 内是**快照**，不管调多少次 setState，读到的 state 都是本次 render 的值。
- 更新在下次 render 时才批量处理。

### 直接值 vs 函数式更新

```jsx
// 直接值：用的是本次 render 快照
setCount(count + 1) // count = 0 → 入队 1
setCount(count + 1) // count = 0 → 入队 1
setCount(count + 1) // count = 0 → 入队 1
// 结果：count = 1（最后一个覆盖前面的）

// 函数式：用的是队列累积值
setCount(c => c + 1) // 0 → 1
setCount(c => c + 1) // 1 → 2
setCount(c => c + 1) // 2 → 3
// 结果：count = 3
```

### 队列处理规则

```text
遍历 updateQueue:
  if (update.action 是函数) → newState = action(prevState)
  if (update.action 是值)   → newState = action
```

### stale closure 典型场景

```jsx
function Timer() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      console.log(count)    // 永远是 0！闭包捕获了初始 render 的 count
      setCount(count + 1)   // 永远设 1
    }, 1000)
    return () => clearInterval(id)
  }, [])  // 空依赖 → effect 只执行一次 → 闭包锁死初始值
}
```

修复方式：
1. **函数式更新**：`setCount(c => c + 1)`（最常用）
2. **加依赖**：`[count]`，但每次清除重建定时器
3. **useRef**：把最新值存 ref，effect 内读 ref.current

## 手写 / 流程图

### 3 道经典输出题

```jsx
// 题 1：直接值 × 3
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1) // 0 + 1 = 1
    setCount(count + 1) // 0 + 1 = 1
    setCount(count + 1) // 0 + 1 = 1
  }
  return <button onClick={handleClick}>{count}</button>
  // 点击后 count = 1
}

// 题 2：函数式 × 3
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(c => c + 1) // 0 → 1
    setCount(c => c + 1) // 1 → 2
    setCount(c => c + 1) // 2 → 3
  }
  return <button onClick={handleClick}>{count}</button>
  // 点击后 count = 3
}

// 题 3：混合
function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 5)  // 入队值 5
    setCount(c => c + 1) // 5 → 6
    setCount(42)         // 入队值 42（覆盖）
  }
  return <button onClick={handleClick}>{count}</button>
  // 点击后 count = 42
}
```

## 口述题

### 1. 为什么连续调 3 次 setState 只加了 1？

回答模板：

> 因为 React 的 state 在一次 render 内是快照。当你写 `setCount(count + 1)` 三次时，三次读到的 `count` 都是本次 render 的值（比如 0），所以三次都是 `setCount(0 + 1)`，入队三个值 1，最后覆盖为 1。
>
> 解决方式是用函数式更新 `setCount(c => c + 1)`。函数式更新不读快照，而是拿上一次更新的结果作为参数。三次调用就是 `0→1→2→3`，正确累加。
>
> 本质原因是 React 的"快照心智模型"：每次 render 都有一个独立的 state 快照，事件处理函数闭包捕获的就是这个快照。

### 2. 什么是 stale closure？怎么修？

回答模板：

> stale closure 是指闭包捕获了旧的 render 快照值，后续 state 更新了但闭包里的值没变。最典型的场景是 `useEffect` 里用了 `[]` 空依赖，effect 内的回调永远读到初始 state。
>
> 三种修法。第一，函数式更新 `setCount(c => c + 1)`，不依赖闭包里的 count。第二，把 state 加入依赖数组，让 effect 随 state 变化重新创建。第三，用 `useRef` 把最新值存起来，ref.current 不受闭包限制。实际项目中优先用函数式更新，最干净。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. state 入队模型 + 快照心智模型（1.5 分钟）
2. 直接值 vs 函数式 + 3 道输出题（2 分钟）
3. stale closure 场景 + 三种修法（1.5 分钟）

录完后自查：

- 是否说出 state 在一次 render 内是快照。
- 是否说出直接值用快照、函数式用队列累积值。
- 是否说出 stale closure 的典型场景和修复方式。
- 是否能口算混合题的结果。

## 今日复盘

今天最需要回补的 3 个点：

1. `useReducer` 的更新队列和 `useState` 的关系（useState 底层就是 useReducer）。
2. `useEffectEvent`（React 19）如何隔离不想触发的值。
3. 对象 state 的不可变更新模式（为什么必须展开新对象）。
