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

<!-- 三件套使用准则 / 何时不该用 / 引用稳定的 4 类场景 -->

## 手写 / 流程图

```jsx
// 反例：memo 包了但依赖里传了新对象，每次都重新渲染
// 正例：useMemo 稳定引用 + memo 子组件
```

## 口述题

### 1. useMemo 是不是越多越好？

> 回答模板：

### 2. React.memo 在什么情况下会失效？

> 回答模板：

## 5 分钟录音顺序

1. 三件套本质（1.5 分钟）
2. 常见失效场景（2 分钟）
3. Compiler 方向 + 心智模型变化（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
