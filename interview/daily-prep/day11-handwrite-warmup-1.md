# Day 11 手写保温 1（call / bind / new / instanceof） 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 11 | 手写 1（call/bind/new/instanceof） | [call](../handwrite/call)、[bind](../handwrite/bind)、[new](../handwrite/new)、[instanceof](../handwrite/instanceof) |

## 今日目标

- 看完 `/handwrite/call`、`bind`、`new`、`instanceof`
- 输出 4 道手写题的「步骤模板」
- 输出一页《手写题答题顺序》：先讲思路 → 再落代码 → 最后补边界

## 阅读卡点

- `call` 的本质是“把函数挂到对象上调用”，注意用 `Symbol` 防冲突
- `bind` 遇到 `new` 调用要忽略绑定对象，`this instanceof boundFn` 判断
- `new` 四步：创对象 → 接原型 → 执行构造 → 返回对象/新实例
- `instanceof` 本质是遍历 `__proto__` 找 `prototype`

## 速记卡 / 知识点

<!-- 4 题步骤模板对比表 -->

## 手写 / 流程图

```js
Function.prototype.myCall = function(thisArg, ...args) { /* ... */ }
Function.prototype.myBind = function(thisArg, ...preset) { /* ... */ }
function myNew(Ctor, ...args) { /* ... */ }
function myInstanceof(obj, Ctor) { /* ... */ }
```

## 口述题

### 1. `call / bind / new` 的本质分别是什么？

> 回答模板：

### 2. `instanceof` 的底层判断逻辑是什么？

> 回答模板：

## 5 分钟录音顺序

1. call / bind 的步骤（2 分钟）
2. new 四步（1.5 分钟）
3. instanceof 的原型遍历（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
