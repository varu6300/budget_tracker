import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/income', label: 'Income', icon: '💰' },
    { path: '/expenses', label: 'Expenses', icon: '💸' },
  // Budget page removed
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/analytics', label: 'Analytics', icon: '📉' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'linear-gradient(180deg, #1e40af 0%, #3b82f6 100%)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💼 Budget Tracker
          </div>
          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '4px'
          }}>
            Financial Management
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.8)',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontWeight: location.pathname === item.path ? 600 : 500,
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
              onMouseEnter={e => {
                if (location.pathname !== item.path) {
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== item.path) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '12px' }}>
            {user?.username || 'User'}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Header */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              {navItems.find(item => item.path === location.pathname)?.label || 'Budget Tracker'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Link to="/settings" style={{
              background: '#f3f4f6',
              padding: '8px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#6b7280',
              fontWeight: 500,
              fontSize: '1.2rem'
            }}>
              ⚙️
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px', background: '#f8f9fc' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
