import { apiRequest } from './client.js';

export function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function register(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function logout(token) {
  return apiRequest('/auth/logout', {
    method: 'POST',
    token
  });
}

export function getProfile(token) {
  return apiRequest('/auth/me', { token });
}
