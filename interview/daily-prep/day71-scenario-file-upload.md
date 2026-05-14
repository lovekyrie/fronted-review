# Day 71 场景题：大文件上传 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 71 | 大文件上传 | [文件上传](../scenarios/file-upload) |

## 今日目标

- 看完 `/scenarios/file-upload`
- 输出一张大文件上传方案图：分片 / hash / 并发 / 秒传 / 断点续传 / 合并
- 准备答题结构：问题分解 → 方案选型 → 边界取舍 → 落地关键点

## 阅读卡点

- 分片大小 2–10MB 之间常见，要能讲清“为什么不是 100MB 一片”
- 秒传依赖服务端已存在 hash 库；hash 计算用 Web Worker + spark-md5 分片累加
- 断点续传靠服务端返回“已上传的分片索引”，前端跳过已传

## 速记卡 / 知识点

### 大文件上传核心流程

```text
1. 选择文件 → File 对象
2. 分片 → Blob.slice(start, end) → chunks[]
3. 计算 hash → Web Worker + spark-md5 分片累加
4. 秒传检查 → 带 hash 问服务端是否已存在
5. 断点续传 → 服务端返回已上传 chunk 索引，前端跳过
6. 并发上传 → 控制并发数（3-6），逐片 POST
7. 合并 → 全部上传完，通知服务端合并
```

### 分片参数

| 参数 | 推荐值 | 原因 |
|------|--------|------|
| 分片大小 | 2-5 MB | 太小请求数多、太大失败重传代价高 |
| 并发数 | 3-6 | 浏览器同域并发限制 6，留余量给其他请求 |
| 重试次数 | 3 | 网络波动兜底 |

### Hash 计算

- 用 **Web Worker** 避免阻塞主线程。
- 用 **spark-md5** 的 `ArrayBuffer.append` 分片增量计算。
- 大文件（>1GB）可以用**抽样 hash**（首尾 + 中间几段）提速。

### 秒传 & 断点续传

| 功能 | 原理 | 依赖 |
|------|------|------|
| **秒传** | 文件 hash 在服务端已存在 → 直接返回 URL | 服务端 hash 库 |
| **断点续传** | 服务端返回已上传 chunk 列表 → 前端跳过 | 服务端记录分片状态 |

## 手写 / 流程图

### 完整流程图

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

### 核心代码

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

## 口述题

### 1. 大文件上传分几步？每步可能踩什么坑？

回答模板：

> 七步。分片 → hash 计算 → 秒传检查 → 断点续传 → 并发上传 → 失败重试 → 合并。
>
> 坑：hash 计算会阻塞主线程——用 Web Worker 解决。分片太小请求数爆炸（200MB / 100KB = 2000 个请求），太大失败一片就要重传很多——推荐 2-5MB。并发数要控制在 3-6，否则浏览器同域 6 连接被打满，其他请求排队。合并时如果服务端没做幂等，重复请求会创建多个文件——用 hash 做唯一标识。

### 2. 如果用户在上传途中刷新页面怎么办？

回答模板：

> 靠断点续传。服务端按 hash + chunk index 存储每个分片。用户刷新后重新选同一个文件，前端算出相同的 hash，问服务端"这个 hash 已上传了哪些分片"，服务端返回已上传的索引列表，前端只上传剩余分片。
>
> 优化：把上传进度（hash + 文件名 + 已上传索引）存到 `localStorage`，刷新后自动恢复，用户不需要重新选文件。但要注意清理过期记录，防止 localStorage 膨胀。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 问题拆解（为什么不能直接传？分片 + hash + 并发）（1 分钟）
2. 方案主线（7 步流程 + 参数选型）（2.5 分钟）
3. 边界处理（秒传 / 断点续传 / 刷新恢复 / 失败重试）（1.5 分钟）

录完后自查：

- 是否说出 Web Worker 算 hash。
- 是否说出分片大小 2-5MB 的理由。
- 是否说出并发控制 3-6。
- 是否说出断点续传的原理。

## 今日复盘

今天最需要回补的 3 个点：

1. 抽样 hash 的具体实现（首尾各取 2MB + 每隔 N 个 chunk 取一段）。
2. `tus` 协议（标准化的断点续传协议）。
3. 上传进度条的实现（`XMLHttpRequest.upload.onprogress` 或 `fetch` + `ReadableStream`）。
