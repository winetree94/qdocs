import i18n from 'i18next';
import ICU from 'i18next-icu';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import ko from './assets/i18n/ko.json';
import en from './assets/i18n/en.json';

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV !== 'production',
    resources: {
      en: {
        translation: en,
      },
      ko: {
        translation: ko,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
