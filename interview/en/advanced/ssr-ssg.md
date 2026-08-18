# SSR / SSG and hydration

## 1. Why SSR

- Better SEO (crawlers get full HTML).
- Faster first paint (users see content sooner on a weak network).

## 2. SSR vs SSG

- **SSR**: the server renders on each request. Good for highly dynamic pages.
- **SSG**: HTML is generated at build time. Good for stable content (docs, blogs, marketing pages).

## 3. Hydration

The server emits HTML first. The client then “takes over” that DOM with events and state.

### Interview points

- Hydration mismatch: server HTML and client render disagree.
- Common causes: timestamps, random numbers, browser-only APIs run on the server.

## 4. In frameworks

- Next.js (React) and Nuxt (Vue) both mix SSR and SSG.
- Real apps pick a strategy per page, not one mode for the whole site.
