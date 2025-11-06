import React, { useState, useEffect } from "react";
import { api } from "../services/api";

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
      const res = await api.post("/api/budgets", { month, year, category, amount });
      setBudgets([...budgets, res.data]);
      setCategory("");
      setAmount("");
    } catch (err) {
      setError("Failed to save budget.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "32px" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}>Budget & Savings</h2>
      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px #0001", padding: "32px", marginBottom: "32px", maxWidth: "700px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "16px" }}>Monthly Budget Manager</h3>
        <form onSubmit={handleAddBudget} style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "center" }}>
          <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #e0e7ef" }}>
            {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: "90px", padding: "8px", borderRadius: "6px", border: "1px solid #e0e7ef" }} />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #e0e7ef" }}>
            <option value="">Select Category</option>
            <option value="Groceries">Groceries</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" style={{ width: "120px", padding: "8px", borderRadius: "6px", border: "1px solid #e0e7ef" }} />
          <button type="submit" style={{ background: "#2563eb", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px", padding: "8px 24px", cursor: "pointer" }} disabled={loading}>Add Budget</button>
        </form>
        {error && <div style={{ color: "#ef4444", marginBottom: "16px" }}>{error}</div>}
        {budgets.length === 0 ? (
          <div style={{ color: "#666", marginTop: "24px" }}>No budgets set for this month. Add one above to get started.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
            <thead>
              <tr style={{ background: "#e0e7ef" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Month</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Year</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Category</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b, idx) => (
                <tr key={b.id || idx}>
                  <td style={{ padding: "8px" }}>{b.month}</td>
                  <td style={{ padding: "8px" }}>{b.year}</td>
                  <td style={{ padding: "8px" }}>{b.category}</td>
                  <td style={{ padding: "8px" }}>{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Budget;
