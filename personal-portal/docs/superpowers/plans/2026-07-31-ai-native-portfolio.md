# AI 原生作品集重定位 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 personal-portal 重定位为「AI 原生工程师」作品集:一个 replay 本站自身受治理构建循环的旗舰可交互 demo、一个 Together Trace 假数据离线优先 demo、精选/藏宝阁重排、hero 与 meta 口径重写。

**Architecture:** 全部复用现有 React + TypeScript + Vite + MDX + 文件驱动内容模型;两个新 demo 复用 `DemoStage → src/demos/registry → src/demos/<key>/index.tsx` 机制;精选顺序与「早期实验」分组走**代码层策展常量**(零 schema 改动);hero/meta 为文案改动。

**Tech Stack:** React 18、TypeScript、Vite、React Router、MDX、纯 CSS(`src/styles/*.css` + design tokens)。**不新增任何依赖。**

**Spec:** `docs/superpowers/specs/2026-07-31-ai-native-portfolio-design.md`(commit `1b5c8d5`)。

---

## 执行约束(每个 chunk 都适用)

- **分支**:`ai-native-portfolio`(隔离 worktree,基于 `dev_1` HEAD)。**只本地 commit**;不 push / 部署 / 建 PR。
- **worktree 需先装依赖**:本 worktree 是新 checkout,`node_modules` 不随 checkout 而来。**第一件事**:
  ```bash
  cd /Users/zcy/Desktop/my/zcy-corner/.claude/worktrees/ai-native-portfolio/personal-portal
  npm install
  ```
- **不新增测试**(Charter §7):验证 = `build`(exit 0)+ `lint`(**不新增** issue,既有 7 errors + 1 warning 属阶段 1 技术债,**不清零、不算作本计划失败**)+ 浏览器刷新实测。用 `ALLOW_HEAVY=1` 前缀跑 build/lint。
- **不改 `src/content/schema.ts`**;不引新依赖 / 新架构模式。
- **不碰主树并发改动**(`claude-code-config`、`checkContext` 基建)——它们不在本 worktree,天然隔离。
- **治理状态板 / 时间线不在本分支更新**(spec §8):每个 commit 只提交工作产物,`PROJECT_STATUS` + 时间线的章程式更新留到合并回 `dev_1` 的对齐环节。
- **commit 身份**:`zcy <zcy_5332@163.com>`(worktree 已配置好,无需改)。
- **诚实红线**(Charter §5、spec §7):demo 内退出码 / 事件文本必须与仓内真实产物一致,不编造;Together Trace 不 iframe / 不真实数据 / 无 `sourceUrl`;不加防御性 AI 声明。

## Lint 基线锚定(执行前先建立)

- [ ] **建立 lint 基线**:`npm install` 后,先跑一次记录既有问题,后续每次 lint 与之对比,只关心"是否新增"。
  ```bash
  ALLOW_HEAVY=1 npm run lint 2>&1 | tail -20
  ```
  Expected:exit 1,约 `7 errors + 1 warning`,分布在 `ParticleSystem.*`、`Typewriter.tsx`、`SiteHeader.tsx`、`DemoStage.tsx`、`demos/particle-field/index.tsx`(既有技术债)。**记住这份清单**;本计划新增文件不得引入新条目。

## 文件结构总览(改动锁定在此)

| 文件 | 职责 | chunk |
|---|---|---|
| `src/demos/agent-orchestration/index.tsx` | 新建·旗舰单步流水线 demo 组件 | 1 |
| `src/demos/agent-orchestration/steps.ts` | 新建·6 步真实数据(与 demo 分离,便于核对) | 1 |
| `src/content/vault/agent-orchestration/meta.json` | 新建·旗舰藏品元数据(featured, demoKey) | 1 |
| `src/content/vault/agent-orchestration/index.mdx` | 新建·旗舰藏品正文 | 1 |
| `public/covers/agent-orchestration.svg` | 新建·封面 | 1 |
| `src/demos/registry.ts` | 改·注册两个新 demoKey | 1 / 4 |
| `src/styles/site.css` | 改·新增两个 demo + 早期实验分区样式 | 1 / 3 / 4 |
| `src/content/contentLoader.ts` | 改·精选策展顺序 + 导出早期实验 slug 常量 | 2 |
| `src/content/vault/supet-industrial-platform/meta.json` | 改·`featured: true → false` | 2 |
| `src/pages/VaultPage.tsx` | 改·拆出「早期实验」分区 | 2 |
| `src/pages/HomePage.tsx` | 改·hero 文案 + `CURRENT_FOCUS` chips | 3 |
| `src/content/vault/personal-portal/index.mdx` + `meta.json` | 改·meta 口径重写 + 跳转旗舰 | 3 |
| `src/demos/together-trace-offline/index.tsx` | 新建·假数据离线优先 demo | 4 |
| `src/content/vault/together-trace/meta.json` | 改·增 `demoKey` | 4 |

