# Implementation Plan: Personal Portal

## Overview

基于 React 18 + TypeScript + Vite 构建科幻风格个人门户网站。按照从基础到上层的顺序逐步实现：项目初始化 → 全局样式 → 数据层 → 路由 → 各 Section 组件 → 属性测试。

## Tasks

- [x] 1. 项目初始化与工程配置
  - 使用 Vite 创建 React + TypeScript 项目（`npm create vite@latest`）
  - 安装依赖：`react-router-dom`、`vitest`、`@testing-library/react`、`@testing-library/user-event`、`fast-check`、`jsdom`
  - 配置 `vite.config.ts`：添加 `test` 字段（environment: jsdom，globals: true）
  - 配置 `tsconfig.json` 确保严格模式
  - _Requirements: 1.1, 1.5_

- [x] 2. 全局样式系统与 ScanLine 组件
  - [x] 2.1 创建全局 CSS 变量与基础样式
    - 在 `src/styles/global.css` 中定义 `--bg-primary: #0a0a0f`、`--accent-cyan: #00ffff`、`--accent-blue: #0080ff`、`--font-mono`
    - 设置 `body` 背景色、字体、`scroll-behavior: smooth`
    - _Requirements: 1.1, 1.2, 1.5_
  - [x] 2.2 实现 ScanLine 组件
    - 创建 `src/components/ScanLine.tsx`：`position: fixed`、全屏覆盖、`repeating-linear-gradient` 模拟 CRT 扫描线、`pointer-events: none`、`z-index` 置顶
    - _Requirements: 1.3_

- [x] 3. 静态数据层
  - [x] 3.1 创建类型定义文件
    - 在 `src/types/index.ts` 中定义 `Project`、`Skill`、`NavItem`、`Particle` 接口
    - _Requirements: 4.1, 5.5, 6.2_
  - [x] 3.2 创建静态数据文件
    - 创建 `src/data/projectsData.ts`：至少 2 个示例项目，包含所有必填字段（id、name、description ≤120字、tags、techStack）
    - 创建 `src/data/skillsData.ts`：至少 6 个技能，部分包含 `proficiency` 字段（0–100）
    - _Requirements: 4.1, 5.1, 5.5_

- [x] 4. 路由配置与页面骨架
  - [x] 4.1 配置 React Router v6 路由
    - 在 `src/App.tsx` 中配置 `BrowserRouter` + `Routes`：`/` → `HomePage`，`/projects/:id` → `ProjectDetailPage`，`*` → `NotFoundPage`
    - 挂载 `Nav` 和 `ScanLine` 在路由外层（全局可见）
    - _Requirements: 3.1, 6.1_
  - [x] 4.2 创建页面骨架组件
    - 创建 `src/pages/HomePage.tsx`：按顺序组合 HeroSection、AboutSection、SkillsSection、ProjectsSection、ContactSection
    - 创建 `src/pages/NotFoundPage.tsx`：显示 404 文字 + 返回首页链接
    - _Requirements: 6.5_

- [x] 5. 自定义 Hooks
  - [x] 5.1 实现 useIntersectionObserver hook
    - 创建 `src/hooks/useIntersectionObserver.ts`：接收 `ref` 和 `options`，返回 `isIntersecting` 布尔值
    - 组件卸载时自动 `disconnect` 清理
    - _Requirements: 9.1_
  - [x] 5.2 实现 useScrollSpy hook
    - 创建 `src/hooks/useScrollSpy.ts`：监听 `scroll` 事件，返回当前视口内激活的 `sectionId`
    - 滚动距离超过 80px 时返回 `isScrolled: true`
    - _Requirements: 3.2, 3.4_

- [x] 6. Nav 组件
  - [x] 6.1 实现 Nav 组件核心结构与样式
    - 创建 `src/components/Nav.tsx`：`position: fixed; top: 0`，使用 `useScrollSpy` 获取当前 section 和滚动状态
    - 滚动 > 80px 时添加毛玻璃背景类（`backdrop-filter: blur(12px)`）
    - 当前 section 对应导航项添加高亮类
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 6.2 实现导航链接交互与扫光动效
    - 点击链接调用 `document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })`
    - 悬停时通过 CSS `::after` + `transform: scaleX` 实现青色下划线扫光动效（200ms transition）
    - _Requirements: 3.3, 3.5_
  - [x] 6.3 为 Nav 编写单元测试
    - 测试 `position: fixed` 样式存在
    - 测试滚动 > 80px 时毛玻璃类存在，≤ 80px 时不存在（Property 5）
    - 测试任意 sectionId 时仅对应导航项高亮（Property 6）
    - _Requirements: 3.2, 3.4_

