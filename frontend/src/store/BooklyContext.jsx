import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, login, logout as logoutRequest, register } from '../api/authService.js';
import { addShelfBook, deleteShelfBook, getBooks, getShelf, updateShelfBook } from '../api/bookService.js';

const TOKEN_KEY = 'booklyToken';
const BooklyContext = createContext(null);

export function BooklyProvider({ children }) {
  const [token, setTokenState] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [shelf, setShelf] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      refresh();
    } else {
      setUser(null);
      setBooks([]);
      setShelf([]);
    }
  }, [token]);

  function setToken(nextToken) {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(nextToken);
  }

  async function refresh() {
    try {
      setLoading(true);
      setError('');
      const [profile, catalog, userShelf] = await Promise.all([
        getProfile(token),
        getBooks(token),
        getShelf(token)
      ]);
      setUser(profile);
      setBooks(catalog);
      setShelf(userShelf);
    } catch (e) {
      setError(e.message);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(credentials) {
    completeAuth(await login(credentials));
  }

  async function signUp(payload) {
    completeAuth(await register(payload));
  }

  function completeAuth(payload) {
    setUser(payload.user);
    setToken(payload.token);
    setError('');
  }

  async function signOut() {
    try {
      if (token) {
        await logoutRequest(token);
      }
    } finally {
      setToken(null);
      setUser(null);
    }
  }

  async function addBook(payload) {
    await addShelfBook(token, payload);
    await refresh();
  }

  async function updateBook(id, payload) {
    await updateShelfBook(token, id, payload);
    await refresh();
  }

  async function deleteBook(id) {
    await deleteShelfBook(token, id);
    await refresh();
  }

  const value = useMemo(() => ({
    token,
    user,
    books,
    shelf,
    error,
    loading,
    setError,
    signIn,
    signUp,
    signOut,
    addBook,
    updateBook,
    deleteBook
  }), [token, user, books, shelf, error, loading]);

  return <BooklyContext.Provider value={value}>{children}</BooklyContext.Provider>;
}

export function useBookly() {
  const context = useContext(BooklyContext);
  if (!context) {
    throw new Error('useBookly must be used inside BooklyProvider');
  }
  return context;
}
