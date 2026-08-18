# Day 24 Nginx Config Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 24 | Nginx | [Deployment](../advanced/week2/deployment) |

## Today's goals

- Finish the Nginx Beginner's Guide
- Write an annotated version based on this repo's `nginx.conf`
- Produce common frontend Nginx snippets: SPA history fallback, gzip, cache headers, reverse proxy

## Reading pitfalls

- SPA routing needs `try_files $uri $uri/ /index.html;` or a refresh will 404
- Hashed static assets can use `Cache-Control: public, max-age=31536000, immutable`; `index.html` needs `no-cache`
- With or without a trailing `/` on `proxy_pass` behaves differently, and it is easy to get wrong

## Cheat sheet / key points

- Common Nginx jobs in frontend deploys: static file serving, SPA route fallback, cache headers, gzip/brotli, reverse proxy, and simple security headers.
- A history-router refresh 404 happens because the browser requests `/user/1` directly, and the server has no such real file. You need a fallback to `index.html`.
- `try_files $uri $uri/ /index.html;` means: look for a real file, then a directory, then hand it to the frontend router.
- Cache HTML and hashed static assets differently: `index.html` must update promptly; `assets/*.hash.js` can be long-cached.
- Common `location` priority: exact `=`, prefix match, regex match. You do not have to recite every rule in interviews, but you should know that blocks can override each other.
- A trailing `/` on `proxy_pass` changes how the forwarded path is joined. This is a high-frequency API reverse-proxy pitfall.
- gzip is good for text assets such as HTML, CSS, JS, and JSON. Already-compressed images and video gain little.
- Frontend cache debugging must look at response headers, filename hashes, CDN cache, browser cache, and the service worker together.

## Handwritten / flow diagrams

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    location = /index.html {
        add_header Cache-Control "no-cache";
        try_files /index.html =404;
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```text
User visits /dashboard
  -> Nginx looks for the real file /dashboard
  -> File does not exist
  -> try_files falls back to /index.html
  -> Browser loads JS
  -> Frontend Router takes over /dashboard
```

## Oral questions

### 1. How do you fix an SPA refresh 404?

> Answer template: With a history router, in-app navigation is handled by the frontend, but a refresh or a direct visit to a deep path hits the server first. If the server looks for a real file at `/dashboard` and cannot find it, you get a 404. The fix is `try_files $uri $uri/ /index.html;` in Nginx `location /`, so requests that are not real static files fall back to the entry HTML, and the frontend Router renders from the path. Be careful not to fall API routes and real static assets back incorrectly.

### 2. How do you set cache headers for static assets + HTML?

> Answer template: Configure HTML and static assets separately. `index.html` is the entry that references assets, so after a release you need the new version quickly. Usually set `no-cache` or a short cache so the browser at least revalidates with the server. JS, CSS, and images with contenthash change filename when content changes, so they can use a one-year long cache and `immutable`. Users then get new HTML promptly and can reuse unchanged static assets for a long time. On rollback you still need the old hashed files that the old HTML references not to have been deleted early.

## 5-minute recording outline

1. location matching + try_files (1.5 minutes)
2. Cache-header combinations (2 minutes)
3. Reverse proxy + gzip (1.5 minutes)

## Today's review

1. Most likely follow-up: SPA fallback must not send `/api/` and real static assets to `index.html` by mistake, or problems get hidden.
2. Current gap: `proxy_pass` path joining is easy to get wrong. Prepare a contrast with and without a trailing `/`.
3. Next to add: connect Nginx cache headers with Day 20 contenthash and Day 26 rollback strategy.
