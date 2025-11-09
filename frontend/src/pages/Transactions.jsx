import React, { useEffect, useState } from 'react';
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
    const raw = typeof editDraft.amount === 'string' ? editDraft.amount.trim().replace(',', '.') : editDraft.amount;
    const parsed = raw ? parseFloat(raw) : undefined;
    const payload = { ...editDraft, amount: parsed };
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
      const raw = typeof form.amount === 'string' ? form.amount.trim().replace(',', '.') : form.amount;
      const amt = raw ? parseFloat(raw) : 0;
      const payload = {
        amount: amt,
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
              <td style={{...styles.td, color:t.type==='INCOME'?'#22c55e':'#ef4444'}}>{t.type}</td>
              <td style={styles.td}>{formatCurrency(t.amount)}</td>
              <td style={styles.td}>{t.category}</td>
              <td style={styles.td}>{t.description}</td>
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
    return (
      <form onSubmit={submitTx} style={styles.card}>
        <h3 style={{marginTop:0, color:'#a4508b'}}>Add Transaction</h3>
        {formError && <div style={{color:'#ef4444', marginBottom:'1rem'}}>{formError}</div>}
        <label style={styles.label}>Amount</label>
        {/* Use text input with decimal inputMode so users can type freely (no native spinner),
            but still accept numbers. We normalize commas to dots before parsing. */}
        <input
          type="text"
          inputMode="decimal"
          name="amount"
          value={form.amount}
          onChange={updateField}
          onFocus={(e) => {
            // If the input has a legacy 0.00 value, clear it so the user can type immediately
            if (e.target.value === '0.00') {
              setForm(f => ({ ...f, amount: '' }));
            }
          }}
          autoComplete="off"
          autoFocus={true}
          style={styles.input}
          required
          placeholder="0.00"
          pattern="[0-9]*([.,][0-9]+)?"
        />
        <label style={styles.label}>Type</label>
        <select name="type" value={form.type} onChange={updateField} style={styles.input}>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <label style={styles.label}>Category</label>
        <input name="category" value={form.category} onChange={updateField} style={styles.input} list="category-list"/>
        <datalist id="category-list">
          {categories.map(c => <option key={c} value={c}/>)}
        </datalist>
        <label style={styles.label}>Description</label>
        <input name="description" value={form.description} onChange={updateField} style={styles.input}/>
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
