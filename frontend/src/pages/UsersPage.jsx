import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import { getUsers } from '../api/userService.js';

export function UsersPage({ onNavigate, onOpenProfile }) {
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
          <button onClick={() => onNavigate({ name: 'landing' })}>Home</button>
          <button onClick={() => onNavigate({ name: 'shelf' })}>My shelf</button>
        </nav>
      </header>
      <section className="users-page">
        <div className="section-title">
          <h2>Readers</h2>
          <span>{data.totalElements} total</span>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="users-grid">
          {data.content.map((item) => (
            <button className="user-card glass-panel" key={item.id} onClick={() => onOpenProfile(item.id)}>
              <UserRound size={26} />
              <strong>{item.displayName}</strong>
              <span>@{item.username}</span>
              <small>{item.booksCount} books</small>
            </button>
          ))}
        </div>
        <div className="pager">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={18} />Previous</button>
          <span>{data.totalPages === 0 ? 0 : page + 1} / {data.totalPages}</span>
          <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Next<ChevronRight size={18} /></button>
        </div>
      </section>
    </main>
  );
}
