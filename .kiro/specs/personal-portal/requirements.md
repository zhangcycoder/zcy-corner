# Requirements Document

## Introduction

个人门户网站，基于 React 构建，采用科幻风格视觉设计。网站以强视觉冲击力的 Hero 区域为核心，融合粒子特效、光效、打字机动效等科幻交互元素，展示个人信息、技能与项目作品，并提供独立的项目详情展示页面入口。

## Glossary

- **Portal**: 个人门户网站整体应用
- **Hero_Section**: 首页顶部的主视觉区域，包含粒子背景与核心个人信息
- **Particle_System**: 负责渲染和管理粒子动画的模块
- **Typewriter**: 负责打字机文字动效的组件
- **Nav**: 顶部导航栏组件
- **Skills_Section**: 技能展示模块
- **Projects_Section**: 项目列表模块
- **Project_Detail_Page**: 独立的单个项目详情展示页面
- **About_Section**: 个人简介模块
- **Contact_Section**: 联系方式模块
- **Glitch_Effect**: 故障艺术风格的文字/图像闪烁特效
- **Scan_Line**: 模拟 CRT 扫描线的视觉效果层

---

## Requirements

### Requirement 1: 科幻主题视觉系统

**User Story:** As a 访客, I want 看到统一的科幻风格视觉设计, so that 获得沉浸式的浏览体验。

#### Acceptance Criteria

1. THE Portal SHALL 使用深色背景（#0a0a0f 或更深）作为全局基础色
2. THE Portal SHALL 使用青色/电蓝色（如 #00ffff、#0080ff）作为主要强调色
3. THE Portal SHALL 在全局应用 Scan_Line 半透明叠加层，模拟 CRT 显示器效果
4. WHEN 页面加载完成，THE Portal SHALL 在 500ms 内完成初始动画序列并呈现主界面
5. THE Portal SHALL 使用等宽字体（如 JetBrains Mono 或 Fira Code）作为标题字体

---

### Requirement 2: Hero 区域主视觉

**User Story:** As a 访客, I want 首页有强视觉冲击力的主图区域, so that 第一眼就能感受到科幻氛围并了解站主身份。

#### Acceptance Criteria

1. THE Hero_Section SHALL 占据视口高度的 100vh
2. THE Particle_System SHALL 在 Hero_Section 背景中渲染不少于 80 个动态粒子，粒子持续漂浮移动
3. WHEN 鼠标在 Hero_Section 内移动，THE Particle_System SHALL 使粒子向鼠标位置产生吸引或排斥响应
4. THE Typewriter SHALL 以打字机效果逐字显示个人职位/标语文字，每字间隔不超过 100ms
5. WHEN 打字机效果完成一段文字，THE Typewriter SHALL 暂停 2000ms 后删除并切换至下一段文字，循环播放
6. THE Hero_Section SHALL 包含姓名、职位动态文字、以及一个引导向下滚动的 CTA 按钮
7. WHEN 访客点击 CTA 按钮，THE Portal SHALL 平滑滚动至 About_Section

---

### Requirement 3: 导航栏

**User Story:** As a 访客, I want 随时能快速跳转到各个模块, so that 浏览体验流畅不迷失。

#### Acceptance Criteria

1. THE Nav SHALL 固定在页面顶部（position: fixed），始终可见
2. WHILE 页面向下滚动超过 80px，THE Nav SHALL 显示半透明毛玻璃背景（backdrop-filter: blur）
3. WHEN 访客点击导航链接，THE Portal SHALL 平滑滚动至对应 Section
4. THE Nav SHALL 高亮显示当前视口内所在 Section 对应的导航项
5. WHEN 鼠标悬停在导航链接上，THE Nav SHALL 在 200ms 内显示青色下划线扫光动效

---

### Requirement 4: 技能展示模块

**User Story:** As a 访客, I want 以直观的方式看到站主的技术栈, so that 快速评估技术能力。

