import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Support session-only token (sessionStorage) or persistent token (localStorage).
  const [token, setToken] = useState(() => sessionStorage.getItem('tempToken') || localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Fetch user summary (do not change storage here — login() handles persistence).
      api.get('/api/user/summary').then(res => setUser({ username: res.data.username, email: res.data.email })).catch(()=>{});
    } else {
      // Clear any stored tokens if logged out
      localStorage.removeItem('token');
      sessionStorage.removeItem('tempToken');
    }
  }, [token]);

  function login(tokenValue, remember = true) {
    // Persist token according to user's choice. Write immediately so interceptors can attach Authorization.
    if (remember) {
      localStorage.setItem('token', tokenValue);
      sessionStorage.removeItem('tempToken');
    } else {
      sessionStorage.setItem('tempToken', tokenValue);
      localStorage.removeItem('token');
    }
    setToken(tokenValue);
  }

  function logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('tempToken');
    setToken(null);
    setUser(null);
  }

  const value = { token, login, logout, user, setUser, loading, setLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
