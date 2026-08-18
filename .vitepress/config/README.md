# VitePress i18n

中文是 `root` locale，路径不变。英文在 `interview/en/`，路径前缀 `/en/`。

导航和侧边栏只维护 [nav-data.mjs](./nav-data.mjs)，由 [build.mjs](./build.mjs) 派生两份配置。

## 翻译进度

`i18nStub: true` 表示未翻译。翻译时删掉这一行。

```bash
pnpm docs:i18n          # 为缺失页生成占位
pnpm docs:i18n:report   # 查看进度
```

## 后续批次

已全部完成（233 / 233）。新增中文页后跑 `pnpm docs:i18n` 生成占位，再说「翻译下一批」。
