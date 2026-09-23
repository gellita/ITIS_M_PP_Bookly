import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.jsx';

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();
  const nextLanguage = language === 'en' ? 'ru' : 'en';

  return (
    <button className="language-toggle" onClick={() => setLanguage(nextLanguage)} title={t('language.toggle')}>
      <Languages size={18} />
      {t('language.current')}
    </button>
  );
}
