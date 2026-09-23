import React from 'react';
import { Header } from '../components/Header.jsx';
import { BookForm } from '../components/BookForm.jsx';
import { BookCard } from '../components/BookCard.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

export function ShelfPage({ onNavigate }) {
  const { error, loading, shelf } = useBookly();
  const { t, tPlural } = useI18n();

  return (
    <main className="app-shell">
      <Header onNavigate={onNavigate} />
      {error && <p className="error wide">{error}</p>}
      <section className="layout">
        <BookForm />
        <section className="shelf">
          <div className="section-title">
            <h2>{t('shelf.title')}</h2>
            <span>{loading ? t('shelf.loading') : tPlural('shelf.booksCount', shelf.length)}</span>
          </div>
          <div className="book-grid">
            {shelf.map((item) => <BookCard key={item.id} item={item} />)}
            {shelf.length === 0 && !loading && <div className="empty glass-panel">{t('shelf.empty')}</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
