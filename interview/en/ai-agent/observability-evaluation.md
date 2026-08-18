---
title: Eval & observability
description: LangSmith, Agent debugging, RAG eval, recall, accuracy, latency, and cost
---

# Eval & observability

## Core takeaway

After launch, the hard part is not “can it answer” but “how do we know it is good, why it got worse, and whether a change helped”. Eval judges quality. Observability reconstructs the run. Together they support iteration.

In interviews, cover the metrics: RAG → recall and citation correctness; Agent → task completion and tool success; Runtime → latency and error rate; product → adoption and human-in-the-loop rate; cost → tokens, model, retrieval, rerank.

## Pipeline

```text
Online request
  -> Record traceId, prompt, model, params
  -> Record retrieval query, docs, rerank scores
  -> Record tool calls, args, latency, errors
  -> Record model output, citations, user feedback
  -> Replay offline eval set
  -> Compare accuracy, recall, latency, cost
  -> Tune prompt, retrieval, tools, or model
```

## Concepts

### Trace

A trace reconstructs one Agent run: user input, prompt, context, model output, tool calls, retrieval, errors, latency, cost. Without it you cannot tell if the bug is retrieval, prompt, model, tool, or frontend protocol.

### LangSmith-style tools

These tools record the chain, debug prompts, replay samples, and run eval. Even without the product, copy the idea: every step has I/O; every change compares to history.

### RAG eval

At least two layers:

- Retrieval quality: was the right doc recalled, and ranked high enough?
- Generation quality: is the answer grounded, correctly cited, not hallucinated?

Common metrics:

| Metric | What it asks |
|------|--------|
| Recall@K | Is the right snippet in the top K? |
| MRR | How high is the first correct hit? |
| Answer Correctness | Is the final answer right? |
| Faithfulness | Is the answer faithful to context? |
| Citation Accuracy | Do citations match real sources? |

### Agent eval

Judge whether the *task* finished, not whether the prose is fluent. Metrics: task completion, tool success rate, human-approval rate, retry count, failure-reason mix, user adoption.

### Latency and cost

Agents get slow because they may retrieve several times, call tools, rerank, and reflect. Split:

- Time to first token.
- End-to-end time.
- Tool time.
- Retrieval + rerank time.
- Tokens and model spend.
- Extra cost from failed retries.

## Common pitfalls

- Only subjective feedback; no fixed eval set, so changes are incomparable.
- Only score the final answer; no recalled snippets, so RAG bugs are invisible.
- Traces store PII with no redaction or access control.
- Prompt / model / index versions not recorded; cannot reproduce.
- Chase accuracy, ignore latency and cost; cannot ship.
- Offline set is too clean; real fuzzy questions and bad input never appear.
- No failure taxonomy; everything is “the model is unstable”.

## Interview template

> I split Agent eval into offline and online. Offline: a fixed question set, RAG Recall@K / answer correctness / citation accuracy, Agent task completion and tool success. Online: traces that stitch prompt, retrieval, tools, model output, latency, cost, and user feedback. A bad answer can then be located as miss / wrong context / tool fail / hallucination / frontend protocol. Every prompt, model, or index change compares to the last baseline — not a gut-feel ship.

## Practice next

- 30 fixed eval questions plus gold source snippets for the frontend KB RAG.
- Per-answer log of prompt version, index version, topK docs, final citations.
- Failure taxonomy: no recall, wrong recall, tool fail, bad output shape, user cancel.
- A small dashboard: accuracy, recall, p50 latency, average token cost.