**延迟项(不在本计划)**:金融 0-1 藏品(spec §5.3/§8),内容待阶段 2 脱敏 + 用户确认后单独一批。

---

## Chunk 1: 旗舰「Agent 编排体系」案例 + 单步流水线 demo

**目标**:新增 `agent-orchestration` 藏品与其 6 步可交互 demo,replay 本站自身受治理构建循环,每步露出**真实**证据。

**Files:**
- Create: `src/demos/agent-orchestration/steps.ts`
- Create: `src/demos/agent-orchestration/index.tsx`
- Create: `src/content/vault/agent-orchestration/meta.json`
- Create: `src/content/vault/agent-orchestration/index.mdx`
- Create: `public/covers/agent-orchestration.svg`
- Modify: `src/demos/registry.ts`
- Modify: `src/styles/site.css`(追加,不改既有)

- [ ] **Step 1: 写 6 步真实数据 `steps.ts`**

所有 `evidence` / `raw` 取自真实仓内产物(`docs/timeline/2026-07-31-1525-claude-takeover-bootstrap.md`、`context:check` / `context` 输出、真实 build/lint 退出码、Charter 暂停条件)。**不得编造数值。**

```ts
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
```

- [ ] **Step 2: Commit 数据文件**

```bash
git add src/demos/agent-orchestration/steps.ts
git commit -m "feat(portal): add agent orchestration demo step data"
```

- [ ] **Step 3: 写 demo 组件 `index.tsx`**

用户驱动步进,无自动播放;键盘可达(用原生 `<button>`);证据可展开用原生 `<details>`。天然 reduced-motion 友好(无动画)。

```tsx
// src/demos/agent-orchestration/index.tsx
import { useState } from 'react'
import { ORCHESTRATION_STEPS } from './steps'

/**
 * @name Agent 编排体系旗舰 demo
 * @description 单步回放本站自身的受治理构建循环(6 步),每步展示真实退出码/事件,
 *   可展开原始产物。用户驱动、无自动播放,尊重 reduced-motion。
 */
export default function AgentOrchestrationDemo() {
  const [step, setStep] = useState(0)
  const total = ORCHESTRATION_STEPS.length
  const current = ORCHESTRATION_STEPS[step]

  return (
    <div className="agent-demo">
      <ol className="agent-demo__rail" aria-label="编排流水线">
        {ORCHESTRATION_STEPS.map((item, index) => (
          <li
            key={item.rail}
            className={
              'agent-demo__stage'
              + (index < step ? ' is-done' : '')
              + (index === step ? ' is-current' : '')
            }
            aria-current={index === step ? 'step' : undefined}
          >
            <span className="agent-demo__stage-n">{String(index + 1).padStart(2, '0')}</span>
            {item.rail}
          </li>
        ))}
      </ol>

      <div className="agent-demo__panel">
        <p className="agent-demo__kicker">STEP {step + 1} / {total}</p>
        <h3 className="agent-demo__title">{current.title}</h3>
        <p className="agent-demo__body">{current.body}</p>

        <pre className="agent-demo__evidence" aria-label="这一步的真实证据">
          {current.evidence.join('\n')}
        </pre>

        <details className="agent-demo__raw">
          <summary>▸ {current.raw.label}</summary>
          <pre>{current.raw.lines.join('\n')}</pre>
        </details>
      </div>

      <div className="agent-demo__nav">
        <button
          type="button"
          className="agent-demo__btn"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
        >
          ← 上一步
        </button>
        <span className="agent-demo__dots" aria-hidden="true">
          {ORCHESTRATION_STEPS.map((item, index) => (
            <span key={item.rail} className={index === step ? 'is-on' : ''}>●</span>
          ))}
        </span>
        <button
          type="button"
          className="agent-demo__btn"
          onClick={() => setStep((value) => Math.min(total - 1, value + 1))}
          disabled={step === total - 1}
        >
          下一步 →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 注册 demoKey**

`src/demos/registry.ts` — 扩展 `DemoKey` union 与 loader map(本 chunk 先加 agent-orchestration;together-trace-offline 在 chunk 4 加):

```ts
export type DemoKey = 'particle-field' | 'typewriter-effect' | 'agent-orchestration'

