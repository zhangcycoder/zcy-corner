# AI 原生作品集重定位 — 设计确认

> 日期：2026-07-31
> 仓库：personal-portal（Gallery & Paper）
> 工作分支：`ai-native-portfolio`（隔离 worktree，基于 `dev_1` HEAD `b685509`；只本地 commit）
> 证据源：`.superpowers/handoffs/personal-portal-ai-native-redesign-handoff.md`、
> `docs/PROJECT_CHARTER.md`、`docs/DECISIONS.md`、`docs/timeline/2026-07-31-1525-claude-takeover-bootstrap.md`、
> 本轮 brainstorming 逐节确认（IA / 旗舰 demo / 锚点分配 / hero）
> 隔离说明：主树中今日 17:26–17:33 的并发未提交改动（`claude-code-config` 藏品 + `checkContext` 脚本基建）**不纳入本设计**，两条线各自演进、后续再对齐（用户确认）。

---

## 1. 战略定位与人机口径（已锁定，勿重议）

- **重定位**：把 personal-portal 从"通用前端作品集"重定位为**「AI 原生工程师」作品集**。主线一句话:
  **「我能编排 AI 造复杂、能跑、且经得起验收的东西。」**
- **人 / AI 口径**：**我主导架构 + 验收,AI 在我的门禁下做实现**。差异化在**工程判断 + 编排 / 验收体系**,不是"谁敲代码"。
- **诚实边界**(对齐 Charter §5)：不加防御性 AI 参与声明;不编造 AI 参与比例、指标或开发周期;区分"独立规划 / 参与开发 / 完全独立",区分"已实现 / 已构建验证 / 已线上运行"。
- **四个证据锚点(全要)**:
  - ① **Together Trace** — 离线优先 App,已线上(pages.dev)。
  - ② **Agent 编排 / 治理体系本身** — 做成可展示方法论 + 旗舰可交互 demo。
  - ③ **本站 meta** — 由 agent 持续开发 + 受治理的产物,自证。
  - ④ **脱敏金融 0-1** — 纯叙述,无公开代码。
- **"交互体验"的含义**:案例要能**看到交互**(可玩产品 / 可交互流程),不是站本身的微交互。

## 2. 范围与非范围

**In scope（全在 `ai-native-portfolio` 分支、只本地 commit）**

- 首页 hero 重写 + `当前关注` chips 更新。
- 藏宝阁 IA:精选重排(显式顺序)、supET 降级、早期实验分区。
- 新增旗舰案例 `agent-orchestration`(锚点②)+ 其单步流水线 demo。
- 为 `together-trace` 增设假数据离线优先 demo(锚点①,唯一的第二个可交互证据)。
- `personal-portal`(锚点③)案例口径重写 + 跳转旗舰 demo。
- 金融 0-1(锚点④)案例**结构**定义(内容延迟,见 §8)。

**Out of scope**

- 改 `/Users/zcy/Desktop/together-trace` 源码;iframe 内嵌或展示 Together Trace 真实数据 / 引导登录。
- 新增依赖 / 框架 / CMS;改动 `src/content/schema.ts` 的数据结构;引入新架构模式。
- 新增测试(Charter 默认约束)。
- push / 部署 / 建 PR。
- 纳入或改动主树的并发改动(`claude-code-config`、`checkContext` 基建)。
- 阶段 1 lint 既有 7 errors + 1 warning 的清理(属独立技术债,本设计不处理,仅要求**新代码不新增 lint 问题**)。

## 3. 第 1 节 · 藏宝阁 IA 与首页精选

**3.1 目标精选三位(featured=true),按显式叙事顺序 ②→①→③**

1. `agent-orchestration`(锚点②,**新建**)— 方法论 + 旗舰 demo。
2. `together-trace`(锚点①,已 featured)。
3. `personal-portal`(锚点③ / 本站 meta,已 featured)。

叙事:*我的方法 → 它造出的产品 → 这个站就是更多的它*。

**3.2 显式精选顺序(不改 schema)**

- 现状:`getFeaturedTreasures(3)` = published + featured,按 `updatedAt` 降序(5 件同日 → 顺序不稳)。
- 改法:在代码层引入一个**策展顺序常量**(如 `FEATURED_ORDER = ['agent-orchestration','together-trace','personal-portal']`),`getFeaturedTreasures` 改为**按该列表排序**,列表外的 featured 项按 `updatedAt` 兜底。
- **容错**:`FEATURED_ORDER` 中不存在 / 未 published / 未 featured 的 slug 直接**跳过**(支撑 §3.5 过渡态——`agent-orchestration` 建好前不报错,只是暂不出现在精选)。
- **不新增 meta 字段**;符合 Charter §4"精选是主动策展"。

