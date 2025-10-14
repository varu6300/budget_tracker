import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';

export default function Landing() {
  return (
    <div className="ml-page">
      <header className="ml-header">
        <Logo size={24} />
        <nav className="ml-actions">
          <Link className="ml-link" to="/login">Login</Link>
          <Link className="ml-btn" to="/signup">Sign Up Free</Link>
        </nav>
      </header>

      <div className="ml-band">
        <main className="ml-hero">
          <div className="ml-hero-card">
          <div className="ml-hero-left">
            <h1 className="ml-title">
              Budget<br/>Expenses
            </h1>
            <p className="ml-sub">Track and manage your finances with ease</p>
            <div className="ml-cta">
              <Link className="ml-btn accent large" to="/signup">Get Started</Link>
              <Link className="ml-btn outline-dark" to="/login">Learn More</Link>
            </div>
          </div>
          <div className="ml-hero-right" aria-hidden>
            <svg width="520" height="360" viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gblue" x1="0" x2="1">
                  <stop offset="0" stopColor="#60a5fa"/>
                  <stop offset="1" stopColor="#2563eb"/>
                </linearGradient>
                <linearGradient id="gteal" x1="0" x2="1">
                  <stop offset="0" stopColor="#34d399"/>
                  <stop offset="1" stopColor="#10b981"/>
                </linearGradient>
              </defs>
              {/* window card */}
              <rect x="30" y="30" width="380" height="250" rx="22" fill="#ffffff" stroke="#e5e7eb"/>
              <rect x="46" y="46" width="16" height="16" rx="8" fill="#e5e7eb"/>
              <rect x="68" y="46" width="16" height="16" rx="8" fill="#e5e7eb"/>
              <rect x="90" y="46" width="16" height="16" rx="8" fill="#e5e7eb"/>
              {/* pie + bars */}
              <circle cx="132" cy="138" r="54" fill="#d1fae5"/>
              <path d="M132 84a54 54 0 1054 54h-54V84z" fill="url(#gteal)"/>
              <rect x="230" y="108" width="18" height="70" rx="6" fill="#bfdbfe"/>
              <rect x="256" y="92" width="18" height="86" rx="6" fill="#93c5fd"/>
              <rect x="282" y="74" width="18" height="104" rx="6" fill="url(#gblue)"/>
              {/* list rows */}
              <rect x="70" y="198" width="100" height="12" rx="6" fill="#e5e7eb"/>
              <rect x="70" y="218" width="160" height="12" rx="6" fill="#e5e7eb"/>
              <rect x="250" y="198" width="120" height="12" rx="6" fill="#e5e7eb"/>
              {/* wallet */}
              <g transform="translate(280,210)">
                <rect x="0" y="20" width="170" height="86" rx="16" fill="#1e40af"/>
                <rect x="0" y="20" width="170" height="86" rx="16" fill="#1d4ed8" opacity="0.85"/>
                <rect x="12" y="30" width="146" height="66" rx="12" fill="#1e3a8a" opacity="0.25"/>
                <circle cx="146" cy="63" r="12" fill="#0ea5e9"/>
                <rect x="24" y="-6" width="118" height="36" rx="6" fill="#10b981"/>
                <rect x="40" y="-20" width="118" height="36" rx="6" fill="#059669"/>
              </g>
              {/* coin */}
              <g transform="translate(420,248)">
                <circle cx="0" cy="0" r="30" fill="#fcd34d" stroke="#f59e0b"/>
                <path d="M-8 -4h8v-8h8v8h8v8h-8v8h-8v-8h-8z" fill="#f59e0b"/>
              </g>
            </svg>
          </div>
          </div>
        </main>
      </div>

      <section className="ml-metrics">
        <div className="metric-card"><div className="metric-label">Deposit Amount</div><div className="metric-value">4,700</div></div>
        <div className="metric-card"><div className="metric-label">Establishment Fee</div><div className="metric-value">20%</div></div>
        <div className="metric-card"><div className="metric-label">Annual</div><div className="metric-value">$700.00</div></div>
      </section>

      <section className="ml-cards">
        <div className="ml-card"><h3>Instant Summary</h3><p>Balance, income, and expenses at a glance.</p></div>
        <div className="ml-card"><h3>Lightning Fast</h3><p>Add transactions in seconds, anywhere.</p></div>
        <div className="ml-card"><h3>Secure by Default</h3><p>JWT-based auth with clean APIs.</p></div>
      </section>

      <footer className="ml-footer">© {new Date().getFullYear()} Budget Tracker</footer>
    </div>
  );
}
