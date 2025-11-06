import React from "react";
import Sidebar from "../components/Sidebar";
import IncomeExpensesChart from "../components/IncomeExpensesChart";
import SpendingPieChart from "../components/SpendingPieChart";

const FinancialTrendChart = () => (
  <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e0e7ef", padding: 24, marginBottom: 24 }}>
    <div style={{ fontWeight: 700, marginBottom: 16 }}>Monthly Financial Trend</div>
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
      [Line Chart Here]
    </div>
    <div style={{ color: '#f59e42', fontSize: 14, marginTop: 8 }}>Your expenses dropped by 8% compared to last month.</div>
  </div>
);

const BudgetActuals = () => (
  <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e0e7ef", padding: 24, marginBottom: 24 }}>
    <div style={{ fontWeight: 700, marginBottom: 16 }}>Budget vs Actuals</div>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600 }}>Dining <span style={{ float: 'right' }}>$300 Budgeted / $340 <span style={{ color: '#ef4444' }}>13% Over</span></span></div>
      <div style={{ background: '#ef4444', height: 8, borderRadius: 8, margin: '6px 0 12px 0', width: '100%' }}></div>
    </div>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600 }}>Utilities <span style={{ float: 'right' }}>$250 Budgeted / $240 96% On Track</span></div>
      <div style={{ background: '#6366f1', height: 8, borderRadius: 8, margin: '6px 0 12px 0', width: '96%' }}></div>
    </div>
    <div>
      <div style={{ fontWeight: 600 }}>Entertainment <span style={{ float: 'right' }}>$300 Budgeted / $190 63% Under</span></div>
      <div style={{ background: '#6366f1', height: 8, borderRadius: 8, margin: '6px 0 12px 0', width: '63%' }}></div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', background: '#f6f8fc', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '32px', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: 1 }}>Dashboard</h2>
          <input type="search" placeholder="Search..." style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ef', width: 240 }} />
        </div>
        <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
          <div style={{ flex: 2 }}>
            <IncomeExpensesChart />
          </div>
          <div style={{ flex: 1 }}>
            <SpendingPieChart />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 2 }}>
            <FinancialTrendChart />
          </div>
          <div style={{ flex: 1 }}>
            <BudgetActuals />
          </div>
        </div>
      </div>
    </div>
  );
}
