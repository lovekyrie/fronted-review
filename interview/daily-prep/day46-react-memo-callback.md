# Day 46 useMemo / useCallback / React.memo

## 今日目标

- 看完 React 官方 useMemo / useCallback / memo
- 输出三件套的**错用场景**：到处包 memo、依赖数组写错、被包对象还是新引用
- 结合 React 19 的 compiler 预告，讲“为什么未来可能不需要手动 memo”

## 按顺序阅读

1. [React 性能优化](../framework/react/performance-optimization)
2. [Week 4 Hooks](../advanced/week4/hooks)

## 实操与自测

**检查点**

- `memo` 只做浅比较；props 里有对象 / 函数 / 数组时经常失效
- `useMemo` 是缓存**值**，`useCallback` 是缓存**函数引用**，两者本质一样
- React Compiler（未来）会自动插入 memo 逻辑，但目前线上仍需手写

**先独立完成，再对照专题**

- 三件套本质 — [参考章节](../framework/react/performance-optimization#day-46-三件套本质)
- 使用准则 — [参考章节](../framework/react/performance-optimization#day-46-使用准则)
- 引用稳定的 4 类需求 — [参考章节](../framework/react/performance-optimization#day-46-引用稳定的-4-类需求)
- React Compiler（未来） — [参考章节](../framework/react/performance-optimization#day-46-react-compiler-未来)
- 反例：memo 失效 — [参考章节](../framework/react/performance-optimization#day-46-反例-memo-失效)
- 正例：稳定引用 — [参考章节](../framework/react/performance-optimization#day-46-正例-稳定引用)

**脱稿口述题**

- 1. useMemo 是不是越多越好？
- 2. React.memo 在什么情况下会失效？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 三件套本质（useMemo 缓存值 / useCallback 缓存函数 / memo 缓存渲染）（1.5 分钟）
2. 该用 vs 不该用 + memo 失效四种场景（2 分钟）
3. React Compiler 的方向 + 为什么未来可能不需要手写 memo（1.5 分钟）

录完后自查：

- 是否说出 useCallback 等价于 `useMemo(() => fn, deps)`。
- 是否说出 memo 浅比较 + 新引用会失效。
- 是否说出不是越多 memo 越好，有比较成本。
- 是否提到 React Compiler。

## 复盘

今天最需要回补的 3 个点：

1. `React.memo` 的第二个参数 `areEqual(prevProps, nextProps)` 的用法和注意事项。
2. `useCallback` 配合 `useRef` 做"永远最新"的回调模式。
3. React Compiler 的编译策略：如何自动识别需要缓存的值。