const demoLoaders: Record<DemoKey, DemoLoader> = {
  'particle-field': () => import('./particle-field'),
  'typewriter-effect': () => import('./typewriter-effect'),
  'agent-orchestration': () => import('./agent-orchestration'),
}
```

- [ ] **Step 5: 加样式**(追加到 `src/styles/site.css` 末尾的 demo 区,复用 tokens,mirror `.typewriter-effect-demo` 约定)

```css
/* Agent 编排体系 demo */
.agent-demo {
  min-height: inherit;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  color: var(--color-text);
  background: var(--color-gallery-elevated);
  font-family: var(--font-sans);
}

.agent-demo__rail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.agent-demo__stage {
  flex: 1 1 6rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--color-line-dark);
  border-radius: 0.375rem;
  color: var(--color-muted-dark);
  font: 500 0.75rem/1.3 var(--font-sans);
  opacity: 0.6;
}

.agent-demo__stage.is-done { opacity: 0.85; }

.agent-demo__stage.is-current {
  opacity: 1;
  color: var(--color-text);
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 16%, transparent);
}

.agent-demo__stage-n {
  display: block;
  font: 500 0.625rem/1 var(--font-mono);
  letter-spacing: 0.08em;
  opacity: 0.7;
}

.agent-demo__panel {
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--color-line-dark);
  border-radius: 0.625rem;
}

.agent-demo__kicker {
  margin: 0 0 0.5rem;
  color: var(--color-muted-dark);
  font: 500 0.6875rem/1 var(--font-mono);
  letter-spacing: 0.08em;
}

.agent-demo__title { margin: 0 0 0.5rem; font-size: 1.125rem; }
.agent-demo__body { margin: 0 0 0.75rem; color: var(--color-muted-dark); line-height: 1.6; }

.agent-demo__evidence {
  margin: 0;
  padding: 0.75rem 0.875rem;
  border: 1px dashed var(--color-line-dark);
  border-radius: 0.5rem;
  color: var(--color-text);
  font: 500 0.75rem/1.7 var(--font-mono);
  white-space: pre-wrap;
  overflow-x: auto;
}

.agent-demo__raw { margin-top: 0.75rem; font-size: 0.8125rem; }
.agent-demo__raw summary { cursor: pointer; color: var(--color-muted-dark); }
.agent-demo__raw pre {
  margin: 0.5rem 0 0;
  color: var(--color-muted-dark);
  font: 500 0.75rem/1.7 var(--font-mono);
  white-space: pre-wrap;
}

.agent-demo__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.agent-demo__btn {
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--color-line-dark);
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-text);
  font: 500 0.8125rem/1 var(--font-sans);
  cursor: pointer;
  transition: border-color var(--transition-fast) ease;
}

.agent-demo__btn:hover:not(:disabled) { border-color: var(--color-accent); }
.agent-demo__btn:disabled { opacity: 0.4; cursor: not-allowed; }

.agent-demo__dots { display: flex; gap: 0.25rem; color: var(--color-line-dark); font-size: 0.625rem; }
.agent-demo__dots .is-on { color: var(--color-accent); }
```

- [ ] **Step 6: 写封面 `public/covers/agent-orchestration.svg`**（viewBox 与既有封面一致 1200×720,暗色 Gallery 调）

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#0b0c0f"/>
  <g fill="none" stroke="#23262f" stroke-width="1.5">
    <path d="M120 360H1080"/>
  </g>
  <g font-family="SFMono-Regular, ui-monospace, monospace" fill="#68645d" font-size="26" font-weight="600">
    <text x="120" y="330">01 基线 → 02 意图 → 03 实现 → 04 验证门 → 05 判断门 → 06 提交</text>
  </g>
  <g>
    <circle cx="120" cy="360" r="9" fill="#7188ff"/>
    <circle cx="312" cy="360" r="9" fill="#7188ff"/>
    <circle cx="504" cy="360" r="9" fill="#7188ff"/>
    <circle cx="696" cy="360" r="12" fill="#7188ff"/>
    <circle cx="888" cy="360" r="9" fill="#5566d8"/>
    <circle cx="1080" cy="360" r="9" fill="#5566d8"/>
  </g>
  <text x="120" y="430" font-family="PingFang SC, system-ui, sans-serif" fill="#f0f0ec" font-size="46" font-weight="600">Agent 编排 · 验收门禁</text>
  <text x="120" y="474" font-family="PingFang SC, system-ui, sans-serif" fill="#97999f" font-size="24">我主导架构与验收,AI 在门禁下实现</text>
</svg>
```

