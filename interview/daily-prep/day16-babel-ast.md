# Day 16 Babel：AST / preset / plugin 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 16 | Babel | [构建工具](../advanced/week1/build-tools)、[webpack vs Vite](../engineering/webpack-vs-vite) |

## 今日目标

- 看完 Babel 配置文档、Babel Parser
- 输出 Babel 三阶段流程图：parse → transform → generate
- 用一个真实的 preset-env 转换案例做 AST 解读

## 阅读卡点

- `preset-env` + `core-js` 的组合只负责**语法降级**和**polyfill 注入**，两者职责不同
- Babel 不负责打包，只负责**单文件的语法改写**
- `@babel/runtime` 和 `@babel/plugin-transform-runtime` 解决重复注入辅助代码的问题

## 速记卡 / 知识点

### Babel 三阶段

```text
1. Parse（解析）：源代码 → AST（@babel/parser）
2. Transform（转换）：遍历 AST，用 visitor 模式匹配节点并修改（@babel/traverse + plugins）
3. Generate（生成）：AST → 新代码 + source map（@babel/generator）
```

### AST 核心节点

| 节点类型 | 示例 |
|----------|------|
| `Program` | 顶层程序 |
| `VariableDeclaration` | `const x = 1` |
| `FunctionDeclaration` | `function foo() {}` |
| `ArrowFunctionExpression` | `() => {}` |
| `CallExpression` | `foo()` |
| `MemberExpression` | `obj.prop` |
| `Identifier` | `x`, `foo` |

可在 [AST Explorer](https://astexplorer.net/) 实时查看。

### preset vs plugin

- **plugin**：单个转换规则（如 `@babel/plugin-transform-arrow-functions`）。
- **preset**：一组 plugin 的集合（如 `@babel/preset-env` 包含所有 ES6+ 降级插件）。
- 执行顺序：plugin 先于 preset；plugin 从左到右；preset 从右到左。

### preset-env 的三个关键配置

```json
{
  "presets": [["@babel/preset-env", {
    "targets": "> 0.5%, last 2 versions, not dead",
    "useBuiltIns": "usage",
    "corejs": 3
  }]]
}
```

| 配置 | 作用 |
|------|------|
| `targets` | 指定目标浏览器，只降级目标不支持的语法 |
| `useBuiltIns: "usage"` | 按实际使用自动注入 polyfill |
| `useBuiltIns: "entry"` | 在入口全量注入 polyfill |
| `corejs: 3` | 指定 core-js 版本 |

### preset-env vs core-js 职责

- **preset-env**：负责**语法降级**（箭头函数 → function、可选链 → 条件判断等）。
- **core-js**：负责**API polyfill**（Promise、Array.from、Object.assign 等运行时 API）。
- 两者互补：preset-env 决定要降级什么，core-js 提供缺失的 API 实现。

### @babel/plugin-transform-runtime

解决的问题：Babel 转换时会注入辅助函数（如 `_classCallCheck`），每个文件都注入一份，导致重复代码。

方案：引用 `@babel/runtime` 中的共享辅助函数，避免重复。

## 手写 / 流程图

### Babel 完整流程

```text
源代码: const fn = () => 1
         │
         ▼  @babel/parser
  AST: ArrowFunctionExpression
         │
         ▼  plugin-transform-arrow-functions (visitor)
  AST: FunctionExpression (修改节点类型 + 绑定 this)
         │
         ▼  @babel/generator
新代码: var fn = function() { return 1; }
```

### 简单 Babel 插件示例

```js
// 把 console.log 替换为空语句
module.exports = function () {
  return {
    visitor: {
      CallExpression(path) {
        const callee = path.get('callee')
        if (callee.isMemberExpression() &&
            callee.get('object').isIdentifier({ name: 'console' }) &&
            callee.get('property').isIdentifier({ name: 'log' })) {
          path.remove()
        }
      }
    }
  }
}
```

## 口述题

### 1. `preset-env` 到底做了什么？和 `core-js` 什么关系？

回答模板：

> `preset-env` 是 Babel 的预设集，根据 `targets` 配置的目标浏览器，自动选择需要的转换插件，只降级目标环境不支持的语法。它负责的是**语法层面**的降级，比如箭头函数转 function、可选链转条件判断。
>
> `core-js` 负责的是**API 层面**的 polyfill，比如 `Promise`、`Array.from`、`Object.assign` 这些运行时 API。配合 `useBuiltIns: "usage"`，preset-env 会分析代码里用了哪些 API，按需注入 core-js 的对应模块。
>
> 简单说：preset-env 管语法，core-js 管 API，两者互补。

### 2. 为什么要用 `@babel/plugin-transform-runtime`？

回答模板：

> Babel 转换代码时会注入辅助函数（helpers），比如 `_classCallCheck`、`_extends` 等。默认情况下每个文件都会内联一份，如果项目有几百个文件，同样的辅助函数就会被打包几百次，增加包体积。
>
> `transform-runtime` 的作用是把这些辅助函数的引用指向 `@babel/runtime` 这个共享包，所有文件引用同一份代码，避免重复。同时它还可以沙箱化 polyfill（不污染全局），适合开发库的场景。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Babel 三阶段（parse → transform → generate）+ AST 概念（1.5 分钟）
2. preset-env 三个关键配置 + 与 core-js 的职责分工（2 分钟）
3. transform-runtime 解决的问题 + Babel 和 bundler 的职责分界（1.5 分钟）

录完后自查：

- 是否说出 Babel 只做单文件语法改写，不负责打包。
- 是否说出 preset-env 管语法、core-js 管 API。
- 是否说出 `useBuiltIns: "usage"` 的按需注入机制。
- 是否说出 transform-runtime 解决辅助函数重复的问题。

## 今日复盘

今天最需要回补的 3 个点：

1. AST Explorer 实际操作，能快速定位节点类型。
2. plugin 和 preset 的执行顺序规则（plugin 左到右，preset 右到左）。
3. `useBuiltIns: "entry"` vs `"usage"` 的包体积差异和适用场景。
