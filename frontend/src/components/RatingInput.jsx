import React from 'react';
import { Star } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.jsx';

export function RatingInput({ value, onChange }) {
  const { t } = useI18n();

  return (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map((number) => (
        <button
          type="button"
          key={number}
          className={number <= Number(value) ? 'selected' : ''}
          onClick={() => onChange(number)}
          title={t('books.starTitle', { number })}
        >
          <Star size={18} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
