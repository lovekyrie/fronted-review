# Day 30 Vue track / trigger / effect 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 30 | track / trigger | [响应式原理](../advanced/week3/reactivity) |

## 今日目标

- 读 `@vue/reactivity` 的 `effect.ts`（源码或 mini 实现）
- 画一张依赖收集 + 触发更新的完整流程图
- 输出 `activeEffect / effectStack / targetMap / depsMap / dep` 的关系图

## 阅读卡点

- `activeEffect` 是个全局变量，effect 嵌套时需要**栈结构**恢复
- `targetMap: WeakMap<object, depsMap>`、`depsMap: Map<key, dep>`、`dep: Set<effect>`
- `trigger` 要先把 set 拷贝成数组再遍历，防止遍历中 effect 增删导致死循环

## 速记卡 / 知识点

<!-- track 流程 / trigger 流程 / effect stack / cleanup 回收依赖 -->

## 手写 / 流程图

```text
reactive.get → track(target, key) → depsMap[key].add(activeEffect)
reactive.set → trigger(target, key) → [...dep].forEach(run)
```

## 口述题

### 1. 依赖收集的数据结构为什么是 `WeakMap<obj, Map<key, Set<effect>>>`？

> 回答模板：

### 2. effect 嵌套时为什么需要栈？

> 回答模板：

## 5 分钟录音顺序

1. track 流程（2 分钟）
2. trigger 流程（1.5 分钟）
3. effect 栈 + cleanup（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