- [ ] **Step 7: 写藏品元数据 `meta.json`**

```json
{
  "slug": "agent-orchestration",
  "title": {
    "zh-CN": "Agent 编排体系 — 我如何指挥 AI 造高质量代码",
    "en-US": "Agent Orchestration — How I Direct AI to Ship Quality Code"
  },
  "summary": {
    "zh-CN": "一套让 AI 在我的门禁下稳定产出的编排/验收体系:上下文基线、可验证目标、验证门、人类判断门、追加式时间线。这个 demo 回放本站自身如何被造。",
    "en-US": "An orchestration/acceptance system that keeps AI productive under my gates: context baseline, verifiable goals, verification gates, human-judgment gate, append-only timeline. This demo replays how this very site is built."
  },
  "type": "project",
  "tags": ["AI 编排", "工程治理", "验收门禁", "方法论"],
  "createdAt": "2026-07-31",
  "updatedAt": "2026-07-31",
  "status": "published",
  "featured": true,
  "cover": "/covers/agent-orchestration.svg",
  "demoKey": "agent-orchestration"
}
```

- [ ] **Step 8: 写藏品正文 `index.mdx`**（诚实口径,无防御性 AI 声明;结论都可由仓内产物支持）

```mdx
# Agent 编排体系 — 我如何指挥 AI 造高质量代码

差异化不在"谁敲代码",而在**工程判断**,和我为 AI 立起的一套**编排 / 验证 / 门禁体系**。这个站就是它的产物——上方的 demo 单步回放了本站自身**每一次改动都要走的循环**,每一步的退出码和时间线都取自真实仓内记录。

## 循环的六步

1. **上下文基线** — 开工先跑 `context:check` 与 `context`,确认 active owner、分支、工作树,读章程/状态/时间线。AI 不靠聊天记忆接力,靠仓内文档。
2. **意图 → 可验证目标** — 把"做 X"翻译成可验证的成功标准;bug 必须定位到 `文件:行号`。
3. **最小实现** — 最小且可解释的改动,每行都能追溯到意图。
4. **验证门** — 跑与风险匹配的最窄检查;退出码是事实,`lint` 没过就标失败,不包装成通过。
5. **人类判断门** — 命中暂停条件(隐私 / 新依赖 / 公开口径 / 外部写)就停、交人拍板。
6. **提交 · 时间线 · 验收** — 一个可回退的工作单元:本地 commit + 状态板 + 追加时间线;阶段门再交 Codex 长期验收。

## 为什么这套体系是差异化

- **门禁比产能重要**:AI 最贵的失败是"朝错误方向高效地写一大堆"。判断门把不可逆、涉隐私、超范围的动作挡在人类决策前。
- **可接力**:四层上下文(章程 / 状态 / 决策 / 时间线)+ 追加式时间线,让任何新会话零聊天上下文即可继续。
- **诚实的完成度**:验证退出码如实记录,规划中的能力不写成已完成。

> 这不是"AI 帮我写代码"的故事,而是"我用一套体系让 AI 的产出稳定可信"的故事。
```

- [ ] **Step 9: 验证 build**

Run: `ALLOW_HEAVY=1 npm run build`
Expected: **exit 0**(新藏品通过 `validateTreasureMeta`;新 demoKey 类型收窄通过 `tsc -b`)。若报 `slug must match directory name` → 检查目录名 = `agent-orchestration`。

- [ ] **Step 10: 验证 lint 不新增**

Run: `ALLOW_HEAVY=1 npm run lint 2>&1 | tail -20`
Expected: 仍为基线的 7 errors + 1 warning,**无新增**(新文件不在报错清单)。若新增 → 修到与基线一致。

- [ ] **Step 11: 浏览器实测**（端口未监听先起 dev)

```bash
lsof -nP -iTCP:62740 -sTCP:LISTEN || npm run dev -- --host 127.0.0.1 --port 62740 &
```
刷新 `http://127.0.0.1:62740/vault/agent-orchestration`,确认:demo 出现(非 fallback/loading),点「下一步」6 步可走、进度点跟随、`<details>` 可展开、退出码文本与 `steps.ts` 一致;无新 console error。

- [ ] **Step 12: Commit**

```bash
git add src/demos/agent-orchestration/index.tsx src/demos/registry.ts src/styles/site.css \
  public/covers/agent-orchestration.svg src/content/vault/agent-orchestration/
git commit -m "feat(portal): add flagship agent orchestration case and demo"
```

