import React from 'react';
import { ArrowRight, BookOpen, LibraryBig, MessageSquareText, Sparkles, Star, UsersRound } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

export function LandingPage({ onNavigate }) {
  const { token, user } = useBookly();
  const { t } = useI18n();

  return (
    <main className="landing">
      <header className="landing-nav glass-panel">
        <div className="brand small">
          <BookOpen size={30} />
          <h1>Bookly</h1>
        </div>
        <nav className="nav-actions">
          <button onClick={() => onNavigate({ name: 'users' })}>{t('nav.readers')}</button>
          <button onClick={() => onNavigate({ name: token ? 'shelf' : 'auth' })}>
            {token ? t('nav.shelf') : t('auth.signIn')}
          </button>
          <LanguageToggle />
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy glass-panel">
          <span className="eyebrow">{t('landing.eyebrow')}</span>
          <h2>{t('landing.heroTitle')}</h2>
          <p>{t('landing.heroText')}</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => onNavigate({ name: token ? 'shelf' : 'auth' })}>
              <LibraryBig size={19} />{token ? t('landing.openShelf') : t('landing.createShelf')}
            </button>
            <button className="secondary" onClick={() => onNavigate({ name: 'users' })}>
              <UsersRound size={19} />{t('landing.exploreReaders')}
            </button>
          </div>
          {user && <p className="welcome">{t('landing.signedInAs', { name: user.displayName })}</p>}
        </div>
        <div className="hero-showcase glass-panel">
          <div className="showcase-orbit">
            <div className="mini-book primary-book">{t('landing.showcaseBook1')}</div>
            <div className="mini-book">{t('landing.showcaseBook2')}</div>
            <div className="mini-book">{t('landing.showcaseBook3')}</div>
          </div>
          <div className="rating-bubble"><Star size={18} fill="currentColor" /> {t('landing.averageBadge')}</div>
          <div className="review-bubble">"{t('landing.reviewBadge')}"</div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-title landing-title">
          <h2>{t('landing.sectionTitle')}</h2>
          <button onClick={() => onNavigate({ name: token ? 'shelf' : 'auth' })}>
            {t('landing.goToShelf')} <ArrowRight size={18} />
          </button>
        </div>
        <div className="value-grid">
          <article className="glass-panel">
            <Sparkles size={24} />
            <h3>{t('landing.featureCatalogTitle')}</h3>
            <p>{t('landing.featureCatalogText')}</p>
          </article>
          <article className="glass-panel">
            <Star size={24} />
            <h3>{t('landing.featureRatingsTitle')}</h3>
            <p>{t('landing.featureRatingsText')}</p>
          </article>
          <article className="glass-panel">
            <MessageSquareText size={24} />
            <h3>{t('landing.featureReviewsTitle')}</h3>
            <p>{t('landing.featureReviewsText')}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
