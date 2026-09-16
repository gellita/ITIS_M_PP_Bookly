import React, { useEffect, useState } from 'react';
import { BookOpen, Star, UserRound } from 'lucide-react';
import { getUserProfile } from '../api/userService.js';

export function PublicProfilePage({ userId, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setError('');
        setProfile(await getUserProfile(userId));
      } catch (e) {
        setError(e.message);
      }
    }
    loadProfile();
  }, [userId]);

  return (
    <main className="app-shell">
      <header className="topbar glass-panel">
        <button className="brand small brand-button" onClick={() => onNavigate({ name: 'landing' })}>
          <BookOpen size={28} />
          <h1>Bookly</h1>
        </button>
        <nav className="nav-actions">
          <button onClick={() => onNavigate({ name: 'users' })}>Readers</button>
          <button onClick={() => onNavigate({ name: 'shelf' })}>My shelf</button>
        </nav>
      </header>
      <section className="public-profile">
        {error && <p className="error">{error}</p>}
        {profile && (
          <>
            <div className="profile-heading glass-panel">
              <UserRound size={38} />
              <div>
                <h2>{profile.displayName}</h2>
                <span>@{profile.username}</span>
              </div>
            </div>
            <div className="book-grid">
              {profile.books.map((item) => (
                <article className="book-card glass-panel" key={item.id}>
                  <div>
                    <h3>{item.book.title}</h3>
                    <p className="author">{item.book.author}</p>
                    <p>{item.book.description}</p>
                  </div>
                  <div className="ratings">
                    <span><Star size={16} /> Rating: {item.userRating}</span>
                    <span>Average: {item.book.averageRating || 'n/a'}</span>
                  </div>
                  <p className="review">{item.review}</p>
                </article>
              ))}
              {profile.books.length === 0 && <div className="empty glass-panel">This reader has not added books yet.</div>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
