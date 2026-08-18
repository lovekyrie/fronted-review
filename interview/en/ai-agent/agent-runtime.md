---
title: Agent Runtime
description: SSE streaming, AGUI-style protocols, ASR/TTS, cron, and Agent runtime design
---

# Agent Runtime

## Core takeaway

Agent Runtime is “how the Agent runs as a product”. Not just the model request: task state, streaming, tool events, cancel/retry, human approval, voice I/O, cron, permission audit, and the frontend render protocol.

A frontend engineer’s value often sits in Runtime UI: the user should see what the Agent is doing, confirm or interrupt at key steps, and recover after failure — not wait on an unexplained blob of text.

## Pipeline

```text
User creates a task
  -> Runtime creates runId / traceId
  -> SSE: task.started
  -> Model streams assistant.delta
  -> Tool events: tool.started / tool.finished / tool.failed
  -> High-risk action → approval.required
  -> User confirms, cancels, or edits args
  -> Runtime continues or rolls back
  -> task.finished
  -> Save trace, cost, latency, feedback
```

## Concepts

### SSE

SSE is one-way server → browser events. Versus returning the full answer at once, SSE lets the UI show tokens, stages, tool calls, errors, and done in real time.

Typical events:

| Event | Meaning |
|------|------|
| `task.started` | Task created |
| `assistant.delta` | Incremental model text |
| `tool.started` | Tool call started |
| `tool.finished` | Tool returned |
| `approval.required` | Needs user confirm |
| `task.failed` | Failed |
| `task.finished` | Done |

### AGUI-style protocols

These protocols are the event contract between Agent and UI. Not just text: renderable events — messages, tool cards, confirm forms, progress, errors, result citations.

Protocol design:

- Stable event types, versionable.
- Each event has `runId`, `messageId`, or `toolCallId`.
- Reconnect and replay.
- Cancel, retry, user confirm.

### ASR / TTS

A voice Agent chains speech-to-text, reasoning, and TTS. Frontend handles mic permission, chunked upload, live transcript, barge-in, latency, and multi-turn state.

Voice needs low latency and interruptibility more than text. Stop TTS when the user speaks. While a tool runs, a short status line beats a silent wait.

### Cron / scheduled tasks

Cron turns the Agent from “answer when asked” into “act on a schedule”: daily build checks, alert summaries, study recaps. You need trigger conditions, permissions, idempotency, notifications, and retry.

### Human approval

Any write, pay, delete, publish, or outbound message should ask a human. The confirm UI is not just “continue?”. Show tool name, key args, blast radius, and whether it is reversible.

## Common pitfalls

- SSE only streams tokens; users cannot see where it is stuck.
- No runId / toolCallId; UI cannot merge events or replay.
- Cancel only stops rendering; the backend keeps going.
- Disconnect has no resume; long tasks feel broken.
- High-risk tools with no confirm step.
- TTS cannot be interrupted — a broadcast, not a conversation.
- Cron without idempotency; retries duplicate tickets or notifies.

## Interview template

> I design Agent Runtime as an event-driven task system, not a streaming chat API. Each task has runId and traceId. The server pushes model deltas, tool calls, approval, errors, and done over SSE. The frontend renders messages, tool cards, progress, and confirm forms, plus cancel, retry, and reconnect. For voice and cron I extra-care about latency, barge-in, idempotency, and audit, so the Agent never does high-risk work while the user cannot see it.

## Practice next

- An SSE protocol for knowledge-base Q&A: text vs citation vs tool vs error.
- A tool-call card: status, arg summary, latency, result.
- Cancel that actually reaches the backend execution layer.
- A daily study-recap Agent that only drafts, never auto-sends.
