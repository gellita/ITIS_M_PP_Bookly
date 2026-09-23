import React, { useState } from 'react';
import { Save, Star, Trash2 } from 'lucide-react';
import { RatingInput } from './RatingInput.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useBookly } from '../store/BooklyContext.jsx';

export function BookCard({ item }) {
  const { updateBook, deleteBook, setError } = useBookly();
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ userRating: item.userRating, review: item.review });

  async function save() {
    try {
      setError('');
      await updateBook(item.id, { userRating: Number(draft.userRating), review: draft.review });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove() {
    try {
      setError('');
      await deleteBook(item.id);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <article className="book-card">
      <div>
        <h3>{item.book.title}</h3>
        <p className="author">{item.book.author}</p>
        <p>{item.book.description}</p>
      </div>
      <div className="ratings">
        <span><Star size={16} /> {t('books.mine', { rating: item.userRating })}</span>
        <span>{t('books.average', { rating: item.book.averageRating || t('books.notAvailable') })}</span>
      </div>
      {editing ? (
        <div className="edit-box">
          <RatingInput value={draft.userRating} onChange={(value) => setDraft({ ...draft, userRating: value })} />
          <textarea value={draft.review} onChange={(e) => setDraft({ ...draft, review: e.target.value })} />
          <button className="primary" onClick={save}><Save size={18} />{t('books.save')}</button>
        </div>
      ) : (
        <p className="review">{item.review}</p>
      )}
      <div className="actions">
        <button onClick={() => setEditing(true)}>{t('books.edit')}</button>
        <button className="danger" onClick={remove} title={t('books.delete')}><Trash2 size={18} /></button>
      </div>
    </article>
  );
}
