# Personal Portal 智能时间线协议

时间线用于让 Claude、Codex 和用户跨会话接力。它记录“发生过什么和下一步由谁做”，
不替代长期章程、当前状态板或 Git 历史。

## 1. 文件与顺序

- 路径：`docs/timeline/YYYY-MM-DD-HHMM-<event-slug>.md`
- 同一分钟发生多个事件时，在 slug 前增加两位序号。
- 文件名按字典序即时间顺序。
- 时间线只追加。已经提交的事件不得为美化叙事而改写。
- 旧事件有事实错误时，新增 `correction-<target-slug>` 事件并引用被纠正文件。

## 2. 必需结构

每个事件必须包含以下标题：

```markdown
# <事件标题>

## Event
## Git
## Goal
## Scope
## Decisions
## Verification
## Risks
## Handoff
```

字段要求：

- `Event`：时间、actor、event type。
- `Git`：branch、base commit、head commit、工作树状态。
- `Goal`：本批次唯一目标。
- `Scope`：实际修改范围和明确未做事项。
- `Decisions`：新增或沿用的 `D-xxx`；没有新增时写“沿用”。
- `Verification`：实际命令、退出码和观察结果；未运行必须明确写“未运行”。
- `Risks`：未解决风险；没有则写“None”。
- `Handoff`：next owner、permission、first action、stop conditions。

## 3. 接力规则

1. 开始工作前运行 `npm run context:check` 和 `npm run context`。
2. 检查 `PROJECT_STATUS` 的 active owner、Git 分支和工作树。
3. 如果出现来源不明且重叠的改动，停止；不要覆盖或顺手提交。
4. 一个工作批次只允许一名 active owner 修改仓库。Codex 验收期间 Claude 不继续改同一范围。
5. 完成一个可独立理解的批次时：
   - 更新 `docs/PROJECT_STATUS.md` 的当前事实、owner、下一动作和证据；
   - 新增一条时间线事件；
   - 将源码、状态板和事件放入同一个本地 commit。
6. 用户的新长期决策同时写入 `docs/DECISIONS.md`；普通实现选择只写时间线。
7. 截图、聊天记录和模型记忆不是 source of truth，必须把可持续事实落到仓库。

## 4. 状态与历史边界

- `PROJECT_STATUS` 只保留现在：当前阶段、active owner、基线、下一动作和验收标准。
- `DECISIONS` 只保留长期有效的决策及原因。
- 时间线保留历史事件、交接和验收结论。
- Git 保存精确文件变化；时间线不复制完整 diff。
- 私有工作材料保留在仓库外；时间线只记录脱敏结论和材料是否已获用户确认。

## 5. 事件类型

- `work`：Claude 完成的实现批次。
- `decision`：用户确认长期方向。
- `handoff`：owner 发生变化。
- `acceptance`：Codex 接受、拒绝或有条件接受阶段成果。
- `correction`：纠正既有时间线事实。
- `release`：用户明确授权后的发布事实。

## 6. 验收要求

- `npm run context:check` exit 0。
- 事件中的 commit 与实际 Git 历史可对应；当前 commit 无法自引用时写 `pending`，由下一事件补证。
- `Startup Prompt` 必须是 `PROJECT_STATUS` 的最后一节。
- 不得出现未解释的占位符、密钥、登录邮箱或未脱敏内部材料。
