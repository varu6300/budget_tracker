import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-bg">
      <nav className="landing-nav">
        <div className="brand">Budget Tracker</div>
        <div className="nav-actions">
          <Link className="btn-outline" to="/signup">Sign up</Link>
          <Link className="btn-outline" to="/login">Sign In</Link>
        </div>
      </nav>
      <section className="landing-hero">
        <h1>Welcome to Budget Tracker</h1>
        <h2 className="tagline">Take control of your finances with our easy-to-use budget tracking application</h2>
        <div className="hero-cards">
          <div className="hero-card">
            <h3>Track Expenses</h3>
            <p>Monitor your spending patterns</p>
          </div>
          <div className="hero-card">
            <h3>Save Money</h3>
            <p>Set and achieve savings goals</p>
          </div>
        </div>
      </section>
    </div>
  );
}
