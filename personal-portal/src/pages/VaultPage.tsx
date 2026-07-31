import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import TreasureCard from '../components/vault/TreasureCard'
import VaultFilter, {
  type VaultFilterValue,
} from '../components/vault/VaultFilter'
import {
  EARLY_EXPERIMENT_SLUGS,
  getPublishedTreasures,
  getTreasureTypes,
} from '../content/contentLoader'

export default function VaultPage() {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const locale = i18n.resolvedLanguage ?? i18n.language
  const isEnglish = locale === 'en-US'
  const treasures = getPublishedTreasures()
  const treasureTypes = getTreasureTypes()
  const requestedType = searchParams.get('type')
  const selectedType: VaultFilterValue = treasureTypes.find(
    (type) => type === requestedType,
  ) ?? 'all'
  const visibleTreasures = selectedType === 'all'
    ? treasures
    : treasures.filter((treasure) => treasure.type === selectedType)
  const mainTreasures = visibleTreasures.filter(
    (treasure) => !EARLY_EXPERIMENT_SLUGS.includes(treasure.slug),
  )
  const earlyTreasures = visibleTreasures.filter(
    (treasure) => EARLY_EXPERIMENT_SLUGS.includes(treasure.slug),
  )

  const updateType = (type: VaultFilterValue) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      if (type === 'all') {
        nextParams.delete('type')
      } else {
        nextParams.set('type', type)
      }
      return nextParams
    })
  }

  return (
    <div className="gallery-page vault-page">
      <header className="vault-page__header">
        <p className="home-eyebrow">CURATED PRACTICE · OPEN ARCHIVE</p>
        <h1>技术藏宝阁</h1>
        <div className="vault-page__introduction">
          <p>
            收集做过、想透并值得复用的技术实践。每件藏品都保留实现过程、
            设计判断与可继续生长的线索。
          </p>
          <span>{String(treasures.length).padStart(2, '0')} OBJECTS</span>
        </div>
      </header>

      <VaultFilter
        types={treasureTypes}
        selectedType={selectedType}
        onChange={updateType}
      />

      <section
        className="vault-page__collection"
        aria-labelledby="vault-collection-title"
      >
        <h2 className="visually-hidden" id="vault-collection-title">
          {isEnglish ? 'Treasure collection' : '藏品集合'}
        </h2>
        <div className="vault-page__result-meta">
          <span>INDEX / {selectedType.toUpperCase()}</span>
          <span aria-hidden="true">
            {String(visibleTreasures.length).padStart(2, '0')} RESULTS
          </span>
          <span
            className="visually-hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isEnglish
              ? `${visibleTreasures.length} treasures found`
              : `找到 ${visibleTreasures.length} 件藏品`}
          </span>
        </div>
        <div className="treasure-grid">
          {mainTreasures.map((treasure, index) => (
            <TreasureCard
              key={treasure.slug}
              treasure={treasure}
              locale={locale}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      {earlyTreasures.length > 0 && (
        <section
          className="vault-page__early"
          aria-labelledby="vault-early-title"
        >
          <div className="vault-page__early-head">
            <span className="home-eyebrow">EARLY EXPERIMENTS</span>
            <h2 id="vault-early-title">{isEnglish ? 'Early experiments' : '早期实验'}</h2>
            <p>{isEnglish
              ? 'Warm-up demos kept for the record — not the current headline.'
              : '留档的热身实验——不再是当前主线,但记录仍在。'}</p>
          </div>
          <div className="treasure-grid">
            {earlyTreasures.map((treasure) => (
              <TreasureCard key={treasure.slug} treasure={treasure} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
