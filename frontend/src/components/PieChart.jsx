import React from 'react';

// Simple SVG pie chart (no external deps). Expects values >= 0.
export default function PieChart({ size = 160, segments = [], stroke = 24, centerLabel }) {
  const total = segments.reduce((s, x) => s + (x.value || 0), 0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2} ${size / 2})`}>
        <circle r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const frac = total > 0 ? (seg.value || 0) / total : 0;
          const length = frac * circumference;
          const dasharray = `${length} ${circumference - length}`;
          const el = (
            <circle
              key={i}
              r={radius}
              fill="none"
              stroke={seg.color || '#6366f1'}
              strokeWidth={stroke}
              strokeDasharray={dasharray}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90)"
            />
          );
          offset += length;
          return el;
        })}
        {centerLabel && (
          <text x="0" y="6" textAnchor="middle" fontWeight="700" fontSize="14" fill="#0f172a">{centerLabel}</text>
        )}
      </g>
    </svg>
  );
}
