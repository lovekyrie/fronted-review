---
title: RAG pipeline
description: Loader, splitter, embedding, vector stores, Milvus, BM25, hybrid retrieval, rerank, GraphRAG
---

# RAG pipeline

## Core takeaway

RAG is not “plug in a vector DB”. It turns private knowledge into context that is searchable, citable, and evaluable. The full chain: load, clean, split, embed, index, recall, rerank, stitch context, generate, evaluate.

In interviews, talk about RAG as a system: data quality sets the ceiling, retrieval sets recall, rerank and context layout set answer quality, eval decides if you can keep improving.

## Pipeline

```text
Raw data
  -> Loader reads Markdown, PDF, pages, DB, tickets
  -> Clean titles, nav, scripts, duplicates
  -> Splitter chunks by semantics and length
  -> Embedding → vectors
  -> Vector store / inverted index / graph DB
  -> Query rewrite and intent
  -> Vector recall + BM25 keyword recall
  -> Reranker
  -> Stitch context and citations
  -> Model answers
  -> Eval recall, accuracy, latency, cost
```

## Concepts

### Loader

The loader pulls data in. A frontend knowledge base often comes from Markdown, VitePress pages, API docs, component docs, FAQs, Git history, and incident write-ups.

Loading is not “read the file”. Keep metadata:

- Path, title, section.
- Updated time and version.
- Permission scope.
- Source URL or citation anchor.

### Splitter

Splitter sets retrieval grain. Chunks too big → noisy recall. Too small → incomplete meaning. In practice, split on Markdown headings, paragraphs, code blocks, and a max token length, and keep the parent heading as context.

### Embedding

Embedding maps text to vectors for semantic similarity. Good at “close in meaning”, weaker at exact keywords, version numbers, API names, error codes. Production RAG usually hybridizes.

### Vector stores and Milvus

The vector store holds vectors and does similarity search. Milvus is a common one: large indexes, filters, similarity queries. Position it as “vector retrieval infra”, not as all of RAG.

### BM25 and hybrid retrieval

BM25 is classic keyword relevance — good at terms, function names, error codes, titles. Hybrid retrieval merges vector and BM25 recall, then reranks so you get both semantic and exact hits.

### Reranker

Reranker reorders the first-pass candidates. It is usually better than raw vector score at “does this snippet actually answer the question?” Cost is extra latency, so cap candidate count.

### GraphRAG

GraphRAG puts entities, relations, and snippets on a graph. Useful for “this module, owner, incident, dependency, and fix — how are they related?” Not the default for every KB; use it when relation reasoning clearly matters.

## Common pitfalls

- Uncleaned nav, footers, duplicates in the index → bad recall.
- Fixed-length splits that break headings, tables, code blocks.
- Vector-only retrieval; API names, error codes, proper nouns miss.
- No source citations; users cannot trust the answer.
- Too much context stitched in: noise and cost go up.
- No eval set; a few manual questions pretend to be quality.
- No incremental index or versioning; answers cite stale docs.

## Interview template

> I split RAG into data, retrieval, and generation. Data: loader + clean, chunk by heading and semantics, keep path / section / permission metadata. Retrieval: vectors for meaning, BM25 for keywords and API names, then a reranker. Generation: feed top snippets with citations and require the answer to stay inside that context. I judge with a fixed eval set on recall, answer accuracy, latency, and cost — not vibes.

## Practice next

- A Markdown loader for this VitePress site, keeping heading tree and file path.
- An offline chunk script emitting `docId`, `heading`, `content`, `source`.
- Hybrid retrieval experiments: vector-only vs BM25-only vs vector + BM25 + rerank.
- A 30-question frontend-interview eval set, logging which snippet was hit.
