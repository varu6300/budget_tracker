import React from 'react';

export default function Cards() {
  return (
    <div>
      <header style={{background: 'linear-gradient(90deg, #a4508b 0%, #5f0a87 100%)', padding: '0 32px', display: 'flex', alignItems: 'center', height: 60}}>
        <div style={{fontWeight:700, fontSize:24, color:'#ffe600'}}>BudgetWise</div>
      </header>
      <div style={{ background: '#fff7f0', minHeight: 'calc(100vh - 60px)', padding: '32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 16, color: '#222' }}>💳 Cards</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* Example card */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 24, minWidth: 260, maxWidth: 320, flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>Visa Classic</h3>
              <div style={{ color: '#555', fontSize: 14 }}>Card Number: **** **** **** 1234</div>
              <div style={{ color: '#0ea5e9', fontWeight: 500 }}>Holder: John Doe</div>
              <div style={{ color: '#f59e42', fontWeight: 500 }}>Expiry: 12/27</div>
              <div style={{ color: '#64748b', fontWeight: 500 }}>Type: Credit</div>
              <div style={{ height: 10, background: '#f3f4f6', borderRadius: 5, margin: '8px 0' }}>
                <div style={{ width: `60%`, height: '100%', background: '#6366f1', borderRadius: 5, transition: 'width 0.3s' }}></div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 16px', fontWeight: 500 }}>Edit</button>
                <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 16px', fontWeight: 500 }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
