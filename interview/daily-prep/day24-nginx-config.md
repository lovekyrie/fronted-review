# Day 24 Nginx 配置 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 24 | Nginx | [部署](../advanced/week2/deployment) |

## 今日目标

- 看完 Nginx Beginner's Guide
- 基于仓库 `nginx.conf` 写注释版
- 输出前端常用 Nginx 片段：SPA history 回退、gzip、缓存头、反向代理

## 阅读卡点

- SPA 路由需要 `try_files $uri $uri/ /index.html;` 否则刷新会 404
- 静态资源带 hash 可以 `Cache-Control: public, max-age=31536000, immutable`，`index.html` 要 `no-cache`
- `proxy_pass` 的末尾有无 `/` 行为不同，容易踩坑

## 速记卡 / 知识点

- Nginx 在前端部署里常见职责：静态资源服务、SPA 路由兜底、缓存头、gzip/brotli、反向代理、简单安全头。
- SPA history 路由刷新 404 的原因是浏览器直接请求 `/user/1`，服务端没有这个真实文件；需要 fallback 到 `index.html`。
- `try_files $uri $uri/ /index.html;` 的含义是先找真实文件，再找目录，找不到就交给前端路由。
- HTML 和 hash 静态资源缓存策略要分开：`index.html` 要能及时更新，`assets/*.hash.js` 可以长缓存。
- `location` 常见优先级：精确匹配 `=`，前缀匹配，正则匹配；面试不必背全规则，但要知道不同块可能互相覆盖。
- `proxy_pass` 末尾有无 `/` 会影响转发路径拼接，是 API 反向代理的高频坑点。
- gzip 适合压缩文本资源，如 HTML、CSS、JS、JSON；图片、视频等已压缩资源收益小。
- 前端缓存问题排查要同时看响应头、资源文件名 hash、CDN 缓存、浏览器缓存和 service worker。

## 手写 / 流程图

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
用户访问 /dashboard
  -> Nginx 查找真实文件 /dashboard
  -> 文件不存在
  -> try_files 回退到 /index.html
  -> 浏览器加载 JS
  -> 前端 Router 接管 /dashboard
```

## 口述题

### 1. SPA 刷新 404 怎么解决？

> 回答模板：SPA 使用 history 路由时，页面内跳转由前端接管，但用户刷新或直接访问深层路径时，请求会先到服务器。如果服务器按真实文件查找 `/dashboard`，找不到就会 404。解决方式是在 Nginx 的 `location /` 里配置 `try_files $uri $uri/ /index.html;`，让非真实静态资源请求回退到入口 HTML，再由前端 Router 根据路径渲染页面。这里要注意 API 路由和静态资源路由不要被错误 fallback。

### 2. 静态资源 + HTML 的缓存头怎么配？

> 回答模板：HTML 和静态资源要分开配。`index.html` 是资源引用入口，发布后要尽快拿到新版本，所以通常设置 `no-cache` 或短缓存，让浏览器每次至少和服务端确认。带 contenthash 的 JS、CSS、图片内容变化时文件名会变，可以设置一年长缓存和 `immutable`。这样用户既能及时拿到新 HTML，又能长期复用没变化的静态资源。回滚时还要保证旧 HTML 引用的旧 hash 文件没有被提前删除。

## 5 分钟录音顺序

1. location 匹配 + try_files（1.5 分钟）
2. 缓存头组合（2 分钟）
3. 反向代理 + gzip（1.5 分钟）

## 今日复盘

1. 最容易被追问：SPA fallback 不能把 `/api/` 和真实静态资源错误回退到 `index.html`，否则问题会被隐藏。
2. 当前短板：`proxy_pass` 路径拼接容易踩坑，要准备一个有 `/` 和无 `/` 的对比例子。
3. 下一次补充：把 Nginx 缓存头和 Day20 的 contenthash、Day26 的回滚策略连起来讲。
