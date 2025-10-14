import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { Spinner } from '../components/Spinner.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const { login, setUser, loading, setLoading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', remember: true });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function validate() {
    if (!form.username.trim() || !form.password.trim()) return 'Username & password required';
    if (form.password.length < 4) return 'Password must be at least 4 characters';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const vErr = validate();
    if (vErr) { setError(vErr); return; }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { username: form.username, password: form.password });
      // let AuthContext handle persistence according to the remember flag
      login(res.data.token, form.remember);
  const summary = await api.get('/api/user/summary');
  setUser({ username: summary.data.username, email: summary.data.email });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
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
          <div className="auth-card" role="region" aria-label="Sign in form">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to track your spending and stay on top of your budget.</p>
            <form onSubmit={handleSubmit} noValidate>
              <label>
                Username
                <input name="username" value={form.username} onChange={handleChange} autoComplete="username" required />
              </label>
              <label>
                Password
                <div style={{ position:'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    style={{ paddingRight:44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className={`password-toggle-icon ${showPassword ? 'active' : ''}`}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >{showPassword ? '🙈' : '👁'}</button>
                </div>
              </label>
              <div className="auth-row">
                <label className="auth-remember">
                  <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} /> Remember me
                </label>
                <a className="auth-link" href="#">Forgot password?</a>
              </div>
              {error && <div className="error" role="alert">{String(error)}</div>}

              <button type="submit" className="ml-btn accent full" disabled={loading} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {loading ? <><Spinner size={18} /> Signing in...</> : 'Sign In'}
              </button>
              <div className="auth-alt">No account? <Link to="/signup" className="auth-link">Create one</Link></div>
            </form>
          </div>
        </section>
      </div>

      <footer className="ml-footer">BudgetTracker © {new Date().getFullYear()}</footer>
    </div>
  );
}
