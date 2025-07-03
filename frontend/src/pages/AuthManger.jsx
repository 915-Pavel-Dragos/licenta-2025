import { useEffect, useRef } from 'react';
import { isTokenExpired } from '../utils/auth';
import { refreshAccessToken, logout } from '../services/authService';

export default function AuthManager() {
  const timeoutRef = useRef(null);
  const idleTime = 30 * 1000; 

  const resetIdleTimer = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const token = localStorage.getItem('accessToken');
      if (isTokenExpired(token)) {
        const success = await refreshAccessToken();
        if (!success) logout();
      }
    }, idleTime);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
}
