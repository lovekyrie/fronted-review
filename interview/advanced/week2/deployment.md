### Deployment

这一篇是 Week 2 的补充，重点不是重复 CI/CD 定义，而是把“前端产物如何真正上线”单独拆开。

如果说 CI/CD 更关注整条自动化流水线，那么 deployment 更关注这几个问题：

- 交付单元是什么
- 目标环境是什么
- 部署过程怎样保证稳定
- 上线后怎么验证
- 出问题怎么回滚

#### 1. 前端部署到底在部署什么

前端部署的交付单元常见有三种：

1. 静态资源目录
2. Docker 镜像
3. 平台托管构建产物

这个仓库当前采用的是第二种，也就是镜像化交付：

- 构建阶段生成 VitePress 的静态站点
- 用 Nginx 镜像托管构建结果
- 通过 GitHub Actions 推送到 GHCR
- 服务器拉取镜像并启动容器

这比“本地打包然后手动上传文件”更稳定，因为产物和运行环境是一起交付的。

#### 2. 这个仓库里的真实部署链路

核心文件：

- `.github/workflows/deploy.yml`
- `Dockerfile`
- `nginx.conf`

链路可以拆成：

1. push 到主干
2. GitHub Actions 构建镜像
3. 推送 GHCR
4. 服务器通过 SSH 拉镜像
5. 停掉旧容器并启动新容器

#### 3. Docker 两阶段构建的价值

当前 Dockerfile 使用了两阶段构建：

```dockerfile
FROM node:20-alpine AS builder
...
RUN pnpm run docs:build

FROM nginx:alpine
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html
```

这样做的价值：

- builder 阶段只负责构建
- runtime 阶段只保留运行所需内容
- 最终镜像更小
- 运行环境更干净

这类问题面试里经常会追问：为什么不直接在 Node 镜像里运行前端？对静态站点来说，因为根本不需要 Node runtime，Nginx 更轻、更符合职责。

#### 4. Nginx 在前端部署里的职责

在这个仓库里，Nginx 主要承担：

- 静态文件服务
- gzip 压缩
- 文档路由兜底
- 缓存头控制

典型配置：

```nginx
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

这类兜底配置适合文档路由和前端路由场景，否则直接访问深层路径时，服务器可能只会返回 404。

#### 5. 部署策略怎么选

前端常见部署策略有：

- 覆盖式部署
- 蓝绿部署
- 滚动部署
- 灰度发布

当前仓库更接近简单覆盖式容器部署：停旧容器，起新容器。

它的优点：

- 简单直接
- 成本低
- 适合个人项目和小团队

它的缺点：

- 切换时可能有短暂抖动
- 没有细粒度流量切换
- 回滚依赖镜像管理是否完善

#### 6. 前端部署后的验证

很多流程把“容器起来了”当成部署完成，这是不够的。

更稳的验证层次应该包括：

1. 容器是否启动成功
2. 首页是否返回 200
3. 静态资源是否能访问
4. 关键路由是否正常
5. 错误监控是否有异常飙升

前端部署后验证最少也应该补一层冒烟检查，否则只能算“部署脚本执行完成”，不算“上线成功”。

#### 7. 回滚为什么重要

前端上线失败的影响面通常很大，因为静态资源一旦失效，所有用户都可能受影响。

所以回滚能力至少要回答：

- 当前线上跑的是哪个版本
- 上一个稳定版本是什么
- 能否快速切回去

当前仓库虽然镜像打了 `sha` 标签，但实际部署脚本使用的是 `latest`，这会削弱精准回滚能力。更稳的做法是直接部署 commit SHA 对应镜像。

#### 8. 高级面试常见追问

##### 8.1 前端为什么适合容器化部署

因为它能把构建环境、运行环境和产物版本统一起来，减少“机器不同导致行为不同”的问题。

##### 8.2 部署和 CI/CD 的区别是什么

Deployment 更偏“如何把产物送上目标环境并稳定运行”，CI/CD 更偏“从代码变更到产物交付的整条自动化链路”。

##### 8.3 为什么部署后还需要验证

因为脚本成功不代表用户真的可用。资源缺失、路由错误、缓存不一致、接口域名错误都可能让“成功部署”的版本实际上不可用。

##### 8.4 回滚能力为什么要在上线前设计

因为真正出事故时，临时设计回滚往往已经太晚。版本标识、镜像管理、资源映射、监控告警都要提前准备。

#### 9. 面试回答建议

如果被问 deployment，可以按这个顺序答：

1. 先说明交付单元是什么
2. 再说这条部署链路的各个角色：构建、镜像、Nginx、服务器
3. 再说上线后验证与回滚
4. 最后补当前方案的优点与局限

这样答案会比“我会用 Docker 和 Nginx 部署”更完整。

## 每日练习参考

### Day 23：知识补充

- `image` 是只读模板，`container` 是镜像运行后的实例；同一个镜像可以启动多个容器。
- `layer` 是镜像分层缓存的基础，每条 Dockerfile 指令通常生成一层；越靠前且越稳定的层越容易复用缓存。
- 前端静态站点通常不需要 Node runtime，Node 只负责构建，Nginx 负责运行时托管静态资源。
- 多阶段构建把“构建环境”和“运行环境”分开，最终镜像只保留 `dist` 和 Nginx，体积更小、攻击面更低。
- `.dockerignore` 的价值是减少 build context，避免把 `node_modules`、`.git`、本地缓存、日志传进镜像构建过程。
- Docker 构建缓存的关键顺序是：先复制 lockfile 和 package 文件安装依赖，再复制业务源码；源码变化时不会让依赖层失效。
- `ARG` 是构建时变量，`ENV` 会进入镜像运行时环境；两者都不适合承载会暴露到前端产物里的敏感信息。
- 镜像 tag 要能回溯版本，生产部署尽量使用 commit SHA 或版本号，不要只依赖 `latest`。

### Day 23：动手示例

```dockerfile
# 前端多阶段构建：Node 负责 build，Nginx 负责 serve
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```text
源码 + Dockerfile
  -> build context，受 .dockerignore 影响
  -> builder stage：安装依赖、执行构建、生成 dist
  -> runtime stage：复制 dist + nginx.conf
  -> image：打 tag，推送 registry
  -> container：服务器拉取镜像并运行
```

