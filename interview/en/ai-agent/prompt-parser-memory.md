---
title: Prompt / Parser / Memory
description: Prompt templates, structured output, output parsers, and Agent memory
---

# Prompt / Parser / Memory

## Core takeaway

Prompt is how the model understands the task. Parser is how the system consumes the output reliably. Memory is how the Agent keeps context across turns. Together they move the Agent from “can answer” to “can run a stable flow”.

Do not worship a giant prompt. Split goal, context, constraints, output schema, tool notes, and failure policy, then validate with a structured parser.

## Pipeline

```text
Business input
  -> Prompt template injects role, task, context, constraints
  -> Model emits prose, JSON, or a tool call
  -> Output parser checks structure and fields
  -> On invalid: retry, repair, or degrade
  -> Memory writes this-turn summary, preference, or task state
  -> Next turn reads only the memory it needs
```

Frontend should care whether output can drive UI. Tables, steps, forms, approval flows, graph nodes should all be a structured protocol — not guessed from prose.

## Concepts

### Prompt template

A reusable template, usually:

- Role: who the model is.
- Task: this turn’s goal.
- Context: user input, history summary, retrieved snippets, tool results.
- Constraints: what not to do, what boundaries to keep.
- Output format: JSON schema, Markdown template, or field list.
- Failure policy: ask, refuse, or degrade when info is missing.

### Output parser

Turns model output into app data. Common shapes:

- JSON object: forms, config, structured results.
- Labels: intent, routing.
- Step list: plan and progress.
- Cited answers: RAG; bind the answer to source snippets.

The parser makes failure visible. Better to catch missing fields, wrong types, or illegal citations at parse time and repair/retry than to push dirty data into the UI.

### LCEL-style thinking

LCEL-style chains compose Prompt, Model, Parser, Retriever, Tool into an observable, reusable pipeline. Even without LangChain, copy the split: each step has a clear I/O, so you can test and swap.

### Three memory strategies

#### Short context

Stuff the last few turns into the window. Simple for short tasks. Token-heavy; long chats lose early info.

#### Summary memory

Compress history into a summary: goal, constraints, decisions, unfinished items. Good for ongoing work; a bad summary contaminates later turns.

#### Long-term memory

Store preferences, project background, stable facts in a DB or vector store. Good for personalization. Needs write review, expiry, privacy, and delete.

## Common pitfalls

- Lots of rules, no output schema — still uncontrolled.
- Parser only handles the happy path; no retry/degrade on parse fail.
- Dumping every history message back in: cost and noise grow.
- Auto-writing all content to memory; a temp preference becomes a “fact”.
- Summaries drop key constraints; later execution drifts.
- Structured output has no version; UI protocol upgrades break.

## Interview template

> I treat Prompt, Parser, and Memory as a stability chain. Prompt states task, context, and constraints. Parser validates output into something frontend or backend can consume. Memory keeps the state a multi-turn task needs. I do not just write a long prompt: I define an output schema, a parse-failure policy, write rules, and expiry. Then the Agent can enter a real business flow instead of staying as chat text.

## Practice next

- A JSON schema for an interview-question generator: stem, topic, difficulty, follow-up, reference answer.
- Parser retry: feed validation errors back and ask the model to fix the JSON.
- Session summary in Memory: goal, constraints, done, pending confirm.
- A write whitelist so only stable preferences and project facts go long-term.
