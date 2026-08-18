---
title: LangGraph & multi-agent
description: LangGraph, graph orchestration, multi-agent collaboration, and Agentic RAG
---

# LangGraph & multi-agent

## Core takeaway

When a task grows from one-shot Q&A into multi-step work, a prompt chain becomes hard to maintain. Graph orchestration (LangGraph-style) splits the flow into nodes, edges, branches, and shared state so planning, retrieval, tool execution, human approval, review, and stop conditions stay clear.

More agents is not better. Split only when the work has different roles, different tool permissions, or different eval criteria.

## Pipeline

```text
User goal
  -> Planner node decomposes the task
  -> Router node: retrieve, tool, or ask
  -> Retriever node recalls knowledge
  -> Executor node calls tools
  -> Reviewer node checks result and risk
  -> Human node for confirm or extra info
  -> Final node produces the answer
```

A graph cares about three questions:

- What is the current state?
- Which node next?
- When to stop, retry, or hand to a human?

## Concepts

### State

Shared task state: user goal, done steps, retrieval results, tool results, errors, user confirmation, final answer. Better than stuffing every message into context for complex work.

### Node

An executable step: plan, retrieve, call a tool, score a result, reply. Clear I/O so you can test and swap nodes.

### Edge

How control flows. A plain edge is a fixed path. A conditional edge picks the next node from state: retry after tool fail, ask when info is missing, human confirm when risk is high.

### Planner / Executor

Planner breaks the goal into steps. Executor runs tools. Splitting them reduces “think while doing” chaos and lets you inject permission / risk checks before execution.

### Reviewer

Checks whether the answer meets the spec, cites sources, respects constraints, and avoids high-risk actions. Can be a model node or a rules check.

### Multi-agent splits

Typical:

- Planner: decompose and order.
- Retriever: RAG and evidence.
- Executor: tools.
- Reviewer: correctness, safety, format.
- Summarizer: user-facing wording.

### Agentic RAG

Not “retrieve once then answer”. The Agent decides whether to rewrite the question, retrieve again, call a tool to verify, or add citations. Better for hard questions; cost and latency are higher, so you need a stop condition.

## Common pitfalls

- Multi-agent for the slogan; no real gain from the split.
- Messy state; nodes pass critical data as prose.
- No stop condition; the Agent loops plan / retrieve / reflect.
- Reviewer only polishes tone; never checks evidence or constraints.
- Planner emits tiny steps; execution cost explodes.
- All agents share high-privilege tools; no role-level ACL.
- Agentic RAG with no retrieval-round cap; latency and cost unbounded.

## Interview template

> I bring in a graph when the task has multiple steps, branches, or human approval. I split Planner, Retriever, Executor, Reviewer, Human, Final. Shared State holds goal, tool results, errors, and confirmations. Conditional edges drive retry, ask, stop, and human handoff. I only split into multiple agents when roles, tool permissions, or eval criteria differ — otherwise communication cost wins. For Agentic RAG I cap retrieval rounds and cost, and every answer must point back to evidence.

## Practice next

- Graph state for an interview-mock Agent: question, answer, follow-up, score, advice.
- A RAG router: simple questions answer directly; hard ones multi-retrieve + rerank.
- Reviewer + Human nodes before high-risk tools.
- Max steps, max cost, max retries so the graph cannot run away.
