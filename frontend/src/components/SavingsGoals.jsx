import React, { useState, useEffect } from 'react';
import {
  getSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addAmountToGoal,
} from '../services/api';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
  const [editGoalId, setEditGoalId] = useState(null);
  const [editGoal, setEditGoal] = useState({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (err) {
      setError('Failed to fetch savings goals.');
    }
    setLoading(false);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const added = await addSavingsGoal({
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount) || 0,
        targetDate: newGoal.targetDate,
      });
      setGoals([...goals, added]);
      setNewGoal({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
      setSuccess('Goal added successfully!');
    } catch (err) {
      setError('Failed to add goal.');
    }
    setLoading(false);
  };

  const handleEditGoal = (goal) => {
    setEditGoalId(goal.id);
    setEditGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate,
    });
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await updateSavingsGoal(editGoalId, {
        name: editGoal.name,
        targetAmount: Number(editGoal.targetAmount),
        currentAmount: Number(editGoal.currentAmount),
        targetDate: editGoal.targetDate,
      });
      setGoals(goals.map((g) => (g.id === editGoalId ? updated : g)));
      setEditGoalId(null);
      setSuccess('Goal updated successfully!');
    } catch (err) {
      setError('Failed to update goal.');
    }
    setLoading(false);
  };

  const handleDeleteGoal = async (id) => {
    setLoading(true);
    setError('');
    try {
      await deleteSavingsGoal(id);
      setGoals(goals.filter((g) => g.id !== id));
      setSuccess('Goal deleted successfully!');
    } catch (err) {
      setError('Failed to delete goal.');
    }
    setLoading(false);
  };

  const handleAddAmount = async (id, amount) => {
    setLoading(true);
    setError('');
    try {
      const updated = await addAmountToGoal(id, Number(amount));
      setGoals(goals.map((g) => (g.id === id ? updated : g)));
      setSuccess('Amount added successfully!');
    } catch (err) {
      setError('Failed to add amount.');
    }
    setLoading(false);
  };

  const daysLeft = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="card goals-card">
      <h3>Savings Goals</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="info-alert">
        <span role="img" aria-label="info" className="info-icon">💡</span>
        <b>How Savings Goals Work</b><br />
        <span>
          Money added to your savings goals is <b className="highlight">frozen (locked 🔒)</b> and deducted from your available balance. This ensures you stay committed to your financial targets and don't accidentally spend your savings!
        </span>
      </div>
      <form onSubmit={editGoalId ? handleUpdateGoal : handleAddGoal} className="goal-form">
        <input
          type="text"
          placeholder="Goal Name"
          value={editGoalId ? editGoal.name : newGoal.name}
          onChange={(e) =>
            editGoalId
              ? setEditGoal({ ...editGoal, name: e.target.value })
              : setNewGoal({ ...newGoal, name: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Target Amount"
          value={editGoalId ? editGoal.targetAmount : newGoal.targetAmount}
          onChange={(e) =>
            editGoalId
              ? setEditGoal({ ...editGoal, targetAmount: e.target.value })
              : setNewGoal({ ...newGoal, targetAmount: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Current Amount"
          value={editGoalId ? editGoal.currentAmount : newGoal.currentAmount}
          onChange={(e) =>
            editGoalId
              ? setEditGoal({ ...editGoal, currentAmount: e.target.value })
              : setNewGoal({ ...newGoal, currentAmount: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Target Date"
          value={editGoalId ? editGoal.targetDate : newGoal.targetDate}
          onChange={(e) =>
            editGoalId
              ? setEditGoal({ ...editGoal, targetDate: e.target.value })
              : setNewGoal({ ...newGoal, targetDate: e.target.value })
          }
          required
        />
        <button type="submit" disabled={loading}>
          {editGoalId ? 'Update Goal' : 'Add Goal'}
        </button>
        {editGoalId && (
          <button type="button" onClick={() => setEditGoalId(null)}>
            Cancel
          </button>
        )}
      </form>
      <div className="goals-list">
        {goals.length === 0 && <div>No savings goals yet.</div>}
        {goals.map((goal) => {
          const percent = Math.min(
            100,
            goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
          );
          return (
            <div key={goal.id} className="goal-item">
              <div className="goal-header">
                <span className="goal-name">{goal.name}</span>
                <span className="goal-amount">
                  ${goal.currentAmount} / ${goal.targetAmount}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${percent}%` }}></div>
              </div>
              <div className="goal-details">
                <div className="goal-date">
                  Target Date: <b>{goal.targetDate}</b> ({daysLeft(goal.targetDate)} days left)
                </div>
                <div className="goal-status" style={{ background: percent < 100 ? '#fef3c7' : '#d1fae5', color: percent < 100 ? '#b45309' : '#065f46' }}>
                  {percent < 100
                    ? `You are ${percent < 50 ? 'behind' : 'on'} schedule. Consider increasing your savings rate to meet your goal.`
                    : "Congratulations! You've met your savings goal."}
                </div>
              </div>
              <div className="goal-actions">
                <button onClick={() => handleEditGoal(goal)} disabled={loading}>Edit</button>
                <button onClick={() => handleDeleteGoal(goal.id)} disabled={loading}>Delete</button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const amount = e.target.elements.amount.value;
                    handleAddAmount(goal.id, amount);
                    e.target.reset();
                  }}
                  className="add-amount-form"
                >
                  <input type="number" name="amount" placeholder="Add Amount" min="1" required />
                  <button type="submit" disabled={loading}>Add</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsGoals;
