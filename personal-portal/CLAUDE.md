# Personal Portal — Claude 工作入口

本文件是 Claude 接管 `personal-portal` 时的强制入口。不要只依赖聊天记录、截图或
单次任务描述；仓库内文档才是可持续的工作上下文。

## 启动顺序

开始任何工作前，先运行：

```bash
npm run context:check
npm run context
```

然后按顺序完整阅读：

1. `CLAUDE.md`
2. `docs/PROJECT_CHARTER.md`
3. `docs/DECISIONS.md`
4. `docs/PROJECT_STATUS.md`
5. `docs/timeline/README.md`
6. `docs/timeline/` 中最近三条事件
7. 当前阶段在 `docs/PROJECT_STATUS.md` 中列出的专项设计、计划和证据文档
8. 环境提供的 `AGENTS.md` 或其他更高优先级指令

发生冲突时遵循：用户最新明确指令 > `AGENTS.md` > 本文件 >
`docs/PROJECT_CHARTER.md` > `docs/DECISIONS.md` > `docs/PROJECT_STATUS.md` >
时间线事件 > 历史计划或报告。

## 角色分工

- 用户是产品与公开表达的最终决策者，称呼用户为「冒险家」。
- Claude 负责阶段 1–4 的连续分析、实现、验证、文档维护和本地提交。
- Codex 只在长期阶段完成、重大风险出现或公开发布前做验收与方向把关。
- 不再为每个普通文件、普通 commit 或已锁定范围内的小判断请求 Codex 转述。

## 自主权限

Claude 可以按 `docs/PROJECT_CHARTER.md` 的阶段 1–4 连续自主推进：

- 阅读仓库、历史提交和证据文档。
- 修改当前阶段明确列入范围的源码、样式、内容和文档。
- 运行本地开发服务及只读诊断命令。
- 运行 build、lint、已有测试和本地浏览器检查。
- 创建小而完整的本地 commit。
- 完成子阶段后直接进入下一子阶段，不必等待 Codex 逐阶段批准。
- 在同一个 commit 中同步更新 `docs/PROJECT_STATUS.md`、新增一条时间线事件并明确
  下一 owner 与第一动作。

每个 commit 必须形成可理解、可回退、可单独验收的工作单元。不要为了制造提交数量
拆分机械步骤，也不要把多个不相关目标塞进同一个 commit。

## 必须暂停的情况

仅在以下情况暂停并请求用户或 Codex：

- 需要改变 `docs/PROJECT_CHARTER.md` 中的锁定方向。
- 需要新增依赖、创建新测试、改变数据结构或引入新的架构模式。
- 涉及个人隐私、真实凭据、真实用户数据或公开叙事存在不确定性。
- 当前工作或内网经历的脱敏公开文案已经形成，需要用户确认公开口径。
- 需要 push、部署、创建 PR、访问外部账号或进行其他外部写操作。
- 需要删除重要文件、改写 Git 历史、迁移数据或执行不可逆操作。
- 同一问题连续三次修复尝试仍未解决。
- 发现工作树存在来源不明且与当前任务重叠的改动。
- 阶段 4 完成并形成最终发布候选，需要 Codex 做长期验收。

普通实现细节、既有模式内的重构、局部视觉判断和可逆的小范围修复不需要暂停。

## 永久约束

- 工作目录：`/Users/zcy/Desktop/my/zcy-corner/personal-portal`
- 长期分支：`dev_1`
- Git 身份：`zcy <zcy_5332@163.com>`
- 只能创建本地 commit；禁止主动 push、部署、创建 PR。
- 不暂存或提交父目录既有的 `../.DS_Store`。
- 除非当前阶段明确授权，`/Users/zcy/Desktop/together-trace` 只读。
- 不在公开页面、文档或日志中写入密钥、登录邮箱、真实私密数据或未脱敏截图。
- 当前工作和内网经历的原始证据保存在仓库外；受版本控制的仓库只接收用户确认过的
  脱敏表达。
- 不默认创建新测试；确有风险需要新增测试时，先说明原因并请求用户确认。
- 不把未运行的验证写成通过，不把规划中能力写成已完成。
- 公开案例优先使用可证明的事实，避免防御性 AI 声明、虚构指标和夸大归属。

## 工作循环

1. 运行 `npm run context:check && npm run context`，再读取当前阶段、active owner、
   第一动作和验收标准。
2. 检查分支、工作树和最近提交，确认没有意外改动；只有一个 active owner 可以修改仓库。
3. 先复现或建立基线，再做最小且可解释的修改。
4. 运行与风险匹配的最窄验证；阶段结束前运行完整阶段验证。
5. 浏览器相关修改必须刷新页面，以刷新后的 DOM、视觉和新日志为准。
6. 创建本地 commit，并在同一 commit 中更新状态板和新增时间线事件。不要为了在文档
   写入该 commit 自身的 SHA 而反复 amend；SHA 可在下一条事件补记。
7. 未达到阶段门槛就继续当前阶段；达到后更新状态并直接进入下一阶段。仅在暂停条件
   或阶段 4 发布候选门槛停止。

## 当前入口

当前阶段和可直接复制的启动指令位于：

`docs/PROJECT_STATUS.md#startup-prompt`

时间线写入规则位于：

`docs/timeline/README.md`
