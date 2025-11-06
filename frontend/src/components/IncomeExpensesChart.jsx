import React from "react";
// You can replace this with a real chart using recharts or chart.js
const IncomeExpensesChart = () => (
  <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e0e7ef", padding: 24, marginBottom: 24 }}>
    <div style={{ fontWeight: 700, marginBottom: 16 }}>Income vs Expenses</div>
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
      {/* Placeholder for bar chart */}
      <span>[Bar Chart Here]</span>
    </div>
    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
      <button style={{ background: "#f5f7fa", border: "none", borderRadius: 8, padding: "4px 16px", fontWeight: 600 }}>Last 3 months</button>
      <button style={{ background: "#f5f7fa", border: "none", borderRadius: 8, padding: "4px 16px", fontWeight: 600 }}>Last 6 months</button>
      <button style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, padding: "4px 16px", fontWeight: 600 }}>This Year</button>
    </div>
  </div>
);
export default IncomeExpensesChart;
