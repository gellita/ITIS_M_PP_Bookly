import { apiRequest } from './client.js';

export function getUsers(page = 0, size = 8) {
  return apiRequest(`/users?page=${page}&size=${size}`);
}

export function getUserProfile(id) {
  return apiRequest(`/users/${id}`);
}