---

## Chunk 2: 藏宝阁策展(精选顺序 + supET 降级 + 早期实验分区)

**目标**:精选按 ②→①→③ 显式排序、supET 退出精选、particle-field/typewriter 收进「早期实验」分区。零 schema 改动。

**Files:**
- Modify: `src/content/contentLoader.ts:51-54`(`getFeaturedTreasures`)+ 追加导出 `EARLY_EXPERIMENT_SLUGS`
- Modify: `src/content/vault/supet-industrial-platform/meta.json`(`featured` 字段)
- Modify: `src/pages/VaultPage.tsx`
- Modify: `src/styles/site.css`(早期实验分区样式)

- [ ] **Step 1: 改 `getFeaturedTreasures` 为策展顺序 + 导出早期实验常量**

替换 `src/content/contentLoader.ts` 中现有的 `getFeaturedTreasures`(第 51–54 行),并在其上方加两个策展常量:

```ts
/** @name 首页精选策展顺序(② 方法论 → ① 产品 → ③ meta) */
const FEATURED_ORDER = ['agent-orchestration', 'together-trace', 'personal-portal']

/** @name 藏宝阁「早期实验」分区的藏品 */
export const EARLY_EXPERIMENT_SLUGS = ['particle-field', 'typewriter-effect']

/**
 * @name 获取首页精选藏品
 * @description 按 FEATURED_ORDER 显式策展顺序;列表中不存在/未 published/未 featured
 *   的 slug 直接跳过(支撑过渡态),列表外的 featured 项按更新时间兜底追加。
 */
export function getFeaturedTreasures(limit = 3): TreasureRecord[] {
  const featured = getPublishedTreasures().filter((item) => item.featured)
  const ordered = FEATURED_ORDER
    .map((slug) => featured.find((item) => item.slug === slug))
    .filter((item): item is TreasureRecord => Boolean(item))
  const rest = featured.filter((item) => !FEATURED_ORDER.includes(item.slug))
  return [...ordered, ...rest].slice(0, limit)
}
```

- [ ] **Step 2: supET 降级**

`src/content/vault/supet-industrial-platform/meta.json`:`"featured": true` → `"featured": false`。

- [ ] **Step 3: 验证 build（精选逻辑不破类型)**

Run: `ALLOW_HEAVY=1 npm run build`
Expected: exit 0。

- [ ] **Step 4: VaultPage 拆出「早期实验」分区**

`src/pages/VaultPage.tsx`:import 加 `EARLY_EXPERIMENT_SLUGS`;在 `visibleTreasures` 之后按早期实验 slug 分区;主 grid 只渲染非早期项,末尾追加带标题的早期实验分区。

import 改:
```tsx
import {
  EARLY_EXPERIMENT_SLUGS,
  getPublishedTreasures,
  getTreasureTypes,
} from '../content/contentLoader'
```

在 `const visibleTreasures = …` 之后新增:
```tsx
  const mainTreasures = visibleTreasures.filter(
    (treasure) => !EARLY_EXPERIMENT_SLUGS.includes(treasure.slug),
  )
  const earlyTreasures = visibleTreasures.filter(
    (treasure) => EARLY_EXPERIMENT_SLUGS.includes(treasure.slug),
  )
```

把主 `.treasure-grid` 的 `visibleTreasures.map` 换成 `mainTreasures.map`;在该 `</section>` 之后、`</div>` 之前追加:
```tsx
      {earlyTreasures.length > 0 && (
        <section
          className="vault-page__early"
          aria-labelledby="vault-early-title"
        >
          <div className="vault-page__early-head">
            <span className="home-eyebrow">EARLY EXPERIMENTS</span>
            <h2 id="vault-early-title">{isEnglish ? 'Early experiments' : '早期实验'}</h2>
            <p>{isEnglish
              ? 'Warm-up demos kept for the record — not the current headline.'
              : '留档的热身实验——不再是当前主线,但记录仍在。'}</p>
          </div>
          <div className="treasure-grid">
            {earlyTreasures.map((treasure) => (
              <TreasureCard key={treasure.slug} treasure={treasure} locale={locale} />
            ))}
          </div>
        </section>
      )}
```

> 注:主 grid 的 `priority={index === 0}` 保持在 `mainTreasures.map` 上(首张预加载);早期实验组不传 priority。类型筛选天然生效——早期项被 type 过滤掉时 `earlyTreasures` 为空、分区不渲染。

