import React from "react";
// You can replace this with a real pie chart using recharts or chart.js
const SpendingPieChart = () => (
  <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e0e7ef", padding: 24, marginBottom: 24 }}>
    <div style={{ fontWeight: 700, marginBottom: 16 }}>Where Your Money Went</div>
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
      {/* Placeholder for pie chart */}
      <span>[Pie Chart Here]</span>
    </div>
    <div style={{ marginTop: 16, fontSize: 15 }}>
      <div>Groceries <span style={{ float: 'right' }}>$420</span></div>
      <div>Dining <span style={{ float: 'right' }}>$340</span></div>
      <div>Transport <span style={{ float: 'right' }}>$185</span></div>
      <div>Utilities <span style={{ float: 'right' }}>$240</span></div>
      <div>Entertainment <span style={{ float: 'right' }}>$190</span></div>
      <div>Subscriptions <span style={{ float: 'right' }}>$150</span></div>
    </div>
  </div>
);
export default SpendingPieChart;
