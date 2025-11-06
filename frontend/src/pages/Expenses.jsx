import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { getTransactionHistory, createTransaction } from '../services/transactions.js';

export default function ExpensesPage(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount:'', description:'', category:'' });

  async function load(){
    setLoading(true);
    try{
      const data = await getTransactionHistory({ page:0, size:50, type:'EXPENSE' });
      setItems(data.content || []);
    } finally { setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);

  async function submit(e){
    e.preventDefault();
    const payload = { amount: parseFloat(form.amount), type:'EXPENSE', description: form.description, category: form.category };
    await createTransaction(payload);
    setForm({ amount:'', description:'', category:'' });
    load();
  }

  const totalExpenses = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Layout>
      <div style={{ maxWidth: 1200 }}>
        <div style={{background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', borderRadius:'16px', padding:'32px', marginBottom:'32px', color:'#fff', boxShadow:'0 4px 20px rgba(239, 68, 68, 0.3)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <h2 style={{fontSize:'1.8rem', fontWeight:700, margin:0, marginBottom:'8px'}}>💸 Expense Tracking</h2>
            <p style={{fontSize:'1rem', opacity:0.9, margin:0}}>Monitor and categorize your spending</p>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'0.9rem', opacity:0.9, marginBottom:'4px'}}>Total Expenses</div>
            <div style={{fontSize:'2.5rem', fontWeight:700}}>${totalExpenses.toFixed(2)}</div>
          </div>
        </div>
        <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <h3 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:'20px', color:'#1f2937'}}>➕ Add New Expense</h3>
          <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'1fr 2fr 1fr auto', gap:'16px', alignItems:'end'}}>
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Amount</label>
              <input placeholder="0.00" type="number" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))} required style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}} />
            </div>
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Description</label>
              <input placeholder="e.g., Groceries, Rent" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}} />
            </div>
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Category</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}}>
                <option value="">Select...</option>
                <option value="Groceries">Groceries</option>
                <option value="Dining">Dining</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" style={{padding:'12px 32px', background:'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color:'#fff', border:'none', borderRadius:'8px', fontWeight:600, fontSize:'1rem', cursor:'pointer', boxShadow:'0 2px 8px rgba(239, 68, 68, 0.3)'}}>Add Expense</button>
          </form>
        </div>
        <div style={{background:'#fff', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <h3 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:'20px', color:'#1f2937'}}>📋 Expense History</h3>
          {loading ? <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>Loading...</div> : items.length === 0 ? <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>No expenses recorded yet. Add your first expense above!</div> : (
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {items.map(t => (
                <div key={t.id} style={{display:'grid', gridTemplateColumns:'120px 2fr 1fr 140px', gap:'16px', padding:'16px', background:'#f9fafb', borderRadius:'12px', border:'1px solid #e5e7eb', alignItems:'center'}}>
                  <div style={{fontSize:'0.9rem', color:'#6b7280'}}>{new Date(t.createdAt).toLocaleDateString()}</div>
                  <div style={{fontWeight:600, color:'#374151'}}>{t.description || 'Expense'}</div>
                  <div style={{fontSize:'0.9rem', color:'#6b7280'}}>{t.category || 'Uncategorized'}</div>
                  <div style={{fontSize:'1.2rem', fontWeight:700, color:'#ef4444', textAlign:'right'}}>-${t.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
