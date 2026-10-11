# Day 75 monitoring / error tracking / observability — execution log

## Goals

- Finish `/en/network&broswer/error-monitoring`, `/en/observability-system`
- Output the three pillars of frontend observability: logs / metrics / traces
- Draw an error-report pipeline: capture → aggregate → report → consume

## Read in order

1. [Error monitoring](../network&broswer/error-monitoring)
2. [Observability](../network&broswer/observability-system)

## Practice and self-check

**Checkpoints**

- Frontend error sources: JS error, Promise rejection, resource load failure, API error, white screen
- Report with `sendBeacon` / `fetch keepalive` so unload does not drop events
- Logs must carry a release version and sourcemap, or production stacks are useless

**Produce or redraw from memory**

- Three pillars — [reference section](../network&broswer/observability-system#day-75-three-pillars)
- Error types — [reference section](../network&broswer/error-monitoring#day-75-error-types)
- Error-report design — [reference section](../network&broswer/error-monitoring#day-75-error-report-design)
- When to report — [reference section](../network&broswer/error-monitoring#day-75-when-to-report)
- SourceMap restore — [reference section](../network&broswer/error-monitoring#day-75-sourcemap-restore)
- Capture pipeline — [reference section](../network&broswer/error-monitoring#day-75-capture-pipeline)
- Minimal error SDK — [reference section](../network&broswer/error-monitoring#day-75-minimal-error-sdk)

**Answer aloud without reading a reference answer**

- 1. How would you layer frontend observability?
- 2. How do you monitor white screens?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Three pillars (Logs / Metrics / Traces) (1.5 min)
2. Error pipeline (capture → format → aggregate → report → SourceMap) (2 min)
3. Perf metrics + white-screen monitoring + alerting (1.5 min)

After recording, self-check:

- Did you name 5 error sources and how to catch them.
- Did you mention why sendBeacon helps.
- Did you walk through SourceMap restore.
- Did you describe a white-screen approach.

## Recap

The 3 points that most need a follow-up today:

1. Sampling design (P0 100%, P1 at 10%).
2. Session replay (rrweb) — idea and use.
3. Tying frontend APM to backend APM.