#### Acceptance Criteria

1. THE Skills_Section SHALL 以卡片或标签形式展示技能列表
2. WHEN Skills_Section 进入视口，THE Skills_Section SHALL 触发卡片依次从下方淡入的入场动画，每张卡片延迟 80ms
3. WHEN 鼠标悬停在技能卡片上，THE Skills_Section SHALL 在 150ms 内显示青色边框发光（box-shadow glow）效果
4. WHERE 技能包含熟练度数据，THE Skills_Section SHALL 以动态进度条展示熟练度，进度条在入场时从 0 动画至目标值

---

### Requirement 5: 项目列表模块

**User Story:** As a 访客, I want 浏览站主的项目作品列表, so that 了解实际产出与技术应用。

#### Acceptance Criteria

1. THE Projects_Section SHALL 以卡片网格形式展示项目列表，每行不少于 2 个项目卡片
2. WHEN Projects_Section 进入视口，THE Projects_Section SHALL 触发卡片交错淡入动画
3. WHEN 鼠标悬停在项目卡片上，THE Projects_Section SHALL 显示卡片上移 4px 并增强发光效果的悬停状态
4. WHEN 访客点击项目卡片，THE Portal SHALL 导航至对应的 Project_Detail_Page
5. THE Projects_Section SHALL 在每张项目卡片上展示项目名称、简短描述（不超过 120 字）、以及技术标签

---

### Requirement 6: 项目详情页

**User Story:** As a 访客, I want 查看单个项目的详细信息, so that 深入了解项目背景、技术实现与成果。

#### Acceptance Criteria

1. THE Project_Detail_Page SHALL 通过独立路由（如 `/projects/:id`）访问
2. THE Project_Detail_Page SHALL 展示项目标题、完整描述、技术栈、项目截图或演示链接
3. WHEN 访客进入 Project_Detail_Page，THE Project_Detail_Page SHALL 播放页面入场动画（内容从下方滑入）
4. THE Project_Detail_Page SHALL 提供返回项目列表的导航入口
5. IF 访问的项目 ID 不存在，THEN THE Project_Detail_Page SHALL 显示 404 提示并提供返回首页的链接

---

### Requirement 7: 个人简介模块

**User Story:** As a 访客, I want 了解站主的个人背景与经历, so that 建立对站主的整体认知。

#### Acceptance Criteria

1. THE About_Section SHALL 展示个人头像、简介文字与关键信息（如所在地、当前状态）
2. WHEN About_Section 进入视口，THE About_Section SHALL 触发 Glitch_Effect 短暂闪烁后稳定显示标题文字
3. WHEN About_Section 进入视口，THE About_Section SHALL 触发简介文字逐行淡入动画

---

### Requirement 8: 联系方式模块

**User Story:** As a 访客, I want 找到联系站主的方式, so that 能够发起沟通或合作。

#### Acceptance Criteria

1. THE Contact_Section SHALL 展示至少一种联系方式（如 Email、GitHub、LinkedIn）
2. WHEN 鼠标悬停在联系方式图标上，THE Contact_Section SHALL 在 200ms 内显示图标放大与发光动效
3. WHEN 访客点击 Email 联系方式，THE Contact_Section SHALL 打开系统默认邮件客户端

---

### Requirement 9: 滚动与过渡动效

**User Story:** As a 访客, I want 页面滚动时有流畅的动效反馈, so that 浏览过程有连贯的科幻沉浸感。

#### Acceptance Criteria

1. THE Portal SHALL 为所有 Section 配置 Intersection Observer，当 Section 进入视口时触发对应入场动画
2. THE Portal SHALL 确保所有 CSS 过渡动画时长在 150ms 至 800ms 之间，避免过慢或过快
3. WHEN 访客在移动端访问，THE Portal SHALL 禁用粒子系统以保证性能，改用静态渐变背景替代
