import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'

export type SiteScene = 'gallery' | 'paper'

interface SiteHeaderProps {
  scene: SiteScene
}

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home', end: true },
  { to: '/vault', labelKey: 'nav.vault', end: false },
  { to: '/resume', labelKey: 'nav.resume', end: true },
] as const

/**
 * @name 站点导航
 * @description 在画廊与纸张场景中共享，并在路由变化后收起移动端菜单。
 * @param scene 当前页面的视觉场景。
 */
export default function SiteHeader({ scene }: SiteHeaderProps) {
  const { i18n, t } = useTranslation()
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const changeLanguage = (language: 'zh-CN' | 'en-US') => {
    if (language !== currentLanguage) void i18n.changeLanguage(language)
  }

  return (
    <header className="site-header" data-scene={scene}>
      <div className="site-header__inner">
        <Link className="site-brand" to="/" aria-label={`${t('nav.home')} — ZCY CORNER`}>
          <span className="site-brand__mark" aria-hidden="true">ZC</span>
          <span className="site-brand__name">ZCY CORNER</span>
        </Link>

        <button
          className="site-menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label={isMenuOpen
            ? t('a11y.closeNavigationMenu')
            : t('a11y.openNavigationMenu')}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="site-menu-button__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <div
          className="site-navigation"
          id="site-navigation"
          data-open={isMenuOpen}
        >
          <nav aria-label={t('a11y.mainNavigation')}>
            <ul className="site-navigation__list">
              {NAV_ITEMS.map(({ end, labelKey, to }) => (
                <li key={to}>
                  <NavLink
                    className={({ isActive }) => (
                      `site-navigation__link${isActive ? ' is-active' : ''}`
                    )}
                    end={end}
                    to={to}
                  >
                    {t(labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="language-switcher"
            aria-label={t('a11y.languageSwitcher')}
          >
            <button
              type="button"
              className={currentLanguage === 'zh-CN' ? 'is-active' : undefined}
              aria-pressed={currentLanguage === 'zh-CN'}
              aria-label={t('a11y.switchToChinese')}
              onClick={() => changeLanguage('zh-CN')}
            >
              中
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              className={currentLanguage === 'en-US' ? 'is-active' : undefined}
              aria-pressed={currentLanguage === 'en-US'}
              aria-label={t('a11y.switchToEnglish')}
              onClick={() => changeLanguage('en-US')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
