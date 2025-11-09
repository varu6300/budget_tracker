import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { api } from "../services/api.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import HeaderCard from "../components/HeaderCard.jsx";
import { IconGoals } from "../components/Icons.jsx";

const Budget = () => {
  const [month, setMonth] = useState("November");
  const [year, setYear] = useState("2025");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/budgets");
      setBudgets(res.data);
    } catch (err) {
      setError("Failed to fetch budgets.");
    }
    setLoading(false);
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    setLoading(true);
    setError("");
    try {
      const raw = typeof amount === 'string' ? amount.trim().replace(',', '.') : amount;
      const amt = raw ? parseFloat(raw) : 0;
      const res = await api.post("/api/budgets", { month, year, category, amount: amt });
      setBudgets([...budgets, res.data]);
      setCategory("");
      setAmount("");
    } catch (err) {
      setError("Failed to save budget.");
    }
    setLoading(false);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

  return (
    <Layout>
      <div style={{ maxWidth: 1200 }}>
        <HeaderCard title="📈 Budget & Savings" subtitle="Set financial limits and track spending against budgets" rightLabel="Total Budget" rightValue={formatCurrency(totalBudget)} bg={'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'} icon={IconGoals} iconSize={28} />
        
        <div style={{background:'#fff', borderRadius:'16px', padding:'28px', marginBottom:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <h3 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:'20px', color:'#1f2937'}}>➕ Create Budget</h3>
          {error && <div style={{padding:'12px', background:'#fee2e2', border:'1px solid #ef4444', borderRadius:'8px', color:'#991b1b', marginBottom:'16px'}}>{error}</div>}
          <form onSubmit={handleAddBudget} style={{display:'grid', gridTemplateColumns:'120px 100px 2fr 1fr auto', gap:'16px', alignItems:'end'}}>
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Month</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}}>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}} />
            </div>
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}}>
                <option value="">Select Category</option>
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
            <div>
              <label style={{display:'block', fontSize:'0.9rem', fontWeight:600, color:'#374151', marginBottom:'8px'}}>Amount</label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#6b7280'}}>₹</span>
                <input type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{width:'100%', padding:'12px', paddingLeft:'36px', borderRadius:'8px', border:'1.5px solid #e5e7eb', fontSize:'1rem', background:'#f9fafb'}} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{padding:'12px 32px', background:'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color:'#fff', border:'none', borderRadius:'8px', fontWeight:600, fontSize:'1rem', cursor:'pointer', boxShadow:'0 6px 18px rgba(99,102,241,0.18)', opacity:loading?0.6:1}}>
              {loading ? 'Adding...' : 'Add Budget'}
            </button>
          </form>
        </div>

        <div style={{background:'#fff', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <h3 style={{fontSize:'1.2rem', fontWeight:700, marginBottom:'20px', color:'#1f2937'}}>📊 Budget Overview</h3>
          {budgets.length === 0 ? (
            <div style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>No budgets created yet. Set your first budget above!</div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              {budgets.map((b, idx) => {
                const spent = parseFloat(b.spent) || 0;
                const amt = parseFloat(b.amount) || 0;
                const percentage = amt > 0 ? ((spent / amt) * 100).toFixed(0) : 0;
                const isOver = amt > 0 ? spent > amt : false;
                const isNear = !isOver && percentage > 80;
                
                return (
                  <div key={b.id || idx} style={{padding:'20px', background:'#f9fafb', borderRadius:'12px', border:'1px solid #e5e7eb'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                      <div>
                        <div style={{fontWeight:700, fontSize:'1.1rem', color:'#374151'}}>{b.category}</div>
                        <div style={{fontSize:'0.85rem', color:'#6b7280', marginTop:'4px'}}>{b.month} {b.year}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'1.2rem', fontWeight:700, color: isOver ? '#ef4444' : isNear ? '#f59e0b' : '#10b981'}}>
                          {formatCurrency(spent)} / {formatCurrency(amt)}
                        </div>
                        <div style={{fontSize:'0.9rem', fontWeight:600, color: isOver ? '#ef4444' : isNear ? '#f59e0b' : '#10b981'}}>
                          {percentage}% {isOver ? '(Over Budget!)' : isNear ? '(Warning!)' : 'Used'}
                        </div>
                      </div>
                    </div>
                      <div style={{background:'#e5e7eb', borderRadius:'8px', height:'12px', overflow:'hidden'}}>
                      <div style={{width:`${Math.min(percentage, 100)}%`, height:'100%', background: isOver ? 'linear-gradient(90deg, #ef4444, #dc2626)' : isNear ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #10b981, #059669)', borderRadius:'8px', transition:'width 0.3s'}} />
                    </div>
                    {isOver && (
                      <div style={{marginTop:'12px', padding:'10px', background:'#fee2e2', borderRadius:'8px', color:'#991b1b', fontSize:'0.9rem', fontWeight:500}}>
                        ⚠️ You have exceeded your budget by {formatCurrency(spent - amt)}
                      </div>
                    )}
                    {isNear && !isOver && (
                      <div style={{marginTop:'12px', padding:'10px', background:'#fef3c7', borderRadius:'8px', color:'#92400e', fontSize:'0.9rem', fontWeight:500}}>
                        ⚡ Approaching budget limit. {formatCurrency(amt - spent)} remaining
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Budget;
