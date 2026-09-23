import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { getUsers } from '../api/userService.js';

export function UsersPage({ onNavigate, onOpenProfile }) {
  const { t, tPlural } = useI18n();
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], page: 0, size: 8, totalElements: 0, totalPages: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  async function loadUsers(nextPage) {
    try {
      setError('');
      setData(await getUsers(nextPage, 8));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar glass-panel">
        <button className="brand small brand-button" onClick={() => onNavigate({ name: 'landing' })}>
          <BookOpen size={28} />
          <h1>Bookly</h1>
        </button>
        <nav className="nav-actions">
          <button onClick={() => onNavigate({ name: 'landing' })}>{t('nav.home')}</button>
          <button onClick={() => onNavigate({ name: 'shelf' })}>{t('nav.shelf')}</button>
          <LanguageToggle />
        </nav>
      </header>
      <section className="users-page">
        <div className="section-title">
          <h2>{t('users.title')}</h2>
          <span>{tPlural('users.total', data.totalElements)}</span>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="users-grid">
          {data.content.map((item) => (
            <button className="user-card glass-panel" key={item.id} onClick={() => onOpenProfile(item.id)}>
              <UserRound size={26} />
              <strong>{item.displayName}</strong>
              <span>@{item.username}</span>
              <small>{tPlural('users.booksCount', item.booksCount)}</small>
            </button>
          ))}
        </div>
        <div className="pager">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={18} />{t('users.previous')}</button>
          <span>{data.totalPages === 0 ? 0 : page + 1} / {data.totalPages}</span>
          <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>{t('users.next')}<ChevronRight size={18} /></button>
        </div>
      </section>
    </main>
  );
}
