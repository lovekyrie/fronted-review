# Day 71 scenario: large-file upload — execution log

## Goals

- Finish `/en/scenarios/file-upload`
- Produce a large-file upload design diagram: chunking / hash / concurrency / instant upload / resume / merge
- Prepare the answer structure: break down the problem → pick a design → edge-case trade-offs → landing points

## Read in order

1. [File upload](../scenarios/file-upload)

## Practice and self-check

**Checkpoints**

- Chunk size is commonly 2–10MB; be ready to explain why not 100MB per chunk
- Instant upload depends on a server-side hash store; compute the hash in a Web Worker with spark-md5, appending chunk by chunk
- Resume depends on the server returning already-uploaded chunk indexes so the client skips them

**Produce or redraw from memory**

- Core large-file upload flow — [reference section](../scenarios/file-upload#day-71-core-large-file-upload-flow)
- Chunk params — [reference section](../scenarios/file-upload#day-71-chunk-params)
- Hashing — [reference section](../scenarios/file-upload#day-71-hashing)
- Instant upload & resume — [reference section](../scenarios/file-upload#day-71-instant-upload-resume)
- Full flow — [reference section](../scenarios/file-upload#day-71-full-flow)
- Core code — [reference section](../scenarios/file-upload#day-71-core-code)

**Answer aloud without reading a reference answer**

- 1. How many steps is large-file upload? What pitfalls at each step?
- 2. What if the user refreshes mid-upload?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Break down the problem (why not a single POST? chunking + hash + concurrency) (1 min)
2. Main design (7-step flow + param choices) (2.5 min)
3. Edges (instant upload / resume / refresh recovery / retry) (1.5 min)

After recording, self-check:

- Did you mention hashing in a Web Worker.
- Did you give a reason for 2-5MB chunks.
- Did you mention concurrency 3-6.
- Did you explain how resume works.

## Recap

The 3 points that most need a follow-up today:

1. Sampled-hash details (2MB from head and tail + one slice every N chunks).
2. The `tus` protocol (a standard for resumable upload).
3. Progress bar (`XMLHttpRequest.upload.onprogress` or `fetch` + `ReadableStream`).
