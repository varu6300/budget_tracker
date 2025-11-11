import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { getTransactionHistory, getCategories, updateTransaction, deleteTransaction, createTransaction } from '../services/transactions.js';
import Layout from '../components/Layout.jsx';
import HeaderCard from '../components/HeaderCard.jsx';
import { IconTransactions } from '../components/Icons.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const styles = {
  main: {
    padding: '32px',
    background: 'linear-gradient(120deg, #f7f7fa 60%, #e9e4f0 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 24px #0002',
    padding: '2rem',
    maxWidth: '540px',
    width: '100%',
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px #0001',
    overflow: 'hidden',
  },
  th: {
    background: 'linear-gradient(90deg, #a4508b 0%, #7c2bc4 100%)',
    color: '#fff',
    fontWeight: 600,
    padding: '14px',
    fontSize: '1rem',
    borderBottom: '2px solid #f3f4f6',
  },
  td: {
    padding: '12px',
    fontSize: '1rem',
    borderBottom: '1px solid #f3f4f6',
    background: '#fff',
  },
  actionBtn: {
    background: '#7c2bc4',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 16px',
    fontWeight: 500,
    marginRight: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  actionBtnDelete: {
    background: '#ef4444',
  },
  formBtn: {
    background: 'linear-gradient(90deg, #a4508b 0%, #7c2bc4 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 32px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 2px 8px #0001',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '1rem',
    fontSize: '1rem',
    background: '#f7f7fa',
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontWeight: 500,
    marginBottom: '0.5rem',
    display: 'block',
    color: '#7c2bc4',
  },
};

// Use shared Layout instead of local Sidebar/TopBar for consistent UI

