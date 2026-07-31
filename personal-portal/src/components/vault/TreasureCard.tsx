import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  resolveLocalizedText,
  type TreasureRecord,
} from '../../content/contentLoader'

interface TreasureCardProps {
  treasure: TreasureRecord
  locale: string
  priority?: boolean
}

/**
 * @name 藏品卡片
 * @description 以可聚焦的完整链接展示藏品；封面加载失败时保留固定比例的降级画面。
 * @param treasure 要展示的藏品记录。
 * @param locale 标题与摘要使用的当前语言。
 * @param priority 是否优先加载封面，适用于首屏精选内容。
 */
export default function TreasureCard({
  treasure,
  locale,
  priority = false,
}: TreasureCardProps) {
  const [failedCover, setFailedCover] = useState<string | null>(null)
  const title = resolveLocalizedText(treasure.title, locale)
  const summary = resolveLocalizedText(treasure.summary, locale)
  const hasCoverFailed = failedCover === treasure.cover

  return (
    <article className="treasure-card">
      <Link
        className="treasure-card__link"
        to={`/vault/${treasure.slug}`}
      >
        <div className="treasure-card__cover">
          {hasCoverFailed ? (
            <div className="treasure-cover-fallback" aria-hidden="true">
              <span>{treasure.type}</span>
              <strong>ZC</strong>
            </div>
          ) : (
            <img
              className="treasure-card__cover-image"
              src={treasure.cover}
              alt=""
              width="1200"
              height="720"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              onError={() => setFailedCover(treasure.cover)}
            />
          )}
        </div>

        <div className="treasure-card__body">
          <div className="treasure-card__meta">
            <span>{treasure.type}</span>
            <time dateTime={treasure.updatedAt}>
              {treasure.updatedAt.replaceAll('-', '.')}
            </time>
          </div>

          <h3 className="treasure-card__title">{title}</h3>
          <p className="treasure-card__summary">{summary}</p>

          <div className="treasure-card__footer">
            <ul
              className="treasure-card__tags"
              aria-label={locale === 'en-US' ? 'Technology tags' : '技术标签'}
            >
              {treasure.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <span className="treasure-card__arrow" aria-hidden="true">↗</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
