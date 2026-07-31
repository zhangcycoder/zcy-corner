/** @name 履历链接 */
export interface ProfileLink {
  label: string
  href: string
}

/** @name 技能分组 */
export interface SkillGroup {
  title: string
  items: string[]
}

/** @name 履历经历 */
export interface ResumeEntry {
  id: string
  period: string
  role: string
  organization: string
  summary: string
  background: string
  actions: string[]
  challenges: string[]
  results: string[]
}

/** @name 个人履历 */
export interface Profile {
  displayName: string
  role: string
  location: string
  headline: string
  summary: string
  focus: string[]
  links: ProfileLink[]
  skillGroups: SkillGroup[]
  entries: ResumeEntry[]
}

/** @name 公开履历资料 */
export const profile: Profile = {
  displayName: 'ZCY',
  role: '前端开发者',
  location: '中国 · 上海',
  headline: '构建、记录、持续进化',
  summary: '关注前端工程化、交互体验与 AI 辅助研发，并通过持续实践沉淀可复用的技术资产。',
  focus: ['AI 辅助研发', '前端工程化', '交互体验'],
  links: [
    { label: 'GitHub', href: 'https://github.com/zhangcycoder' },
  ],
  skillGroups: [
    { title: '前端', items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'] },
    { title: '体验', items: ['响应式界面', '交互动效', 'Canvas', '国际化'] },
    { title: '工程', items: ['Git', 'Netlify', '构建工具', '代码质量'] },
  ],
  entries: [
    {
      id: 'personal-tech-space',
      period: '2026 — 至今',
      role: '独立开发',
      organization: 'Personal Tech Space',
      summary: '设计并持续建设个人技术网站，用于技术沉淀、作品展示和职业信息表达。',
      background: '原有站点可以部署，但内容与结构仍停留在模板阶段。',
      actions: ['重新定义网站信息架构', '建立文件驱动的藏品模型', '设计 Gallery & Paper 双场景视觉系统'],
      challenges: ['在展示效果与长文阅读之间保持统一', '控制首期范围并保留后续扩展能力'],
      results: ['形成可持续维护的网站结构', '建立 GitHub 到 Netlify 的发布链路记录'],
    },
  ],
}
