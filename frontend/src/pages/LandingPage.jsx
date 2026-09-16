import React from 'react';
import { ArrowRight, BookOpen, LibraryBig, MessageSquareText, Sparkles, Star, UsersRound } from 'lucide-react';
import { useBookly } from '../store/BooklyContext.jsx';

export function LandingPage({ onNavigate }) {
  const { token, user } = useBookly();

  return (
    <main className="landing">
      <header className="landing-nav glass-panel">
        <div className="brand small">
          <BookOpen size={30} />
          <h1>Bookly</h1>
        </div>
        <nav className="nav-actions">
          <button onClick={() => onNavigate({ name: 'users' })}>Readers</button>
          <button onClick={() => onNavigate({ name: token ? 'shelf' : 'auth' })}>
            {token ? 'My shelf' : 'Sign in'}
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy glass-panel">
          <span className="eyebrow">social reading shelf</span>
          <h2>Your books, reviews, and reading taste in one glowing place.</h2>
          <p>
            Build a personal shelf, rate every book, write quick reviews, and browse
            what other readers love without losing the cozy feeling of your own library.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => onNavigate({ name: token ? 'shelf' : 'auth' })}>
              <LibraryBig size={19} />{token ? 'Open my shelf' : 'Create my shelf'}
            </button>
            <button className="secondary" onClick={() => onNavigate({ name: 'users' })}>
              <UsersRound size={19} />Explore readers
            </button>
          </div>
          {user && <p className="welcome">Signed in as {user.displayName}</p>}
        </div>
        <div className="hero-showcase glass-panel">
          <div className="showcase-orbit">
            <div className="mini-book primary-book">The Midnight Library</div>
            <div className="mini-book">Dune</div>
            <div className="mini-book">Circe</div>
          </div>
          <div className="rating-bubble"><Star size={18} fill="currentColor" /> 4.8 average</div>
          <div className="review-bubble">“A shelf that feels like a reading profile.”</div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-title landing-title">
          <h2>A polished reading profile, not just a list.</h2>
          <button onClick={() => onNavigate({ name: token ? 'shelf' : 'auth' })}>
            Go to shelf <ArrowRight size={18} />
          </button>
        </div>
        <div className="value-grid">
          <article className="glass-panel">
            <Sparkles size={24} />
            <h3>Curated catalog</h3>
            <p>Pick from the shared book catalog with search, or create a brand-new title.</p>
          </article>
          <article className="glass-panel">
            <Star size={24} />
            <h3>Personal and global ratings</h3>
            <p>See your own score next to the average rating across the whole service.</p>
          </article>
          <article className="glass-panel">
            <MessageSquareText size={24} />
            <h3>Readable reviews</h3>
            <p>Keep your thoughts attached to the book and discover opinions from others.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
