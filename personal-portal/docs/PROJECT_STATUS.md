# Personal Portal 连续接管 — Handoff

## Current State

- cwd: `/Users/zcy/Desktop/my/zcy-corner/personal-portal`
- branch: `dev_1`
- active owner: `Claude`
- current phase: `阶段 1：工程基线转绿`
- owner base commit: `39a0405dec9285bd308425b39280a435d0c7f4c8`
- git status: 本次治理提交前仅有 `?? ../.DS_Store`；它是父目录既有 OS 元数据，
  不得暂存或提交。
- recent commits:
  - `39a0405 docs(portal): add long-horizon Claude governance`
  - `e751b0f feat(portal): add together trace showcase`
  - `ecedfcd fix(portal): restore content runtime loading`
  - `94c31ea fix(portal): correct historical resume note`
  - `14b6cba feat(portal): add real resume and supet project`
- summary:
  - Gallery & Paper 网站骨架、简历舱、五件藏宝阁内容和 Together Trace 案例已存在。
  - Claude 获得阶段 1–4 连续执行权限；Codex 不再逐任务传话。
  - 当前仍从工程基线开始：Build 通过，lint 有 7 errors + 1 warning。

## Source Of Truth

- `CLAUDE.md` — Claude 强制启动入口、权限、暂停条件和工作循环。
- `docs/PROJECT_CHARTER.md` — 项目使命、产品方向、真实性、连续路线和验收门。
- `docs/DECISIONS.md` — 已锁定的长期决策及原因。
- `docs/timeline/README.md` — 追加式事件、active owner 和接力协议。
- `docs/timeline/2026-07-31-1525-claude-takeover-bootstrap.md` — 本轮长期接管事件。
- `docs/superpowers/specs/2026-07-31-personal-tech-space-design.md` — Gallery & Paper
  产品与视觉设计。
- `docs/superpowers/specs/2026-07-31-together-trace-showcase-design.md` — Together Trace
  展示口径、隐私和事实边界。
- `/Users/zcy/Desktop/my/zcy-corner/.superpowers/handoffs/personal-portal-together-trace-report.md`
  — Together Trace 接入、浏览器验证和 lint 基线报告。
- `e751b0f66ad1e38202843989ae91422940d0cc9e` — 当前功能基线提交。

## Proven Evidence

- `npm run build` 在 2026-07-31 实际 exit 0，Vite 完成 108 modules 构建。
- `npm run lint` 在 2026-07-31 实际 exit 1：7 errors + 1 warning。
- lint 问题位于：
  - `src/components/ParticleSystem.test.tsx`
  - `src/components/ParticleSystem.tsx`
  - `src/components/Typewriter.tsx`
  - `src/components/layout/SiteHeader.tsx`
  - `src/components/vault/DemoStage.tsx`
  - `src/demos/particle-field/index.tsx`
- `127.0.0.1:62740` 最近一次实测由 Vite 监听，`curl -I` 返回 HTTP 200。
- Codex 最近一次浏览器实测确认：
  - Particle Field：`canvas=1`、`fallback=0`、`loading=0`。
  - Typewriter：`demo=1`、`fallback=0`、`loading=0`。
  - 首页精选是个人技术空间、supET、Together Trace。
  - 藏宝阁共 5 项。
  - Together Trace 页面有本地模式提示和 Pages 入口，无源码入口。
- Personal Portal 的 Git 身份是 `zcy <zcy_5332@163.com>`。

## Open Questions

- 当前工作经历的原始证据、可公开边界和候选文案尚未收集；阶段 2 由 Claude 在仓库外
  整理，形成完整脱敏草稿后一次性交给用户确认。
- 生产发布状态不在当前授权范围内；阶段 5 验收通过后仍需用户单独决定是否部署。

## Scope

- In scope:
  - 阶段 1：修复现有 lint 问题并保持 Build、已有测试与页面行为正常。
  - 阶段 2：在仓库外收集当前工作证据并形成脱敏候选文案。
  - 阶段 3：整合已确认工作内容，打磨简历与代表案例，固化内容模板。
  - 阶段 4：全站响应式、交互、无障碍、性能、SEO、深链和打印优化。
  - 在每个完整批次更新本状态板、追加时间线并创建本地 commit。
- Out of scope:
  - 用户确认前公开当前工作或内网经历的候选文案。
  - 把原始私有证据、登录邮箱、密钥、真实用户数据或未脱敏截图提交到本仓库。
  - 未获确认时新增依赖、创建新测试、迁移框架或改变数据模型。
  - 修改 `/Users/zcy/Desktop/together-trace`。
  - push、部署、创建 PR、访问外部账号或改写 Git 历史。
  - 暂存或提交 `../.DS_Store`。

## Next Steps

1. 运行 `npm run context:check && npm run context`，确认协议、active owner、分支和工作树一致。
2. 重新运行 `npm run lint`，把输出与 7 errors + 1 warning 基线逐项对齐。
3. 完整阅读报错文件和相似实现，按根因拆分可独立验证的本地提交；不新增测试。
4. lint 清零后运行阶段 1 完整验证并刷新关键页面，把实际退出码写入状态板和新时间线事件。
5. 直接进入阶段 2，在仓库外收集当前工作证据；形成完整脱敏草稿后暂停，请用户确认一次公开口径。
6. 用户确认后继续阶段 3 和阶段 4，不为普通实现判断等待 Codex。
7. 阶段 4 全部完成后形成阶段 5 发布候选，停止并交由 Codex 做长期验收。

