# Daily Prep 补充计划

## 补充原则

- 按 `Day 20 -> Day 80` 的顺序推进，不跳阶段补答案。
- 不追求文件行数，只补面试高频、容易被追问、能体现工程判断的关键点。
- 每个 day 优先补 4 块：速记卡、流程/代码、口述题答案、今日复盘。
- 复盘日不写成知识堆叠，重点沉淀“答题本、追问清单、薄弱项”。
- Day 80 只做总控索引和最终查漏，不提前替代前面每天的内容。

## 每个文件的最小补充标准

### 速记卡 / 知识点

- 5-8 条核心结论。
- 每条尽量包含“是什么 / 为什么 / 场景 / 坑点”中的至少 2 个维度。
- 避免大段复制文档，优先写成面试可直接说出口的短句。

### 手写 / 流程图

- 原理题补最小代码或 ASCII 链路。
- 工程题补流程图、checklist 或配置骨架。
- 场景题补模块拆分、数据流、异常分支。

### 口述题

- 每天至少补 2 道。
- 每道按“先结论 -> 讲链路 -> 说取舍 -> 补坑点 -> 落项目”组织。
- 控制在 1-3 分钟口述长度，复盘日可扩展到 5 分钟。

### 今日复盘

- 不写空泛感受。
- 固定沉淀 3 个点：最容易被追问的点、当前短板、下一次要补的动作。

## 推进顺序

### 第一轮：工程化与交付，Day 20-28

目标：把构建、CI/CD、Docker、Nginx、环境变量、发布回滚、线上排障串成一条完整链路。

重点文件：

- `day20-production-build.md`：env/mode、source map、chunk、产物分析。
- `day21-build-review.md`：构建链路 15 题答题本。
- `day22-github-actions.md`：workflow、runner、cache、secrets、artifacts。
- `day23-docker-basics.md`：多阶段构建、镜像分层、tag、运行环境。
- `day24-nginx-config.md`：location、try_files、proxy_pass、gzip、缓存头。
- `day25-env-and-mode.md`：构建时变量、运行时配置、secret 边界。
- `day26-release-rollback.md`：版本、灰度、回滚、资源保留。
- `day27-online-troubleshoot.md`：静态资源 404、白屏、缓存污染、接口异常。
- `day28-deploy-review.md`：部署交付 15 题答题本。

### 第二轮：Vue 原理主线，Day 29-42

目标：把 Vue 3 响应式、编译优化、渲染更新、Router/Pinia/SSR 讲成主线能力。

关键主线：

- `Proxy / Reflect -> track / trigger -> effect / scheduler -> computed / watch`
- `template compiler -> patch flag -> block tree -> renderer diff`
- `component update -> router -> state management -> SSR / hydrate`

### 第三轮：React 机制副线，Day 43-49

目标：能稳定回答 React 渲染、状态队列、effect、memo、并发和 React 19。

关键主线：

- `render / commit / batching`
- `state queue / stale closure / effect cleanup`
- `memo / useMemo / useCallback 的收益与成本`
- `transition / deferred / RSC / React 19 新 API`

### 第四轮：TypeScript 进阶，Day 50-56

目标：从“会写类型”升级到“能解释类型设计”。

关键主线：

- 泛型约束和推断方向。
- 条件类型、分发、`infer`。
- 映射类型、key remapping、模板字面量。
- 工具类型手写与业务 API 建模。

### 第五轮：性能、安全、监控，Day 57-63 + Day 75

目标：把指标、原因、优化动作、线上观测串起来。

关键主线：

- Event Loop 与渲染流水线。
- Web Vitals 与优化动作映射。
- HTTP 缓存、Service Worker、首屏优化。
- XSS、CSRF、CSP 的边界。
- 监控采集、source map、release、采样、告警闭环。

### 第六轮：测试保障，Day 64-70

目标：能说明为什么测、测什么、怎么测、如何接入 CI。

关键主线：

- 测试金字塔与分层职责。
- Vitest、Vue Test Utils、Mock、覆盖率。
- Playwright E2E 与 trace 调试。
- flaky test 治理和 CI 时长控制。

### 第七轮：场景、项目、模拟面，Day 71-80

目标：把前面知识收束成高级面试表达。

关键主线：

- 大文件上传、虚拟列表、权限体系、微前端。
- 项目 STAR、简历 HR、两轮模拟面复盘。
- Day 80 汇总绿黄红状态、高频 30 题和未来 2 周补漏清单。

## 执行节奏

- 每次补 2-3 个连续 day，避免上下文切换过大。
- 每完成一个复盘日，例如 Day 21、28、42、49、56、63、70、80，同步更新阶段薄弱项。
- 优先保证答案能讲，不优先追求资料全面。
