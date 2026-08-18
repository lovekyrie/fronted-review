---
title: AI Agent Engineering
description: An AI Agent learning path, engineering pipeline, and interview framing for frontend engineers
---

# AI Agent Engineering

## Core takeaway

An AI Agent is not “a chat API”. It is a pipeline that plugs a model into a real system: the model understands and decides, tools execute, MCP standardizes connections, Prompt and Parser constrain I/O, Memory and RAG expand context, SSE / protocol layers drive UX, LangGraph / multi-agent orchestrate complex flows, and eval / observability make the system debuggable, iterable, and shippable.

Frontend engineers do not need to turn the app into a LangChain backend on day one. A better path is: understand capability boundaries and engineering interfaces first, then land tool calls, streaming UI, RAG, the agent state machine, and online eval.

## Four-stage path

| Stage | Topic | Goal | Docs |
|------|------|------|----------|
| 1 | Tool / MCP / Prompt / Parser | Stable tool use and consumable output | [Tools & MCP](./tool-and-mcp), [Prompt / Parser / Memory](./prompt-parser-memory) |
| 2 | Memory / RAG | Private knowledge and history as context | [RAG pipeline](./rag) |
| 3 | SSE / AGUI / voice / cron | Interactive, interruptible, runnable product | [Agent Runtime](./agent-runtime) |
| 4 | LangGraph / multi-agent / eval | Orchestrate, replay, evaluate | [LangGraph & multi-agent](./langgraph-multi-agent), [Eval & observability](./observability-evaluation) |

## Pipeline

```text
User input
  -> Prompt template builds the task
  -> Model infers and picks tools
  -> Tool / MCP calls external systems
  -> Memory / RAG fills context
  -> Output parser constrains the result
  -> SSE / AGUI streams progress
  -> Frontend renders, confirms, interrupts, retries
  -> Trace / eval / metrics close the loop
```

A shippable Agent pipeline usually answers three questions:

- The model knows *when* to call *which* capability.
- Tool args, permissions, errors, and retries are under control.
- Every answer can be traced, evaluated, and reviewed — not judged by gut feel.

## Concepts

### Tool

A tool is an external capability the model can call: query an order, read a doc, search the web, drive a browser, open a ticket. The hard part is not “write a function”. It is schema, permission boundary, idempotency, error handling, and result shape.

### MCP

MCP is a tool-connection protocol. It standardizes how a model client talks to tool servers so filesystems, browsers, repos, DBs, or internal platforms can expose capabilities the same way.

### Prompt / Parser

The prompt template turns goals, constraints, and context into a task the model can follow. The output parser forces JSON, form fields, step lists, or a business DSL so frontend and backend can consume the result cheaply.

### Memory

Memory is how the Agent remembers. Common strategies: short context window, session summaries, long-term user profile or task state. In production, treat privacy, contamination, and expiry carefully.

### RAG

RAG retrieves what the model does not know or cannot remember reliably. The chain is loader, splitter, embedding, index, recall, rerank, context stitch, and citations.

### Agent Runtime

Runtime is the interaction and scheduling layer: SSE streaming, task state, cancel / retry, human approval, voice I/O, cron, and permission audit.

### LangGraph / multi-agent

Complex agents cannot live on a single prompt. Graph orchestration splits work into nodes, edges, branches, and state updates. Multi-agent splits planner, executor, retriever, reviewer, and similar roles.

### Evaluation / Observability

Eval and observability turn a demo into a system. Record prompt, context, tool calls, model output, latency, cost, hit rate, accuracy, and user feedback.

## Common pitfalls

- Chat UI only: no tools, permissions, state, or eval — cannot do real work.
- Equating RAG with a vector DB; skipping clean, split, recall, rerank, and citation checks.
- Long prompts without structured output or a failure fallback — frontend cannot consume them.
- Tools that are too wide; one call can cause high-risk side effects.
- Memory without expiry, redaction, or explainability — answers rot over time.
- Streaming only tokens, with no stage, tool call, or error state.
- Too many agent roles; communication cost beats the benefit.

## Interview template

> I treat Agent engineering as a pipeline around understand → decide → execute → feedback, not as wrapping a model API. The model infers; Tool and MCP connect external systems; Prompt and Parser constrain I/O; Memory and RAG fill context; SSE or AGUI lets the frontend show a live process; trace, eval sets, and metrics keep improving it. A frontend engineer’s value is making process state, human approval, permission boundaries, error recovery, and UX stable — not just a chat box.

## Practice next

- A “frontend knowledge-base Q&A” RAG demo: ingest, split, retrieve, cite.
- A “browser automation assistant” via MCP or browser tools: read pages, fill forms, screenshot.
- An “interview mock Agent”: generate questions, follow up, score, write a recap.
- Index this VitePress site for RAG, then plug in local Q&A.
- Add SSE events, tool-call cards, human approval, and task replay to the Agent UI.

## Index

- [Tools & MCP](./tool-and-mcp)
- [Prompt / Parser / Memory](./prompt-parser-memory)
- [RAG pipeline](./rag)
- [Agent Runtime](./agent-runtime)
- [LangGraph & multi-agent](./langgraph-multi-agent)
- [Eval & observability](./observability-evaluation)
- [High-frequency Agent interview questions](./interview-questions)
