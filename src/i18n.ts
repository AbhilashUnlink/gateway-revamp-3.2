import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './language/en/common';
import jp from './language/jp/common';

const getInitialLanguage = (): string => {
  try {
    const raw = localStorage.getItem('persist:root');
    if (raw) {
      const root = JSON.parse(raw) as Record<string, string | undefined>;
      const settingsRaw = root['settings'];
      if (settingsRaw) {
        const settings = JSON.parse(settingsRaw) as { language?: string };
        return settings.language ?? 'jp';
      }
    }
  } catch {
    // fall through to default
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    jp: { translation: jp },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