- [ ] **Step 5: 早期实验分区样式**（追加到 `src/styles/site.css`)

```css
.vault-page__early {
  margin-top: clamp(2.5rem, 6vw, 4rem);
  padding-top: clamp(1.5rem, 4vw, 2.5rem);
  border-top: 1px solid var(--color-line-dark);
}

.vault-page__early-head { margin-bottom: 1.5rem; }
.vault-page__early-head h2 { margin: 0.25rem 0 0.5rem; }
.vault-page__early-head p { margin: 0; color: var(--color-muted-dark); max-width: var(--reading-width); }
```

- [ ] **Step 6: 验证 build + lint 不新增**

Run: `ALLOW_HEAVY=1 npm run build && ALLOW_HEAVY=1 npm run lint 2>&1 | tail -8`
Expected: build exit 0;lint 仍为基线,无新增。

- [ ] **Step 7: 浏览器实测**

刷新 `http://127.0.0.1:62740/`:首页精选**三位且顺序为** agent-orchestration → together-trace → personal-portal;supET 不在精选。
刷新 `http://127.0.0.1:62740/vault`:主 grid 不含 particle-field/typewriter,底部有「早期实验」分区含这两项;按 `?type=demo` 筛选时早期实验分区随之变化;无新 console error。

- [ ] **Step 8: Commit**

```bash
git add src/content/contentLoader.ts src/content/vault/supet-industrial-platform/meta.json \
  src/pages/VaultPage.tsx src/styles/site.css
git commit -m "feat(portal): curate featured order and early-experiments section"
```

---

## Chunk 3: Home hero 重写 + 本站 meta 口径

**目标**:hero 换成 AI 原生主线(方向 1),chips 更新;personal-portal 藏品口径重写并跳转旗舰 demo。

**Files:**
- Modify: `src/pages/HomePage.tsx:11`(CURRENT_FOCUS)+ `:23-27`(hero eyebrow/h1/描述,**勿动第 28 行 `home-hero__actions`**)
- Modify: `src/content/vault/personal-portal/index.mdx` + `meta.json`(口径)

- [ ] **Step 1: 改 hero 文案与 chips**

`src/pages/HomePage.tsx`:

第 11 行:
```tsx
const CURRENT_FOCUS = ['AI 编排 · 验收门禁', '离线优先的真实产品', '工程判断 > 敲代码']
```

hero 的 eyebrow/h1/描述块(约 23–27 行,**替换时勿动第 28 行 `home-hero__actions`**):
```tsx
          <p className="home-eyebrow">AI-NATIVE ENGINEER · 架构与验收</p>
          <h1 id="home-title">我编排 AI 造复杂、能跑、且经得起验收的东西。</h1>
          <p className="home-hero__description">
            差异化不在谁敲代码,而在工程判断,和我为 AI 立起的编排 / 验证 / 门禁体系。这里是能跑的证据。
          </p>
```

- [ ] **Step 2: 重写 personal-portal 藏品口径**

`src/content/vault/personal-portal/meta.json` 的 `summary`(zh-CN + en-US 同步)改为强调"agent 持续构建 + 受治理的产物"。目标文案(可直接替换):

```json
"summary": {
  "zh-CN": "这个站本身就是作品:由 agent 在受治理流程(章程 / 验收门 / 追加式时间线)下持续开发的个人技术空间。它的交互证据就是旗舰 demo——单步回放本站自己的构建循环。",
  "en-US": "The site is itself the artifact: a personal tech space continuously built by an agent under a governed process (charter, verification gates, append-only timeline). Its interactive proof is the flagship demo that replays this site's own build loop."
}
```

`index.mdx` 正文按上述口径重写,并在正文中加一处**跳转旗舰 demo** 的内链:

在 `index.mdx` 合适位置加(Markdown 链接,详情页 slug 路由为 `/vault/<slug>`):
```mdx
> 想看它**怎么被造**?去 [Agent 编排体系](/vault/agent-orchestration) 单步走一遍本站自身的构建循环。
```

> meta 口径要点(诚实):这个站由 agent 在受治理流程下持续开发;交互证据就是旗舰 demo 本身,因此 personal-portal 不再单独做 demo。措辞不加防御性 AI 声明。

- [ ] **Step 3: 验证 build + lint 不新增**

Run: `ALLOW_HEAVY=1 npm run build && ALLOW_HEAVY=1 npm run lint 2>&1 | tail -8`
Expected: build exit 0;lint 无新增。

- [ ] **Step 4: 浏览器实测**

