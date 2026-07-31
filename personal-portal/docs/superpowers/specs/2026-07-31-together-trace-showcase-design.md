# Together Trace 展示接入 — 设计确认

> 日期：2026-07-31
> 仓库：personal-portal（藏宝阁 / Gallery 场景）
> 证据源：`.superpowers/handoffs/together-trace-showcase-handoff.md`、`together-trace-task-0.5-report.md`、together-trace `docs/architecture/current-state.md`、`architecture-decisions.md`

---

## 1. 已确认的展示定位

- Together Trace 是**用户独立规划的个人项目**。
- 展示口径：**技术能力为主，双人记忆产品故事为辅**。
- 不声称「完全独立开发」，不编造 AI 参与比例或开发周期。

## 2. 线上入口与隐私边界

- 线上入口：`https://together-trace.pages.dev`（本次接入前 `curl -I` 返回 HTTP/2 200，方可加入 `externalUrl`）。
- 访客只被引导使用**本地模式**；**禁止**引导登录或展示真实数据。
- **不嵌入 iframe**，**不展示真实情侣截图**、真实坐标、真实照片或私密数据。
- 当前**没有公开代码仓库**，因此**不放 `sourceUrl`**（详情页不出现「查看源码」）。
- 正文尾部醒目提示：「线上体验请使用本地模式。请勿尝试登录或录入真实私密数据。」

## 3. 首页精选调整

- 首页精选固定为三项：**Together Trace、个人技术空间（personal-portal）、supET（supet-industrial-platform）**。
- Particle Field 与 Typewriter 仅将 `meta.json` 的 `featured` 由 `true` 改为 `false`，**仍保留在藏宝阁**可访问，只是不再占用首页精选位。
- **不修改首页组件排序逻辑**（`getFeaturedTreasures` 保持原样：published + featured，按 `updatedAt` 降序取前 3）；不为固定顺序编造日期。

## 4. 内容真实性红线（逐条对齐证据）

- 敏感操作（空间创建、旅行发布、心跳、回声揭示）经 Cloudflare Worker；成员内容可在 Firestore Security Rules 约束下由客户端直写——**不得写成「Worker 是唯一写入者」**。
- 成本表述统一为「以免费额度内、接近零成本运行为设计约束」——**不得写成「实际月费为 0」**。
- 地图（Mapbox）与 R2 只按证据描述（旅行路线渲染 / 媒体存储），**不扩写未完成能力**（跨旅行「足迹地图」总览为规划中，不得写成已完成）。
- 验证证据：构建通过、现有测试 19 files / 86 tests 全绿；**不得声称 57 条 Firestore Emulator 用例已全部执行通过**——现有证据只证明这些用例存在。
- 全文**不得出现 TBD / TODO / placeholder** 或未经证据支持的完成度声明。

## 5. Particle Field 现象根因（本次不改其代码）

- Codex 诊断：`127.0.0.1:62740` 无服务监听；浏览器报 `Failed to fetch dynamically imported module`；particle-field 与 typewriter-effect 两个动态 Demo 同时失败。
- 本次接入前复核：`lsof -nP -iTCP:62740 -sTCP:LISTEN` 无监听、`curl http://127.0.0.1:62740/` 无响应 → 确认为 **Vite 开发服务停止**，非 `ParticleSystem` / `DemoStage` / `DemoBoundary` / `demos/registry` 代码错误。
- 处置：恢复本地 Vite 服务后验证两个 Demo 是否恢复；**不为此现象修改上述任何 Demo 运行代码**。若恢复服务后仍复现，则收集新证据并停止报告，不做猜测式修改。
