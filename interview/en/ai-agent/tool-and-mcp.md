---
title: Tools & MCP
description: Tool calling, MCP, browser MCP, and cross-process tools in an AI Agent
---

# Tools & MCP

## Core takeaway

Tool calling is “how the model does an external action”. MCP is “how those capabilities are exposed and connected in a standard way”. In interviews, do not stop at function calling. Cover schema, permissions, idempotency, errors, call logs, and frontend display.

A stable tool system is not “more functions”. Each function needs validatable inputs, parseable outputs, controlled permissions, a traceable process, and recoverable failures.

## Pipeline

```text
User goal
  -> Model decides if a tool is needed
  -> Generate args from the tool schema
  -> Runtime validates args and permissions
  -> Call a local fn, HTTP service, browser MCP, or another process
  -> Return a structured result
  -> Model continues or produces the final answer
  -> Frontend shows the call, result, and errors
```

From the frontend you usually see three kinds of tools:

- Read: search docs, read a page, hit an API, pull a repo file.
- Write: create a ticket, change config, start an approval, submit a form.
- Interact: open a browser, click, screenshot, upload, wait for confirmation.

## Concepts

### Tool schema

The schema names the tool, its purpose, param types, required fields, and return shape. Stable calling depends on a schema that is clear, single-purpose, and low-ambiguity.

Design notes:

- Names are actions: `searchDocs`, `getOrderDetail`, `createTicket`.
- Keep params structured; do not make the model concatenate prose.
- Mark required vs optional.
- Stable field names in the return so downstream does not parse natural language again.

### Function calling

Function calling is the model emitting intent and args. Execution happens in the app runtime. The model must not have unlimited power; the app layer validates, auths, audits, and controls side effects.

### MCP

MCP decouples tool servers from the model client. A typical MCP server can expose filesystem, Git, DB, browser, design files, a knowledge base, or an internal platform. If the client speaks the protocol, it can discover tools, read resources, and call them.

### Browser MCP

Browser MCP is good for reading pages, automation, screenshots, and E2E checks. It matters for frontend engineers because many tasks are not “generate an answer” but “understand the current page and act on the UI”.

Typical uses:

- Read DOM and visible text.
- Click, type, submit.
- Screenshot for visual checks.
- Replay a user path in a real browser.

### Cross-process tool calls

Tools often do not live in one process: UI → backend API → MCP server → browser or DB. You need timeouts, cancel, retry, correlated logs, and error codes.

## Common pitfalls

- One tool that queries, mutates, and notifies — the model cannot pick it reliably.
- Params are free text, with no enum, range, or format.
- Writes without human approval; a wrong call has real side effects.
- Tools return a wall of text; neither model nor frontend can consume it.
- MCP servers with overly wide permissions; no isolation by project, user, or env.
- No trace id; a cross-process failure cannot be reconstructed.
- Raw tool errors shown to users, with no recovery hint.

## Interview template

> I treat a Tool as the Agent’s execution layer, not a random function. I define the boundary and schema first: the model only picks the tool and fills args; the runtime validates, checks permissions, actually calls, audits, and recovers. MCP’s value is a standard connection — files, browser, DB, knowledge base all via MCP servers. For high-risk writes I add human approval, an idempotency key, timeout/retry, and a call log, so the Agent is not an uncontrolled script.

## Practice next

- A `searchDocs` tool for the knowledge base: keywords + scope → structured snippets.
- Browser MCP crawl of the VitePress site: open pages, check titles, links, screenshots.
- A tool-call card UI: name, args, status, latency, result.
- Confirm + idempotency key for writes as a safety baseline.
