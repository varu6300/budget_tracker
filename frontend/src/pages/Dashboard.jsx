import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../services/api.js';
import { fetchTransactions, createTransaction, resetTransactions } from '../services/transactions.js';

export default function Dashboard() {
  const { user, logout, setUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [form, setForm] = useState({ amount:'', type:'INCOME', description:'', category:'' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/user/summary');
        if(!ignore){
          setSummary(res.data);
          if(res.data?.username) setUser({ username: res.data.username });
        }
      } catch(e){
        if(!ignore){
          const status = e?.response?.status;
          if(status === 401) setError('Unauthorized (401) – please login again.');
          else if(status === 403) setError('Forbidden (403) – token missing/invalid or CORS.');
          else setError(e?.response?.data?.error || 'Failed to load');
        }
      } finally {
        if(!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [setUser]);

  useEffect(()=>{
    let ignore = false;
    async function load(){
      try{
        setTxLoading(true);
        const data = await fetchTransactions();
        if(!ignore) setTransactions(data);
      }catch(e){
        // swallow; summary error already displayed
      }finally{ if(!ignore) setTxLoading(false); }
    }
    load();
    return ()=>{ignore=true};
  }, []);

  async function submitTx(e){
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        amount: form.amount ? parseFloat(form.amount) : 0,
        type: form.type,
        description: form.description || null,
        category: form.category || null
      };
      if(!payload.amount || payload.amount <=0){
        setFormError('Amount must be > 0');
        return;
      }
      const created = await createTransaction(payload);
      setTransactions(t=> [created, ...t].slice(0,10));
      // update summary numbers locally
      setSummary(s => {
        if(!s) return s;
        let { currentBalance, totalIncome, totalExpenses } = s;
        if(payload.type === 'INCOME'){
          totalIncome = parseFloat(totalIncome) + payload.amount;
          currentBalance = parseFloat(currentBalance) + payload.amount;
        } else {
          totalExpenses = parseFloat(totalExpenses) + payload.amount;
          currentBalance = parseFloat(currentBalance) - payload.amount;
        }
        return { ...s, currentBalance, totalIncome, totalExpenses };
      });
      setForm({ amount:'', type: form.type, description:'', category:'' });
    } catch(e){
      setFormError(e?.response?.data?.error || 'Failed to add');
    }
  }

  function updateField(e){
    const { name, value } = e.target;
    setForm(f=> ({ ...f, [name]: value }));
  }

  async function handleReset(){
    if(!window.confirm('Reset ALL your transactions? This cannot be undone.')) return;
    try {
      const res = await resetTransactions();
      setTransactions([]);
      if(res.summary){
        setSummary(s => ({...s, ...res.summary}));
      } else {
        setSummary(s => s ? {...s, currentBalance:0,totalIncome:0,totalExpenses:0}: s);
      }
    } catch(e){
      alert('Reset failed');
    }
  }

  function handleLogout(){
    logout();
    // redirect handled by ProtectedRoute on next render
  }

  return (
    <div className="dashboard-layout">
      <header className="topbar">
        <div className="logo">Project Expense Tracking Software</div>
        <div className="spacer" />
        <div className="profile-wrapper" onBlur={()=>setTimeout(()=>setOpenMenu(false),150)} tabIndex={0}>
          <button className="profile-chip" onClick={()=>setOpenMenu(o=>!o)}>
            <span className="avatar">{user?.username?.charAt(0)?.toUpperCase()}</span>
            <span className="chip-name">{user?.username}</span>
            <span className="chevron">▾</span>
          </button>
          {openMenu && (
            <div className="profile-dropdown">
              <div className="pd-username">Signed in as <strong>{user?.username}</strong></div>
              <button className="dropdown-item" onClick={handleLogout}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <main className="content wide">
        {error && <div className="error" style={{marginBottom:16}}>{String(error)}</div>}
  {loading && <div>Loading summary...</div>}
  {!loading && error && <div className="error" style={{marginBottom:16}}>{String(error)}</div>}
  {!loading && !error && summary && (
          <>
          <div className="kpi-row" style={{alignItems:'flex-start'}}>
            <div className="kpi-box">
              <div className="kpi-label">Current Balance</div>
              <div className="kpi-number green">${summary.currentBalance}</div>
            </div>
            <div className="kpi-box">
              <div className="kpi-label">Total Income</div>
              <div className="kpi-number blue">${summary.totalIncome}</div>
            </div>
            <div className="kpi-box">
              <div className="kpi-label">Total Expenses</div>
              <div className="kpi-number red">${summary.totalExpenses}</div>
            </div>
            <div className="kpi-box" style={{display:'flex', flexDirection:'column', gap:8}}>
              <div className="kpi-label">Actions</div>
              <button onClick={handleReset} style={{background:'#dc2626', color:'#fff', border:'none', padding:'0.5rem 0.75rem', borderRadius:6, cursor:'pointer', fontSize:'0.75rem'}}>Reset Data</button>
            </div>
          </div>
          <div className="panel-grid">
            <div className="panel" style={{minWidth:0}}>
              <h3 style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>Latest Transactions <span style={{fontSize:'0.75rem', fontWeight:400}}>{txLoading? 'Loading...' : ''}</span></h3>
              <div className="tx-list" style={{maxHeight:260, overflowY:'auto'}}>
                {transactions.length === 0 && <div style={{opacity:0.6}}>No transactions yet.</div>}
                {transactions.map(t => (
                  <div key={t.id} className="tx-row" style={{display:'grid', gridTemplateColumns:'100px 80px 1fr 1fr', gap:'0.75rem', padding:'0.5rem 0', borderBottom:'1px solid #1f2937'}}>
                    <div style={{fontVariantNumeric:'tabular-nums'}}>{new Date(t.createdAt).toLocaleDateString()}</div>
                    <div style={{color: t.type==='INCOME'? '#16a34a': '#dc2626'}}>{t.type}</div>
                    <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{t.description || '-'}</div>
                    <div style={{textAlign:'right', fontWeight:600}}>{t.type==='EXPENSE'? '-' : ''}${t.amount}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel" style={{minWidth:0}}>
              <h3>Add Transaction</h3>
              <form onSubmit={submitTx} className="tx-form" style={{display:'grid', gap:'0.5rem'}}>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <input name="amount" value={form.amount} onChange={updateField} placeholder="Amount" type="number" step="0.01" required style={{flex:1}} />
                  <select name="type" value={form.type} onChange={updateField} style={{width:140}}>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <input name="description" value={form.description} onChange={updateField} placeholder="Description" />
                <input name="category" value={form.category} onChange={updateField} placeholder="Category" />
                {formError && <div style={{color:'#dc2626', fontSize:'0.75rem'}}>{formError}</div>}
                <button type="submit" className="primary-btn" style={{justifySelf:'start'}}>Add</button>
              </form>
            </div>
          </div>
          </>
        )}
      </main>
    </div>
  );
}
