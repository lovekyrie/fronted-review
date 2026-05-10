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

<!-- location 匹配规则 / try_files / gzip / proxy_pass / 缓存头组合 -->

## 手写 / 流程图

```nginx
# SPA + 静态资源长缓存 + API 反向代理 的最小完整配置
```

## 口述题

### 1. SPA 刷新 404 怎么解决？

> 回答模板：

### 2. 静态资源 + HTML 的缓存头怎么配？

> 回答模板：

## 5 分钟录音顺序

1. location 匹配 + try_files（1.5 分钟）
2. 缓存头组合（2 分钟）
3. 反向代理 + gzip（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
