# Together Trace 展示接入 — 实施计划

> 日期：2026-07-31
> 角色：Claude 实施 / 验证 / 本地 commit；Codex 验收。
> 约束：只 commit，不 push / 不部署 / 不建 PR；不修改 together-trace 仓库（仅只读取证据）。

---

## 步骤

1. **前置检查**：确认分支 `dev_1`、本地 `user.email=zcy_5332@163.com`、工作树除既有 `../.DS_Store` 外无其他改动；`curl -I https://together-trace.pages.dev` 返回 200 方可加入 `externalUrl`。
2. **根因复核**：`lsof`/`curl` 确认 62740 无监听 → Particle Field 失败源于 Vite 停止，非代码。
3. **设计确认文档**：`docs/superpowers/specs/2026-07-31-together-trace-showcase-design.md`。
4. **新增藏品**：
   - `src/content/vault/together-trace/meta.json`（type=project，含 `externalUrl`，无 `sourceUrl`）。
   - `src/content/vault/together-trace/index.mdx`（自然中文，含 6 段：定位 / 为何离线优先 / 核心技术结构 / 工程判断 / 验证证据 / 体验提示）。
   - `public/covers/together-trace.svg`（viewBox 1200×720，暗色 Gallery 风格，抽象地图网格 + 两条轨迹 + 汇合点，主色 `#0b0c0f`/`#7188ff` + 一种克制暖色）。
5. **首页精选调整**：`particle-field`、`typewriter-effect` 的 `meta.json` `featured` 改为 `false`；`together-trace`/`personal-portal`/`supet-industrial-platform` 保持 `featured=true` → 精选恰为 3 项。
6. **验证**：`npm run build`、`npm run lint`、`git diff --check`/`--stat`/`--diff` 全通过；`validate-vault-content` 插件接受新 meta+MDX。
7. **恢复本地服务并人工验收**：`127.0.0.1:62740` 启动 Vite，验证 particle-field / typewriter-effect / together-trace / 首页与藏宝阁四处。
8. **本地提交**：按明确路径 `git add`（严禁暂存 `../.DS_Store`），`git commit -m "feat(portal): add together trace showcase"`。
9. **交付报告**：`.superpowers/handoffs/personal-portal-together-trace-report.md`。

## 验收门槛（供 Codex）

- build exit 0、lint exit 0、diff-check exit 0。
- 详情页显示封面 / 标题 / 正文 / 标签；「访问项目」指向 pages.dev；无「查看源码」；含本地模式提示。
- 首页精选恰为 Together Trace / 个人技术空间 / supET；Particle Field 与 Typewriter 仍可从藏宝阁访问。
- 无 `../.DS_Store` 入暂存；无无关文件或依赖改动；未改 together-trace。

## 实际执行偏差

- 原计划要求 `npm run lint` exit 0。
- 实际 `npm run lint` 为 **exit 1**，共 **7 errors + 1 warning**。
- 所有问题均位于本次提交**未修改的既有 TS/TSX 文件**（`ParticleSystem.test.tsx` / `ParticleSystem.tsx` / `Typewriter.tsx` / `SiteHeader.tsx` / `DemoStage.tsx` / `demos/particle-field/index.tsx`）。
- Codex 在本次最终验收中确认：这些问题作为**独立 lint 技术债**保留，不要求本次内容任务处理。
- 本任务 `npm run lint` 实际状态仍为 exit 1，**不作通过声称**。

## 不做的事（Out of Scope）

- 不修改 `ParticleSystem` / `Typewriter` / `DemoStage` / `DemoBoundary` / `demos/registry` 运行代码（除非恢复服务后出现新的可复现代码错误，届时停止并报告）。
- 不改首页排序逻辑，不新增依赖 / 测试，不做无关重构或格式化。
- 不 push / 不部署 / 不建 PR。