export default function TransactionsPage(){
  // Sidebar button style
  const sidebarBtn = {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 24px",
    margin: "0 24px",
    fontWeight: "500",
    fontSize: "1.1rem",
    color: "#222",
    textDecoration: "none",
    boxShadow: "0 2px 8px #0001",
    transition: "background 0.2s, box-shadow 0.2s"
  };
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
  const amountRef = useRef(null);
  const editInputRef = useRef(null);
  const LOCAL_KEY = 'budget_transactions_v1';

  function saveLocal(txArr){
    try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(txArr || [])); }catch(e){}
  }
  function loadLocal(){
    try{ const v = localStorage.getItem(LOCAL_KEY); return v ? JSON.parse(v) : []; }catch(e){ return []; }
  }

  // Attempt to sync locally-saved transactions to server. Runs on boot and periodically.
  async function syncLocalTransactions(){
    const all = loadLocal();
    if(!all || !all.length) return;
    const locals = all.filter(t => t && (t._local || (typeof t.id === 'string' && t.id.startsWith('local-'))));
    if(!locals.length) return;
    for(const l of locals){
      try{
        // Build payload expected by server
        const payload = { amount: Number(l.amount), type: l.type, description: l.description, category: l.category };
        const created = await createTransaction(payload);
        // Replace local entry in current transactions state and localStorage with server-created one
        setTransactions(prev => {
          const next = prev.map(p => (p.id === l.id ? created : p));
          // if local entry not present (rare), prepend
          if(!next.find(x => x && x.id === created.id)) next.unshift(created);
          saveLocal(next);
          return next;
        });
      }catch(err){
        // keep local entry and continue; we can retry later
        console.debug('syncLocalTransactions: failed to sync', l.id, err?.message || err);
      }
    }
  }

  useEffect(()=>{
    let ignore = false;
    async function boot(){
      // show cached transactions immediately, then load fresh from server
      const cached = loadLocal();
      if(!ignore && cached && cached.length) setTransactions(cached);
      const cats = await getCategories().catch(()=>[]);
      if(!ignore) setCategories(cats);
      await load(0);
      // try to sync any local transactions after loading server data
      syncLocalTransactions().catch(()=>{});
    }
    boot();
    return ()=>{ignore=true};
  }, []);

  // periodic sync (best-effort) every 30s
  useEffect(()=>{
    const id = setInterval(()=>{ syncLocalTransactions().catch(()=>{}); }, 30000);
    return ()=> clearInterval(id);
  }, []);

  async function load(p=0){
    setTxLoading(true);
    try{
      const data = await getTransactionHistory({ page:p, size, type: typeFilter || undefined, category: categoryFilter || undefined });
      const list = data.content || [];
      setTransactions(list);
      saveLocal(list);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || p);
    } catch(err){
      // fallback to local cache if network/server fails
      const cached = loadLocal();
      if(cached && cached.length) setTransactions(cached);
    } finally { setTxLoading(false); }
  }

  function startEdit(t){
    setEditingId(t.id);
    setEditDraft({ amount: String(t.amount), type: t.type, description: t.description || '', category: t.category || '' });
  }
  // Auto-focus the inline edit input when editingId changes
  useEffect(()=>{
    if(editingId && editInputRef.current){
      try{
        editInputRef.current.focus();
        // move caret to end
        const val = editInputRef.current.value || '';
        editInputRef.current.setSelectionRange(val.length, val.length);
      }catch(e){}
    }
  }, [editingId]);
  function updateEditField(e){ const { name, value } = e.target; setEditDraft(d=>({ ...d, [name]: value })); }
  function cancelEdit(){ setEditingId(null); }
  async function saveEdit(id){
    const raw = typeof editDraft.amount === 'string' ? editDraft.amount.trim().replace(',', '.') : editDraft.amount;
    const parsed = raw ? parseFloat(raw) : undefined;
    const payload = { ...editDraft, amount: parsed };
    const updated = await updateTransaction(id, payload);
    setTransactions(ts => ts.map(t => t.id === id ? updated : t));
    setEditingId(null);
  }
  async function removeTx(id){ await deleteTransaction(id); setTransactions(ts => ts.filter(t=>t.id!==id)); }

  function updateField(e){ const { name, value } = e.target; setForm(f=> ({ ...f, [name]: value })); }

  // Robust handler for amount input to allow multi-digit typing and keep decimals/commas
  function handleAmountChange(e){
    let v = e.target.value || '';
    // strip any non-digit, non-dot, non-comma characters (e.g., stray currency symbols)
    v = String(v).replace(/[^0-9.,]/g, '');
    // allow multiple digits; keep as entered so user can type freely
    setForm(f => ({ ...f, amount: v }));
  }
  async function submitTx(e){
    e.preventDefault();
    setFormError(null);
    try {
      const raw = typeof form.amount === 'string' ? form.amount.trim().replace(',', '.') : form.amount;
      const amt = raw ? parseFloat(raw) : 0;
      const payload = {
        amount: amt,
        type: form.type,
        description: form.description || null,
        category: form.category || null
      };
      if(!payload.amount || payload.amount <=0){ setFormError('Amount must be > 0'); return; }
      try{
        const created = await createTransaction(payload);
        // add to UI and cache
        setTransactions(prev => { const next = [created, ...prev]; saveLocal(next); return next; });
        if(payload.category && !categories.includes(payload.category)){
          setCategories(cs => [...cs, payload.category].sort((a,b)=>a.localeCompare(b)));
        }
      }catch(apiErr){
        // offline or server error: save locally so it persists across reloads
        const localTx = { id: 'local-' + Date.now(), amount: amt, type: payload.type, description: payload.description, category: payload.category, createdAt: new Date().toISOString(), _local:true };
        setTransactions(prev => { const next = [localTx, ...prev]; saveLocal(next); return next; });
        setFormError('Saved locally (offline). Will remain after reload.');
      }
      setForm({ amount:'', type: form.type, description:'', category:'' });
      // refresh server list in background (best-effort)
      load(0).catch(()=>{});
    } catch(e){ setFormError(e?.response?.data?.error || 'Failed to add'); }
  }

  function handleLogout(){ logout(); }

  // Transaction table UI
  function TransactionTable() {
    if (txLoading) return <div>Loading transactions...</div>;
    if (!transactions.length) return <div>No transactions found.</div>;
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td style={{...styles.td, color:t.type==='INCOME'?'#22c55e':'#ef4444'}}>
                {editingId === t.id ? (
                  <select name="type" value={editDraft.type} onChange={updateEditField} style={{...styles.input, padding:'8px'}}>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                ) : t.type}
              </td>
              <td style={styles.td} onDoubleClick={(e)=>{ if(editingId !== t.id) startEdit(t); }}>
                {editingId === t.id ? (
                  <input ref={editInputRef} name="amount" value={editDraft.amount} onChange={updateEditField} inputMode="decimal" style={{...styles.input, padding:'8px'}} />
                ) : formatCurrency(t.amount)}
              </td>
              <td style={styles.td}>
                {editingId === t.id ? (
                  <input name="category" value={editDraft.category} onChange={updateEditField} style={styles.input} />
                ) : t.category}
              </td>
              <td style={styles.td}>
                {editingId === t.id ? (
                  <input name="description" value={editDraft.description} onChange={updateEditField} style={styles.input} />
                ) : t.description}
              </td>
              <td style={styles.td}>
                {editingId === t.id ? (
                  <>
                    <button onClick={()=>saveEdit(t.id)} style={styles.actionBtn}>Save</button>
                    <button onClick={cancelEdit} style={styles.actionBtn}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>startEdit(t)} style={styles.actionBtn}>Edit</button>
                    <button onClick={()=>removeTx(t.id)} style={{...styles.actionBtn, ...styles.actionBtnDelete}}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Add transaction form UI
  function AddTransactionForm() {
    // amountRef is declared above in the parent component so we can programmatically
    // focus it if a click doesn't reach the input due to layout overlays.
    return (
      <form onSubmit={submitTx} style={styles.card}>
        <h3 style={{marginTop:0, color:'#a4508b'}}>Add Transaction</h3>
        {formError && <div style={{color:'#ef4444', marginBottom:'1rem'}}>{formError}</div>}
            <div style={{cursor:'text'}}>
              <label htmlFor="tx-amount" style={styles.label}>Amount</label>
          {/* Use text input with decimal inputMode so users can type freely (no native spinner),
              but still accept numbers. We normalize commas to dots before parsing. */}
          <input
            ref={amountRef}
            id="tx-amount"
            type="text"
            inputMode="decimal"
            name="amount"
                value={form.amount}
                onChange={handleAmountChange}
            onFocus={(e) => {
              // If the input has a legacy 0.00 value, clear it so the user can type immediately
              if (e.target.value === '0.00') {
                setForm(f => ({ ...f, amount: '' }));
              }
            }}
            autoComplete="off"
            style={styles.input}
            required
            placeholder="0.00"
            pattern="[0-9]*([.,][0-9]+)?"
          />
        </div>
        <label htmlFor="tx-type" style={styles.label}>Type</label>
        <select id="tx-type" name="type" value={form.type} onChange={updateField} style={styles.input}>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <label htmlFor="tx-category" style={styles.label}>Category</label>
        <input id="tx-category" name="category" value={form.category} onChange={updateField} style={styles.input} list="category-list" onFocus={(e)=>e.target.focus()} />
        <datalist id="category-list">
          {categories.map(c => <option key={c} value={c}/>) }
        </datalist>
        <label htmlFor="tx-description" style={styles.label}>Description</label>
        <input id="tx-description" name="description" value={form.description} onChange={updateField} style={styles.input} onFocus={(e)=>e.target.focus()} />
        <button type="submit" style={styles.formBtn}>Add</button>
      </form>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: 1100 }}>
        <HeaderCard title={"Transactions"} subtitle={"Add and manage transactions"} rightLabel={""} rightValue={""} bg={'linear-gradient(135deg, #a4508b 0%, #7c2bc4 100%)'} icon={IconTransactions} iconSize={28} />
        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px #0001", padding: "32px", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "16px" }}>Add Transaction</h3>
          <AddTransactionForm />
          <TransactionTable />
        </div>
      </div>
    </Layout>
  );
}
