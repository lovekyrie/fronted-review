# Day 49 RSC + React 专题追问复盘 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 49 | RSC + 复盘 | [React 19 新特性](../framework/react/react19-features)、[Week 4 路线图](../advanced/week4/roadmap)、[SSR/SSG](../advanced/ssr-ssg) |

## 今日目标

- 看完 React Server Components、`use server`
- 汇总 Day 43–48，形成《React 方向 15 题答题本》
- 录一段 8 分钟录音：从 setState 到屏幕显示的完整链路

## 阅读卡点

- RSC 不是 SSR；它能**直接在服务端执行组件**并把序列化结果流到客户端
- “Server Component / Client Component”通过 `"use client"` 标注区分
- RSC 的收益：减少 bundle、安全访问数据层；代价：序列化限制、心智变化

## 速记卡 / 知识点

### RSC 核心模型

| 概念 | 说明 |
|------|------|
| Server Component | 默认组件，在服务端执行，不打包进客户端 bundle |
| Client Component | `"use client"` 标注，在客户端执行，支持交互 |
| 序列化边界 | Server → Client 传递的 props 必须可序列化（JSON 兼容） |
| RSC Payload | 服务端渲染结果的序列化格式（非 HTML），流式传给客户端 |

### RSC vs SSR

| 维度 | SSR | RSC |
|------|-----|-----|
| 渲染产物 | HTML 字符串 | RSC Payload（序列化的组件树） |
| JS bundle | 所有组件都打包 | Server Component 不进 bundle |
| 数据获取 | 服务端获取 → 序列化到 HTML | 组件内直接 async/await |
| 交互能力 | hydrate 后才可交互 | Client Component 独立 hydrate |
| 重渲染 | 全页面 | 可以局部 refetch Server Component |

### RSC 渲染流程

```text
1. 请求到达 → 服务端执行 Server Component（可以 async/await 数据库）
2. 遇到 Client Component → 序列化为引用标记 + props
3. 把整个组件树序列化为 RSC Payload → 流式传给客户端
4. 客户端解析 RSC Payload → 遇到 Client Component 引用 → 加载对应 JS
5. Client Component hydrate → 页面可交互
```

### Next.js App Router 中的 RSC

- `app/` 目录下的组件默认是 Server Component。
- 需要交互（onClick、useState）的组件加 `"use client"`。
- Server Actions 用 `"use server"` 标注，可以在 Client Component 中调用服务端函数。

### 适用场景

- **用 Server Component**：数据展示、静态 UI、访问数据库/文件系统。
- **用 Client Component**：用户交互、浏览器 API、state/effect。

## 手写 / 流程图

### RSC 渲染链路

```text
浏览器请求 /dashboard
  → Next.js Server:
    → 执行 layout.tsx (Server Component)
      → async: 查数据库获取用户信息
      → 执行 Sidebar (Server Component)
      → 遇到 <InteractiveChart "use client" />
        → 序列化：{ type: "client-ref", module: "./InteractiveChart.js", props: { data } }
    → 生成 RSC Payload (流式)
  → 客户端:
    → 解析 RSC Payload → 渲染静态部分
    → 加载 InteractiveChart.js → hydrate → 图表可交互
    → Server Component 的 JS 永远不进 bundle！
```

### Server Action 示例

```jsx
// actions.ts
'use server'
export async function createTodo(formData: FormData) {
  const text = formData.get('text')
  await db.todos.create({ text })
  revalidatePath('/todos')
}

// TodoForm.tsx
'use client'
import { createTodo } from './actions'

export function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  )
}
```

## 口述题

### 1. RSC 和 SSR 的本质区别？

回答模板：

> SSR 是把组件渲染成 HTML 字符串发给客户端，但所有组件的 JS 仍然需要打包发送，客户端 hydrate 后才能交互。本质上 SSR 只是"提前渲染了 HTML"，JS 一字节没省。
>
> RSC 是让组件直接在服务端执行，渲染结果以 RSC Payload（序列化格式）流式传给客户端。Server Component 的 JS 代码**永远不会发到客户端**，真正减少了 bundle 大小。只有 `"use client"` 标注的组件才会打包到客户端。
>
> 另一个区别是数据获取：SSR 需要在特定入口（getServerSideProps）集中获取数据；RSC 可以在每个 Server Component 内直接 async/await，数据获取和组件树的位置一致，更自然。

### 2. 3 道自抽追问

**Q: RSC 有哪些限制？**

> Server Component 不能用 useState / useEffect / 浏览器 API，不能有事件处理函数。传给 Client Component 的 props 必须是可序列化的（不能传函数、class 实例）。Server Component 不能导入 Client Component 以外的有交互逻辑的模块。

**Q: 如何在 Server Component 和 Client Component 之间共享数据？**

> 三种方式。一、Server Component 通过 props 传给 Client Component（必须可序列化）。二、Server Actions 让 Client Component 调用服务端逻辑。三、通过 URL searchParams / cookie 在两端共享状态。

**Q: RSC 对现有 React 项目意味着什么？**

> 不是所有项目都需要 RSC。如果是纯 SPA / 管理后台，CSR 就够了。RSC 主要适合内容密集型应用（电商、社交、文档站），这些场景下减少 bundle 和直连数据层的收益最大。迁移成本也不低，需要区分 Server / Client 边界，改变组件设计思路。

## 8 分钟录音顺序（React 专题总结）

1. setState → render → commit 完整链路 + Fiber + Lanes（2 分钟）
2. useEffect 三大坑 + cleanup 时机 + Strict Mode（1.5 分钟）
3. memo 三件套 + 失效场景 + Compiler 方向（1.5 分钟）
4. 并发渲染 + useTransition + useDeferredValue（1.5 分钟）
5. React 19 Actions + RSC 模型 + Server/Client 边界（1.5 分钟）

## 今日复盘

React 方向最容易被击穿的 3 题：

1. "React 18 的自动批处理具体改了什么？在哪些场景有差异？"——需要说出 4 种场景 + createRoot。
2. "useEffect 和 useLayoutEffect 区别？cleanup 什么时候执行？"——需要画出时机图。
3. "RSC 和 SSR 到底有什么不同？"——需要说出 bundle 差异 + 数据获取差异 + 序列化边界。

本周新增的 3 个"为什么"：

1. 为什么 React 选择不可变数据而不是 Vue 的可变响应式？（可预测性 + 并发兼容）
2. 为什么 Concurrent 模式下 render 必须是纯函数？（可中断重试要求幂等）
3. 为什么 RSC 的 Server Component 不打包到客户端？（减少 bundle + 安全访问服务端资源）
