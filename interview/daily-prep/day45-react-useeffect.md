# Day 45 useEffect 陷阱与 Strict Mode 双执行

## 今日目标

- 看完 React useEffect 官方文档（重点“Specifying reactive dependencies”）
- 输出 useEffect 三大坑清单：依赖不全 / cleanup 漏写 / 对象/函数引用不稳
- 解释 Strict Mode 双执行的目的：帮你发现**不幂等**的 effect

## 按顺序阅读

1. [Week 4 Hooks](../advanced/week4/hooks)
2. [React Hooks](../framework/react/hooks)

## 实操与自测

**检查点**

- 所有在 effect 内读取的响应式值都应进入依赖数组；用 `useEffectEvent`（React 19）隔离不想触发的
- cleanup 的目的是“让每次 effect 执行像第一次”，常用于订阅 / 定时器 / 竞态请求
- Strict Mode 双 mount 用于发现你忘写的 cleanup

**先独立完成，再对照专题**

- useEffect 执行时机 — [参考章节](../advanced/week4/hooks#day-45-useeffect-执行时机)
- cleanup 执行时机 — [参考章节](../advanced/week4/hooks#day-45-cleanup-执行时机)
- 三大坑清单 — [参考章节](../advanced/week4/hooks#day-45-三大坑清单)
- Strict Mode 双执行 — [参考章节](../advanced/week4/hooks#day-45-strict-mode-双执行)
- 竞态请求处理 — [参考章节](../advanced/week4/hooks#day-45-竞态请求处理)
- 不稳定引用的坑 — [参考章节](../advanced/week4/hooks#day-45-不稳定引用的坑)
- useEffect vs useLayoutEffect — [参考章节](../advanced/week4/hooks#day-45-useeffect-vs-uselayouteffect)

**脱稿口述题**

- 1. useEffect 的 cleanup 到底在什么时候执行？
- 2. 为什么 Strict Mode 要双执行？它暴露了什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. useEffect 时机（异步，DOM 更新后浏览器绘制后）+ 和 useLayoutEffect 区别（2 分钟）
2. 三大坑（依赖不全 / cleanup 漏写 / 引用不稳）+ 竞态请求修复（2 分钟）
3. Strict Mode 双执行目的 + 幂等性要求（1 分钟）

录完后自查：

- 是否说出 cleanup 在"依赖变化前"和"卸载时"执行。
- 是否说出竞态请求用 AbortController 处理。
- 是否说出 Strict Mode 暴露不幂等 effect。
- 是否说出 useLayoutEffect 阻塞绘制、适合 DOM 读写。

## 复盘

今天最需要回补的 3 个点：

1. `useEffectEvent`（React 19 实验）的用法：隔离不想触发 effect 的值。
2. effect 内异步函数的写法（不能直接 async，要包一层）。
3. `useInsertionEffect` 的适用场景（CSS-in-JS 库注入样式）。