### Day 24：知识补充

- Nginx 在前端部署里常见职责：静态资源服务、SPA 路由兜底、缓存头、gzip/brotli、反向代理、简单安全头。
- SPA history 路由刷新 404 的原因是浏览器直接请求 `/user/1`，服务端没有这个真实文件；需要 fallback 到 `index.html`。
- `try_files $uri $uri/ /index.html;` 的含义是先找真实文件，再找目录，找不到就交给前端路由。
- HTML 和 hash 静态资源缓存策略要分开：`index.html` 要能及时更新，`assets/*.hash.js` 可以长缓存。
- `location` 常见优先级：精确匹配 `=`，前缀匹配，正则匹配；面试不必背全规则，但要知道不同块可能互相覆盖。
- `proxy_pass` 末尾有无 `/` 会影响转发路径拼接，是 API 反向代理的高频坑点。
- gzip 适合压缩文本资源，如 HTML、CSS、JS、JSON；图片、视频等已压缩资源收益小。
- 前端缓存问题排查要同时看响应头、资源文件名 hash、CDN 缓存、浏览器缓存和 service worker。

### Day 24：动手示例

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

### Day 25：知识补充

- 环境变量要先区分三类：本地开发变量、构建时变量、运行时配置；它们生效时机不同。
- Vite 通过 `mode` 加载对应 `.env` 文件，并把符合前缀规则的变量暴露到 `import.meta.env`。
- 进入前端 bundle 的变量都是浏览器可见的，不能把 `VITE_` 变量当密钥存储。
- 构建时注入的优点是简单、产物确定；缺点是换环境通常要重新构建。
- 运行时注入的优点是同一份产物可部署到多个环境；常见方式是外部 `config.js`、服务端模板注入或启动时替换占位符。
- Docker `ARG` 只在 build 阶段可用，`ENV` 会保留在镜像运行时；但只要最后写进前端静态文件，用户仍然能看到。
- 多环境配置建议把“公开配置”和“敏感配置”分开：公开配置给前端，敏感配置只留在服务端、CI secret 或网关。
- 环境变量事故常见原因：构建模式用错、缓存了旧 HTML、前端写死接口域名、预发变量流入生产。

### Day 25：动手示例

```text
构建时注入：
.env.production
  -> Vite build --mode production
  -> import.meta.env.VITE_API_BASE 被替换进 JS
  -> dist 固化配置
  -> 部署到 Nginx/CDN

运行时注入：
同一份 dist
  -> 容器启动时生成 /config.js
  -> window.__APP_CONFIG__ = { apiBase: "..." }
  -> 应用启动时读取 window.__APP_CONFIG__
  -> 不同环境复用同一份镜像
```

```ts
// 运行时配置读取示意
type AppConfig = {
  apiBase: string
  env: 'dev' | 'staging' | 'prod'
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig
  }
}

export const appConfig: AppConfig = window.__APP_CONFIG__ ?? {
  apiBase: import.meta.env.VITE_API_BASE,
  env: import.meta.env.MODE as AppConfig['env'],
}
```

### Day 26：发布策略矩阵

| 策略 | 核心做法 | 适合场景 | 主要风险 |
|------|----------|----------|----------|
| 覆盖式发布 | 直接替换旧版本 | 个人项目、小团队低风险系统 | 出问题影响全量用户，回滚依赖版本管理 |
| 蓝绿发布 | 新旧两套环境并存，切流量 | 对稳定性要求高、切换要快 | 资源成本更高，数据状态要兼容 |
| 滚动发布 | 分批替换实例 | 多实例服务、容器平台 | 新旧版本短时间共存，接口和资源要兼容 |
| 灰度 / 金丝雀 | 少量用户先用新版本 | 大流量业务、风险可控发布 | 分桶要稳定，监控和回滚要细 |

