# Day 71 scenario: large-file upload — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 71 | Large-file upload | [File upload](../scenarios/file-upload) |

## Today's goals

- Finish `/en/scenarios/file-upload`
- Produce a large-file upload design diagram: chunking / hash / concurrency / instant upload / resume / merge
- Prepare the answer structure: break down the problem → pick a design → edge-case trade-offs → landing points

## Reading checkpoints

- Chunk size is commonly 2–10MB; be ready to explain why not 100MB per chunk
- Instant upload depends on a server-side hash store; compute the hash in a Web Worker with spark-md5, appending chunk by chunk
- Resume depends on the server returning already-uploaded chunk indexes so the client skips them

## Cheat sheet / knowledge

### Core large-file upload flow

```text
1. Pick a file → File object
2. Slice → Blob.slice(start, end) → chunks[]
3. Compute hash → Web Worker + spark-md5, append per chunk
4. Instant-upload check → send hash, ask if the server already has it
5. Resume → server returns uploaded chunk indexes, client skips them
6. Concurrent upload → cap concurrency (3-6), POST each chunk
7. Merge → when every chunk is up, tell the server to merge
```

### Chunk params

| Param | Recommended | Why |
|------|--------|------|
| Chunk size | 2-5 MB | Too small → too many requests; too large → a failed retry is expensive |
| Concurrency | 3-6 | Browsers cap same-origin connections at 6; leave headroom for other requests |
| Retries | 3 | Absorb network jitter |

### Hashing

- Use a **Web Worker** so the main thread is not blocked.
- Use spark-md5 `ArrayBuffer.append` to hash incrementally per chunk.
- For huge files (>1GB), a **sampled hash** (head + tail + a few middle slices) can speed things up.

### Instant upload & resume

| Feature | How it works | Depends on |
|------|------|------|
| **Instant upload** | File hash already exists on the server → return the URL directly | Server hash store |
| **Resume** | Server returns the uploaded chunk list → client skips those | Server records per-chunk state |

## Handwritten / flow

### Full flow

```text
User picks a file (200MB)
  ↓
Web Worker computes hash (spark-md5 append per chunk, UI stays responsive)
  ↓
POST /upload/check { hash, filename, totalChunks }
  ├─ Already exists → instant upload, return URL
  └─ Partially exists → return uploadedChunks: [0, 1, 3]
       ↓
Filter out uploaded chunks → leftover [2, 4, 5, ...]
  ↓
Concurrent upload (limit=4): each chunk POST /upload/chunk { hash, index, chunk }
  ├─ Failure → retry 3 times
  └─ All succeed → POST /upload/merge { hash, filename, totalChunks }
       ↓
Server merges chunks → return file URL
```

### Core code

```ts
// chunking
function createChunks(file: File, chunkSize = 5 * 1024 * 1024) {
  const chunks: Blob[] = []
  let cur = 0
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + chunkSize))
    cur += chunkSize
  }
  return chunks
}

// concurrency control
async function uploadWithLimit(tasks: (() => Promise<void>)[], limit = 4) {
  const executing = new Set<Promise<void>>()
  for (const task of tasks) {
    const p = task().then(() => executing.delete(p))
    executing.add(p)
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }
  await Promise.all(executing)
}

// hash in a Web Worker (worker.ts)
self.onmessage = async (e) => {
  const { chunks } = e.data
  const spark = new SparkMD5.ArrayBuffer()
  for (const chunk of chunks) {
    spark.append(await chunk.arrayBuffer())
    self.postMessage({ progress: /* ... */ })
  }
  self.postMessage({ hash: spark.end() })
}
```

## Spoken questions

### 1. How many steps is large-file upload? What pitfalls at each step?

Answer template:

> Seven steps. Slice → hash → instant-upload check → resume → concurrent upload → retry on failure → merge.
>
> Pitfalls: hashing blocks the main thread — fix with a Web Worker. Chunks that are too small explode request count (200MB / 100KB = 2000 requests); chunks that are too large make one failure expensive to retry — recommend 2-5MB. Cap concurrency at 3-6, otherwise the browser’s 6 same-origin connections fill up and other requests queue. If merge is not idempotent, a duplicate request creates extra files — use hash as the unique id.

### 2. What if the user refreshes mid-upload?

Answer template:

> Resume. The server stores each chunk by hash + chunk index. After refresh the user picks the same file again, the client computes the same hash, asks “which chunks of this hash are already up”, the server returns the uploaded index list, and the client only sends the rest.
>
> Optimization: persist progress (hash + filename + uploaded indexes) in `localStorage` so a refresh can resume without re-picking the file. Clean up stale records so localStorage does not bloat.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Break down the problem (why not a single POST? chunking + hash + concurrency) (1 min)
2. Main design (7-step flow + param choices) (2.5 min)
3. Edges (instant upload / resume / refresh recovery / retry) (1.5 min)

After recording, self-check:

- Did you mention hashing in a Web Worker.
- Did you give a reason for 2-5MB chunks.
- Did you mention concurrency 3-6.
- Did you explain how resume works.

## Today's recap

The 3 points that most need a follow-up today:

1. Sampled-hash details (2MB from head and tail + one slice every N chunks).
2. The `tus` protocol (a standard for resumable upload).
3. Progress bar (`XMLHttpRequest.upload.onprogress` or `fetch` + `ReadableStream`).
