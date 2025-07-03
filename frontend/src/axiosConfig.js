import axios from 'axios';
import { refreshAccessToken, logout } from './services/authService';
import { isTokenExpired } from './utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');

  if (isTokenExpired(token)) {
    const success = await refreshAccessToken();
    if (!success) {
      logout();
      return Promise.reject('Token expired');
    }
    token = localStorage.getItem('accessToken');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
