# Day 29 Vue 3 Proxy / Reflect 与响应式入口 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 29 | Proxy / Reflect | [响应式原理](../advanced/week3/reactivity)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 看完 Vue Reactivity in Depth、`/framework/vue/reactivity`
- 输出 Proxy 13 个 trap 速记卡，标注响应式常用的 4 个：`get / set / has / deleteProperty`
- 对比 Vue 2 `Object.defineProperty` 和 Vue 3 Proxy 的差异

## 阅读卡点

- `Reflect` 的作用不只是“调用默认行为”，还有让 `this` 正确指向 receiver 的副作用
- Proxy 对数组索引 / length 的代理不是“天生”能用，Vue 3 做了特殊处理
- 只有访问到的属性才会触发 getter，深响应是“按需”生成的

## 速记卡 / 知识点

<!-- Proxy trap 列表 / Reflect 作用 / 响应式入口 reactive / shallowReactive / readonly -->

## 手写 / 流程图

```js
function reactive(target) {
  return new Proxy(target, {
    get(t, k, r) { track(t, k); return Reflect.get(t, k, r) },
    set(t, k, v, r) { const ok = Reflect.set(t, k, v, r); trigger(t, k); return ok }
  })
}
```

## 口述题

### 1. Vue 3 为什么换成 Proxy？

> 回答模板：

### 2. 为什么 Proxy 的 handler 里要用 Reflect 而不是直接 `target[key]`？

> 回答模板：

## 5 分钟录音顺序

1. Proxy 13 trap + 常用 4 个（2 分钟）
2. Reflect 与 receiver（1.5 分钟）
3. Vue 2 vs Vue 3 响应式差异（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
