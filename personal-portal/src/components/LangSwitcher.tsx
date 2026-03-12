import React from 'react'
import { useTranslation } from 'react-i18next'

const LangSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const current = i18n.language

  const handleSwitch = (lang: string) => {
    if (lang !== current) {
      i18n.changeLanguage(lang)
    }
  }

  const baseStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    background: 'transparent',
    border: '1px solid rgba(0, 255, 255, 0.4)',
    padding: '3px 8px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  }

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    color: '#00ffff',
    borderColor: '#00ffff',
    boxShadow: '0 0 8px rgba(0, 255, 255, 0.5)',
  }

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    color: 'rgba(200, 220, 255, 0.5)',
  }

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      <button
        style={current === 'zh-CN' ? activeStyle : inactiveStyle}
        onClick={() => handleSwitch('zh-CN')}
        aria-label="切换为中文"
        data-lang="zh-CN"
      >
        ZH
      </button>
      <button
        style={current === 'en-US' ? activeStyle : inactiveStyle}
        onClick={() => handleSwitch('en-US')}
        aria-label="Switch to English"
        data-lang="en-US"
      >
        EN
      </button>
    </div>
  )
}

export default LangSwitcher
