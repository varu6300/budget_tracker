import React from "react";
import { formatCurrency } from '../utils/formatCurrency.js';

const data = [
  { category: "Dining", budgeted: 300, spent: 340, percent: 113, status: "Over" },
  { category: "Utilities", budgeted: 250, spent: 240, percent: 96, status: "On Track" },
  { category: "Entertainment", budgeted: 300, spent: 190, percent: 63, status: "Under" },
];

const statusColor = (status) => {
  if (status === "Over") return "#ef4444";
  if (status === "On Track") return "#22c55e";
  return "#2563eb";
};

const BudgetActuals = () => (
  <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e0e7ef", padding: 24 }}>
    <div style={{ fontWeight: 700, marginBottom: 16 }}>Budget vs Actuals</div>
    {data.map((row) => (
      <div key={row.category} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 15 }}>
          <span>{row.category}</span>
          <span>{formatCurrency(row.budgeted)} <span style={{ color: '#bbb', fontWeight: 400 }}>/ {formatCurrency(row.spent)}</span> <span style={{ color: statusColor(row.status), fontWeight: 700 }}>{row.percent}%</span></span>
          <span style={{ color: statusColor(row.status), fontWeight: 700 }}>{row.status}</span>
        </div>
        <div style={{ background: "#e0e7ef", borderRadius: 8, height: 8, width: "100%", marginTop: 6, overflow: "hidden" }}>
          <div style={{ background: statusColor(row.status), width: `${row.percent}%`, height: "100%" }}></div>
        </div>
      </div>
    ))}
  </div>
);

export default BudgetActuals;
