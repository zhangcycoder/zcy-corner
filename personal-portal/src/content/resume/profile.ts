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

/** @name 工作经历 */
export interface WorkExperience {
  id: string
  period: string
  role: string
  organization: string
  summary: string
}

/** @name 代表技术项目 */
export interface TechnicalProject {
  id: string
  title: string
  domain: string
  summary: string
  background: string
  contributions: string[]
  challenges: string[]
  completedScope: string[]
}

/** @name 教育经历 */
export interface EducationExperience {
  id: string
  period: string
  organization: string
  field: string
}

/** @name 个人履历 */
export interface Profile {
  displayName: string
  role: string
  headline: string
  summary: string
  sourceNote: string
  focus: string[]
  links: ProfileLink[]
  skillGroups: SkillGroup[]
  workExperience: WorkExperience[]
  projects: TechnicalProject[]
  education: EducationExperience[]
}

/** @name 公开履历资料 */
export const profile: Profile = {
  displayName: '张赐永',
  role: '前端开发工程师',
  headline: '工业互联网与复杂 Web 应用前端实践',
  summary: '历史项目覆盖工业互联网、边缘计算控制台、低代码组态、AI 知识库与在线教育，关注复杂业务中的前端系统设计、功能交付与工程协作。',
  sourceNote: '历史履历来源于旧简历，当前任职状态未公开。',
  focus: ['工业互联网', '边缘计算', '低代码组态', 'AI 知识库'],
  links: [
    { label: 'GitHub', href: 'https://github.com/zhangcycoder' },
  ],
  skillGroups: [
    { title: '前端开发', items: ['JavaScript', 'React', 'Redux / MobX', 'Vue'] },
    { title: 'Web 工程', items: ['Ajax / Axios / fetch', '跨域处理', '浏览器原理', '前端性能'] },
    { title: '服务与平台', items: ['Node.js / Express / Koa', 'Sequelize', '微信小程序'] },
  ],
  workExperience: [
    {
      id: 'wh-beyondsoft',
      period: '2021.04 — 历史简历记录时',
      role: '前端开发',
      organization: '武汉佰钧诚有限公司',
      summary: '参与需求评审、前端系统设计评审、功能交付与发布协作，具体项目贡献见代表技术项目。',
    },
    {
      id: 'work-2020',
      period: '2020.07 — 2021.04',
      role: '前端开发',
      organization: '博彦科技有限公司',
      summary: '从事前端开发，任职时间按历史简历记录呈现。',
    },
    {
      id: 'sier-education',
      period: '2018.04 — 2020.06',
      role: '前端开发',
      organization: '北京斯尔教育',
      summary: '参与财经职业培训产品建设，覆盖商品、课程、内容与支付链路。',
    },
  ],
  projects: [
    {
      id: 'industrial-region-cloud',
      title: '工业区行平台',
      domain: '工业互联网 · 行业区域云',
      summary: '面向工厂一站式管理的行业区域云产品，覆盖设备接入、远程连接、门户配置与账号服务。',
      background: '平台需要承载设备接入、云端配置、远程运维、门户和账号服务等多类工业场景，并推进 UI 与状态组织方式的迁移。',
      contributions: [
        '参与需求评审、排期、前端系统设计评审，以及提测、发布文档和 Node 镜像构建。',
        '将 UI 体系从旧骨架迁移至 Link Design / Fusion，移除 DVA model 层，按组件持有状态与请求边界组织代码。',
        '参与 CMS 2.0 的权限、路由、数据结构、Layout、HOC 和跨页面能力建设。',
      ],
      challenges: [
        '在迁移 UI 体系的同时调整既有状态和请求组织方式。',
        '处理多角色权限、跨页面能力与设备配置链路之间的协作边界。',
      ],
      completedScope: [
        '参与交付云网关激活与进度、设备点表上传校验、驱动分配、云端配置与下发、远程隧道 / VPN。',
        '参与交付门户配置、服务商入驻、企业 / 个人账号续费与权限标签。',
        '参与的登录安全范围包括公网 / 本地 IP、浏览器指纹、验证码与锁定策略。',
      ],
    },
    {
      id: 'bee-local-console',
      title: '小蜜蜂本地控制台',
      domain: '边缘计算 · Web 控制台',
      summary: '边缘计算服务器的 Web 控制台，用于边缘网关初始化与服务管理。',
      background: '控制台需要在本地网络环境中完成设备初始化、网络配置、身份校验和运行状态管理。',
      contributions: [
        '使用 React 与飞冰参与控制台前端开发。',
        '通过全局事件更新实时网络状态，并参与性能与包体优化。',
      ],
      challenges: [
        '协调 Wi-Fi、4G 等实时网络状态与页面展示。',
        '处理登录、Token、限流和本地设备服务之间的状态边界。',
      ],
      completedScope: [
        '参与交付总览、Wi-Fi、4G、设置、日志、登录与 Token、基础信息和限流功能。',
      ],
    },
    {
      id: 'maliang-configuration',
      title: '马良组态',
      domain: '低代码 · 可视化组态',
      summary: '服务于工业流程、设备运维和数据看板的可视化组态系统。',
      background: '编辑器需要让用户配置画布组件、运行时数据源和属性，并保持编辑操作与素材管理一致。',
      contributions: [
        '参与画布气泡、对话框、右侧面板编辑，以及运行时数据源与属性配置。',
        '参与图表、颜色、基础组件、自动保存、代码编辑器输入和 SVG 素材管理。',
      ],
      challenges: [
        '处理组件复制、删除后的配置同步，以及编辑态与运行态数据之间的衔接。',
      ],
      completedScope: [
        '参与交付画布编辑、组件配置、图表与基础组件、自动保存、代码输入和 SVG 素材管理等功能。',
      ],
    },
    {
      id: 'tongyi-knowledge',
      title: '通义智物',
      domain: 'AI 应用 · 知识库',
      summary: '面向工厂模型的 AI 问答与知识库应用。',
      background: '应用围绕多模态会话、知识库维护、角色权限和监控展示组织多个业务模块。',
      contributions: [
        '参与多模态会话、知识库创建测试与批量维护、角色账号权限。',
        '参与通用 Layout、Container、BaseDataGrid、HOC，以及图表监控能力建设。',
      ],
      challenges: [
        '在会话、知识库批量操作、角色权限和监控图表之间复用页面结构与数据展示能力。',
      ],
      completedScope: [
        '参与交付多模态问答、知识库维护、账号权限、通用页面容器与图表监控相关功能。',
      ],
    },
    {
      id: 'sier-learning',
      title: '斯尔教育',
      domain: '在线教育 · 交易与内容',
      summary: '面向财经职业培训的课程、内容和交易产品。',
      background: '产品需要串联课程发现、内容消费、订单支付和视频学习等用户链路。',
      contributions: [
        '使用 Vue、Vant 与 SCSS 负责购物车、课程、首页、资讯和支付链路。',
        '接入微信 / 支付宝支付、订单、视频播放和上传等能力。',
      ],
      challenges: [
        '衔接商品、课程、订单、第三方支付与内容播放等多个业务环节。',
      ],
      completedScope: [
        '交付购物车、课程、首页、资讯和支付相关页面与功能。',
      ],
    },
  ],
  education: [
    {
      id: 'zhengzhou-university',
      period: '2021.09 — 2024.01',
      organization: '郑州大学',
      field: '计算机科学与技术',
    },
    {
      id: 'open-university',
      period: '2016.03 — 2018.07',
      organization: '国家开放大学',
      field: '工商管理',
    },
  ],
}
