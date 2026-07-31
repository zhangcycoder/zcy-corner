import type { ComponentType } from 'react'
import {
  validateTreasureMeta,
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

/** @name 藏宝阁「早期实验」分区的藏品 */
export const EARLY_EXPERIMENT_SLUGS = ['particle-field', 'typewriter-effect']

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
