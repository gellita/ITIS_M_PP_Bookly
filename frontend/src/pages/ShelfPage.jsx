import React from 'react';
import { Header } from '../components/Header.jsx';
import { BookForm } from '../components/BookForm.jsx';
import { BookCard } from '../components/BookCard.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

export function ShelfPage({ onNavigate }) {
  const { error, loading, shelf } = useBookly();

  return (
    <main className="app-shell">
      <Header onNavigate={onNavigate} />
      {error && <p className="error wide">{error}</p>}
      <section className="layout">
        <BookForm />
        <section className="shelf">
          <div className="section-title">
            <h2>My shelf</h2>
            <span>{loading ? 'loading' : `${shelf.length} books`}</span>
          </div>
          <div className="book-grid">
            {shelf.map((item) => <BookCard key={item.id} item={item} />)}
            {shelf.length === 0 && !loading && <div className="empty glass-panel">Your shelf is empty. Add a book from the catalog.</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