**3.3 supET 降级**

- `supet-industrial-platform` 的 `meta.json` `featured: true → false`。仍留在藏宝阁 + 简历,只退出首页精选。

**3.4 早期实验分区(不改 schema)**

- `particle-field`、`typewriter-effect`(现均 featured:false)在 `/vault` 页归入一个**带标题的「早期实验 / Early experiments」小分区**(置于常规藏品之后)。
- 机制:代码层**策展 slug 列表**(如 `EARLY_EXPERIMENTS = ['particle-field','typewriter-effect']`);`VaultPage` 将其从主列表抽出、单独成组;其余 featured:false 项(supET、金融)仍在主藏品区。**不新增 meta 字段 / type**。

**3.5 过渡态**

- 锚点② 未建好前若先降级 supET,`getFeaturedTreasures(3)` 只返回 2 条。实现时把「建 `agent-orchestration` + 降 supET + 设精选顺序」放同一批,避免精选缺位。

## 4. 第 2 节 · 旗舰「Agent 编排体系」可交互 demo

**4.1 载体**

- 新建藏品 `src/content/vault/agent-orchestration/`(`meta.json` + `index.mdx` + `public/covers/agent-orchestration.svg`),`type: project`,`featured: true`,`demoKey: 'agent-orchestration'`。
- 新建 demo `src/demos/agent-orchestration/index.tsx`(默认导出 React 组件,无 props),在 `src/demos/registry.ts` 注册;经现有 `DemoStage`(lazy + `DemoBoundary` + `Suspense`)加载。**复用现有机制,无新依赖、无新模式。**

**4.2 形态 = 单步流水线回放(brainstorm 已选定 A)**

- replay 对象 = **本站自身的受治理构建循环**(唯一有仓内可证据据的选择;不用 Together Trace 那种过程证据不在本仓的项目)。同时融合锚点②(方法论)与锚点③(meta)。
- **6 步**:
  1. **上下文基线** — `checkContext`:确认 owner · 分支 · 工作树,读章程 / 状态 / 时间线。
  2. **意图 → 可验证目标** — 定位到 `文件:行号`,把"做 X"转成成功标准。
  3. **最小实现** — 最小且可解释的改动(`git diff --name-only`)。
  4. **验证门** — `context:check` / `build` / `lint` / `test` 的**真实退出码**。
  5. **人类判断门** — 命中暂停条件?(隐私 / 新依赖 / 公开口径 / 外部写…)→ 停,交人;否则继续。
  6. **提交 · 时间线 · 验收** — 本地 commit + 状态板 + 追加时间线;阶段门 → Codex 验收。

**4.3 交互**

- 用户驱动:`← 上一步 / 下一步 →` + 进度指示(Step n/6)。**无自动播放**,尊重 `prefers-reduced-motion`;键盘可达(按钮 + 焦点)。
- 每步含**真实证据**面板 + 可展开「▸ 看原始产物」(露出真实时间线事件 / 退出码原文)。
- **诚实展示**:lint 未过就标"失败(阶段 1 技术债)",不包装成通过——这本身就是"诚实记录完成度"纪律的示范。

**4.4 数据来源**

- demo 内嵌的步骤文案与证据取自**真实仓内产物**:`docs/timeline/2026-07-31-1525-claude-takeover-bootstrap.md` 的 Verification / Handoff 段、`checkContext` 输出、真实 build/lint 退出码、章程的暂停条件清单。**不编造退出码或事件。**demo 内容是静态快照(手工誊入真实值),不实时执行命令。

## 5. 第 3 节 · 其余锚点案例化 + Home hero

**5.1 ① Together Trace — 假数据离线优先 demo(TT-A,唯一第二个可交互证据)**

- 新建 demo `src/demos/together-trace-offline/index.tsx`;在 `together-trace` 的 `meta.json` 增加 `demoKey: 'together-trace-offline'`(schema 已支持,无需改动)。
- 交互:输入"写一条 moment" → 离线入队(pending 徽标)→ 切「回到在线」→ flush 同步。**全假数据、自包含、无登录**。演示"离线优先:本地先写、回到在线自动 flush"这一工程概念。
- **红线(对齐 Charter §6 + 既有 together-trace spec)**:不 iframe、不展示真实情侣数据 / 截图 / 坐标、不引导登录;保留 `externalUrl`(pages.dev)、**不加 `sourceUrl`**;正文保留"线上体验请用本地模式,勿录入真实私密数据"提示。
- `featured` 保持 `true`。

