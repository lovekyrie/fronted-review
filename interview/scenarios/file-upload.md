# 大文件处理：分片上传、断点续传、秒传

## 一、设计目标

- 支持超大文件稳定上传（例如 2GB+）。
- 网络中断后可以继续上传，而不是从 0 开始。
- 对已上传过的同内容文件实现秒传。
- 服务端可校验完整性，避免脏数据。

## 二、核心流程

1. 前端计算文件指纹（hash），先调用「秒传检查接口」。
2. 若服务端已存在完整文件，直接返回成功（秒传）。
3. 若不存在，按固定大小切片（例如 5MB）并并发上传。
4. 上传前查询已上传分片清单，仅上传缺失分片（断点续传）。
5. 上传完成后调用合并接口，服务端按序合并并二次校验 hash。

## 三、前端关键点

### 1) 切片与并发控制

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

- 并发建议 3~6，避免把带宽和后端瞬时打满。
- 使用请求队列控制并发，失败分片支持指数退避重试。

### 2) 断点续传

- 断点依据：`fileHash + chunkIndex`。
- 本地可记录上传任务状态（`localStorage` / `IndexedDB`）。
- 页面刷新后先拉取服务端已上传分片列表，再补传。

### 3) 秒传

- 秒传本质：文件内容去重，不是文件名去重。
- 指纹计算可放在 `Web Worker`，避免阻塞主线程。

## 四、服务端关键点

- 分片临时存储目录：`/tmp/{fileHash}/{index}`。
- 合并前校验：分片总数、缺失片段、每片大小。
- 合并后校验：整体 hash 与前端上报一致。
- 清理策略：失败任务与过期临时文件定时删除。

## 五、面试追问与回答思路

### Q1：hash 很慢怎么办？

- 先算前 1MB + 中间 1MB + 后 1MB 做快速预检。
- 命中概率高时再决定是否做全量 hash。
- 在 Worker 中计算，主线程只更新进度 UI。

### Q2：并发越高越好吗？

- 不是。并发过高会导致网络拥塞、服务端排队与失败率上升。
- 通常按网络环境动态调整并发（弱网降并发）。

### Q3：如何防止分片被篡改？

- 每个分片可带签名或 checksum。
- 合并后做全文件 hash 复验，最终以后端校验为准。

## 每日练习参考

### Day 71：大文件上传核心流程

```text
1. 选择文件 → File 对象
2. 分片 → Blob.slice(start, end) → chunks[]
3. 计算 hash → Web Worker + spark-md5 分片累加
4. 秒传检查 → 带 hash 问服务端是否已存在
5. 断点续传 → 服务端返回已上传 chunk 索引，前端跳过
6. 并发上传 → 控制并发数（3-6），逐片 POST
7. 合并 → 全部上传完，通知服务端合并
```

### Day 71：分片参数

| 参数 | 推荐值 | 原因 |
|------|--------|------|
| 分片大小 | 2-5 MB | 太小请求数多、太大失败重传代价高 |
| 并发数 | 3-6 | 浏览器同域并发限制 6，留余量给其他请求 |
| 重试次数 | 3 | 网络波动兜底 |

### Day 71：Hash 计算

- 用 **Web Worker** 避免阻塞主线程。
- 用 **spark-md5** 的 `ArrayBuffer.append` 分片增量计算。
- 大文件（>1GB）可以用**抽样 hash**（首尾 + 中间几段）提速。

### Day 71：秒传 & 断点续传

| 功能 | 原理 | 依赖 |
|------|------|------|
| **秒传** | 文件 hash 在服务端已存在 → 直接返回 URL | 服务端 hash 库 |
| **断点续传** | 服务端返回已上传 chunk 列表 → 前端跳过 | 服务端记录分片状态 |

### Day 71：完整流程图

```text
用户选择文件（200MB）
  ↓
Web Worker 计算 hash（spark-md5 分片累加，不阻塞 UI）
  ↓
POST /upload/check { hash, filename, totalChunks }
  ├─ 已存在 → 秒传，直接返回 URL
  └─ 部分存在 → 返回 uploadedChunks: [0, 1, 3]
       ↓
过滤掉已上传的 chunks → 剩余 [2, 4, 5, ...]
  ↓
并发上传（limit=4）：每片 POST /upload/chunk { hash, index, chunk }
  ├─ 失败 → 重试 3 次
  └─ 全部成功 → POST /upload/merge { hash, filename, totalChunks }
       ↓
服务端合并分片 → 返回文件 URL
```

### Day 71：核心代码

```ts
// 分片
function createChunks(file: File, chunkSize = 5 * 1024 * 1024) {
  const chunks: Blob[] = []
  let cur = 0
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + chunkSize))
    cur += chunkSize
  }
  return chunks
}

// 并发控制
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

// Web Worker 算 hash（worker.ts）
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
