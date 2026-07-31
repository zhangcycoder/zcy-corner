# Personal Portal 长期接管 — Handoff

## Current State

- cwd: `/Users/zcy/Desktop/my/zcy-corner/personal-portal`
- branch: `dev_1`
- git status: 记录本文件前仅有 `?? ../.DS_Store`；它是父目录既有 OS 元数据，
  不得暂存或提交。
- recent commits:
  - `e751b0f feat(portal): add together trace showcase`
  - `ecedfcd fix(portal): restore content runtime loading`
  - `94c31ea fix(portal): correct historical resume note`
  - `14b6cba feat(portal): add real resume and supet project`
  - `710d185 docs(portal): clarify credential privacy note`
- summary:
  - Gallery & Paper 网站骨架、简历舱、五件藏宝阁内容和 Together Trace 案例已存在。
  - 当前进入阶段 1「工程基线转绿」；Claude 在阶段内自主工作，Codex 只做阶段验收。
  - Build 通过；lint 仍有 7 errors + 1 warning，是阶段 1 的明确目标。

## Source Of Truth

- `CLAUDE.md` — Claude 启动入口、权限、永久禁区和工作循环。
- `docs/PROJECT_CHARTER.md` — 项目使命、产品方向、公开真实性、阶段路线和协作模型。
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
- `127.0.0.1:62740` 当前由 Vite 监听，`curl -I` 返回 HTTP 200。
- Codex 浏览器实测已确认：
  - Particle Field：`canvas=1`、`fallback=0`、`loading=0`。
  - Typewriter：`demo=1`、`fallback=0`、`loading=0`。
  - 首页精选是个人技术空间、supET、Together Trace。
  - 藏宝阁共 5 项。
  - Together Trace 页面有本地模式提示和 Pages 入口，无源码入口。
- Personal Portal 的 Git 身份是 `zcy <zcy_5332@163.com>`。

## Open Questions

- None。阶段 1 的范围、第一动作和验收标准已经确定。

## Scope

- In scope:
  - 修复现有 7 个 lint error 和 1 个 warning。
  - 为解决 lint 根因进行必要的小范围拆分或 React 写法调整。
  - 保持现有产品行为、视觉和公开内容不变。
  - 运行已有测试、Build、lint 和本地浏览器验证。
  - 创建小而完整的本地 commit，并持续更新本状态板。
- Out of scope:
  - 新增产品功能、重新设计页面或增加藏宝阁内容。
  - 新增依赖、创建新测试或迁移框架。
  - 修改 `/Users/zcy/Desktop/together-trace`。
  - 修改公开履历、Together Trace 口径或个人信息。
  - push、部署、创建 PR、访问外部账号或改写 Git 历史。
  - 修复全局 `/Users/zcy/.claude/hooks/autocorrect-fix.sh` 权限。

## Next Steps

1. 重新运行 `npm run lint`，把输出与本文件的 7 errors + 1 warning 基线逐项对齐。
2. 完整阅读每个报错文件及同仓库可工作的相似模式，按根因分为四个可独立验证的工作单元：
   - 移除测试中的未使用参数和 Typewriter 的过期 lint-disable。
   - 将与 React 组件同文件导出的纯函数移到职责明确的本地模块，保持原有导出消费者可迁移。
   - 消除 `SiteHeader` 和 Particle Field 中同步 Effect setState，同时保持路由切换和
     `prefers-reduced-motion` 行为。
   - 让 Demo 懒加载组件在 render 外稳定创建，保持按 `demoKey` 延迟加载和错误边界。
3. 每个工作单元先检查调用方和现有测试，再实施最小修改并运行最窄验证。
4. 每个完成的工作单元创建一个本地 commit；提交前在同一组改动中更新本文件的证据、
   完成内容和剩余问题。不要为了记录该 commit 自身的 SHA 而反复 amend；SHA 可在
   下一次状态更新或阶段报告中补记。
5. lint 清零后运行阶段完整验证并刷新浏览器页面。
6. 达到 Acceptance Criteria 后停止，提交给 Codex 做阶段 1 验收，不自行进入阶段 2。

## Acceptance Criteria

- `npm run lint` exit 0，0 errors，0 warnings。
- `npm run build` exit 0。
- `npx vitest run` exit 0，现有测试全部通过。
- 刷新后以下页面可访问且没有新 console error：
  - `/`
  - `/vault`
  - `/vault/particle-field`
  - `/vault/typewriter-effect`
  - `/vault/together-trace`
  - `/resume`
