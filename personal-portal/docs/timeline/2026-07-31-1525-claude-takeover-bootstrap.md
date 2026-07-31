# Claude 长期接管与智能时间线启动

## Event

- time: `2026-07-31 15:25 Asia/Shanghai`
- actor: `Codex`
- event type: `decision + handoff`

## Git

- branch: `dev_1`
- base commit: `e751b0f66ad1e38202843989ae91422940d0cc9e`
- head commit before this event: `39a0405dec9285bd308425b39280a435d0c7f4c8`
- event commit: `pending`，由下一条时间线事件补证，避免提交自引用循环。
- worktree before this event: 仅 `?? ../.DS_Store`，未触碰且不得提交。

## Goal

把 Claude 的短阶段任务升级为可跨会话连续执行的长期接管，并建立无需聊天上下文的
项目事实、决策和历史接力体系。

## Scope

- 新增决策簿、时间线协议、初始交接事件和无依赖上下文命令。
- 更新 Claude 入口、项目章程和当前状态板。
- 不修改 React/TypeScript 业务源码，不修改 Together Trace，不新增依赖或测试。
- 不 push、不部署、不创建 PR。

## Decisions

- 新增并生效：`D-006` 四层上下文和追加式时间线。
- 新增并生效：`D-007` 五段连续工作路线。
- 沿用：`D-001` 至 `D-005`。

## Verification

- `git status --short --branch`：开始时为 `dev_1...origin/dev_1 [ahead 17]`，
  仅有 `?? ../.DS_Store`。
- `npm run context:check`：exit 0，校验 1 条时间线事件。
- `npm run context`：exit 0，输出 branch、active owner、current phase、first action、
  最近提交和最近时间线。
- `git diff --check`：exit 0。
- 业务 build/lint/test：本批次不修改业务源码，因此未重复运行；最近可证基线仍为
  build exit 0、lint exit 1（7 errors + 1 warning）。

## Risks

- 当前工作经历可能包含雇主内网与隐私信息；原始材料不得进入本仓库。
- lint 基线仍未转绿，Claude 的第一执行任务保持阶段 1，不因治理文档完成而跳过。

## Handoff

- next owner: `Claude`
- permission: 可连续推进章程阶段 1–4，并在每个完整工作批次创建本地 commit。
- first action: 运行 `npm run context:check && npm run context`，随后复现 lint 基线并开始阶段 1。
- stop conditions: 当前工作公开文案待用户确认、锁定方向变化、新依赖或新测试、隐私或真实性风险、连续三次失败、外部写操作、最终发布候选。
