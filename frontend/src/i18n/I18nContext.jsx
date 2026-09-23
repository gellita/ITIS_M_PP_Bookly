import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

const LANG_KEY = 'booklyLang';
const dictionaries = { en, ru };
const I18nContext = createContext(null);

function interpolate(template, values = {}) {
  return template.replace(/\{(\w+)}/g, (_, key) => values[key] ?? '');
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem(LANG_KEY) || 'en');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(nextLanguage) {
    if (!dictionaries[nextLanguage]) {
      return;
    }
    localStorage.setItem(LANG_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }

  const value = useMemo(() => ({
    language,
    setLanguage,
    t(key, values) {
      const template = dictionaries[language][key] || dictionaries.en[key] || key;
      return interpolate(template, values);
    }
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}
