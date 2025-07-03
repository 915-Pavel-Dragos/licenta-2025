import axios from 'axios';

export async function refreshAccessToken() {
  try {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return false;

    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh,
    });

    localStorage.setItem('accessToken', response.data.access);
    return true;
  } catch (error) {
    console.error('Refresh token failed', error);
    return false;
  }
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/logout';
}
