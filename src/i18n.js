import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEnglish from './translation/english/translationEn.json'
import translationJapanese from './translation/japanese/translationJapn.json'

const resources = {
  en: { translation: translationEnglish },
  japn: { translation: translationJapanese },
}

i18n

  .use(initReactI18next)

  .init({
    resources,
    lng: 'en',

    keySeparator: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