刷新 `http://127.0.0.1:62740/`:hero 为新标题 + eyebrow + 描述,三个新 chips;刷新 `http://127.0.0.1:62740/vault/personal-portal`:口径已更新,内链可跳到 `/vault/agent-orchestration`;无新 console error。

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/content/vault/personal-portal/
git commit -m "feat(portal): reframe home hero and site-meta case for ai-native positioning"
```

---

## Chunk 4: Together Trace 假数据离线优先 demo

**目标**:给 `together-trace` 加一个自包含、全假数据的离线优先 demo(唯一的第二个可交互证据),守红线(不 iframe / 不真实数据 / 不引导登录 / 无 sourceUrl)。

**Files:**
- Create: `src/demos/together-trace-offline/index.tsx`
- Modify: `src/demos/registry.ts`(加第二个 demoKey)
- Modify: `src/content/vault/together-trace/meta.json`(加 `demoKey`)
- Modify: `src/styles/site.css`(demo 样式)

- [ ] **Step 1: 写 demo 组件**

演示"离线优先:本地先写、回到在线自动 flush"。全假数据、无网络调用、无登录。reduced-motion 友好(仅状态切换,无关键动画)。

```tsx
// src/demos/together-trace-offline/index.tsx
import { useState } from 'react'

interface Moment {
  id: number
  text: string
  synced: boolean
}

const SEED: Moment[] = [
  { id: 1, text: '一起看了日落', synced: true },
  { id: 2, text: '煮了咖啡', synced: true },
]

/**
 * @name Together Trace 离线优先 demo
 * @description 全假数据、自包含:离线时本地先写入并入队,切回在线后 flush 同步。
 *   仅演示"离线优先"工程概念,不触网、不涉真实数据、不引导登录。
 */
export default function TogetherTraceOfflineDemo() {
  const [online, setOnline] = useState(false)
  const [draft, setDraft] = useState('')
  const [moments, setMoments] = useState<Moment[]>(SEED)
  const [nextId, setNextId] = useState(3)

  const pending = moments.filter((moment) => !moment.synced).length

  const addMoment = () => {
    const text = draft.trim()
    if (!text) return
    // 离线优先:无论在线与否都先本地写入并立即可见;在线则视为已同步
    setMoments((list) => [...list, { id: nextId, text, synced: online }])
    setNextId((value) => value + 1)
    setDraft('')
  }

  const toggleOnline = () => {
    setOnline((value) => {
      const next = !value
      // 回到在线 → flush 同步队列
      if (next) setMoments((list) => list.map((moment) => ({ ...moment, synced: true })))
      return next
    })
  }

  return (
    <div className="tt-offline">
      <div className="tt-offline__bar">
        <span className={'tt-offline__status' + (online ? ' is-online' : '')}>
          {online ? '● 在线' : '○ 离线'}
        </span>
        {pending > 0 && <span className="tt-offline__pending">待同步 {pending}</span>}
        <button type="button" className="tt-offline__toggle" onClick={toggleOnline}>
          {online ? '🔌 切到离线' : '🔌 回到在线'}
        </button>
      </div>

      <div className="tt-offline__compose">
        <input
          className="tt-offline__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') addMoment() }}
          placeholder="写一条 moment…"
          aria-label="写一条 moment"
        />
        <button type="button" className="tt-offline__add" onClick={addMoment}>添加</button>
      </div>

      <ul className="tt-offline__list">
        {moments.map((moment) => (
          <li key={moment.id} className="tt-offline__item">
            <span>{moment.text}</span>
            <span className={'tt-offline__tag' + (moment.synced ? ' is-synced' : '')}>
              {moment.synced ? 'synced ✓' : 'queued'}
            </span>
          </li>
        ))}
      </ul>

      <p className="tt-offline__note">
        本地先写、界面即时可见;回到在线自动 flush 同步队列。全假数据,仅演示离线优先概念。
      </p>
    </div>
  )
}
```

- [ ] **Step 2: 注册第二个 demoKey**

`src/demos/registry.ts`:
```ts
export type DemoKey = 'particle-field' | 'typewriter-effect' | 'agent-orchestration' | 'together-trace-offline'

const demoLoaders: Record<DemoKey, DemoLoader> = {
  'particle-field': () => import('./particle-field'),
  'typewriter-effect': () => import('./typewriter-effect'),
  'agent-orchestration': () => import('./agent-orchestration'),
  'together-trace-offline': () => import('./together-trace-offline'),
}
```

- [ ] **Step 3: 给 together-trace 挂 demoKey**

`src/content/vault/together-trace/meta.json`:在 `"externalUrl"` 行前(或任意位置)加:
```json
  "demoKey": "together-trace-offline",