**5.2 ③ 本站 meta（personal-portal）**

- **不做独立 demo**(交互 = 旗舰本身)。重写 `index.mdx` / `summary` 口径为"你正站在 agent 持续构建 + 受治理的产物里",并在正文**跳转到 `agent-orchestration` 旗舰 demo** 看它怎么被造。
- `featured` 保持 `true`。

**5.3 ④ 金融 0-1**

- **纯叙述**案例:职责 / 问题 / 技术判断 / 可证明结果。无公开代码、无截图、无交互。`type: project`,`featured: false`。
- **内容延迟**:候选文案依赖阶段 2 脱敏 + 用户一次性确认公开口径(见 §8)。本设计只定结构,不落内容。

**5.4 Home hero(方向 1,已选定)**

- eyebrow:`AI-NATIVE ENGINEER · 架构与验收`
- h1:**「我编排 AI 造复杂、能跑、且经得起验收的东西。」**
- 描述:差异化不在谁敲代码,而在工程判断,和我为 AI 立起的编排 / 验证 / 门禁体系。这里是能跑的证据。
- `当前关注` chips(替换旧 `['AI 辅助研发','前端工程化','交互体验']`):**`AI 编排 · 验收门禁` / `离线优先的真实产品` / `工程判断 > 敲代码`**(措辞可在实现时微调)。
- **实现说明**:hero 与 chips 现为 `HomePage.tsx` 硬编码中文字面量;英文版留到实现时决定,本次先定中文。

## 6. 关键设计取舍

- **零 schema 改动**:精选顺序、早期实验分组均走**代码层策展常量**,不加 meta 字段 / type,规避 Charter"改变数据结构"暂停条件。
- **复用而非新建机制**:两个新 demo 完全复用 `DemoStage + src/demos + registry`,不引入新架构模式。
- **自证优先**:旗舰 demo replay 本站自身循环,因为只有它的过程证据在仓内、可核对。
- **交互预算有界**:方案 A 只投入"旗舰 + 一个可交互证据(TT-A)";meta / 金融 不各配 demo,避免过度扩张。

## 7. 内容真实性与隐私红线（逐条,阻断项)

- 旗舰 demo 内所有退出码 / 事件文本必须与仓内真实产物一致;**不得编造**。lint 未过如实标失败。
- Together Trace:不 iframe、不真实数据、不引导登录、无 `sourceUrl`;沿用既有 together-trace spec 的成本 / 能力口径(如"接近零成本运行为设计约束",不写"月费为 0";不扩写规划中能力)。
- 金融 0-1:不写入雇主内网细节 / 需求号 / 租户名 / 同事名 / 登录邮箱 / 真实截图;原始证据不进仓;公开前用户确认一次。
- 全站不加防御性 AI 声明;不虚构指标、周期、归属。
- 公开文案存在不确定时暂停交用户。

## 8. 依赖与延迟项

- **金融 0-1 内容**:阻断在阶段 2 脱敏 + 用户确认;在此之前只建结构、不公开文案。
- **精选缺位过渡态**:见 §3.5,实现批次内消解。
- **治理状态 / 时间线更新**:本工作在隔离分支进行;为避免与主树并发的 `PROJECT_STATUS` / `timeline` 编辑冲突,side-branch commit **只提交工作产物(spec / 代码)**,`PROJECT_STATUS` + 时间线的章程式更新留到本分支合并回 `dev_1` 的**对齐环节**(由用户驱动)一并处理。

## 9. 验证口径

- `ALLOW_HEAVY=1 npm run build` → 期望 exit 0。
- `ALLOW_HEAVY=1 npm run lint` → **不新增** lint 问题(既有 7e+1w 属阶段 1 技术债,本设计不清零)。
- 浏览器(`127.0.0.1:62740`,worktree 内需先 `npm install`)刷新后实测:首页 hero / 精选三位顺序、`/vault` 早期实验分区、旗舰 demo 六步步进 + 证据展开、Together Trace 离线 demo 的入队→flush、无新 console error。
- 不把未运行的验证写成通过;退出码如实记录。

## 10. 交付边界

- 本设计对应一段跨"内容整合(阶段 3)+ 质量(阶段 4)"的重定位工作,在隔离分支自主推进;只本地 commit。
- 暂停点:金融公开口径确认、任何红线不确定、需要改锁定方向 / 加依赖 / 加测试 / 改 schema、外部写操作。
- 合并回 `dev_1` 与治理状态对齐由用户驱动。
