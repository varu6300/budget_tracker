import React from 'react';

// Base attributes for line icons
const line = {
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

// Colored (filled) variants to match screenshot style
export const IconDashboard = ({variant='color'}) => {
  if(variant==='line') return (
    <svg {...line} viewBox="0 0 24 24"><path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3v6h8V3zM3 21h8v-6H3z"/></svg>
  );
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" rx="1.8" fill="#8fd3f4" />
      <rect x="13" y="13" width="9" height="9" rx="1.8" fill="#a29bfe" />
      <rect x="13" y="2" width="9" height="6" rx="1.2" fill="#ffb347" />
      <rect x="2" y="13" width="9" height="6" rx="1.2" fill="#55efc4" />
    </svg>
  );
};
export const IconTransactions = ({variant='color'}) => variant==='line' ? (
  <svg {...line} viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7"/></svg>
) : (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="3" rx="1.5" fill="#74b9ff" />
    <rect x="3" y="11" width="13" height="3" rx="1.5" fill="#ffeaa7" />
    <rect x="3" y="17" width="9" height="3" rx="1.5" fill="#fab1a0" />
  </svg>
);
export const IconCards = ({variant='color'}) => variant==='line' ? (
  <svg {...line} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
) : (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="3" fill="#b39ddb" />
    <rect x="2" y="9" width="20" height="3" fill="#9575cd" />
    <rect x="5" y="14" width="6" height="3" rx="1" fill="#ede7f6" />
  </svg>
);
export const IconBank = ({variant='color'}) => variant==='line' ? (
  <svg {...line} viewBox="0 0 24 24"><path d="M3 10h18L12 4 3 10z"/><path d="M4 10v7h3v-7M10 10v7h4v-7M17 10v7h3v-7"/><path d="M3 21h18"/></svg>
) : (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <path d="M3 10h18L12 3 3 10z" fill="#ffeaa7" stroke="#e1a948" strokeWidth="1" />
    <path d="M5 10h2v7H5zM11 10h2v7h-2zM17 10h2v7h-2z" fill="#fab1a0" />
    <rect x="3" y="17" width="18" height="2" fill="#e17055" />
  </svg>
);
export const IconBell = ({variant='color'}) => variant==='line' ? (
  <svg {...line} viewBox="0 0 24 24"><path d="M18 10a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
) : (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <path d="M18 10a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" fill="#ffd54f" stroke="#f9a825" strokeWidth="1" />
    <path d="M10.8 21a1.2 1.2 0 002.4 0" stroke="#f57f17" strokeWidth="1.2" fill="none" />
  </svg>
);
export const IconSettings = ({variant='color'}) => variant==='line' ? (
  <svg {...line} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H10a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V10c0 .69.28 1.36.76 1.84.48.48 1.15.76 1.84.76H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
) : (
  <svg width={18} height={18} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3.2" fill="#81ecec" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H10a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V10c0 .69.28 1.36.76 1.84.48.48 1.15.76 1.84.76H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="#00cec9" fillOpacity="0.45" />
  </svg>
);


export const NavIcon = ({children}) => (
  <span style={{display:'inline-flex', width:18, marginRight:8, alignItems:'center', justifyContent:'center'}}>{children}</span>
);
