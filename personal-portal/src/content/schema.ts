export type SupportedLocale = 'zh-CN' | 'en-US'

export interface LocalizedText {
  'zh-CN': string
  'en-US'?: string
}

export type TreasureType = 'demo' | 'ui' | 'module' | 'note' | 'project'
export type TreasureStatus = 'draft' | 'published'

export interface TreasureMeta {
  slug: string
  title: LocalizedText
  summary: LocalizedText
  type: TreasureType
  tags: string[]
  createdAt: string
  updatedAt: string
  status: TreasureStatus
  featured: boolean
  cover: string
  demoKey?: string
  sourceUrl?: string
  externalUrl?: string
}

const TREASURE_TYPES: TreasureType[] = ['demo', 'ui', 'module', 'note', 'project']
const TREASURE_STATUSES: TreasureStatus[] = ['draft', 'published']
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasChineseText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value['zh-CN'] === 'string' && value['zh-CN'].trim().length > 0
}

/**
 * @name 校验藏品元数据
 * @description 在构建期和运行期共享，发现字段缺失或格式错误时抛出带字段名的异常。
 * @param value 从 meta.json 读取的未知对象。
 */
export function validateTreasureMeta(value: unknown): asserts value is TreasureMeta {
  if (!isRecord(value)) throw new Error('meta must be an object')
  if (typeof value.slug !== 'string' || value.slug.trim().length === 0) throw new Error('slug is required')
  if (!hasChineseText(value.title)) throw new Error('title.zh-CN is required')
  if (!hasChineseText(value.summary)) throw new Error('summary.zh-CN is required')
  if (!TREASURE_TYPES.includes(value.type as TreasureType)) throw new Error('type is invalid')
  if (!Array.isArray(value.tags) || value.tags.some((tag) => typeof tag !== 'string')) throw new Error('tags must be string[]')
  if (typeof value.createdAt !== 'string' || !ISO_DATE_PATTERN.test(value.createdAt)) throw new Error('createdAt must use YYYY-MM-DD')
  if (typeof value.updatedAt !== 'string' || !ISO_DATE_PATTERN.test(value.updatedAt)) throw new Error('updatedAt must use YYYY-MM-DD')
  if (!TREASURE_STATUSES.includes(value.status as TreasureStatus)) throw new Error('status is invalid')
  if (typeof value.featured !== 'boolean') throw new Error('featured must be boolean')
  if (typeof value.cover !== 'string' || value.cover.trim().length === 0) throw new Error('cover is required')
}

/**
 * @name 读取本地化文本
 * @returns 当前语言存在时返回对应文本，否则返回中文。
 */
export function resolveLocalizedText(value: LocalizedText, locale: string): string {
  return locale === 'en-US' && value['en-US'] ? value['en-US'] : value['zh-CN']
}
