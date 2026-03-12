import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './i18n/locales/zh-CN.json'
import enUS from './i18n/locales/en-US.json'

// Initialize i18n for tests — use en-US so nav labels match navItems.label
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      'zh-CN': { translation: zhCN },
      'en-US': { translation: enUS },
    },
    lng: 'en-US',
    fallbackLng: 'zh-CN',
    interpolation: { escapeValue: false },
  })
}
