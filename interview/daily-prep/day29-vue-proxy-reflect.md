# Day 29 Vue 3 Proxy / Reflect 与响应式入口

## 今日目标

- 看完 Vue Reactivity in Depth、`/framework/vue/reactivity`
- 输出 Proxy 13 个 trap 速记卡，标注响应式常用的 4 个：`get / set / has / deleteProperty`
- 对比 Vue 2 `Object.defineProperty` 和 Vue 3 Proxy 的差异

## 按顺序阅读

1. [响应式原理](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## 实操与自测

**检查点**

- `Reflect` 的作用不只是“调用默认行为”，还有让 `this` 正确指向 receiver 的副作用
- Proxy 对数组索引 / length 的代理不是“天生”能用，Vue 3 做了特殊处理
- 只有访问到的属性才会触发 getter，深响应是“按需”生成的

**先独立完成，再对照专题**

- Proxy 常用 trap — [参考章节](../advanced/week3/reactivity#day-29-proxy-常用-trap)
- 补充笔记 — [参考章节](../advanced/week3/reactivity#day-29-补充笔记)

**脱稿口述题**

- 1. Vue 3 为什么换成 Proxy？
- 2. 为什么 Proxy 的 handler 里要用 Reflect 而不是直接 `target[key]`？

**录音练习**

1. Proxy 13 trap + 常用 4 个（2 分钟）
2. Reflect 与 receiver（1.5 分钟）
3. Vue 2 vs Vue 3 响应式差异（1.5 分钟）

## 复盘

1. 最容易被追问：Proxy 不是“自动让所有事情变响应式”，数组和集合类型仍然需要 Vue 做专门代理逻辑。
2. 当前短板：要能把 `get/set/has/deleteProperty/ownKeys` 分别对应到读取、写入、`in`、删除、遍历依赖。
3. 下一次补充：接到 Day30，说明 Proxy 触发的 `track/trigger` 具体把依赖存到哪里。
