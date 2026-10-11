# Day 24 Nginx 配置

## 今日目标

- 看完 Nginx Beginner's Guide
- 基于仓库 `nginx.conf` 写注释版
- 输出前端常用 Nginx 片段：SPA history 回退、gzip、缓存头、反向代理

## 按顺序阅读

1. [部署](../advanced/week2/deployment)

## 实操与自测

**检查点**

- SPA 路由需要 `try_files $uri $uri/ /index.html;` 否则刷新会 404
- 静态资源带 hash 可以 `Cache-Control: public, max-age=31536000, immutable`，`index.html` 要 `no-cache`
- `proxy_pass` 的末尾有无 `/` 行为不同，容易踩坑

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week2/deployment#day-24-知识补充)
- 动手示例 — [参考章节](../advanced/week2/deployment#day-24-动手示例)

**脱稿口述题**

- 1. SPA 刷新 404 怎么解决？
- 2. 静态资源 + HTML 的缓存头怎么配？

**录音练习**

1. location 匹配 + try_files（1.5 分钟）
2. 缓存头组合（2 分钟）
3. 反向代理 + gzip（1.5 分钟）

## 复盘

1. 最容易被追问：SPA fallback 不能把 `/api/` 和真实静态资源错误回退到 `index.html`，否则问题会被隐藏。
2. 当前短板：`proxy_pass` 路径拼接容易踩坑，要准备一个有 `/` 和无 `/` 的对比例子。
3. 下一次补充：把 Nginx 缓存头和 Day20 的 contenthash、Day26 的回滚策略连起来讲。
