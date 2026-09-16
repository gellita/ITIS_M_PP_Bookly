import React from 'react';
import { Star } from 'lucide-react';

export function RatingInput({ value, onChange }) {
  return (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map((number) => (
        <button
          type="button"
          key={number}
          className={number <= Number(value) ? 'selected' : ''}
          onClick={() => onChange(number)}
          title={`${number} of 5`}
        >
          <Star size={18} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
