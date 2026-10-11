# pnpm 默认不跑依赖的构建脚本

> Related source: [Dockerfile](../../../Dockerfile)

## Meaning

pnpm 10 起，依赖的 `postinstall` 默认不执行，除非包名在 `onlyBuiltDependencies` 里，或本地用 `pnpm approve-builds` 批准过。较新的 pnpm 把「有脚本被跳过」从警告改成了失败：`ERR_PNPM_IGNORED_BUILDS`。

`esbuild` 的 `postinstall` 负责放好当前平台的原生二进制。脚本不跑，Vite / VitePress 后面也编不过。Alpine 镜像还要靠这个脚本选 musl 版二进制。

非交互环境（Docker、CI）跑不了 `pnpm approve-builds`。两条路：

- 继续用 pnpm 10+，在 `package.json` 里写 `pnpm.onlyBuiltDependencies: ["esbuild"]`
- 把 pnpm 固定到 9.x（最后一版是 `9.15.9`）。9 默认会跑依赖的 `postinstall`，不需要这份名单

pnpm 10 里只关 `strict-dep-builds` 不能代替上面两条：安装能过，脚本仍然不跑。

## In This Project

`Dockerfile` 固定安装 `pnpm@9.15.9`，`package.json` 的 `packageManager` 写同一版本。这样镜像里的 `pnpm install` 会执行 `esbuild` 的 `postinstall`，随后 `pnpm run docs:build` 能找到二进制。
