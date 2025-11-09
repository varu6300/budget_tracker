import React from 'react';

/**
 * HeaderCard
 * Props:
 * - title: string
 * - subtitle: string
 * - rightLabel: string
 * - rightValue: node
 * - bg: css background (color or gradient)
 * - icon: React component (rendered inside a rounded box)
 * - iconSize: number
 */
const HeaderCard = ({ title, subtitle, rightLabel, rightValue, bg = '#fff', icon: Icon, iconSize = 32 }) => {
  return (
    <div style={{background: bg, borderRadius: '16px', padding: '32px', marginBottom: '32px', color:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div>
        <h2 style={{fontSize:'1.9rem', fontWeight:700, margin:0, marginBottom:'8px', display:'flex', alignItems:'center', gap:'14px'}}>
          {Icon ? (
            <span style={{width:56, height:56, display:'inline-flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.12)', borderRadius:10, padding:8}}>
              <Icon size={iconSize} />
            </span>
          ) : null}
          <span>{title}</span>
        </h2>
        {subtitle && <p style={{fontSize:'1rem', opacity:0.95, margin:0}}>{subtitle}</p>}
      </div>
      <div style={{textAlign:'right', color:'rgba(255,255,255,0.95)'}}>
        {rightLabel && <div style={{fontSize:'0.9rem', opacity:0.95, marginBottom:'4px'}}>{rightLabel}</div>}
        <div style={{fontSize:'2.5rem', fontWeight:700}}>{rightValue}</div>
      </div>
    </div>
  );
};

export default HeaderCard;
