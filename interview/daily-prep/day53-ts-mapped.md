# Day 53 映射类型与 keyof 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 53 | 映射类型 | [TS 类型设计](../advanced/week5/typescript-design) |

## 今日目标

- 看完 TS Mapped Types
- 手写 `Partial / Required / Readonly / Pick / Record`
- 理解 `-readonly` / `-?` 移除修饰符的语法

## 阅读卡点

- 映射类型基础语法：`{ [K in keyof T]: ... }`
- `keyof` 对 interface / type / class 行为一致，但对 `{}` 是 `never`
- `as` 子句（remapping）可以配合模板字面量类型改 key 名

## 速记卡 / 知识点

<!-- 映射类型语法 / 修饰符增删 / key remapping / 与泛型组合 -->

## 手写 / 流程图

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }
```

## 口述题

### 1. Partial 和 DeepPartial 实现差别？

> 回答模板：

### 2. 映射类型什么时候配合 remapping？

> 回答模板：

## 5 分钟录音顺序

1. 映射类型语法（1.5 分钟）
2. 修饰符 + remapping（2 分钟）
3. DeepX 系列思路（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
