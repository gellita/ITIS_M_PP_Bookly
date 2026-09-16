import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useBookly } from '../store/BooklyContext.jsx';

export function AuthPage({ onAuthed, onNavigate }) {
  const { error, setError, signIn, signUp } = useBookly();
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
        <button className="link-button" onClick={() => onNavigate({ name: 'landing' })}>Back to home</button>
        <div className="brand">
          <BookOpen size={34} />
          <div>
            <h1>Bookly</h1>
            <p>Your personal reading shelf</p>
          </div>
        </div>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Sign up</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          {mode === 'register' && (
            <>
              <input name="username" placeholder="Username" minLength="3" required />
              <input name="email" placeholder="Email" type="email" required />
              <input name="displayName" placeholder="Display name" required />
            </>
          )}
          {mode === 'login' && <input name="usernameOrEmail" placeholder="Username or email" required />}
          <input name="password" placeholder="Password" type="password" minLength="6" required />
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
      </section>
    </main>
  );
}
