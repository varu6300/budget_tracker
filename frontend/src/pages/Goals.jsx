import React, { useState } from "react";
import SavingsGoals from "../components/SavingsGoals.jsx";
import BudgetManager from "../components/BudgetManager.jsx";

const Sidebar = () => (
  <aside
    style={{
      width: "220px",
      background: "#2563eb",
      color: "#fff",
      minHeight: "100vh",
      padding: "32px 0",
    }}
  >
    <div
      style={{
        fontWeight: "bold",
        fontSize: "1.5rem",
        marginBottom: "32px",
        textAlign: "center",
      }}
    >
      Budget Tracker
    </div>
    <nav>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "24px 0" }}>
          <a
            href="/dashboard"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Dashboard
          </a>
        </li>
        <li style={{ margin: "24px 0" }}>
          <a
            href="/transactions"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Transactions
          </a>
        </li>
        <li style={{ margin: "24px 0" }}>
          <a
            href="/goals"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Goals
          </a>
        </li>
        <li style={{ margin: "24px 0" }}>
          <a
            href="/budget"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Budget
          </a>
        </li>
      </ul>
    </nav>
  </aside>
);

const TopBar = () => (
  <header
    style={{
      background: "#fff",
      padding: "16px 32px",
      boxShadow: "0 2px 8px #0001",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <nav style={{ display: "flex", gap: "32px" }}>
      <a
        href="/dashboard"
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Dashboard
      </a>
      <a
        href="/transactions"
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Transactions
      </a>
      <a
        href="/goals"
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Goals
      </a>
      <a
        href="/budget"
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Budget
      </a>
      <a
        href="/analytics"
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Analytics
      </a>
    </nav>
    <div style={{ color: "#2563eb", fontWeight: "bold" }}>Profile</div>
  </header>
);

const Goals = () => {
  const [activeTab, setActiveTab] = useState("budget");

  return (
    <div
      style={{
        display: "flex",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopBar />
        <main style={{ padding: "32px" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Budget & Savings
          </h2>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <button
              onClick={() => setActiveTab("budget")}
              style={{
                background: activeTab === "budget" ? "#2563eb" : "#e0e7ef",
                color: activeTab === "budget" ? "#fff" : "#2563eb",
                fontWeight: "bold",
                fontSize: "1.1rem",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                cursor: "pointer",
                boxShadow:
                  activeTab === "budget" ? "0 2px 8px #2563eb33" : "none",
                transition: "all 0.2s",
              }}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab("savings")}
              style={{
                background: activeTab === "savings" ? "#2563eb" : "#e0e7ef",
                color: activeTab === "savings" ? "#fff" : "#2563eb",
                fontWeight: "bold",
                fontSize: "1.1rem",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                cursor: "pointer",
                boxShadow:
                  activeTab === "savings" ? "0 2px 8px #2563eb33" : "none",
                transition: "all 0.2s",
              }}
            >
              Savings
            </button>
          </div>
          <div>
            {activeTab === "budget" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px #0001",
                  padding: "32px",
                  marginBottom: "32px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                >
                  Monthly Budget Manager
                </h3>
                <BudgetManager />
              </div>
            )}
            {activeTab === "savings" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px #0001",
                  padding: "32px",
                }}
              >
                <SavingsGoals />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Goals;
