---
title: AI Agent 工程专题
description: 面向前端工程师的 AI Agent 学习路线、工程链路与面试表达
---

# AI Agent 工程专题

## 核心结论

AI Agent 不是“会聊天的接口”，而是一套把大模型能力接入真实工程系统的链路：模型负责理解与决策，工具负责执行，MCP 负责标准化连接，Prompt 和 Parser 负责输入输出约束，Memory 和 RAG 负责上下文扩展，SSE/协议层负责交互体验，LangGraph/多 Agent 负责复杂流程编排，评估观测负责让系统可调试、可迭代、可上线。

前端工程师学习 Agent，不需要一开始就把项目改成 LangChain 后端应用。更合理的路径是先理解能力边界和工程接口，再逐步落到工具调用、流式 UI、RAG 检索、Agent 状态机和线上评估。

## 四阶段路线

| 阶段 | 主题 | 目标 | 对应文档 |
|------|------|------|----------|
| 阶段 1 | Tool / MCP / Prompt / Parser | 让模型稳定调用外部能力，并输出可消费结构 | [Tool 与 MCP](./tool-and-mcp)、[Prompt / Parser / Memory](./prompt-parser-memory) |
| 阶段 2 | Memory / RAG / 检索增强 | 让模型使用私有知识和历史上下文 | [RAG 工程链路](./rag) |
| 阶段 3 | SSE / AGUI / 语音 / 定时任务 | 让 Agent 具备可交互、可中断、可运行的产品形态 | [Agent Runtime](./agent-runtime) |
| 阶段 4 | LangGraph / 多 Agent / 评估观测 | 让复杂任务可编排、可回放、可评估 | [LangGraph 与多 Agent](./langgraph-multi-agent)、[评估与观测](./observability-evaluation) |

## 工程链路

```text
用户输入
  -> Prompt Template 构造任务
  -> 模型推理与工具选择
  -> Tool / MCP 调用外部系统
  -> Memory / RAG 补充上下文
  -> Output Parser 约束结果
  -> SSE / AGUI 推送过程状态
  -> 前端渲染、确认、中断、重试
  -> Trace / Eval / Metrics 进入迭代闭环
```

一条能上线的 Agent 链路，通常要同时回答三个问题：

- 模型知道什么时候该调用什么能力。
- 工具调用的参数、权限、错误和重试是可控的。
- 每次回答都能被追踪、评估和复盘，而不是靠主观感觉判断效果。

## 关键概念

### Tool

Tool 是模型可调用的外部能力，例如查询订单、读取文档、搜索网页、调用浏览器、写入工单。它的重点不是“写一个函数”，而是把参数 schema、权限边界、幂等性、错误处理和结果格式设计清楚。

### MCP

MCP 可以理解为工具连接协议。它把模型客户端和外部工具服务之间的连接标准化，让不同数据源、浏览器、代码仓库、文件系统或内部系统能够以统一方式暴露能力。

### Prompt / Parser

Prompt Template 负责把业务目标、约束、上下文组织成模型可理解的任务。Output Parser 负责把模型输出限制成 JSON、表单字段、步骤列表或业务 DSL，降低前端和服务端消费结果的成本。

### Memory

Memory 解决“Agent 如何记住信息”。常见策略包括短期上下文窗口、会话摘要记忆、长期用户画像或任务状态。工程上要谨慎处理隐私、污染和过期策略。

### RAG

RAG 用检索补充模型不知道或不能稳定记住的信息。核心链路是 Loader、Splitter、Embedding、索引、召回、重排、上下文拼接和答案引用。

### Agent Runtime

Runtime 是 Agent 真正跑起来所需的交互和调度层，包括 SSE 流式输出、任务状态、取消重试、人工确认、语音输入输出、定时任务和权限审计。

### LangGraph / 多 Agent

复杂 Agent 不能只靠单轮提示词。图编排把任务拆成节点、边、条件分支和状态更新，多 Agent 则把规划、执行、检索、审查等角色拆开协作。

### Evaluation / Observability

评估观测让 Agent 从 demo 变成工程系统。它需要记录 prompt、上下文、工具调用、模型输出、耗时、成本、命中率、正确率和用户反馈。

## 常见坑点

- 只做聊天 UI，没有工具、权限、状态和评估，无法承担真实任务。
- 把 RAG 等同于向量库，忽略数据清洗、切分、召回、重排和引用校验。
- Prompt 写得很长，但没有结构化输出和失败兜底，前端难以稳定消费。
- Tool 设计过宽，模型一次调用就可能产生高风险副作用。
- Memory 不做过期、脱敏和可解释，长期运行后容易污染回答。
- 流式输出只展示 token，没有任务阶段、工具调用和错误状态。
- 多 Agent 角色拆得过细，通信成本高于收益。

## 面试回答模板

> 我理解 Agent 工程不是单纯接一个大模型接口，而是围绕“理解、决策、执行、反馈”建立工程链路。模型负责推理，Tool 和 MCP 连接外部系统，Prompt 和 Parser 约束输入输出，Memory 与 RAG 补充上下文，SSE 或 AGUI 让前端能展示流式过程，最后用 trace、评估集和指标持续优化。前端工程师的价值在于把 Agent 的过程状态、人工确认、权限边界、错误恢复和用户体验做稳定，而不是只做一个聊天框。

## 后续实战方向

- 做一个“前端知识库问答”RAG demo，覆盖文档导入、切分、检索和引用。
- 做一个“浏览器自动化助手”，用 MCP 或浏览器工具完成网页读取、表单填充和截图。
- 做一个“面试模拟 Agent”，支持题目生成、追问、评分和复盘报告。
- 给现有 VitePress 文档增加 RAG 索引，后续接入本地知识库问答。
- 为 Agent 前端 UI 增加 SSE 事件流、工具调用卡片、人工确认和任务回放。

## 专题目录

- [Tool 与 MCP](./tool-and-mcp)
- [Prompt / Parser / Memory](./prompt-parser-memory)
- [RAG 工程链路](./rag)
- [Agent Runtime](./agent-runtime)
- [LangGraph 与多 Agent](./langgraph-multi-agent)
- [评估与观测](./observability-evaluation)
- [AI Agent 高频面试题](./interview-questions)
