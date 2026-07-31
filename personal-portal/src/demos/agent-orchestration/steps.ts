// src/demos/agent-orchestration/steps.ts

/** @name 旗舰 demo 的一步 */
export interface OrchestrationStep {
  /** 轨道短标签 */
  rail: string
  /** 面板标题 */
  title: string
  /** 这一步在做什么(为什么这么做) */
  body: string
  /** 终端式证据行 */
  evidence: string[]
  /** 可展开的真实原始产物 */
  raw: { label: string; lines: string[] }
}

/**
 * @name 本站受治理构建循环的六步
 * @description 数据取自仓内真实产物(时间线事件 / context:check / context / 真实退出码 /
 *   Charter 暂停条件),demo 只做静态回放,不实时执行命令。
 */
export const ORCHESTRATION_STEPS: OrchestrationStep[] = [
  {
    rail: '基线',
    title: '上下文基线',
    body: '开工先跑 context:check 与 context:确认 active owner、分支、工作树,并读章程/状态/时间线。AI 不靠聊天记忆,靠仓内文档接力。',
    evidence: [
      '$ npm run context:check  → exit 0 · 校验时间线事件',
      '$ npm run context        → exit 0',
    ],
    raw: {
      label: '看 context:check / context 输出的关键字段',
      lines: [
        'branch: dev_1',
        'active owner: Claude',
        'current phase: 阶段 1:工程基线转绿',
        'first action: 运行 npm run context:check && npm run context,确认协议、owner、分支、工作树一致',
      ],
    },
  },
  {
    rail: '意图→目标',
    title: '意图 → 可验证目标',
    body: '把"做 X"翻译成可验证的成功标准;bug 修复必须定位到 文件:行号。目标可验证,循环才能自主收敛。',
    evidence: [
      '意图:让新会话零聊天上下文即可接力',
      '成功标准:context:check exit 0 且能输出 owner/phase/first action',
    ],
    raw: {
      label: '看这一步定下的验收标准',
      lines: [
        '- npm run context:check exit 0',
        '- npm run context 输出 branch / phase / owner / first action / 最近提交 / 时间线',
        '- 新会话只读启动文件即可知道任务、边界、证据、风险、第一动作',
      ],
    },
  },
  {
    rail: '实现',
    title: '最小实现',
    body: '做最小且可解释的改动,每一行都能追溯到意图;不顺手重构无关代码。',
    evidence: [
      '$ git diff --name-only   # 本批次改动的文件',
      '→ CLAUDE.md · docs/PROJECT_CHARTER.md · docs/PROJECT_STATUS.md',
      '→ docs/DECISIONS.md · docs/timeline/README.md',
      '→ scripts/project-context.mjs · docs/timeline/2026-07-31-1525-…md',
    ],
    raw: {
      label: '看这一步的 scope 边界',
      lines: [
        'In scope:决策簿 / 时间线协议 / 无依赖上下文命令 / 治理入口',
        'Out of scope:不改业务源码、不改 Together Trace、不加依赖或测试',
      ],
    },
  },
  {
    rail: '验证门',
    title: '验证门 · 与风险匹配的最窄验证',
    body: '改动落地后先跑匹配的检查,退出码是事实。这批治理文档不动业务源码,只跑上下文与静态检查。lint 没过就标失败,不包装成通过。',
    evidence: [
      '$ npm run context:check → exit 0',
      '$ npm run context       → exit 0',
      '$ git diff --check      → exit 0',
      '基线(本批次不改业务源码,未重跑):build exit 0 · lint exit 1 (7e+1w)',
    ],
    raw: {
      label: '看时间线事件里的 Verification 段',
      lines: [
        '# 2026-07-31-1525-claude-takeover-bootstrap.md · ## Verification',
        '- context:check:exit 0,校验时间线事件',
        '- context:exit 0,输出 branch/owner/phase/first action',
        '- 业务 build/lint:本批次不改业务源码,基线仍为 build exit 0、lint exit 1(7e+1w)',
      ],
    },
  },
  {
    rail: '人类判断门',
    title: '人类判断门',
    body: '命中暂停条件就停、交人拍板——不好回退或涉及隐私/公开口径的动作,AI 不自作主张。这是差异化的核心:门禁,不是产能。',
    evidence: [
      '本批次命中:当前工作经历含雇主内网/隐私 → 原始材料不得进仓',
      '决策:结构先行,公开文案待用户确认',
    ],
    raw: {
      label: '看章程里的暂停条件清单',
      lines: [
        '- 公开口径待用户确认',
        '- 改变锁定方向 / 新增依赖或新测试 / 改数据结构',
        '- 隐私、真实性、外部账号或不可逆操作风险',
        '- 同一问题连续三次修复失败',
        '- push / 部署 / 建 PR 等外部写操作',
        '- 阶段 4 完成、形成发布候选',
      ],
    },
  },
  {
    rail: '提交·时间线·验收',
    title: '提交 · 时间线 · 验收',
    body: '一个可回退的工作单元:本地 commit + 更新状态板 + 追加时间线事件,明确 next owner 与第一动作;阶段门再交 Codex 做长期验收。',
    evidence: [
      '本地 commit(zcy)· 更新 PROJECT_STATUS · 追加 timeline',
      '阶段门 → Codex 长期验收',
    ],
    raw: {
      label: '看时间线事件的 Handoff 段',
      lines: [
        'next owner: Claude',
        'permission: 可连续推进阶段 1–4,每批次创建本地 commit',
        'first action: 运行 npm run context:check && npm run context,随后复现 lint 基线并开始阶段 1',
        'stop conditions: 公开口径待确认 / 锁定方向 / 新依赖或测试 / 隐私真实性 / 三次失败 / 外部写 / 发布候选',
      ],
    },
  },
]