- [x] 7. ParticleSystem 组件
  - [x] 7.1 实现 Canvas 粒子渲染与动画循环
    - 创建 `src/components/ParticleSystem.tsx`：接收 `particleCount`（默认 80）和 `disabled` props
    - 初始化粒子数组（长度等于 `particleCount`），每个粒子含 x、y、vx、vy、radius、opacity、color
    - 使用 `requestAnimationFrame` 驱动动画循环，组件卸载时 `cancelAnimationFrame` 清理
    - Canvas 不支持时 `try/catch` 降级为静态渐变背景
    - _Requirements: 2.2, 9.3_
  - [x] 7.2 实现鼠标交互力场
    - 监听 `mousemove` 事件，计算粒子与鼠标距离，对影响半径内的粒子施加吸引/排斥力（修改 vx、vy）
    - `disabled=true` 时渲染静态 CSS 渐变背景，不渲染 Canvas
    - _Requirements: 2.3, 9.3_
  - [x] 7.3 为 ParticleSystem 编写属性测试
    - **Property 1: 粒子数量下限** — 任意 `particleCount ≥ 80`，粒子数组长度等于 `particleCount`
    - **Validates: Requirements 2.2**
    - **Property 2: 鼠标交互影响粒子速度** — 任意鼠标坐标，影响半径内粒子速度向量发生变化
    - **Validates: Requirements 2.3**
    - **Property 17: 移动端禁用粒子系统** — 任意移动端视口宽度（320–767），`disabled=true` 时 Canvas 不渲染
    - **Validates: Requirements 9.3**

- [x] 8. Typewriter 组件
  - [x] 8.1 实现打字机状态机
    - 创建 `src/components/Typewriter.tsx`：接收 `texts`、`charInterval`（默认 80ms）、`pauseDuration`（默认 2000ms）
    - 内部状态：`currentTextIndex`、`displayedText`、`isDeleting`
    - 使用 `useEffect` + `setTimeout` 驱动：打字 → 暂停 → 删除 → 切换下一段 → 循环
    - _Requirements: 2.4, 2.5_
  - [x] 8.2 为 Typewriter 编写属性测试
    - **Property 3: 打字机字符间隔约束** — 任意文字列表，`charInterval ≤ 100`
    - **Validates: Requirements 2.4**
    - **Property 4: 打字机循环播放** — 任意 N 段文字，状态机完成第 N 段后回到第 0 段
    - **Validates: Requirements 2.5**

- [x] 9. HeroSection 组件
  - [x] 9.1 实现 HeroSection 布局与内容
    - 创建 `src/components/HeroSection.tsx`：高度 `100vh`，包含姓名、Typewriter 组件、CTA 按钮
    - 集成 ParticleSystem：通过 `window.innerWidth < 768` 或 `matchMedia` 检测移动端，传入 `disabled` prop
    - CTA 按钮点击后 `scrollIntoView` 至 AboutSection（`behavior: 'smooth'`）
    - _Requirements: 2.1, 2.2, 2.6, 2.7, 9.3_
  - [x] 9.2 为 HeroSection 编写单元测试
    - 测试包含姓名文字、CTA 按钮、Typewriter 组件
    - 测试 CTA 按钮点击触发滚动
    - _Requirements: 2.6, 2.7_

- [x] 0A. Tailwind CSS 集成与主题配置
  - [x] 0A.1 安装 Tailwind CSS v4 及相关依赖
    - 安装 `tailwindcss`、`@tailwindcss/vite`
    - 配置 `vite.config.ts` 添加 Tailwind Vite 插件
    - 在 `src/styles/global.css` 中添加 `@import "tailwindcss"` 并迁移 CSS 变量为 Tailwind 主题 token
  - [x] 0A.2 配置科幻主题 token
    - 在 CSS 中通过 `@theme` 定义颜色（bg-primary、accent-cyan、accent-blue）、字体（font-mono）等 token
    - 确保现有组件可以使用 Tailwind 工具类

