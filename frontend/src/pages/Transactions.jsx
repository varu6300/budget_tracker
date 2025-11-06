import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { getTransactionHistory, getCategories, updateTransaction, deleteTransaction, createTransaction } from '../services/transactions.js';

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

const Sidebar = () => (
  <aside style={{ width: "220px", background: "#2563eb", color: "#fff", minHeight: "100vh", padding: "32px 0" }}>
    <div style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "32px", textAlign: "center" }}>Budget Tracker</div>
    <nav>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "24px 0" }}><Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link></li>
        <li style={{ margin: "24px 0" }}><Link to="/transactions" style={{ color: "#fff", textDecoration: "none" }}>Transactions</Link></li>
        <li style={{ margin: "24px 0" }}><Link to="/goals" style={{ color: "#fff", textDecoration: "none" }}>Goals</Link></li>
        <li style={{ margin: "24px 0" }}><Link to="/budget" style={{ color: "#fff", textDecoration: "none" }}>Budget</Link></li>
      </ul>
    </nav>
  </aside>
);

const TopBar = () => (
  <header style={{ background: "#fff", padding: "16px 32px", boxShadow: "0 2px 8px #0001", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <nav style={{ display: "flex", gap: "32px" }}>
      <Link to="/dashboard" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>Dashboard</Link>
      <Link to="/transactions" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>Transactions</Link>
      <Link to="/goals" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>Goals</Link>
      <Link to="/budget" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>Budget</Link>
      <Link to="/analytics" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>Analytics</Link>
    </nav>
    <div style={{ color: "#2563eb", fontWeight: "bold" }}>Profile</div>
  </header>
);

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
              <td style={styles.td}>${t.amount}</td>
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
        <input type="number" name="amount" value={form.amount} onChange={updateField} style={styles.input} required min={0.01} step={0.01}/>
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
    <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopBar />
        <main style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}>Transactions</h2>
          <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px #0001", padding: "32px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "16px" }}>Add Transaction</h3>
            <AddTransactionForm />
            <TransactionTable />
          </div>
        </main>
      </div>
    </div>
  );
}
