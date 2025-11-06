import React, { useState } from 'react';

export default function GoalsSection() {
  const [alert, setAlert] = useState(null);

  function handleCreateGoal(type) {
    // Simulate goal creation (replace with API call if needed)
    setTimeout(() => {
      setAlert(`${type} goal created successfully!`);
      setTimeout(() => setAlert(null), 2000);
    }, 300);
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 24px #0002',
      padding: '2rem',
      maxWidth: '480px',
      margin: '2rem auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h2 style={{ color: '#a4508b', fontWeight: 700, marginBottom: '1.5rem' }}>Goals</h2>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => handleCreateGoal('Budget')}
          style={{
            background: 'linear-gradient(90deg, #a4508b 0%, #7c2bc4 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 32px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
          }}
        >
          Budget
        </button>
        <button
          onClick={() => handleCreateGoal('Savings')}
          style={{
            background: 'linear-gradient(90deg, #22c55e 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 32px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
          }}
        >
          Savings
        </button>
      </div>
      {alert && (
        <div style={{
          background: '#a4508b',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 24px',
          fontWeight: 'bold',
          fontSize: '1rem',
          marginTop: '1rem',
          boxShadow: '0 2px 8px #0001',
        }}>
          {alert}
        </div>
      )}
    </div>
  );
}