- [ ] 0B. 国际化（i18n）集成
  - [ ] 0B.1 安装并配置 react-i18next
    - 安装 `i18next`、`react-i18next`
    - 创建 `src/i18n/index.ts` 初始化 i18next（默认语言 zh-CN，支持 en-US）
    - 在 `src/main.tsx` 中导入 i18n 初始化文件
  - [x] 0B.2 创建翻译文件
    - 创建 `src/i18n/locales/zh-CN.json`：中文翻译（nav、hero、about、skills、projects、contact 各模块）
    - 创建 `src/i18n/locales/en-US.json`：英文翻译
  - [ ] 0B.3 实现语言切换组件
    - 创建 `src/components/LangSwitcher.tsx`：ZH / EN 切换按钮，集成到 Nav 右侧
    - 使用 `useTranslation` hook 切换语言

- [-] 10. AboutSection 组件
  - [x] 10.1 实现 AboutSection 布局与 Glitch 效果
    - 创建 `src/components/AboutSection.tsx`：展示头像、简介文字、所在地、当前状态
    - 使用 `useIntersectionObserver` 触发入场：标题添加 Glitch Effect CSS 动画（`@keyframes` 随机偏移 + 颜色通道分离）
    - _Requirements: 7.1, 7.2_
  - [x] 10.2 实现简介文字逐行淡入
    - 简介文字按行拆分，每行 `animation-delay: index * Xms`（递增），进入视口后触发淡入
    - _Requirements: 7.3_
  - [-] 10.3 为 AboutSection 编写属性测试
    - **Property 14: 简介文字逐行淡入延迟** — 任意 N 行简介，第 i 行 `animation-delay` 大于第 i-1 行
    - **Validates: Requirements 7.3**
    - **Property 15: IntersectionObserver 触发动画** — 未进入视口时无激活类，进入后有激活类
    - **Validates: Requirements 9.1**

- [~] 11. SkillsSection 组件
  - [ ] 11.1 实现技能卡片列表与入场动画
    - 创建 `src/components/SkillsSection.tsx`：从 `skillsData` 渲染技能卡片
    - 使用 `useIntersectionObserver` 触发入场，每张卡片 `animation-delay: index * 80ms`
    - 悬停时 `box-shadow: 0 0 12px #00ffff`（150ms transition）
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ] 11.2 实现熟练度进度条
    - 有 `proficiency` 字段的技能渲染进度条，`proficiency` 值 `clamp(0, 100)` 后设为目标宽度
    - 入场时进度条从 0 动画至目标值（CSS transition）
    - _Requirements: 4.4_
  - [ ] 11.3 为 SkillsSection 编写属性测试
    - **Property 7: 技能列表完整渲染** — 任意技能数组，卡片数量等于数组长度且包含技能名称
    - **Validates: Requirements 4.1**
    - **Property 8: 卡片交错入场延迟（技能）** — 任意 N 个技能卡片，第 i 张延迟 = `i * 80ms`
    - **Validates: Requirements 4.2**
    - **Property 9: 有熟练度数据的技能渲染进度条** — 任意有 `proficiency` 的技能，进度条宽度比例等于 `proficiency / 100`
    - **Validates: Requirements 4.4**