- 回滚要回滚“已验证产物”，不是临时回滚代码重新构建；否则可能因为依赖、环境、构建参数变化引入新差异。
- 前端静态资源回滚的前提是版本化：HTML、hash 资源、镜像 tag、source map、release 号能对应起来。
- 静态资源带 hash 后可以多版本共存，旧 HTML 引用旧 JS 仍能访问，这对蓝绿、灰度和回滚都很关键。
- 灰度分桶要稳定，例如按用户 ID、租户、地域或账号 hash；随机分桶会导致用户一会新版本一会旧版本。
- 回滚触发条件要提前定义：白屏率升高、JS 错误率升高、核心接口失败、资源 404、转化率或核心业务指标异常。
- 发布不是脚本执行完成就结束，至少要有部署后验证：容器状态、首页 200、关键资源、关键路由、监控指标。
- `latest` 适合人看，不适合精准回滚；生产部署应记录 commit SHA、镜像 tag、构建号和发布时间。
- 回滚后也要观察缓存：用户可能还拿着旧 HTML、旧 service worker 或 CDN 边缘节点缓存。

### Day 26：补充笔记

```text
线上事故 5 分钟回滚流程：

监控告警 / 用户反馈
  -> 确认范围：全量 / 灰度 / 单地区 / 单浏览器
  -> 判断等级：白屏、核心链路不可用、错误率异常
  -> 决策：修复来不及则立即回滚
  -> 执行：切回上一稳定镜像 tag / 静态资源版本
  -> 验证：首页、关键路由、核心接口、错误率
  -> 观察：缓存命中、CDN、旧版本用户
  -> 记录：影响面、根因、修复动作、预防项
```

```bash
# 容器化部署的回滚示意：切回上一稳定镜像 tag
docker pull registry.example.com/frontend:2026-05-previous-sha
docker stop frontend || true
docker rm frontend || true
docker run -d \
  --name frontend \
  --restart always \
  -p 8080:80 \
  registry.example.com/frontend:2026-05-previous-sha
```

### Day 27：上线后排障 checklist

| 问题 | 典型症状 | 快速定位 | 常见修复 |
|------|----------|----------|----------|
| 白屏 | 页面空白、控制台报错 | DevTools Console、监控错误栈 | 回滚、修复 JS 异常、补兼容 |
| JS 资源 404 | `app.hash.js` 加载失败 | Network 看资源状态码 | 恢复旧资源、修正发布路径/CDN |
| CSS 丢失 | 页面无样式或错乱 | Network 看 CSS、MIME type | 修正资源路径、Nginx 类型配置 |
| 接口失败 | 页面加载中、数据为空 | Network 看 4xx/5xx、接口域名 | 修接口、网关、环境变量 |
| 跨域错误 | Console CORS 报错 | 看预检 OPTIONS 和响应头 | 补 CORS 配置或代理 |
| 缓存错乱 | 部分用户新旧混用 | 看 `index.html` 响应头和资源 hash | 修缓存头、刷新 CDN、保留旧资源 |
| 环境变量错误 | 请求到错误域名 | 查构建产物和运行时配置 | 重发正确配置或回滚 |
| gzip/CDN 异常 | 加载慢、压缩未生效 | 看 `content-encoding`、CDN 回源 | 修 Nginx/CDN 配置 |
| 证书问题 | HTTPS 访问失败 | 浏览器安全面板、证书链 | 更新证书、修域名绑定 |
| 旧版本用户 | 回滚后仍异常 | 看 service worker、浏览器缓存 | 清 SW、调整缓存策略 |

- 白屏优先三分法：JS 运行时报错、核心资源加载失败、接口或配置错误导致应用无法启动。
- 资源 404 要看是不是“新 HTML 引用了未上传的 hash 文件”或“旧 HTML 引用了已删除的旧 hash 文件”。
- 用户还看到旧页面，优先检查 `index.html` 是否被强缓存，其次看 CDN、service worker、浏览器缓存。
- 接口异常要区分网络层失败、跨域失败、认证失败、业务 5xx，不要统一说“接口挂了”。
- 环境变量错误通常表现为请求域名不对、开关状态不对、预发配置流入生产。
- 排障时先止损再根因：核心链路不可用时优先回滚或切流，复盘阶段再定位完整根因。

### Day 27：补充笔记

```text
用户反馈 / 监控告警
  -> 复现：环境、账号、浏览器、地区、版本
  -> 分类：
       JS：Console、错误监控、source map
       资源：Network、404、MIME、CDN
       网络：接口状态码、CORS、认证、网关
       缓存：index.html、hash、CDN、service worker
       配置：env、config.js、域名、开关
  -> 判断影响面：全量 / 灰度 / 单租户 / 单浏览器
  -> 动作：修配置 / 刷 CDN / 回滚 / 热修
  -> 验证：关键路径 + 指标恢复
```
