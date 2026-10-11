# Day 48 React 19 新特性

## 今日目标

- 看完 React 19 官方 What's New + useOptimistic / useActionState / Actions
- 输出 React 19 新特性速记卡：Actions / useOptimistic / useActionState / use / ref as prop
- 思考这些新特性如何改变你现有项目的写法

## 按顺序阅读

1. [React 19 新特性](../framework/react/react19-features)

## 实操与自测

**检查点**

- Actions 打通了表单提交、异步请求、状态更新、乐观 UI 的一条龙
- `useOptimistic` 是**临时状态**，服务端失败会回滚
- `use` 可以在 render 里直接读 Promise / Context，是 RSC 的基础

**先独立完成，再对照专题**

- React 19 新 API 清单 — [参考章节](../framework/react/react19-features#day-48-react-19-新-api-清单)
- Actions 概念 — [参考章节](../framework/react/react19-features#day-48-actions-概念)
- useActionState — [参考章节](../framework/react/react19-features#day-48-useactionstate)
- useOptimistic — [参考章节](../framework/react/react19-features#day-48-useoptimistic)
- use — [参考章节](../framework/react/react19-features#day-48-use)
- ref as prop（去 forwardRef） — [参考章节](../framework/react/react19-features#day-48-ref-as-prop-去-forwardref)
- 表单 + useActionState + useOptimistic 完整示例 — [参考章节](../framework/react/react19-features#day-48-表单-useactionstate-useoptimistic-完整示例)

**脱稿口述题**

- 1. Actions 解决了什么以前很麻烦的事？
- 2. useOptimistic 和普通乐观更新手写有什么不同？

**录音练习**

按这个顺序录，不要临场重新组织：

1. React 19 新 API 总览（6 个关键变化快速过一遍）（1 分钟）
2. Actions + useActionState（表单提交场景 + isPending + 错误处理）（2 分钟）
3. useOptimistic + use（乐观更新自动回滚 + render 内读 Promise）（2 分钟）

录完后自查：

- 是否说出 Actions 自动管理 pending / error / optimistic。
- 是否说出 useOptimistic 自动回滚。
- 是否说出 `use` 可以在条件语句中调用。
- 是否说出 ref as prop 去掉了 forwardRef。

## 复盘

今天最需要回补的 3 个点：

1. `useFormStatus` 的使用场景和限制（只能在 form 的子组件中使用）。
2. `use` 读 Promise 时 Suspense 的交互（如何避免瀑布流请求）。
3. React 19 和 Server Actions 的关系（`"use server"` 标记的函数如何和 Actions 配合）。
