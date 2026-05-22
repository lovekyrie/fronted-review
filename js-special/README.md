# js-special

JavaScript 进阶手写与工具函数专题，主题围绕 **函数式编程思想** 与 **Underscore / jQuery 风格工具库实现**。多数示例由简到繁递进，便于面试复习与理解底层 API。

## 主题思想

1. **高阶函数与闭包**：柯里化、偏函数、组合、防抖/节流、惰性函数、记忆化，都依赖「返回函数 + 闭包保存状态」。
2. **Point-Free 风格**：先定义原子运算（`head`、`toUpperCase`），再用 `compose` / `curry` 拼业务，减少中间变量与数据名耦合。
3. **模拟经典库**：`type` → `isArrayLike` → `each` → `extend` / `flatten` / `unique` / `findIndex`，串联成小型工具链。
4. **性能与边界**：`call` 与裸调用的性能对比、有序数组二分查找、`NaN` / `+0` `-0`、深拷贝循环引用等边界场景。

## 目录结构

| 目录 | 内容 |
|------|------|
| `curry/` | 柯里化：预填参、按 `fn.length` 递归收集、ES6  rest、无限累加 `sum(1)(2)()` |
| `partial/` | 偏函数 vs `bind` 的 `this` 差异 |
| `function-compose/` | `compose`、Point-Free 问候语 / 姓名缩写实战 |
| `function-memory/` | `memoize` 缓存（Underscore / 犀牛书）、斐波那契优化 |
| `lazy-function/` | 惰性函数：重写自身、闭包、函数属性、DOM 兼容 `addEvent` |
| `debounce&throttle/` | 防抖（立即执行 + cancel）、节流（时间戳 vs 定时器） |
| `copy/` | 浅拷贝、递归深拷贝、`JSON` 局限、`jquery.extend` 模拟 |
| `flatten/` | 递归 / `reduce` / `toString` / ES6 展开、`_.flatten` 风格 |
| `arrry-de-duplication/` | 数组去重多种实现（含 `Set`、`Map`、排序、对象键） |
| `find-index/` | `findIndex`、工厂函数、`sortedIndex` 二分、`indexOf` 增强 |
| `get-maxium/` | 数组最大值：`reduce`、`apply`、展开、`eval`（不推荐） |
| `type-judgment/` | 比 `typeof` 更准的类型判断、`isArrayLike` |
| `judge-equal/` | 深比较思路片段、`+0` / `-0` |
| `jquery-each/` | 模拟 `$.each`，`call` 绑定 `this` 的性能对比 |
| `recursion/` | 递归入门（阶乘 / 斐波那契） |

## 学习路径建议

```
type-judgment → jquery-each → find-index
     ↓
curry / partial → function-compose → pointfree 实战
     ↓
function-memory / lazy-function → debounce&throttle
     ↓
copy / flatten / arrry-de-duplication / get-maxium
```

## 运行说明

- 纯 Node 脚本：在项目根执行 `node js-special/xxx/yyy.js`（模块间用 `import`，相对路径需带 `.js` 后缀）。
- 浏览器 Demo：`debounce&throttle/*.html`、`copy/jquery-extend.html`、`jquery-each/*.html` 需在浏览器打开。
- 刻意保留 CommonJS 的目录（用于对比学习）：`js/module/commonjs/`、`js/module/cmd/`、`js-questions/node-export-require/`、`js/event-loop/*.cjs`。

## 注意事项

- 部分文件为**教学草稿**，存在未完成或笔误（如 `curry/easy-version.js`、`judge-equal/eq-v1.js`、`recursion/factorial.js` 变量名混用），以注释与 README 说明为准。
- `curry/v3.js` 为占位符版本预留，实现可参考 `curry/demo02.js`。
- 更完整的 ES6 柯里化见仓库内 `hand-write/simulate/curry.js`（`demo02.js` 中已注明）。
