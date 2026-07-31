import type { ComponentType } from 'react'
import {
  validateTreasureMeta,
  type LocalizedText,
  type TreasureMeta,
  type TreasureType,
} from './schema'

export { resolveLocalizedText } from './schema'

interface MDXModule {
  default: ComponentType
}

interface JsonModule {
  default: TreasureMeta
}

export interface TreasureRecord extends TreasureMeta {
  Body: ComponentType
}

const metaModules = import.meta.glob<JsonModule>('./vault/*/meta.json', { eager: true })
const bodyModules = import.meta.glob<MDXModule>('./vault/*/index.mdx', { eager: true })

function directoryFromMetaPath(path: string): string {
  return path.replace('./vault/', '').replace('/meta.json', '')
}

const catalog: TreasureRecord[] = Object.entries(metaModules).map(([metaPath, module]) => {
  const directory = directoryFromMetaPath(metaPath)
  const meta: unknown = module.default
  validateTreasureMeta(meta)

  const body = bodyModules[`./vault/${directory}/index.mdx`]
  if (!body) throw new Error(`${directory}: index.mdx is missing`)
  if (meta.slug !== directory) throw new Error(`${directory}: slug must match directory name`)

  return { ...meta, Body: body.default }
})

/**
 * @name 获取已发布藏品
 * @returns 按更新时间从新到旧排列的藏品。
 */
export function getPublishedTreasures(): TreasureRecord[] {
  return catalog
    .filter((item) => item.status === 'published')
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

/** @name 首页精选策展顺序(② 方法论 → ① 产品 → ③ meta) */
const FEATURED_ORDER = ['agent-orchestration', 'together-trace', 'personal-portal', 'co-authorship']

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

/**
 * @name 按地址获取藏品
 * @returns 未发布或不存在时返回 undefined。
 */
export function getTreasureBySlug(slug: string | undefined): TreasureRecord | undefined {
  if (!slug) return undefined
  return getPublishedTreasures().find((item) => item.slug === slug)
}

/** @name 获取当前存在的藏品类型 */
export function getTreasureTypes(): TreasureType[] {
  return [...new Set(getPublishedTreasures().map((item) => item.type))]
}

/** @name 藏宝阁主题分类 */
export interface VaultCategory {
  key: string
  label: LocalizedText
  description: LocalizedText
  slugs: string[]
}

/** @name 一个主题分类及其命中的藏品 */
export interface VaultCategoryGroup {
  category: VaultCategory
  items: TreasureRecord[]
}

/**
 * @name 藏宝阁主题分类(策展顺序)
 * @description 每件藏品按 slug 归入一类;新增藏品若忘记登记,会兜底进「其他」组而非消失。
 */
export const VAULT_CATEGORIES: VaultCategory[] = [
  {
    key: 'ai-native-engineering',
    label: { 'zh-CN': 'AI 原生工程与方法', 'en-US': 'AI-Native Engineering & Method' },
    description: {
      'zh-CN': '我编排 AI 造东西的那套体系:门禁、验收、可接力的治理,以及你正站在里面的这个站。',
      'en-US': 'The system I use to orchestrate AI — gates, acceptance, hand-off-able governance, and the site you are standing in.',
    },
    slugs: ['agent-orchestration', 'personal-portal', 'claude-code-config', 'co-authored'],
  },
  {
    key: 'ai-interaction',
    label: { 'zh-CN': 'AI 交互与前端', 'en-US': 'AI Interaction & Frontend' },
    description: {
      'zh-CN': '把模型的能力接进界面的前端手艺:流式、增量、可中断。',
      'en-US': 'The frontend craft of wiring model output into a UI — streaming, incremental, interruptible.',
    },
    slugs: ['streaming-ui', 'streaming-frontend'],
  },
  {
    key: 'browser-ml',
    label: { 'zh-CN': '浏览器里的 AI / ML', 'en-US': 'AI / ML in the Browser' },
    description: {
      'zh-CN': '不靠后端、在浏览器里真的跑起来的机器学习:反向传播、n-gram、端侧推理的边界。',
      'en-US': 'Machine learning that actually runs client-side — backprop, n-grams, and the limits of on-device inference.',
    },
    slugs: ['neural-net', 'markov', 'browser-inference'],
  },
  {
    key: 'generative-visual',
    label: { 'zh-CN': '生成式视觉', 'en-US': 'Generative Visuals' },
    description: {
      'zh-CN': 'Canvas 上的算法生成与物理:力场、字符画、海报、布料,与一张协作图谱。',
      'en-US': 'Algorithmic generation and physics on canvas — fields, ASCII, posters, cloth, and a collaboration graph.',
    },
    slugs: ['flow-field', 'ascii-art', 'generative-poster', 'physics-sandbox', 'co-authorship'],
  },
  {
    key: 'applications',
    label: { 'zh-CN': '应用与项目', 'en-US': 'Applications & Projects' },
    description: {
      'zh-CN': '真上线、有真实使用场景的完整项目。',
      'en-US': 'Complete, shipped projects with real usage scenarios.',
    },
    slugs: ['together-trace', 'supet-industrial-platform'],
  },
  {
    key: 'early-experiments',
    label: { 'zh-CN': '早期实验', 'en-US': 'Early Experiments' },
    description: {
      'zh-CN': '留档的热身作——不再是主线,但记录仍在。',
      'en-US': 'Warm-ups kept for the record — no longer the headline.',
    },
    slugs: ['particle-field', 'typewriter-effect'],
  },
]

/**
 * @name 按主题分类分组已发布藏品
 * @param items 待分组的藏品(通常已按类型过滤)
 * @returns 有序分组;空组被剔除;未登记进任何分类的藏品收入末尾「其他」组。
 */
export function groupByCategory(items: TreasureRecord[]): VaultCategoryGroup[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]))
  const claimed = new Set<string>()
  const groups: VaultCategoryGroup[] = []

  for (const category of VAULT_CATEGORIES) {
    const hit = category.slugs
      .map((slug) => bySlug.get(slug))
      .filter((item): item is TreasureRecord => Boolean(item))
    hit.forEach((item) => claimed.add(item.slug))
    if (hit.length > 0) groups.push({ category, items: hit })
  }

  const orphans = items.filter((item) => !claimed.has(item.slug))
  if (orphans.length > 0) {
    groups.push({
      category: {
        key: 'other',
        label: { 'zh-CN': '其他', 'en-US': 'Other' },
        description: { 'zh-CN': '尚未归类的藏品。', 'en-US': 'Not yet categorized.' },
        slugs: [],
      },
      items: orphans,
    })
  }

  return groups
}
