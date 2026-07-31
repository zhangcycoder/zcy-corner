import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import TreasureCard from '../components/vault/TreasureCard'
import {
  getFeaturedTreasures,
  getPublishedTreasures,
  resolveLocalizedText,
} from '../content/contentLoader'

const GITHUB_URL = 'https://github.com/zhangcycoder/zcy-corner'
const CURRENT_FOCUS = ['AI 编排 · 验收门禁', '离线优先的真实产品', '工程判断 > 敲代码']

export default function HomePage() {
  const { i18n } = useTranslation()
  const locale = i18n.resolvedLanguage ?? i18n.language
  const featuredTreasures = getFeaturedTreasures(4)
  const latestTreasures = getPublishedTreasures().slice(0, 3)

  return (
    <div className="gallery-page home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__statement">
          <p className="home-eyebrow">AI-NATIVE ENGINEER · 架构与验收</p>
          <h1 id="home-title">我编排 AI 造复杂、能跑、且经得起验收的东西。</h1>
          <p className="home-hero__description">
            差异化不在谁敲代码，而在工程判断，和我为 AI 立起的编排 / 验证 / 门禁体系。这里是能跑的证据。
          </p>
          <div className="home-hero__actions">
            <Link className="gallery-button gallery-button--primary" to="/vault">
              探索藏宝阁
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="gallery-button gallery-button--secondary" to="/resume">
              查看简历
            </Link>
          </div>
        </div>

        <aside className="home-focus" aria-labelledby="home-focus-title">
          <div className="home-focus__header">
            <span>NOW / 2026</span>
            <h2 id="home-focus-title">当前关注</h2>
          </div>
          <ol className="home-focus__list">
            {CURRENT_FOCUS.map((focus, index) => (
              <li key={focus}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{focus}</strong>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="home-featured" aria-labelledby="featured-title">
        <div className="gallery-section-heading">
          <div>
            <p className="gallery-section-heading__index">01 / SELECTED</p>
            <h2 id="featured-title">精选藏品</h2>
          </div>
          <Link className="gallery-text-link" to="/vault">
            查看全部 <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="treasure-grid">
          {featuredTreasures.map((treasure, index) => (
            <TreasureCard
              key={treasure.slug}
              treasure={treasure}
              locale={locale}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="home-latest" aria-labelledby="latest-title">
        <div className="gallery-section-heading">
          <div>
            <p className="gallery-section-heading__index">02 / RECENT</p>
            <h2 id="latest-title">最近更新</h2>
          </div>
        </div>

        <ol className="home-latest__list">
          {latestTreasures.map((treasure, index) => (
            <li key={treasure.slug}>
              <Link to={`/vault/${treasure.slug}`}>
                <span className="home-latest__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong>
                  {resolveLocalizedText(treasure.title, locale)}
                </strong>
                <span className="home-latest__type">{treasure.type}</span>
                <time dateTime={treasure.updatedAt}>
                  {treasure.updatedAt.replaceAll('-', '.')}
                </time>
                <span className="home-latest__arrow" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-resume-cta" aria-labelledby="resume-cta-title">
        <div>
          <p className="gallery-section-heading__index">03 / PROFILE</p>
          <h2 id="resume-cta-title">想了解我的经历与工作方式？</h2>
        </div>
        <div className="home-resume-cta__links">
          <Link className="gallery-text-link" to="/resume">
            阅读简历 <span aria-hidden="true">→</span>
          </Link>
          <a
            className="gallery-text-link"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>
  )
}
