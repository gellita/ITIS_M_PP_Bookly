import React from 'react';
import { BookOpen, LogOut, UserRound } from 'lucide-react';
import { useBookly } from '../store/BooklyContext.jsx';

export function Header({ onNavigate }) {
  const { user, signOut } = useBookly();

  return (
    <header className="topbar">
      <button className="brand small brand-button" onClick={() => onNavigate({ name: 'landing' })}>
        <BookOpen size={28} />
        <h1>Bookly</h1>
      </button>
      <nav className="nav-actions">
        <button onClick={() => onNavigate({ name: 'users' })}>Readers</button>
        <button onClick={() => onNavigate({ name: 'shelf' })}>My shelf</button>
      </nav>
      <div className="profile">
        <UserRound size={18} />
        <span>{user?.displayName}</span>
        <button className="icon-button" onClick={signOut} title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
