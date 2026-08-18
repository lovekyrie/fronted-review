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
