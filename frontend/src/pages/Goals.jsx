import React, { useState } from "react";
import SavingsGoals from "../components/SavingsGoals.jsx";
import BudgetManager from "../components/BudgetManager.jsx";
import { NavIcon, IconGoals } from "../components/Icons.jsx";
import HeaderCard from "../components/HeaderCard.jsx";
import Layout from "../components/Layout.jsx";

const Goals = () => {
  const [activeTab, setActiveTab] = useState("budget");

  return (
    <Layout>
      <div style={{ maxWidth: 1200 }}>
        {/* Full header card to match Income/Budget pages */}
    <HeaderCard title="Budget & Savings" subtitle="Manage monthly budgets and your savings goals" rightLabel="Overview" rightValue={""} bg={'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'} icon={IconGoals} iconSize={32} />
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <button
            onClick={() => setActiveTab("budget")}
            style={{
              background: activeTab === "budget" ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : '#eef2ff',
              color: activeTab === "budget" ? '#fff' : '#1e3a8a',
              fontWeight: '700',
              fontSize: '1.05rem',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 28px',
              cursor: 'pointer',
              boxShadow: activeTab === "budget" ? '0 6px 18px rgba(99,102,241,0.18)' : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            <span style={{display:'inline-flex', alignItems:'center'}}><NavIcon><IconGoals/></NavIcon>Budget</span>
          </button>
          <button
            onClick={() => setActiveTab("savings")}
            style={{
              background: activeTab === "savings" ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : '#eef2ff',
              color: activeTab === "savings" ? '#fff' : '#1e3a8a',
              fontWeight: '700',
              fontSize: '1.05rem',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 28px',
              cursor: 'pointer',
              boxShadow: activeTab === "savings" ? '0 6px 18px rgba(99,102,241,0.18)' : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            <span style={{display:'inline-flex', alignItems:'center'}}><NavIcon><IconGoals/></NavIcon>Savings</span>
          </button>
        </div>

        <div>
          {activeTab === "budget" && (
            <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px #0001", padding: "32px", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "16px" }}>Monthly Budget Manager</h3>
              <BudgetManager />
            </div>
          )}

          {activeTab === "savings" && (
            <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px #0001", padding: "32px" }}>
              <SavingsGoals />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Goals;
