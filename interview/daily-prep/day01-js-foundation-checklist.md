# Day 1 JS 基础执行记录

## 今日目标

- 看完 `数据类型 / this / 原型链` 三块基础。
- 输出一页《JS 基础速记卡》。
- 写出 `call / bind` 的手写步骤。
- 准备 3 道口述题，完成一次 5 分钟录音。

## 按顺序阅读

1. [数据类型](../jscore/basic/data-type)
2. [This 关键字](../jscore/basic/this)
3. [原型链](../jscore/basic/prototype)

## 实操与自测

**检查点**

- `data-type`：引用类型传参容易误说成“按引用传递”，准确说法是“按值传递，传的是引用地址的副本”。
- `this`：先判断是不是箭头函数，再判断调用方式；`new` 绑定优先级高于 `bind`。
- `prototype`：`prototype` 属于构造函数，`__proto__` 属于实例对象；属性查找沿 `__proto__` 继续向上。

**先独立完成，再对照专题**

- 数据类型 — [参考章节](../jscore/basic/data-type#day-1-数据类型)
- this — [参考章节](../jscore/basic/this#day-1-this)
- 原型链 — [参考章节](../jscore/basic/prototype#day-1-原型链)
- 知识补充 — [参考章节](../jscore/basic/data-type#day-1-知识补充)
- 动手示例 — [参考章节](../jscore/basic/data-type#day-1-动手示例)

**脱稿口述题**

- 1. this 绑定优先级是什么？
- 2. 原型链查找与 new 过程怎么讲？
- 3. call / bind 的本质分别是什么？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 先讲 `this` 四种绑定和优先级，控制在 2 分钟。
2. 再讲原型链查找和 `new` 过程，控制在 2 分钟。
3. 最后讲 `call / bind` 区别，控制在 1 分钟。

录完后自查：

- 是否说出 `new > 显式 > 隐式 > 默认`。
- 是否说出箭头函数不能改 `this`。
- 是否说出 `instance.__proto__ === Constructor.prototype`。
- 是否说出 `call` 立即执行、`bind` 返回函数。

## 复盘

今天最需要回补的 3 个点：

1. `typeof / instanceof / Object.prototype.toString.call` 的适用边界。
2. `bind` 遇到 `new` 调用时为什么要忽略绑定对象。
3. `prototype / __proto__ / constructor` 三者关系需要画图再讲一遍。
