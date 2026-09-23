import React from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="language-toggle" aria-label="Language switcher">
      <button
        type="button"
        className={language === 'ru' ? 'active' : ''}
        onClick={() => setLanguage('ru')}
      >
        RU
      </button>
      <button
        type="button"
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
