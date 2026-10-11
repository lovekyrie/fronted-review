# Day 11 手写保温 1（call / bind / new / instanceof）

## 今日目标

- 看完 `/handwrite/call`、`bind`、`new`、`instanceof`
- 输出 4 道手写题的「步骤模板」
- 输出一页《手写题答题顺序》：先讲思路 → 再落代码 → 最后补边界

## 按顺序阅读

1. [call](../handwrite/call)
2. [bind](../handwrite/bind)
3. [new](../handwrite/new)
4. [instanceof](../handwrite/instanceof)

## 实操与自测

**检查点**

- `call` 的本质是“把函数挂到对象上调用”，注意用 `Symbol` 防冲突
- `bind` 遇到 `new` 调用要忽略绑定对象，`this instanceof boundFn` 判断
- `new` 四步：创对象 → 接原型 → 执行构造 → 返回对象/新实例
- `instanceof` 本质是遍历 `__proto__` 找 `prototype`

**先独立完成，再对照专题**

- 4 题步骤对比 — [参考章节](../handwrite/call#day-11-4-题步骤对比)
- 手写答题顺序 — [参考章节](../handwrite/call#day-11-手写答题顺序)
- myCall — [参考章节](../handwrite/call#day-11-mycall)
- myBind — [参考章节](../handwrite/bind#day-11-mybind)
- myNew — [参考章节](../handwrite/new#day-11-mynew)
- myInstanceof — [参考章节](../handwrite/instanceof#day-11-myinstanceof)

**脱稿口述题**

- 1. `call / bind / new` 的本质分别是什么？
- 2. `instanceof` 的底层判断逻辑是什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. call 的核心（挂到对象上调用）+ bind 与 new 的兼容（2 分钟）
2. new 四步 + 返回值判断逻辑（1.5 分钟）
3. instanceof 原型链遍历 + 基本类型边界（1.5 分钟）

录完后自查：

- 是否说出 `Symbol` 防属性冲突。
- 是否说出 bind 遇 new 要忽略绑定对象。
- 是否说出 new 的"构造函数返回对象则用返回值"。
- 是否说出 instanceof 对基本类型直接返回 false。

## 复盘

今天最需要回补的 3 个点：

1. `bind` 返回的函数需要继承原函数的 `prototype`，否则 `new` 出来的实例原型链断裂。
2. `myNew` 中 `result` 判断需要排除 `null`（typeof null === 'object'）。
3. `Symbol.hasInstance` 自定义 instanceof 行为的用法和场景。
