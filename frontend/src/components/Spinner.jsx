import React from 'react';

export function Spinner({ size = 20 }) {
  return (
    <div style={{ display:'inline-block', width:size, height:size }} aria-label="loading">
      <svg width={size} height={size} viewBox="0 0 44 44" stroke="#2563eb">
        <g fill="none" fillRule="evenodd" strokeWidth="4">
          <circle cx="22" cy="22" r="18" strokeOpacity="0.25" />
          <path d="M40 22c0-9.941-8.059-18-18-18" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 22 22"
              to="360 22 22"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}
