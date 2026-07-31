import { useTranslation } from 'react-i18next'
import type { TreasureType } from '../../content/schema'

export type VaultFilterValue = TreasureType | 'all'

interface VaultFilterProps {
  types: TreasureType[]
  selectedType: VaultFilterValue
  onChange: (type: VaultFilterValue) => void
}

/**
 * @name 藏品类型筛选器
 * @description 以单选按钮组切换 Vault 类型，选中状态由父级 URL 参数控制。
 * @param types 当前内容中可用的藏品类型。
 * @param selectedType 当前选中的类型，all 表示全部。
 * @param onChange 用户选择类型时的回调。
 */
export default function VaultFilter({
  types,
  selectedType,
  onChange,
}: VaultFilterProps) {
  const { i18n, t } = useTranslation()
  const isEnglish = (i18n.resolvedLanguage ?? i18n.language) === 'en-US'

  return (
    <div
      className="vault-filter"
      role="group"
      aria-label={isEnglish ? 'Filter treasures by type' : '按藏品类型筛选'}
    >
      <button
        className="vault-filter__button"
        type="button"
        aria-pressed={selectedType === 'all'}
        onClick={() => onChange('all')}
      >
        {isEnglish ? 'All' : '全部'}
      </button>

      {types.map((type) => (
        <button
          className="vault-filter__button"
          type="button"
          key={type}
          aria-pressed={selectedType === type}
          onClick={() => onChange(type)}
        >
          {t(`treasureTypes.${type}`)}
        </button>
      ))}
    </div>
  )
}
