# Day 56 TS 类型设计实战 + 追问复盘

## 今日目标

- 挑一个组件或函数（表单 / 表格 / fetch 封装），用 TS 做类型设计
- 汇总 Day 50–55，形成《TypeScript 方向 15 题答题本》
- 输出“为什么类型设计 ≠ 会写 TS”的答题稿

## 按顺序阅读

1. [Week 5 路线图](../advanced/week5/roadmap)
2. [TS 基础](../advanced/week5/typescript-basic)
3. [TS 类型设计](../advanced/week5/typescript-design)

## 实操与自测

**检查点**

- 类型设计关注的是**接口使用体验**，不是“能跑”
- 推断 > 显式标注；让调用方不用手动传泛型
- “避免 any” 不是目标，“让错误在调用处而不是内部报出来”才是

**先独立完成，再对照专题**

- 类型设计 5 原则
- 典型反模式
- 不可能的状态不可表达
- 强类型 EventEmitter
- 强类型 fetch 封装

**脱稿口述题**

- 1. 一个好的 TS API 应该长什么样？
- 2. 你用过哪些"能让错误尽早报出来"的技巧？

**模拟流程与评分**

### 类型设计 5 原则

1. **推断优先**：让 TS 自动推断，减少手动标注。函数内部用推断，边界（参数/返回值）加标注。
2. **窄类型优于宽类型**：用 `'success' | 'error'` 而不是 `string`，用 discriminated union 而不是可选属性。
3. **不可能的状态不可表达**：用类型系统排除非法组合（如 loading 和 error 不能同时为 true）。
4. **错误在调用处报出**：泛型约束 + 条件类型让错误信息出现在使用者写代码的地方，而不是库的内部。
5. **最小暴露面**：只导出必要的类型，内部实现类型用 `type` 而不是 `export type`。

### 典型反模式

| 反模式 | 问题 | 修正 |
|--------|------|------|
| 到处 `any` | 失去类型安全 | 用 `unknown` + 缩窄 |
| 过度 `as` 断言 | 欺骗编译器 | 改善类型定义 |
| 可选属性滥用 | 状态不明确 | discriminated union |
| 泛型参数过多 | 调用方困惑 | 利用推断减少参数 |
| 类型和实现分离 | 类型和代码不一致 | `typeof` / `satisfies` 从实现提取 |

### 不可能的状态不可表达

[参考代码](../advanced/week5/typescript-design#day-56-practice-code)

### 强类型 EventEmitter

[参考代码](../advanced/week5/typescript-design#day-56-practice-code)

### 强类型 fetch 封装

[参考代码](../advanced/week5/typescript-design#day-56-practice-code)

**录音练习**

1. 类型基础（type vs interface / union 缩窄 / as const）（1.5 分钟）
2. 泛型（3 动机 / extends 约束 / 推断方向）（2 分钟）
3. 条件类型 + infer（分发规则 / ReturnType / Awaited 实现）（2 分钟）
4. 映射类型 + 模板字面量（修饰符 / remapping / 路由参数推导）（1.5 分钟）
5. 类型设计 3 原则（推断优先 / 窄类型 / 不可能状态不可表达）（1 分钟）

## 复盘

TS 方向最容易被击穿的 3 题：

1. "手写 Omit 类型"——需要说出 Pick + Exclude 的组合，不能只背结果。
2. "分发条件类型什么时候触发？怎么关闭？"——需要说出 naked type parameter + `[]` 包裹。
3. "给一个实际场景设计类型（如 fetch 封装）"——需要现场写出泛型 + 条件类型的完整签名。

本周新增的 3 个"为什么"：

1. 为什么 TS 选择结构类型（structural typing）而不是名义类型（nominal typing）？（和 JS 的鸭子类型一致）
2. 为什么工具类型的底层只需要映射 + 条件 + infer 三种技术？（它们构成了类型层面的图灵完备子集）
3. 为什么"推断优先"是好的 API 设计原则？（减少调用方负担 + 避免类型标注和实际值不一致）