- [~] 12. ProjectsSection 组件
  - [ ] 12.1 实现项目卡片网格与入场动画
    - 创建 `src/components/ProjectsSection.tsx` 和 `src/components/ProjectCard.tsx`
    - 网格布局：`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
    - 使用 `useIntersectionObserver` 触发交错淡入，每张卡片 `animation-delay: index * 100ms`
    - 每张卡片展示 name、description（超 120 字截断）、tags
    - _Requirements: 5.1, 5.2, 5.5_
  - [ ] 12.2 实现卡片悬停与点击导航
    - 悬停：`transform: translateY(-4px)` + 增强 `box-shadow`
    - 点击调用 `useNavigate` 跳转至 `/projects/${project.id}`
    - _Requirements: 5.3, 5.4_
  - [ ] 12.3 为 ProjectsSection 编写属性测试
    - **Property 8: 卡片交错入场延迟（项目）** — 任意 N 个项目卡片，第 i 张延迟 = `i * 100ms`
    - **Validates: Requirements 5.2**
    - **Property 10: 项目卡片完整展示必要信息** — 任意项目对象，卡片包含 name、description、至少一个 tag
    - **Validates: Requirements 5.5**
    - **Property 11: 项目卡片点击导航至正确路由** — 任意项目 id，点击后路由跳转至 `/projects/{id}`
    - **Validates: Requirements 5.4**

- [~] 13. ProjectDetailPage 组件
  - [ ] 13.1 实现项目详情页与 404 处理
    - 创建 `src/pages/ProjectDetailPage.tsx`：通过 `useParams` 获取 `id`，在 `projectsData` 中查找
    - 找不到时渲染 404 提示 + 返回首页链接（`/`），不抛出异常
    - 展示项目标题、完整描述、技术栈列表、演示链接（若存在）、截图（若存在）
    - 提供返回项目列表的导航入口
    - _Requirements: 6.1, 6.2, 6.4, 6.5_
  - [ ] 13.2 实现页面入场动画
    - 内容初始 `transform: translateY(20px); opacity: 0`，挂载后过渡至 `translateY(0); opacity: 1`
    - 动画时长在 150ms–800ms 范围内
    - _Requirements: 6.3, 9.2_
  - [ ] 13.3 为 ProjectDetailPage 编写属性测试
    - **Property 12: 项目详情页展示完整信息** — 任意存在的项目，页面展示标题、完整描述、技术栈
    - **Validates: Requirements 6.2**
    - **Property 13: 无效项目 ID 显示 404** — 任意不存在的 id，渲染 404 提示 + 首页链接
    - **Validates: Requirements 6.5**

- [~] 14. ContactSection 组件
  - [ ] 14.1 实现联系方式展示与交互
    - 创建 `src/components/ContactSection.tsx`：展示 Email、GitHub、LinkedIn 图标链接
    - Email 链接使用 `mailto:` 协议
    - 悬停：图标 `scale(1.2)` + `filter: drop-shadow(0 0 8px #00ffff)`（200ms transition）
    - 使用 `useIntersectionObserver` 触发入场动画
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  - [ ] 14.2 为 ContactSection 编写单元测试
    - 测试 Email 链接包含 `mailto:` 协议
    - 测试至少一个联系方式存在
    - _Requirements: 8.1, 8.3_

- [~] 15. Checkpoint — 确保所有测试通过
  - 运行 `vitest --run` 确保所有单元测试与属性测试通过
  - 检查所有组件 TypeScript 类型无报错
  - 如有问题，向用户说明并等待确认后继续

- [x] 16. 动画时长合规性属性测试
  - [ ] 16.1 编写 CSS 动画时长范围属性测试
    - **Property 16: 动画时长在合法范围内** — 遍历页面所有 CSS transition/animation duration，验证值在 [150, 800]ms 之间
    - **Validates: Requirements 9.2**
  - [ ] 16.2 编写 IntersectionObserver 通用属性测试
    - **Property 15: 所有 Section 使用 IntersectionObserver 触发动画** — Mock IntersectionObserver，验证各 Section 未进入视口时无激活类，进入后有激活类
    - **Validates: Requirements 9.1**

- [~] 17. 集成收尾与最终 Checkpoint
  - [ ] 17.1 确认所有 Section 挂载至 HomePage 并正确排列
    - 验证 `HomePage` 中 Section 顺序：Hero → About → Skills → Projects → Contact
    - 确认各 Section 均有对应 `id` 属性供 Nav 滚动定位
    - _Requirements: 3.3, 2.7_
  - [ ] 17.2 验证移动端降级行为
    - 确认 `HeroSection` 在移动端视口下向 `ParticleSystem` 传入 `disabled=true`
    - 确认静态渐变背景在 `disabled=true` 时正确渲染
    - _Requirements: 9.3_
  - [ ] 17.3 编写端到端集成属性测试
    - 综合验证路由跳转、数据渲染、404 处理的正确性
    - _Requirements: 5.4, 6.1, 6.5_

- [~] 18. 最终 Checkpoint — 确保所有测试通过
  - 运行 `vitest --run` 确保全部测试通过，ask the user if questions arise.

## Notes

- 标有 `*` 的子任务为可选测试任务，可跳过以加快 MVP 进度
- 每个属性测试运行最少 100 次迭代：`fc.assert(fc.property(...), { numRuns: 100 })`
- 每个属性测试注释须标注：`// Feature: personal-portal, Property N: 属性名称`
- 所有 CSS 过渡动画时长须在 150ms–800ms 之间
- 粒子系统在移动端（`window.innerWidth < 768`）自动禁用
