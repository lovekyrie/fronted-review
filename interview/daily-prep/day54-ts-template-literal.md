# Day 54 模板字面量类型 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 54 | 模板字面量 | [TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Template Literal Types
- 手写 `Join / Split / CamelCase / KebabCase` 字符串工具类型
- 做一个路由参数类型推导 demo：`/user/:id/post/:postId` → `{ id: string; postId: string }`

## 阅读卡点

- 模板字面量类型和字符串字面量的 `${}` 语法一致，但只能在类型位置
- 常配合 `infer` 用于模式提取
- 注意 union 分发：`T extends \`\${infer H}.\${infer T}\` ? ... : ...`

## 速记卡 / 知识点

<!-- 模板字面量语法 / 字符串拆分递归 / 路由参数推导 / 类型 + 模板字面量的限制 -->

## 手写 / 流程图

```ts
type Params<S extends string> =
  S extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof Params<Rest>]: string }
    : S extends `${infer _Start}:${infer Param}`
      ? { [K in Param]: string }
      : {}
```

## 口述题

### 1. 模板字面量类型典型用途？

> 回答模板：

### 2. 路由参数类型怎么推导？

> 回答模板：

## 5 分钟录音顺序

1. 语法基础（1 分钟）
2. infer + 递归（2 分钟）
3. 路由 / 事件名 / 表单字段 案例（2 分钟）

## 今日复盘

1. 
2. 
3. 
