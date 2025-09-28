import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Signup() {
  const { login, setUser, setLoading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', form);
      login(res.data.token);
      // Immediately navigate; background load summary inside dashboard
      navigate('/dashboard');
      api.get('/api/user/summary')
        .then(summary => setUser({ username: summary.data.username }))
        .catch(()=>{});
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error || err.response?.data;
      if (status === 409) {
        setError(serverMsg || 'Username already exists');
      } else if (status === 403) {
        setError('Not allowed (403) – check CORS or auth header');
      } else {
        setError(serverMsg || 'Signup failed');
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit} className="card">
        <label>Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <div className="error">{String(error)}</div>}
        <button type="submit">Sign Up</button>
        <div className="switch-link">Have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  );
}
