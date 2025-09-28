import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Login() {
  const { login, setUser, setLoading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.token);
      // fetch summary to populate user quickly
      const summary = await api.get('/api/user/summary');
      setUser({ username: summary.data.username });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="card">
        <label>Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <div className="error">{String(error)}</div>}
        <button type="submit">Login</button>
        <div className="switch-link">No account? <Link to="/signup">Create one</Link></div>
      </form>
    </div>
  );
}
