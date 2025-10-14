import React, { useEffect, useState } from 'react';
import { IconDashboard, IconTransactions, IconCards, IconBank, IconBell, IconSettings, NavIcon } from '../components/Icons.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { getTransactionHistory, getCategories, updateTransaction, deleteTransaction, createTransaction } from '../services/transactions.js';

export default function TransactionsPage(){
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ amount:'', type:'INCOME', description:'', category:'' });
  const [form, setForm] = useState({ amount:'', type:'INCOME', description:'', category:'' });
  const [formError, setFormError] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(()=>{
    let ignore = false;
    async function boot(){
      const cats = await getCategories().catch(()=>[]);
      if(!ignore) setCategories(cats);
      load(0);
    }
    boot();
    return ()=>{ignore=true};
  }, []);

  async function load(p=0){
    setTxLoading(true);
    try{
      const data = await getTransactionHistory({ page:p, size, type: typeFilter || undefined, category: categoryFilter || undefined });
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || p);
    } finally { setTxLoading(false); }
  }

  function startEdit(t){
    setEditingId(t.id);
    setEditDraft({ amount: String(t.amount), type: t.type, description: t.description || '', category: t.category || '' });
  }
  function cancelEdit(){ setEditingId(null); }
  async function saveEdit(id){
    const payload = { ...editDraft, amount: editDraft.amount ? parseFloat(editDraft.amount) : undefined };
    const updated = await updateTransaction(id, payload);
    setTransactions(ts => ts.map(t => t.id === id ? updated : t));
    setEditingId(null);
  }
  async function removeTx(id){ await deleteTransaction(id); setTransactions(ts => ts.filter(t=>t.id!==id)); }

  function updateField(e){ const { name, value } = e.target; setForm(f=> ({ ...f, [name]: value })); }
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
      if(!payload.amount || payload.amount <=0){ setFormError('Amount must be > 0'); return; }
      await createTransaction(payload);
      // If a new category was typed, add it to the categories state so it appears in filter dropdown
      if(payload.category && !categories.includes(payload.category)){
        setCategories(cs => [...cs, payload.category].sort((a,b)=>a.localeCompare(b)));
      }
      setForm({ amount:'', type: form.type, description:'', category:'' });
      load(0);
    } catch(e){ setFormError(e?.response?.data?.error || 'Failed to add'); }
  }

  function handleLogout(){ logout(); }

  return (
    <div className="dashboard-layout">
      <header className="topbar header-blue">
        <div className="logo">Transactions</div>
        <div className="spacer" />
        <nav className="profile-menu">
          <Link to="/profile" className="ml-link" style={{color:'#4a2e05'}}>Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <div className="dashboard-body" style={{gridTemplateColumns:'220px 1fr'}}>
        <aside className="sidebar-left">
          <div style={{fontWeight:700, padding:'6px 10px'}}>Menu</div>
          <Link to="/dashboard"><NavIcon><IconDashboard /></NavIcon>Dashboard</Link>
          <Link to="/transactions"><NavIcon><IconTransactions /></NavIcon>Transactions</Link>
          <Link to="/cards"><NavIcon><IconCards /></NavIcon>Cards</Link>
          <Link to="/bank-accounts"><NavIcon><IconBank /></NavIcon>Bank Accounts</Link>
          <Link to="/notifications"><NavIcon><IconBell /></NavIcon>Notifications</Link>
          <Link to="/settings"><NavIcon><IconSettings /></NavIcon>Settings</Link>
        </aside>
        <main className="main-center">

        <div className="panel-grid">
          <div className="panel" style={{minWidth:0}}>
            <h3 style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              Transactions
              <span style={{fontSize:'0.75rem', fontWeight:400}}>{txLoading? 'Loading...' : ''}</span>
            </h3>
            <div style={{display:'flex', gap:'0.5rem', marginBottom:'0.75rem', flexWrap:'wrap'}}>
              <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={()=>load(0)} className="ml-btn outline-dark" style={{padding:'6px 10px'}}>Apply</button>
            </div>
            <div className="tx-list" style={{maxHeight:360, overflowY:'auto'}}>
              {transactions.length === 0 && <div style={{opacity:0.6}}>No transactions found.</div>}
              {transactions.map(t => (
                <div key={t.id} className="tx-row" style={{display:'grid', gridTemplateColumns:'110px 90px 1fr 1fr 120px', gap:'0.5rem', padding:'0.5rem 0', borderBottom:'1px solid #e5e7eb'}}>
                  <div style={{fontVariantNumeric:'tabular-nums'}}>{new Date(t.createdAt).toLocaleDateString()}</div>
                  <div style={{color: t.type==='INCOME'? '#16a34a': '#dc2626'}}>{t.type}</div>
                  {editingId === t.id ? (
                    <>
                      <input value={editDraft.description} onChange={e=>setEditDraft(d=>({...d, description:e.target.value}))} />
                      <div style={{display:'flex', gap:'0.5rem'}}>
                        <input style={{width:110}} value={editDraft.amount} onChange={e=>setEditDraft(d=>({...d, amount:e.target.value}))} />
                        <select value={editDraft.type} onChange={e=>setEditDraft(d=>({...d, type:e.target.value}))}>
                          <option value="INCOME">INCOME</option>
                          <option value="EXPENSE">EXPENSE</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{t.description || '-'}</div>
                      <div style={{textAlign:'right', fontWeight:600}}>{t.type==='EXPENSE'? '-' : ''}${t.amount}</div>
                    </>
                  )}
                  <div style={{display:'flex', gap:'0.5rem', justifyContent:'flex-end'}}>
                    {editingId === t.id ? (
                      <>
                        <button onClick={()=>saveEdit(t.id)} className="ml-btn" style={{padding:'6px 10px'}}>Save</button>
                        <button onClick={cancelEdit} className="ml-btn outline-dark" style={{padding:'6px 10px'}}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={()=>startEdit(t)} className="ml-btn outline-dark" style={{padding:'6px 10px'}}>Edit</button>
                        <button onClick={()=>removeTx(t.id)} className="ml-btn" style={{padding:'6px 10px', background:'#ef4444'}}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.5rem'}}>
              <div>Page {page+1} / {Math.max(totalPages, 1)}</div>
              <div style={{display:'flex', gap:'0.5rem'}}>
                <button disabled={page<=0} onClick={()=>load(page-1)} className="ml-btn outline-dark" style={{padding:'6px 10px'}}>Prev</button>
                <button disabled={page+1>=totalPages} onClick={()=>load(page+1)} className="ml-btn outline-dark" style={{padding:'6px 10px'}}>Next</button>
              </div>
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
        </main>
      </div>
    </div>
  );
}
