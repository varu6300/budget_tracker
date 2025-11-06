import React from "react";
// You can replace this with a real line chart using recharts or chart.js
const FinancialTrendChart = () => (
  <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e0e7ef", padding: 24, marginBottom: 24 }}>
    <div style={{ fontWeight: 700, marginBottom: 16 }}>Monthly Financial Trend</div>
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
      {/* Placeholder for line chart */}
      <span>[Line Chart Here]</span>
    </div>
    <div style={{ marginTop: 8, fontSize: 14, color: '#f59e42', fontWeight: 600 }}>
      Your expenses dropped by 8% compared to last month.
    </div>
  </div>
);
export default FinancialTrendChart;
