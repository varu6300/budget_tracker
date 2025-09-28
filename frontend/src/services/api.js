import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

api.interceptors.response.use(r => r, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem('token');
    // force redirect to login if protected
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(err);
});
