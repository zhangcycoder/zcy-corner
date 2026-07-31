# Agent Context Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Claude、Codex 和用户只依赖仓库文档即可轮流接管 Personal Portal，并能追溯每次交接、决策、验证与下一动作。

**Architecture:** `PROJECT_CHARTER` 保存长期目标，`PROJECT_STATUS` 保存唯一当前状态，`DECISIONS` 保存锁定决策，`docs/timeline` 以追加式事件保存历史。无依赖 Node 脚本只读这些文档与 Git，生成启动摘要并检查交接协议是否完整。

**Tech Stack:** Markdown、Node.js ESM、Git、npm scripts

## Global Constraints

- 只修改 `/Users/zcy/Desktop/my/zcy-corner/personal-portal` 内文件。
- 只创建本地 commit；禁止 push、部署和创建 PR。
- 不暂存或提交 `../.DS_Store`。
- 不引入依赖，不创建测试文件，不修改业务源码。
- 时间线只追加；事实纠正通过新事件完成。

---

### Task 1: 固化上下文分层与协作协议

**Files:**
- Create: `docs/DECISIONS.md`
- Create: `docs/timeline/README.md`
- Create: `docs/timeline/2026-07-31-claude-takeover-bootstrap.md`
- Modify: `CLAUDE.md`
- Modify: `docs/PROJECT_CHARTER.md`
- Modify: `docs/PROJECT_STATUS.md`

**Interfaces:**
- Consumes: 当前项目章程、状态板、Git 基线和用户确认的 Claude 长期接管方案。
- Produces: 新会话可直接读取的长期规则、当前状态、决策和最近事件。

- [x] **Step 1: 写入决策簿**

记录项目使命、视觉方向、角色分工、本地提交边界、隐私要求、连续自主阶段和时间线协议。

- [x] **Step 2: 写入追加式时间线协议和首个事件**

事件固定记录 actor、base/head commit、目标、范围、决策、验证、风险、下一 owner 与第一动作。

- [x] **Step 3: 更新入口、章程与状态板**

启动顺序加入决策簿和最近时间线；Claude 可连续推进阶段 1–4，仅在隐私口径、重大方向、外部操作和最终发布候选时暂停。

### Task 2: 提供无依赖上下文命令

**Files:**
- Create: `scripts/project-context.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: Git 当前分支、工作树、最近提交，以及四层上下文文档。
- Produces: `npm run context` 的人类可读摘要和 `npm run context:check` 的协议校验退出码。

- [x] **Step 1: 实现上下文摘要**

脚本读取状态板中的阶段、owner、下一动作，并列出最近提交和最近时间线事件；不写文件、不读取仓库外隐私材料。

- [x] **Step 2: 实现协议检查**

检查必需文件、必需标题、`Startup Prompt` 最后一节、时间线字段、占位符和状态板分支一致性；失败时 exit 1。

- [x] **Step 3: 注册 npm scripts**

```json
"context": "node scripts/project-context.mjs",
"context:check": "node scripts/project-context.mjs --check"
```

### Task 3: 验证并创建本地提交

**Files:**
- Verify: all files changed by Task 1 and Task 2

**Interfaces:**
- Consumes: 完整实现。
- Produces: 可由 Claude 直接接管的本地 commit。

- [x] **Step 1: 运行协议校验**

Run: `npm run context:check`

Expected: exit 0，输出 `Context protocol check passed.`

- [x] **Step 2: 检查生成摘要**

Run: `npm run context`

Expected: exit 0，包含 branch、phase、owner、first action、recent commits 和 recent timeline。

- [x] **Step 3: 检查差异**

Run: `git diff --check`

Expected: exit 0。

- [x] **Step 4: 创建本地提交**

只暂存本计划列出的文件，确认 staged diff 不含 `../.DS_Store`，然后使用正确 Git 身份提交。
