# Large files: chunked upload, resume, instant upload

## 1. Design goals

- Upload very large files reliably (e.g. 2GB+).
- After a network drop, continue instead of starting from zero.
- Instant-upload files whose content was already stored.
- Server verifies integrity so dirty data never lands.

## 2. Core flow

1. The client hashes the file and calls the “instant-upload check” API.
2. If the server already has the full file, return success (instant upload).
3. Otherwise slice at a fixed size (e.g. 5MB) and upload in parallel.
4. Before upload, fetch the list of chunks already stored; only send missing ones (resume).
5. After all chunks land, call merge; the server concatenates in order and re-checks the hash.

## 3. Frontend points

### 1) Chunking and concurrency

```ts
function createChunks(file: File, chunkSize = 5 * 1024 * 1024) {
  const chunks: Blob[] = []
  let start = 0
  while (start < file.size) {
    chunks.push(file.slice(start, start + chunkSize))
    start += chunkSize
  }
  return chunks
}
```

- Concurrency of 3–6 is enough; more saturates bandwidth and the backend.
- Use a request queue. Failed chunks retry with exponential backoff.

### 2) Resume

- Resume key: `fileHash + chunkIndex`.
- Persist task state locally (`localStorage` / `IndexedDB`).
- After a refresh, pull the server’s uploaded-chunk list, then fill the gaps.

### 3) Instant upload

- Dedup by **content**, not by filename.
- Hash in a `Web Worker` so the main thread stays free.

## 4. Server points

- Temp dir: `/tmp/{fileHash}/{index}`.
- Before merge: chunk count, missing pieces, per-chunk size.
- After merge: whole-file hash must match the client.
- Cleanup: failed jobs and stale temp files on a timer.

## 5. Follow-ups

### Q1: Hashing is slow. What then?

- Fast precheck: first 1MB + middle 1MB + last 1MB.
- Only run a full hash when the precheck is likely to hit.
- Hash in a Worker; the main thread only updates progress UI.

### Q2: Is more concurrency always better?

- No. Too much concurrency congests the network, queues the server, and raises failure rate.
- Tune concurrency to the network (drop it on a weak link).

### Q3: How do you stop a chunk from being tampered with?

- Per-chunk signature or checksum.
- Re-hash the whole file after merge. The backend check is authoritative.

## Daily practice reference

### Day 71: Core large-file upload flow

```text
1. Pick a file → File object
2. Slice → Blob.slice(start, end) → chunks[]
3. Compute hash → Web Worker + spark-md5, append per chunk
4. Instant-upload check → send hash, ask if the server already has it
5. Resume → server returns uploaded chunk indexes, client skips them
6. Concurrent upload → cap concurrency (3-6), POST each chunk
7. Merge → when every chunk is up, tell the server to merge
```

### Day 71: Chunk params

| Param | Recommended | Why |
|------|--------|------|
| Chunk size | 2-5 MB | Too small → too many requests; too large → a failed retry is expensive |
| Concurrency | 3-6 | Browsers cap same-origin connections at 6; leave headroom for other requests |
| Retries | 3 | Absorb network jitter |

### Day 71: Hashing

- Use a **Web Worker** so the main thread is not blocked.
- Use spark-md5 `ArrayBuffer.append` to hash incrementally per chunk.
- For huge files (>1GB), a **sampled hash** (head + tail + a few middle slices) can speed things up.

### Day 71: Instant upload & resume

| Feature | How it works | Depends on |
|------|------|------|
| **Instant upload** | File hash already exists on the server → return the URL directly | Server hash store |
| **Resume** | Server returns the uploaded chunk list → client skips those | Server records per-chunk state |

### Day 71: Full flow

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

### Day 71: Core code

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
