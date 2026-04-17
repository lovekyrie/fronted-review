# 前端规范化：ESLint + Husky + lint-staged + commitlint

## 一、为什么要做规范化

- 提前在提交前发现低级错误。
- 保持团队代码风格统一，降低 review 成本。
- 通过 commit 规范提升变更可追踪性。

## 二、ESLint 原理（面试简述）

- ESLint 先把代码解析成 AST。
- 按规则遍历 AST 节点并报告问题。
- 可自动修复的规则可由 `--fix` 处理。

## 三、提交流水线

1. `git commit` 触发 Husky `pre-commit`。
2. `lint-staged` 只检查本次暂存文件，执行 `eslint --fix` / `prettier`。
3. `commit-msg` 阶段执行 commitlint 校验提交信息格式。

## 四、常用约定（Conventional Commits）

- `feat:` 新功能
- `fix:` bug 修复
- `refactor:` 重构
- `docs:` 文档变更
- `test:` 测试相关

## 五、面试高频追问

### Q1：为什么用 lint-staged？

只校验暂存文件，速度更快，开发体验更好。

### Q2：为什么需要 commitlint？

保证提交可读性和自动化发布流程（如语义化版本）兼容。
