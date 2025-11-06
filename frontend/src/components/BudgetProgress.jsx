import React, { useEffect, useState } from "react";
import axios from "axios";

const BudgetProgress = () => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    axios.get("/api/budgets").then((res) => {
      setBudgets(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Budgets & Savings Goals</h2>
      {budgets.map((budget) => (
        <div key={budget.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{budget.name}</h3>
          <div>
            <progress value={budget.currentAmount} max={budget.goalAmount}></progress>
            <span>
              {budget.currentAmount} / {budget.goalAmount}
            </span>
          </div>
          {budget.alertTriggered && (
            <div style={{ color: "red" }}>Alert: Budget goal reached!</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BudgetProgress;
