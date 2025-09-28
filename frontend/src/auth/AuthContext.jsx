import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Optionally fetch user summary for username quickly
      api.get('/api/user/summary').then(res => setUser({ username: res.data.username })).catch(()=>{});
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  function login(tokenValue) {
    // write immediately so interceptors on same tick can attach Authorization
    localStorage.setItem('token', tokenValue);
    setToken(tokenValue);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = { token, login, logout, user, setUser, loading, setLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
