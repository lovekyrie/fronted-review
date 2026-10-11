# this 绑定优先级

> Related source: [interview/jscore/basic/this.md](../../../interview/jscore/basic/this.md)

## Meaning

`this` 不看函数写在哪，看**怎么被调用**。普通函数有四条绑定规则，互相冲突时按优先级取最高的一条。

箭头函数**没有自己的 `this`**，不参与这四条规则：先看是不是箭头函数，再对普通函数套优先级。

判定顺序：

1. 箭头函数 → 词法 `this`（外层作用域捕获）。`call` / `apply` / `bind` 改不了；`new` 会报错。
2. `new` 绑定 → 新创建的实例
3. 显式绑定 → `call` / `apply` / `bind`
4. 隐式绑定 → `obj.fn()` 里的 `obj`
5. 默认绑定 → 独立调用；严格模式 `undefined`，非严格模式全局对象

硬绑定 vs `new`：`new (fn.bind(obj))()` 时 `new` 赢，`this` 是新对象，不是 `obj`。

## In This Project

面试稿 [`this.md`](../../../interview/jscore/basic/this.md) 的回答模板是 **new > 显式 > 隐式 > 默认**，箭头函数单独作为「先判断」的前置规则。
