import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './i18n/locales/zh-CN.json'
import enUS from './i18n/locales/en-US.json'

// Keep existing component assertions stable by initializing tests in English.
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
