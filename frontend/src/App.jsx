import React, { useEffect, useState } from 'react';
import { AuthPage } from './pages/AuthPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { PublicProfilePage } from './pages/PublicProfilePage.jsx';
import { ShelfPage } from './pages/ShelfPage.jsx';
import { UsersPage } from './pages/UsersPage.jsx';
import { useBookly } from './store/BooklyContext.jsx';

function routeFromPath(pathname) {
  if (pathname === '/signin') {
    return { name: 'auth' };
  }
  if (pathname === '/readers') {
    return { name: 'users' };
  }
  if (pathname.startsWith('/readers/')) {
    return { name: 'profile', id: decodeURIComponent(pathname.replace('/readers/', '')) };
  }
  if (pathname === '/shelf') {
    return { name: 'shelf' };
  }
  return { name: 'landing' };
}

function pathFromRoute(route) {
  if (route.name === 'auth') {
    return '/signin';
  }
  if (route.name === 'users') {
    return '/readers';
  }
  if (route.name === 'profile') {
    return `/readers/${encodeURIComponent(route.id)}`;
  }
  if (route.name === 'shelf') {
    return '/shelf';
  }
  return '/';
}

export function App() {
  const { token } = useBookly();
  const [route, setRoute] = useState(() => routeFromPath(window.location.pathname));

  useEffect(() => {
    function onPopState() {
      setRoute(routeFromPath(window.location.pathname));
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(nextRoute) {
    const nextPath = pathFromRoute(nextRoute);
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    setRoute(nextRoute);
  }

  function openProfile(id) {
    navigate({ name: 'profile', id });
  }

  if (route.name === 'auth') {
    return <AuthPage onAuthed={() => navigate({ name: 'shelf' })} onNavigate={navigate} />;
  }

  if (route.name === 'users') {
    return <UsersPage onNavigate={navigate} onOpenProfile={openProfile} />;
  }

  if (route.name === 'profile') {
    return <PublicProfilePage userId={route.id} onNavigate={navigate} />;
  }

  if (route.name === 'shelf') {
    return token
      ? <ShelfPage onNavigate={navigate} />
      : <AuthPage onAuthed={() => navigate({ name: 'shelf' })} onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}
