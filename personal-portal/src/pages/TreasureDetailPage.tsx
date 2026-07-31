import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import DemoStage from '../components/vault/DemoStage'
import {
  getTreasureBySlug,
  resolveLocalizedText,
} from '../content/contentLoader'
import { usePageMeta } from '../hooks/usePageMeta'
import NotFoundPage from './NotFoundPage'

const GALLERY_TYPES = new Set(['demo', 'ui', 'module', 'project'])

export default function TreasureDetailPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const treasure = getTreasureBySlug(slug)
  const locale = i18n.resolvedLanguage ?? i18n.language
  const title = treasure
    ? resolveLocalizedText(treasure.title, locale)
    : '藏品不存在'
  const summary = treasure
    ? resolveLocalizedText(treasure.summary, locale)
    : '未找到对应的已发布藏品。'

  usePageMeta({
    title: `${title} | ZCY`,
    description: summary,
    image: treasure?.cover,
  })

  if (!treasure) return <NotFoundPage />

  const { Body } = treasure
  const hasGalleryPreview = GALLERY_TYPES.has(treasure.type)

  return (
    <div className="treasure-detail">
      {hasGalleryPreview && (
        <section
          className="gallery-page treasure-detail__preview"
          aria-labelledby="treasure-preview-title"
        >
          <header className="treasure-detail__preview-header">
            <div>
              <p className="home-eyebrow">
                VAULT OBJECT / {treasure.type.toUpperCase()}
              </p>
              <h2 id="treasure-preview-title">
                {treasure.demoKey ? '实验现场' : '项目预览'}
              </h2>
            </div>
            <span>UPDATED / {treasure.updatedAt.replaceAll('-', '.')}</span>
          </header>

          {treasure.demoKey ? (
            <DemoStage demoKey={treasure.demoKey} />
          ) : (
            <figure className="treasure-detail__cover-stage">
              <img
                src={treasure.cover}
                alt={`${title}封面`}
                width="1200"
                height="720"
                decoding="async"
              />
            </figure>
          )}
        </section>
      )}

      <article className="treasure-detail__paper">
        <div className="treasure-detail__paper-inner">
          <header className="treasure-detail__article-header">
            <p className="treasure-detail__kicker">
              {treasure.type.toUpperCase()} / {treasure.slug}
            </p>
            <h1>{title}</h1>
            <p className="treasure-detail__summary">{summary}</p>

            <dl className="treasure-detail__metadata">
              <div>
                <dt>创建</dt>
                <dd>
                  <time dateTime={treasure.createdAt}>{treasure.createdAt}</time>
                </dd>
              </div>
              <div>
                <dt>更新</dt>
                <dd>
                  <time dateTime={treasure.updatedAt}>{treasure.updatedAt}</time>
                </dd>
              </div>
              <div>
                <dt>类型</dt>
                <dd>{treasure.type}</dd>
              </div>
              <div>
                <dt>标签</dt>
                <dd>{treasure.tags.join(' · ')}</dd>
              </div>
            </dl>
          </header>

          <div className="prose-content">
            <Body />
          </div>

          {(treasure.sourceUrl || treasure.externalUrl) && (
            <footer className="treasure-detail__resources">
              <p>RESOURCES</p>
              <div>
                {treasure.sourceUrl && (
                  <a
                    href={treasure.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看源码 <span aria-hidden="true">↗</span>
                  </a>
                )}
                {treasure.externalUrl && (
                  <a
                    href={treasure.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    访问项目 <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </footer>
          )}
        </div>
      </article>
    </div>
  )
}
