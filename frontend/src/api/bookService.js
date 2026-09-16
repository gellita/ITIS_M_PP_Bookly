import { apiRequest } from './client.js';

export function getBooks(token) {
  return apiRequest('/books', { token });
}

export function getShelf(token) {
  return apiRequest('/my/books', { token });
}

export function addShelfBook(token, payload) {
  return apiRequest('/my/books', {
    method: 'POST',
    token,
    body: JSON.stringify(payload)
  });
}

export function updateShelfBook(token, id, payload) {
  return apiRequest(`/my/books/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload)
  });
}

export function deleteShelfBook(token, id) {
  return apiRequest(`/my/books/${id}`, {
    method: 'DELETE',
    token
  });
}
