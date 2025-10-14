import React, { useEffect, useMemo, useState } from 'react';
import { IconDashboard, IconTransactions, IconCards, IconBank, IconBell, IconSettings, NavIcon } from '../components/Icons.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { fetchTransactions, createTransaction, resetTransactions, getTransactionHistory, getCategories, updateTransaction, deleteTransaction } from '../services/transactions.js';
import PieChart from '../components/PieChart.jsx';

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
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ amount:'', type:'INCOME', description:'', category:'' });

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
    async function loadInitial(){
      try{
        setTxLoading(true);
        // fetch quick latest for initial view
        const latest = await fetchTransactions();
        if(!ignore) setTransactions(latest);
        const cats = await getCategories();
        if(!ignore) setCategories(cats);
      } finally { if(!ignore) setTxLoading(false); }
    }
    loadInitial();
    return ()=>{ignore=true};
  }, []);

  async function loadHistory(p=page){
    setTxLoading(true);
    try {
      const data = await getTransactionHistory({ page:p, size, type: typeFilter || undefined, category: categoryFilter || undefined });
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || p);
    } finally { setTxLoading(false); }
  }

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
      // Refresh current history page if filters applied, else prepend
      if(typeFilter || categoryFilter){
        loadHistory(0);
      } else {
        setTransactions(t=> [created, ...t].slice(0,10));
      }
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

  // Editing helpers
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
    // update summary locally naive
    setSummary(s => {
      if(!s) return s;
      const old = transactions.find(t=>t.id===id);
      if(!old) return s;
      let { currentBalance, totalIncome, totalExpenses } = s;
      // revert old
      if(old.type === 'INCOME'){ totalIncome -= Number(old.amount); currentBalance -= Number(old.amount); }
      else { totalExpenses -= Number(old.amount); currentBalance += Number(old.amount); }
      // apply new
      if(updated.type === 'INCOME'){ totalIncome += Number(updated.amount); currentBalance += Number(updated.amount); }
      else { totalExpenses += Number(updated.amount); currentBalance -= Number(updated.amount); }
      return { ...s, currentBalance, totalIncome, totalExpenses };
    });
  }
  async function removeTx(id){
    await deleteTransaction(id);
    setTransactions(ts => ts.filter(t=>t.id!==id));
    // Can't precisely adjust summary without fetching; keep as-is or trigger summary reload if needed.
  }

  function handleLogout(){
    logout();
    // redirect handled by ProtectedRoute on next render
  }

  return (
    <div className="dashboard-layout">
      {/* Blue header like sample */}
      <header className="topbar header-blue">
        <div className="logo">BudgetWise</div>
        <div className="spacer" />
        <nav className="profile-menu">
          <Link to="/profile" className="ml-link" style={{color:'#fff'}}>Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      {/* Body: left nav | center | right rail */}
      <div className="dashboard-body">
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
        {error && <div className="error" style={{marginBottom:16}}>{String(error)}</div>}
        {loading && <div>Loading summary...</div>}
        {!loading && error && <div className="error" style={{marginBottom:16}}>{String(error)}</div>}
        {!loading && !error && summary && (
          <>
            <h2 style={{marginTop:0}}>Project Expense Tracking Software</h2>
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
          </div>
          <div className="panel-grid">
            {/* Left panel - Latest Transactions (placeholder) */}
            <div className="panel" style={{minWidth:0}}>
              <h3>Latest Transactions</h3>
              <div className="placeholder-chart">Chart Placeholder</div>
            </div>
            {/* Right panel - Amount Transfer with rings */}
            <div className="panel" style={{minWidth:0}}>
              <h3>Amount Transfer</h3>
              <div className="ring-charts">
                <div className="ring-wrapper">
                  <div className="ring blue-ring" />
                  <div className="ring-value">${summary.totalIncome}</div>
                </div>
                <div className="ring-wrapper">
                  <div className="ring green-ring" />
                  <div className="ring-value">${summary.totalExpenses}</div>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
        </main>
        {/* Right rail summary like sample */}
        <aside className="right-rail">
          <div className="rr-user">
            <div className="rr-avatar">{user?.username?.charAt(0)?.toUpperCase()}</div>
            <div>
              <div style={{fontWeight:600}}>{user?.username}</div>
              <div style={{fontSize:12, color:'#64748b'}}>{user?.email || ''}</div>
            </div>
          </div>
          <div style={{fontWeight:700}}>Latest Transactions</div>
          <ul className="mini-list">
            {transactions.slice(0,3).map(t => (
              <li key={t.id}>
                <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{t.description || t.category || t.type}</span>
                <span className={t.type==='INCOME' ? 'amt-pos' : 'amt-neg'}>
                  {t.type==='INCOME' ? '+' : '-'}${t.amount}
                </span>
              </li>
            ))}
            {transactions.length===0 && <li><span>No recent items</span><span>—</span></li>}
          </ul>
        </aside>
      </div>
    </div>
  );
}
