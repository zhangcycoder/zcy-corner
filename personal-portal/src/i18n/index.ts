import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

function syncDocumentLanguage(language: string): void {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language.startsWith('en') ? 'en-US' : 'zh-CN'
}

i18n.on('initialized', () => {
  syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language)
})
i18n.on('languageChanged', syncDocumentLanguage)

void i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    'en-US': { translation: enUS },
  },
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: { escapeValue: false },
})

export default i18n
