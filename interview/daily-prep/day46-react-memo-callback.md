# Day 46 useMemo / useCallback / React.memo 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 46 | memo / callback | [React 性能优化](../framework/react/performance-optimization)、[Week 4 Hooks](../advanced/week4/hooks) |

## 今日目标

- 看完 React 官方 useMemo / useCallback / memo
- 输出三件套的**错用场景**：到处包 memo、依赖数组写错、被包对象还是新引用
- 结合 React 19 的 compiler 预告，讲“为什么未来可能不需要手动 memo”

## 阅读卡点

- `memo` 只做浅比较；props 里有对象 / 函数 / 数组时经常失效
- `useMemo` 是缓存**值**，`useCallback` 是缓存**函数引用**，两者本质一样
- React Compiler（未来）会自动插入 memo 逻辑，但目前线上仍需手写

## 速记卡 / 知识点

### 三件套本质

| API | 缓存什么 | 本质 |
|-----|----------|------|
| `useMemo(fn, deps)` | 缓存**计算结果** | deps 不变则返回上次结果 |
| `useCallback(fn, deps)` | 缓存**函数引用** | 等价于 `useMemo(() => fn, deps)` |
| `React.memo(Comp)` | 缓存**组件渲染** | props 浅比较不变则跳过 re-render |

### 使用准则

**该用的场景：**
- 传给 `memo` 子组件的 props（函数/对象）需要稳定引用。
- 计算量大的派生值（排序、过滤大数组）用 `useMemo`。
- 作为 `useEffect` 依赖的对象/函数需要稳定引用。

**不该用的场景：**
- 简单运算（`a + b`）不需要 `useMemo`，缓存本身有开销。
- 组件渲染很轻的情况，`memo` 的比较成本可能高于直接 re-render。
- 到处无脑包 memo 会增加代码复杂度，降低可读性。

### 引用稳定的 4 类需求

1. 传给 `memo` 子组件的 callback → `useCallback`
2. 传给 `memo` 子组件的对象/数组 → `useMemo`
3. `useEffect` 的依赖是对象/函数 → `useMemo` / `useCallback`
4. 第三方库（如 react-query 的 queryKey）需要稳定引用 → `useMemo`

### React Compiler（未来）

React Compiler 会在编译阶段自动分析组件，插入等价于 `useMemo / useCallback / memo` 的优化，开发者不再需要手写。目前实验阶段，生产项目仍需手动。

## 手写 / 流程图

### 反例：memo 失效

```jsx
const Child = React.memo(({ config }) => {
  console.log('Child render')
  return <div>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ❌ 每次 render 创建新对象，memo 的浅比较永远是 false
  return <Child config={{ name: 'test' }} />
}
```

### 正例：稳定引用

```jsx
const Child = React.memo(({ config, onClick }) => {
  console.log('Child render')
  return <div onClick={onClick}>{config.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  // ✅ useMemo 稳定对象引用
  const config = useMemo(() => ({ name: 'test' }), [])
  // ✅ useCallback 稳定函数引用
  const onClick = useCallback(() => console.log('click'), [])
  return <Child config={config} onClick={onClick} />
}
```

## 口述题

### 1. useMemo 是不是越多越好？

回答模板：

> 不是。useMemo 本身有成本：每次 render 都要比较 deps 数组，缓存也占内存。如果计算本身很轻（比如 `a + b`），useMemo 的开销可能比直接计算还大。
>
> 正确的使用原则是：只在"计算成本高"或"需要稳定引用"时才用。计算成本高的例子是对大数组做排序/过滤。稳定引用的例子是传给 memo 子组件的对象 props，或者作为 useEffect 依赖的对象。
>
> React Compiler 未来会自动处理这些优化，手动 memo 是过渡方案。

### 2. React.memo 在什么情况下会失效？

回答模板：

> 四种常见失效场景。第一，props 传了新对象引用（`{}`、`[]`、`() => {}`），每次 render 都是新引用，浅比较永远是 false。要用 useMemo/useCallback 稳定引用。
>
> 第二，父组件传了 children（`<Child><span/></Child>`），children 也是 props，每次 render 创建新的 React element。第三，组件内自己有 useState / useContext 等 hooks 触发更新，memo 管不了内部状态变化。第四，自定义比较函数写错了（`React.memo(Comp, areEqual)` 的第二个参数逻辑不对）。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 三件套本质（useMemo 缓存值 / useCallback 缓存函数 / memo 缓存渲染）（1.5 分钟）
2. 该用 vs 不该用 + memo 失效四种场景（2 分钟）
3. React Compiler 的方向 + 为什么未来可能不需要手写 memo（1.5 分钟）

录完后自查：

- 是否说出 useCallback 等价于 `useMemo(() => fn, deps)`。
- 是否说出 memo 浅比较 + 新引用会失效。
- 是否说出不是越多 memo 越好，有比较成本。
- 是否提到 React Compiler。

## 今日复盘

今天最需要回补的 3 个点：

1. `React.memo` 的第二个参数 `areEqual(prevProps, nextProps)` 的用法和注意事项。
2. `useCallback` 配合 `useRef` 做"永远最新"的回调模式。
3. React Compiler 的编译策略：如何自动识别需要缓存的值。
