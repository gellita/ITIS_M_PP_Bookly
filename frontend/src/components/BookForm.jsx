import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { RatingInput } from './RatingInput.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

const emptyForm = {
  mode: 'existing',
  bookId: '',
  title: '',
  author: '',
  description: '',
  userRating: 5,
  review: ''
};

export function BookForm() {
  const { books, addBook, setError } = useBookly();
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const selectedBook = books.find((book) => book.id === Number(form.bookId));
  const filteredBooks = books
    .filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      userRating: Number(form.userRating),
      review: form.review
    };

    if (form.mode === 'existing') {
      payload.bookId = Number(form.bookId);
    } else {
      payload.title = form.title;
      payload.author = form.author;
      payload.description = form.description;
    }

    try {
      setError('');
      await addBook(payload);
      setForm(emptyForm);
      setQuery('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <aside className="side-panel">
      <h2>Add a book</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="tabs compact">
          <button type="button" className={form.mode === 'existing' ? 'active' : ''} onClick={() => setForm({ ...form, mode: 'existing' })}>Catalog</button>
          <button type="button" className={form.mode === 'new' ? 'active' : ''} onClick={() => setForm({ ...form, mode: 'new' })}>New book</button>
        </div>
        {form.mode === 'existing' ? (
          <div className="catalog-picker">
            <label className="search-field">
              <Search size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or author" />
            </label>
            <input value={form.bookId} onChange={() => {}} className="hidden-input" required />
            <div className="catalog-list">
              {filteredBooks.map((book) => (
                <button
                  type="button"
                  key={book.id}
                  className={book.id === Number(form.bookId) ? 'selected' : ''}
                  onClick={() => setForm({ ...form, bookId: String(book.id) })}
                >
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </button>
              ))}
            </div>
            {selectedBook && <p className="selected-book">Selected: {selectedBook.title}</p>}
          </div>
        ) : (
          <>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required />
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author" required />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required />
          </>
        )}
        <RatingInput value={form.userRating} onChange={(value) => setForm({ ...form, userRating: value })} />
        <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} placeholder="Your review" required />
        <button className="primary" type="submit"><Plus size={18} />Add to shelf</button>
      </form>
    </aside>
  );
}
