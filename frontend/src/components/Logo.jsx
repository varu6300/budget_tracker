import React from 'react';

export default function Logo({ withText = true, size = 28 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" x2="1">
            <stop offset="0" stopColor="#2563eb"/>
            <stop offset="1" stopColor="#06b6d4"/>
          </linearGradient>
        </defs>
        <rect x="6" y="8" width="36" height="28" rx="6" stroke="url(#lg)" strokeWidth="3" fill="#fff"/>
        <path d="M12 18h12M12 24h24M12 30h18" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      {withText && <span style={{ fontWeight:800, letterSpacing:'.4px' }}>Budget Tracker</span>}
    </div>
  );
}
