import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

const LANG_KEY = 'booklyLang';
const dictionaries = { en, ru };
const I18nContext = createContext(null);

function interpolate(template, values = {}) {
  return template.replace(/\{(\w+)}/g, (_, key) => values[key] ?? '');
}

function getPluralForm(language, count) {
  if (language === 'ru') {
    const mod10 = Math.abs(count) % 10;
    const mod100 = Math.abs(count) % 100;

    if (mod100 >= 11 && mod100 <= 14) {
      return 'many';
    }
    if (mod10 === 1) {
      return 'one';
    }
    if (mod10 >= 2 && mod10 <= 4) {
      return 'few';
    }
    return 'many';
  }

  return count === 1 ? 'one' : 'other';
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
      if (typeof template !== 'string') {
        return interpolate(template.other || Object.values(template)[0] || key, values);
      }
      return interpolate(template, values);
    },
    tPlural(key, count, values = {}) {
      const dictionaryValue = dictionaries[language][key] || dictionaries.en[key] || key;
      if (typeof dictionaryValue === 'string') {
        return interpolate(dictionaryValue, { ...values, count });
      }

      const form = getPluralForm(language, Number(count));
      const template = dictionaryValue[form] || dictionaryValue.other || dictionaryValue.many || key;
      return interpolate(template, { ...values, count });
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
