import type { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'personal-portal',
    name: 'Personal Portal',
    description: '基于 React 18 构建的科幻风格个人门户网站，融合粒子特效、打字机动效与光效动画，提供沉浸式浏览体验。',
    tags: ['React', 'TypeScript', 'Canvas', 'CSS Animations'],
    techStack: ['React 18', 'TypeScript', 'Vite', 'React Router v6', 'Canvas API', 'CSS Modules'],
    fullDescription: '这是一个以科幻美学为核心的个人展示网站。Hero 区域使用 Canvas API 渲染 80+ 个动态粒子，支持鼠标交互力场。打字机组件循环展示个人标语，配合 CRT 扫描线叠加层营造复古未来感。所有 Section 通过 Intersection Observer 触发入场动画，技能卡片支持熟练度进度条展示。',
    demoUrl: 'https://example.com/portal',
    screenshots: [],
  },
  {
    id: 'data-viz-dashboard',
    name: 'Data Viz Dashboard',
    description: '实时数据可视化仪表盘，支持多维度图表联动、动态数据流接入与自定义主题配置，适用于运营监控场景。',
    tags: ['Vue 3', 'D3.js', 'WebSocket', 'TypeScript'],
    techStack: ['Vue 3', 'TypeScript', 'D3.js', 'WebSocket', 'Pinia', 'Vite'],
    fullDescription: '基于 Vue 3 + D3.js 构建的实时数据可视化平台。通过 WebSocket 接入实时数据流，支持折线图、柱状图、热力图等多种图表类型，图表间支持联动过滤。提供亮色/暗色双主题，支持拖拽布局自定义。',
    demoUrl: 'https://example.com/dashboard',
  },
  {
    id: 'ai-code-review',
    name: 'AI Code Review Bot',
    description: '基于大语言模型的自动化代码审查工具，集成 GitHub Actions，对 PR 进行安全漏洞、代码规范与性能问题的智能分析。',
    tags: ['Python', 'LLM', 'GitHub Actions', 'FastAPI'],
    techStack: ['Python 3.11', 'FastAPI', 'OpenAI API', 'GitHub Actions', 'Docker', 'PostgreSQL'],
    fullDescription: '通过 GitHub Webhook 监听 Pull Request 事件，调用 LLM 对代码变更进行多维度分析：安全漏洞检测、代码规范检查、性能瓶颈识别。分析结果以结构化评论形式回写至 PR，支持自定义规则集与严重级别过滤。',
    demoUrl: 'https://example.com/ai-review',
  },
  {
    id: 'pixel-art-editor',
    name: 'Pixel Art Editor',
    description: '运行在浏览器中的像素画编辑器，支持多图层、调色板管理、动画帧编辑与 GIF 导出功能。',
    tags: ['React', 'Canvas', 'IndexedDB', 'Web Workers'],
    techStack: ['React 18', 'TypeScript', 'Canvas API', 'IndexedDB', 'Web Workers', 'gif.js'],
    screenshots: ['/screenshots/pixel-editor-1.png', '/screenshots/pixel-editor-2.png'],
  },
];
