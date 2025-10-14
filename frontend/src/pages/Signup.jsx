import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Signup() {
  const { login, setUser, setLoading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', role: 'user', email:'' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
  const res = await api.post('/api/auth/signup', { username: form.username, password: form.password, role: form.role, email: form.email });
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
    <div className="ml-page">
      <header className="ml-header">
        <Logo />
        <div className="ml-actions">
          <Link to="/login" className="ml-link">Login</Link>
          <Link to="/signup" className="ml-btn outline-dark">Sign Up Free</Link>
        </div>
      </header>

      <div className="ml-band">
        <section className="auth-hero">
          <div className="auth-card" role="region" aria-label="Sign up form">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-sub">Join BudgetTracker and start taking control of your money.</p>
            <form onSubmit={handleSubmit} noValidate>
              <label>
                Username
                <input name="username" value={form.username} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </label>
              <div className="role-toggle" role="radiogroup" aria-label="Account type">
                <div className={`role-btn ${form.role==='user' ? 'selected' : ''}`} role="radio" aria-checked={form.role==='user'} tabIndex={0} onClick={()=>setForm(f=>({...f, role:'user'}))}>
                  <div className="icon">👤</div>
                  <div className="label">User</div>
                </div>
                <div className={`role-btn ${form.role==='admin' ? 'selected' : ''}`} role="radio" aria-checked={form.role==='admin'} tabIndex={0} onClick={()=>setForm(f=>({...f, role:'admin'}))}>
                  <div className="icon">🛡️</div>
                  <div className="label">Admin</div>
                </div>
              </div>
              {error && <div className="error">{String(error)}</div>}

              <button type="submit" className="ml-btn accent full">Sign Up</button>
              <div className="auth-alt">Have an account? <Link to="/login" className="auth-link">Log in</Link></div>
            </form>
          </div>
        </section>
      </div>

      <footer className="ml-footer">BudgetTracker © {new Date().getFullYear()}</footer>
    </div>
  );
}