```
> 保持 `externalUrl` 不动、**绝不加 `sourceUrl`**(红线)。加 demoKey 后详情页预览区从封面图切换为 demo。

- [ ] **Step 4: 加样式**（追加到 `src/styles/site.css`)

```css
/* Together Trace 离线优先 demo */
.tt-offline {
  min-height: inherit;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  color: var(--color-text);
  background: var(--color-gallery-elevated);
  font-family: var(--font-sans);
}

.tt-offline__bar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.tt-offline__status { color: var(--color-muted-dark); font: 500 0.8125rem/1 var(--font-mono); }
.tt-offline__status.is-online { color: var(--color-accent); }
.tt-offline__pending {
  padding: 0.125rem 0.5rem;
  border: 1px solid color-mix(in srgb, #d2a046 55%, transparent);
  border-radius: 999px;
  color: #d2a046;
  font: 500 0.6875rem/1.4 var(--font-mono);
}

.tt-offline__toggle,
.tt-offline__add {
  padding: 0.4375rem 0.75rem;
  border: 1px solid var(--color-line-dark);
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-text);
  font: 500 0.8125rem/1 var(--font-sans);
  cursor: pointer;
  transition: border-color var(--transition-fast) ease;
}
.tt-offline__toggle { margin-left: auto; }
.tt-offline__toggle:hover, .tt-offline__add:hover { border-color: var(--color-accent); }

.tt-offline__compose { display: flex; gap: 0.5rem; }
.tt-offline__input {
  flex: 1;
  padding: 0.4375rem 0.625rem;
  border: 1px solid var(--color-line-dark);
  border-radius: 0.375rem;
  background: var(--color-gallery);
  color: var(--color-text);
  font: 400 0.875rem/1.4 var(--font-sans);
}

.tt-offline__list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.375rem; }
.tt-offline__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-line-dark);
  border-radius: 0.375rem;
}
.tt-offline__tag { font: 500 0.6875rem/1 var(--font-mono); color: #d2a046; }
.tt-offline__tag.is-synced { color: var(--color-accent); }
.tt-offline__note { margin: 0; color: var(--color-muted-dark); font-size: 0.8125rem; line-height: 1.6; }
```

- [ ] **Step 5: 验证 build + lint 不新增**

Run: `ALLOW_HEAVY=1 npm run build && ALLOW_HEAVY=1 npm run lint 2>&1 | tail -8`
Expected: build exit 0;lint 无新增。

- [ ] **Step 6: 浏览器实测**

刷新 `http://127.0.0.1:62740/vault/together-trace`:预览区是离线 demo(非封面图);默认离线 → 添加一条 → 显示 `queued` + 待同步计数;点「回到在线」→ 全部变 `synced ✓`、计数清零;详情页 RESOURCES 只有「访问项目」、**无「查看源码」**;无新 console error。

- [ ] **Step 7: Commit**

```bash
git add src/demos/together-trace-offline/index.tsx src/demos/registry.ts \
  src/content/vault/together-trace/meta.json src/styles/site.css
git commit -m "feat(portal): add together trace offline-first fake-data demo"
```

---

## 收尾验证(全 chunk 完成后)

- [ ] **全量 build**:`ALLOW_HEAVY=1 npm run build` → exit 0。
- [ ] **lint 对比基线**:`ALLOW_HEAVY=1 npm run lint 2>&1 | tail -20` → 仍 7 errors + 1 warning,**零新增**。
- [ ] **既有测试不回归**:`ALLOW_HEAVY=1 npx vitest run` → 现有测试仍通过(未新增测试,只确认没弄坏)。
- [ ] **浏览器全链路**:首页 hero/精选顺序、`/vault` 早期实验分区、两个新 demo 交互、Together Trace 无源码入口、既有 particle-field/typewriter 仍可用;刷新后无新 console error。
- [ ] **工作树干净**:`git status --short` 仅剩 `../.DS_Store`(不提交);`git log --oneline b685509..HEAD` 只含本计划的 commit、身份为 `zcy`。

## 暂停点(遇到即停,交用户/Codex)

- 金融 0-1 内容(本计划外,待阶段 2 脱敏 + 用户确认)。
- 任何红线不确定、需要改锁定方向 / 加依赖 / 加测试 / 改 schema。
- 同一问题连续三次修复失败。
- 合并回 `dev_1` 与治理状态对齐(由用户驱动)。
