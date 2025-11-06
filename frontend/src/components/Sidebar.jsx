import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside style={{ width: 240, background: "#2563eb", minHeight: "100vh", padding: "32px 0", boxShadow: "2px 0 8px #e0e7ef" }}>
    <div style={{ fontWeight: "bold", fontSize: "1.6rem", marginBottom: 40, textAlign: "center", color: "#fff" }}>Budget Tracker</div>
    <nav>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ margin: "24px 0" }}><Link to="/dashboard" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Dashboard</Link></li>
        <li style={{ margin: "24px 0" }}><Link to="/transactions" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Transactions</Link></li>
        <li style={{ margin: "24px 0" }}><Link to="/goals" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Goals</Link></li>
        <li style={{ margin: "24px 0" }}><Link to="/budget" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Budget</Link></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
