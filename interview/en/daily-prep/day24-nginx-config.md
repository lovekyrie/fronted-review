# Day 24 Nginx Config

## Goals

- Finish the Nginx Beginner's Guide
- Write an annotated version based on this repo's `nginx.conf`
- Produce common frontend Nginx snippets: SPA history fallback, gzip, cache headers, reverse proxy

## Read in order

1. [Deployment](../advanced/week2/deployment)

## Practice and self-check

**Checkpoints**

- SPA routing needs `try_files $uri $uri/ /index.html;` or a refresh will 404
- Hashed static assets can use `Cache-Control: public, max-age=31536000, immutable`; `index.html` needs `no-cache`
- With or without a trailing `/` on `proxy_pass` behaves differently, and it is easy to get wrong

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week2/deployment#day-24-knowledge-notes)
- Practice example — [reference section](../advanced/week2/deployment#day-24-practice-example)

**Answer aloud without reading a reference answer**

- 1. How do you fix an SPA refresh 404?
- 2. How do you set cache headers for static assets + HTML?

**Recording drill**

1. location matching + try_files (1.5 minutes)
2. Cache-header combinations (2 minutes)
3. Reverse proxy + gzip (1.5 minutes)

## Recap

1. Most likely follow-up: SPA fallback must not send `/api/` and real static assets to `index.html` by mistake, or problems get hidden.
2. Current gap: `proxy_pass` path joining is easy to get wrong. Prepare a contrast with and without a trailing `/`.
3. Next to add: connect Nginx cache headers with Day 20 contenthash and Day 26 rollback strategy.
