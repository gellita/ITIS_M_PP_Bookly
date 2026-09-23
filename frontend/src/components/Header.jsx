import React from 'react';
import { BookOpen, LogOut, UserRound } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

export function Header({ onNavigate }) {
  const { user, signOut } = useBookly();
  const { t } = useI18n();

  return (
    <header className="topbar">
      <button className="brand small brand-button" onClick={() => onNavigate({ name: 'landing' })}>
        <BookOpen size={28} />
        <h1>Bookly</h1>
      </button>
      <nav className="nav-actions">
        <button onClick={() => onNavigate({ name: 'users' })}>{t('nav.readers')}</button>
        <button onClick={() => onNavigate({ name: 'shelf' })}>{t('nav.shelf')}</button>
        <LanguageToggle />
      </nav>
      <div className="profile">
        <UserRound size={18} />
        <span>{user?.displayName}</span>
        <button className="icon-button" onClick={signOut} title={t('nav.logout')}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
