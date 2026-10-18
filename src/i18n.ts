import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

const savedLanguage = typeof window === 'undefined' ? null : localStorage.getItem('lang')
const initialLanguage = savedLanguage === 'fr' ? 'fr' : 'en'

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})
if (typeof document !== 'undefined') document.documentElement.lang = initialLanguage

export default i18n
