import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import TreasureCard from '../components/vault/TreasureCard'
import VaultFilter, {
  type VaultFilterValue,
} from '../components/vault/VaultFilter'
import {
  getPublishedTreasures,
  getTreasureTypes,
} from '../content/contentLoader'

export default function VaultPage() {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const locale = i18n.resolvedLanguage ?? i18n.language
  const treasures = getPublishedTreasures()
  const treasureTypes = getTreasureTypes()
  const requestedType = searchParams.get('type')
  const selectedType: VaultFilterValue = treasureTypes.find(
    (type) => type === requestedType,
  ) ?? 'all'
  const visibleTreasures = selectedType === 'all'
    ? treasures
    : treasures.filter((treasure) => treasure.type === selectedType)

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

      <section className="vault-page__collection" aria-live="polite">
        <div className="vault-page__result-meta">
          <span>INDEX / {selectedType.toUpperCase()}</span>
          <span>{String(visibleTreasures.length).padStart(2, '0')} RESULTS</span>
        </div>
        <div className="treasure-grid">
          {visibleTreasures.map((treasure, index) => (
            <TreasureCard
              key={treasure.slug}
              treasure={treasure}
              locale={locale}
              priority={index === 0}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