- Particle Field 有 Canvas 或符合减少动态效果设置的静态降级。
- Typewriter 正常运行，不进入错误边界。
- Together Trace 的公开文案、隐私提示和外部链接没有被改变。
- 没有新增依赖或新测试文件。
- 工作树除 `?? ../.DS_Store` 外干净。
- 所有本地 commit 使用 `zcy <zcy_5332@163.com>`。
- 未 push、未部署、未创建 PR。
- 本文件已更新为阶段 1 完成状态，并记录实际命令、退出码和 commits。

## Verification Commands

```bash
cd /Users/zcy/Desktop/my/zcy-corner/personal-portal
git status --short --branch
git diff --check
npm run lint
npm run build
npx vitest run
curl -I --max-time 5 http://127.0.0.1:62740/
git log -n 8 --oneline --decorate
git status --short --branch
```

浏览器验收使用本地地址 `http://127.0.0.1:62740`。如果端口未监听，先启动：

```bash
npm run dev -- --host 127.0.0.1 --port 62740
```

## Known Pitfalls

- 本地 Vite 服务停止时，两个动态 Demo 会显示错误边界；先检查端口和模块请求，不要
  直接修改 ParticleSystem。
- 浏览器 console 可能保留服务停止前的旧错误；必须刷新页面并只判断刷新后的新日志。
- `react-refresh/only-export-components` 应通过明确的模块边界解决，不要禁用规则。
- `react-hooks/static-components` 的根因是 render 内创建 lazy component；不要只包更多
  `useMemo` 掩盖问题。
- 消除 Effect 中同步 setState 时必须保持路由切换关闭菜单和减少动态效果的行为。
- `../.DS_Store` 属于父目录既有文件，任何 commit 都不能包含它。
- `/Users/zcy/Desktop/together-trace` 当前只读，不能为了 Personal Portal 阶段修改它。
- `/Users/zcy/.claude/hooks/autocorrect-fix.sh` 的 permission denied 是非阻塞全局问题，
  不属于本阶段。

## Startup Prompt

```text
你正在接管 Personal Portal 的长期开发，不再执行单次截图传话任务。

cwd: /Users/zcy/Desktop/my/zcy-corner/personal-portal
branch: dev_1

首先执行：
cd /Users/zcy/Desktop/my/zcy-corner/personal-portal

按顺序完整阅读：
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/CLAUDE.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/PROJECT_CHARTER.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/PROJECT_STATUS.md
- /Users/zcy/Desktop/my/zcy-corner/personal-portal/docs/superpowers/specs/2026-07-31-personal-tech-space-design.md

锁定决策，不要重新讨论：
- Claude 是当前阶段执行者，可在阶段内自主分析、修改、验证和创建本地 commit。
- Codex 只在阶段完成、重大风险或方向变化时验收。
- 当前只执行阶段 1「工程基线转绿」，不进入阶段 2。
- 只能本地 commit，禁止 push、部署和创建 PR。
- 不新增依赖，不创建新测试，不修改 together-trace。
- 不暂存或提交 ../.DS_Store。

当前已知基线：
- npm run build：exit 0。
- npm run lint：exit 1，7 errors + 1 warning。
- 本地站点：http://127.0.0.1:62740
- 当前功能基线：e751b0f66ad1e38202843989ae91422940d0cc9e

第一动作：
- 运行 npm run lint，逐项核对 docs/PROJECT_STATUS.md 中记录的基线；然后完整阅读报错文件和相似实现，按根因拆分修复。不要在理解根因前修改代码。

阶段内工作方式：
- 自主推进，不为普通实现细节请求 Codex。
- 每个 commit 是一个可独立理解和验证的工作单元。
- 每个 commit 同步更新 docs/PROJECT_STATUS.md 的完成内容、验证结果和下一步；不要
  为记录该 commit 自身的 SHA 反复 amend。
- 运行与改动匹配的最窄验证；阶段结束运行 lint、build、npx vitest run 和浏览器检查。
- 未达到阶段门槛就继续工作；达到后停止并交给 Codex 验收。

只有以下情况暂停：
- 需要改变 PROJECT_CHARTER 的锁定方向。
- 需要新增依赖、创建新测试、改变数据结构或架构。
- 涉及隐私、公开叙事、外部账号或不可逆操作。
- 同一问题连续三次修复失败。
- 阶段 1 已达到全部 Acceptance Criteria。
```
