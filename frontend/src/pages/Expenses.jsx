import React, { useEffect, useState } from 'react';
import { getTransactionHistory, createTransaction } from '../services/transactions.js';

export default function ExpensesPage(){
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount:'', description:'', category:'' });

  async function load(p=0){
    setLoading(true);
    try{
      const data = await getTransactionHistory({ page:p, size, type:'EXPENSE' });
      setItems(data.content || []);
      setPage(data.number || 0);
    } finally { setLoading(false); }
  }
  useEffect(()=>{ load(0); },[]);

  async function submit(e){
    e.preventDefault();
    const payload = { amount: parseFloat(form.amount), type:'EXPENSE', description: form.description, category: form.category };
    await createTransaction(payload);
    setForm({ amount:'', description:'', category:'' });
    load(0);
  }

  return (
    <div className="content wide">
      <h2>Expenses</h2>
      <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'140px 1fr 1fr 120px', gap:8, alignItems:'center', marginBottom:12}}>
        <input placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))} required />
        <input placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
        <input placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} />
        <button className="ml-btn accent" type="submit">Add Expense</button>
      </form>
      {loading && <div>Loading...</div>}
      {!loading && items.map(t => (
        <div key={t.id} style={{display:'grid', gridTemplateColumns:'120px 1fr 1fr 140px', gap:8, padding:'8px 0', borderBottom:'1px solid #e5e7eb'}}>
          <div>{new Date(t.createdAt).toLocaleDateString()}</div>
          <div>{t.description || '-'}</div>
          <div style={{textAlign:'right'}}>${t.amount}</div>
          <div style={{opacity:0.7}}>{t.category || ''}</div>
        </div>
      ))}
    </div>
  );
}
