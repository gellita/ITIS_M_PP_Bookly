import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

export function AuthPage({ onAuthed, onNavigate }) {
  const { error, setError, signIn, signUp } = useBookly();
  const { t } = useI18n();
  const [mode, setMode] = useState('login');

  useEffect(() => {
    setError('');
  }, [mode, setError]);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      setError('');
      if (mode === 'login') {
        await signIn(data);
      } else {
        await signUp(data);
      }
      onAuthed();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel glass-panel">
        <div className="auth-topline">
          <button className="link-button" onClick={() => onNavigate({ name: 'landing' })}>{t('auth.backHome')}</button>
          <LanguageToggle />
        </div>
        <div className="brand">
          <BookOpen size={34} />
          <div>
            <h1>Bookly</h1>
            <p>{t('app.tagline')}</p>
          </div>
        </div>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>{t('auth.signIn')}</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>{t('auth.signUp')}</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          {mode === 'register' && (
            <>
              <input name="username" placeholder={t('auth.username')} minLength="3" required />
              <input name="email" placeholder={t('auth.email')} type="email" required />
              <input name="displayName" placeholder={t('auth.displayName')} required />
            </>
          )}
          {mode === 'login' && <input name="usernameOrEmail" placeholder={t('auth.usernameOrEmail')} required />}
          <input name="password" placeholder={t('auth.password')} type="password" minLength="6" required />
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">{mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}</button>
        </form>
      </section>
    </main>
  );
}
