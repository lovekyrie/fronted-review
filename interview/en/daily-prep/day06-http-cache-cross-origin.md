# Day 6 HTTP / Caching / Cross-Origin / Storage

## Goals

- Finish `/en/network&broswer/http-protocol`, `/en/cache-mechanism`, `/en/cross-origin`, `/en/broswer-storage`
- Produce a short flowchart of “from entering a URL to displaying the page”
- Produce one page of a *Caching Answer Template* (strong cache / negotiation cache / asset versioning)

## Read in order

1. [HTTP Protocol](../network&broswer/http-protocol)
2. [Caching](../network&broswer/cache-mechanism)
3. [Cross-Origin](../network&broswer/cross-origin)
4. [Browser Storage](../network&broswer/broswer-storage)

## Practice and self-check

**Checkpoints**

- HTTP/1.1 head-of-line blocking, HTTP/2 multiplexing, and HTTP/3 QUIC solve problems at different layers
- For strong cache, `Cache-Control` outranks `Expires`; for negotiation cache, `ETag` outranks `Last-Modified`
- CORS preflight triggers: non-simple method / custom headers / non-simple Content-Type

**Produce or redraw from memory**

- HTTP version differences — [reference section](../network&broswer/http-protocol#day-6-http-version-differences)
- Common status codes — [reference section](../network&broswer/http-protocol#day-6-common-status-codes)
- Two-layer cache model — [reference section](../network&broswer/cache-mechanism#day-6-two-layer-cache-model)
- CORS — [reference section](../network&broswer/cross-origin#day-6-cors)
- Browser storage comparison — [reference section](../network&broswer/broswer-storage#day-6-browser-storage-comparison)
- From entering a URL to displaying the page — [reference section](../network&broswer/http-protocol#day-6-from-entering-a-url-to-displaying-the-page)
- Cache decision flowchart — [reference section](../network&broswer/cache-mechanism#day-6-cache-decision-flowchart)

**Answer aloud without reading a reference answer**

- 1. How do you combine strong cache and negotiation cache?
- 2. When does a preflight request fire?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. HTTP version differences (1.1 HOL blocking → 2 multiplexing → 3 QUIC) (1.5 minutes)
2. Two-layer cache model + versioning strategy (2 minutes)
3. CORS simple vs preflight + trigger conditions (1.5 minutes)

Self-check after recording:

- Did you say the priority relationship between strong cache and negotiation cache?
- Did you say ETag outranks Last-Modified?
- Did you say the 3 preflight trigger conditions?
- Did you say the HTML no-cache + JS/CSS hash engineering practice?

## Recap

The 3 points that most need follow-up today:

1. How HTTP/2 multiplexing is implemented (frames, streams, the binary framing layer).
2. The three `SameSite` values and their impact on third-party cookies.
3. The interaction order between Service Worker and HTTP cache.
