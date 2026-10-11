# Day 27 Production Troubleshooting Checklist

## Goals

- Collect the Day 22–26 deploy chain into a **post-release troubleshooting checklist** (sorted by priority)
- List the Top 10 production issues + how to debug them: blank screen / asset 404 / API CORS / cache mix-up / missing env vars / gzip not working / intranet health checks / certificates / CDN not fetching origin / users stuck on old version
- Write it as a Markdown template you can send to a teammate as-is

## Read in order

1. [Deployment](../advanced/week2/deployment)
2. [Error monitoring](../network&broswer/error-monitoring)

## Practice and self-check

**Checkpoints**

- A blank screen must be split into three root causes: **JS errors**, **API failures**, and **asset load failures**
- About 90% of cache mix-ups come from `index.html` being strongly cached. Be able to name the debug commands immediately
- Certificate issues need the specific `SSL handshake` failure error code

**Produce or redraw from memory**

- Post-release troubleshooting checklist — [reference section](../advanced/week2/deployment#day-27-post-release-troubleshooting-checklist)
- Supplementary notes — [reference section](../advanced/week2/deployment#day-27-supplementary-notes)

**Answer aloud without reading a reference answer**

- 1. A user says "it is a blank screen on open". How do you debug?
- 2. You shipped, but users still see the old page. What might cause that?

**Recording drill**

1. The three-way troubleshooting split (1.5 minutes)
2. Typical blank-screen chain (2 minutes)
3. Typical cache mix-up chain (1.5 minutes)

## Recap

1. Most likely follow-up: a blank screen is not one root cause. You must quickly split it into JS, assets, APIs, cache, and config.
2. Current gap: troubleshooting needs concrete commands or evidence, such as Network response headers, error-monitoring release, and container image tags.
3. Next to add: Day 28 should walk the full deploy chain smoothly and turn it into a 15-question answer book.
