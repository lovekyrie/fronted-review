# Day 30 Vue track / trigger / effect

## 今日目标

- 读 `@vue/reactivity` 的 `effect.ts`（源码或 mini 实现）
- 画一张依赖收集 + 触发更新的完整流程图
- 输出 `activeEffect / effectStack / targetMap / depsMap / dep` 的关系图

## 按顺序阅读

1. [响应式原理](../advanced/week3/reactivity)

## 实操与自测

**检查点**

- `activeEffect` 是个全局变量，effect 嵌套时需要**栈结构**恢复
- `targetMap: WeakMap<object, depsMap>`、`depsMap: Map<key, dep>`、`dep: Set<effect>`
- `trigger` 要先把 set 拷贝成数组再遍历，防止遍历中 effect 增删导致死循环

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week3/reactivity#day-30-知识补充)
- 动手示例 — [参考章节](../advanced/week3/reactivity#day-30-动手示例)

**脱稿口述题**

- 1. 依赖收集的数据结构为什么是 `WeakMap<obj, Map<key, Set<effect>>>`？
- 2. effect 嵌套时为什么需要栈？

**录音练习**

1. track 流程（2 分钟）
2. trigger 流程（1.5 分钟）
3. effect 栈 + cleanup（1.5 分钟）

## 复盘

1. 最容易被追问：依赖不是存在 Proxy 上，而是存在全局 `targetMap` 里，Proxy 只是拦截读写入口。
2. 当前短板：cleanup 的意义要能讲清楚，尤其是条件分支依赖切换时为什么要清旧依赖。
3. 下一次补充：接到 Day31，说明 trigger 后为什么组件更新通常不会立即同步 patch DOM。