## Acceptance Criteria

- 智能接力基础：
  - `npm run context:check` exit 0。
  - `npm run context` 能输出 branch、phase、active owner、first action、最近提交和时间线。
  - 新会话只读启动文件即可知道当前任务、边界、证据、风险和第一动作。
- 阶段 1：
  - `npm run lint` exit 0，0 errors，0 warnings。
  - `npm run build` exit 0。
  - `npx vitest run` exit 0，现有测试全部通过。
  - 刷新后的首页、藏宝阁、两个 Demo、Together Trace 和简历舱没有新 console error。
- 阶段 2：
  - 原始工作证据只存在仓库外。
  - 脱敏草稿区分已证明、待用户确认和不可公开内容，并获得用户确认。
- 阶段 3：
  - 已确认内容进入简历舱与适当案例，事实和归属可追溯。
  - Together Trace、Personal Portal、supET 在手机和桌面端易扫描且证据充分。
- 阶段 4：
  - 响应式、交互、无障碍、性能、SEO、深链和打印版式均有实际验证结果。
  - 没有通过视觉改版掩盖内容或工程问题。
- 全程：
  - 工作树除 `?? ../.DS_Store` 外在每个批次提交后干净。
  - commit 使用 `zcy <zcy_5332@163.com>`。
  - 未 push、未部署、未创建 PR。

## Verification Commands

```bash
cd /Users/zcy/Desktop/my/zcy-corner/personal-portal
npm run context:check
npm run context
git status --short --branch
git diff --check
npm run lint
npm run build
npx vitest run
curl -I --max-time 5 http://127.0.0.1:62740/
git log -n 8 --oneline --decorate
git status --short --branch
```

阶段内先运行与改动匹配的最窄命令；上方业务验证在阶段 1 完成时运行。浏览器验收使用
`http://127.0.0.1:62740`。如果端口未监听，启动：

```bash
npm run dev -- --host 127.0.0.1 --port 62740
```

## Known Pitfalls

- 时间线是追加式历史，不要把它改造成第二份状态板；当前事实只写 `PROJECT_STATUS`。
- 同一 commit 无法可靠记录自己的最终 SHA；事件中允许写 `pending`，由下一事件补证，
  不要因此反复 amend。
- 一个批次只允许一个 active owner；发现来源不明且重叠的工作树改动时必须暂停。
- 本地 Vite 服务停止时，动态 Demo 会显示错误边界；先检查端口和模块请求。
- 浏览器 console 可能保留旧错误；必须刷新后判断新日志。
- `react-refresh/only-export-components` 应通过明确模块边界解决，不要禁用规则。
- 消除 Effect 中同步 setState 时必须保持路由菜单和减少动态效果行为。
- 当前工作原始材料不能写入本仓库，即使稍后准备脱敏。
- `../.DS_Store` 属于父目录既有文件，任何 commit 都不能包含它。
- `/Users/zcy/Desktop/together-trace` 当前只读。

## Startup Prompt

```text
你正在接管 Personal Portal 的连续开发。不要依赖聊天记录、截图或模型记忆。

cwd: /Users/zcy/Desktop/my/zcy-corner/personal-portal
branch: dev_1

首先执行：
cd /Users/zcy/Desktop/my/zcy-corner/personal-portal
npm run context:check
npm run context

按顺序完整阅读：
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/CLAUDE.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/PROJECT_CHARTER.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/DECISIONS.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/PROJECT_STATUS.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/timeline/README.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/timeline/ 中最近三条事件

锁定决策，不要重新讨论：
- Claude 是阶段 1–4 连续执行者；Codex 只在重大风险和最终发布候选时验收。
- 达成子阶段后更新状态板与时间线并直接继续，不等待逐项批准。
- 只能本地 commit，禁止 push、部署和创建 PR。
- 不新增依赖或新测试，除非先获用户确认。
- 当前工作原始证据保存在仓库外；公开脱敏草稿必须由用户确认一次。
- 不修改 together-trace，不暂存或提交 ../.DS_Store。

当前阶段：
- 阶段 1「工程基线转绿」。
- 已知 build exit 0；lint exit 1，7 errors + 1 warning。

第一动作：
- 确认 context:check 通过后运行 npm run lint，核对状态板记录的基线；完整阅读报错文件和相似实现，再按根因做最小修复。

工作方式：
- 每个 commit 是一个可独立理解、验证和回退的工作单元。
- 每个批次同步更新 PROJECT_STATUS 并按时间线协议新增事件。
- 运行实际验证并记录退出码；未运行不得写成通过。
- 阶段 1 完成后直接进入阶段 2；脱敏草稿完整时暂停让用户确认。
- 用户确认后继续阶段 3 和 4；阶段 4 完成后停止，交给 Codex 做发布候选验收。

只有以下情况暂停：
- 改变 PROJECT_CHARTER 或 DECISIONS 的锁定方向。
- 新增依赖、创建新测试、改变数据模型或架构。
- 当前工作公开文案等待用户确认。
- 隐私、真实性、外部账号或不可逆操作风险。
- 同一问题连续三次修复失败。
- 发现来源不明且与当前范围重叠的工作树改动。
- 阶段 4 已达到全部验收标准。
```
