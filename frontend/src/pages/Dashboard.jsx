import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { api } from '../services/api.js';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency.js';

const Dashboard = () => {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, transactionsRes, budgetsRes] = await Promise.all([
        api.get('/api/user/summary').catch(() => ({ data: { balance: 0, totalIncome: 0, totalExpenses: 0 } })),
        api.get('/api/transactions?page=0&size=5').catch(() => ({ data: { content: [] } })),
        api.get('/api/budgets').catch(() => ({ data: [] }))
      ]);

      setSummary({
        balance: summaryRes.data.balance || 0,
        income: summaryRes.data.totalIncome || 0,
        expenses: summaryRes.data.totalExpenses || 0
      });
      setRecentTransactions(transactionsRes.data.content || []);
      setBudgets(budgetsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1400 }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '28px',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '12px', fontWeight: 500 }}>💰 Current Balance</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatCurrency(summary.balance)}</div>
            </div>
            <div style={{
              position: 'absolute',
              right: -20,
              bottom: -20,
              fontSize: '6rem',
              opacity: 0.1
            }}>💰</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '16px',
            padding: '28px',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '12px', fontWeight: 500 }}>📈 Total Income</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatCurrency(summary.income)}</div>
            </div>
            <div style={{
              position: 'absolute',
              right: -20,
              bottom: -20,
              fontSize: '6rem',
              opacity: 0.1
            }}>📈</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '16px',
            padding: '28px',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '12px', fontWeight: 500 }}>📉 Total Expenses</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{formatCurrency(summary.expenses)}</div>
            </div>
            <div style={{
              position: 'absolute',
              right: -20,
              bottom: -20,
              fontSize: '6rem',
              opacity: 0.1
            }}>📉</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Recent Transactions */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Recent Transactions</h3>
              <Link to="/transactions" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                View All →
              </Link>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading...</div>
            ) : recentTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                No transactions yet. Start adding your income and expenses!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentTransactions.map(tx => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: tx.type === 'INCOME' ? '#dcfce7' : '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {tx.type === 'INCOME' ? '📥' : '📤'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{tx.description || tx.category || 'Transaction'}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          {new Date(tx.createdAt).toLocaleDateString()} • {tx.category}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: tx.type === 'INCOME' ? '#10b981' : '#ef4444'
                    }}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget Summary */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Budget Status</h3>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Manage</div>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading...</div>
            ) : budgets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                No budgets set. Create your first budget!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {budgets.slice(0, 4).map(budget => {
                  const spent = parseFloat(budget.spent) || 0;
                  const amt = parseFloat(budget.amount) || 0;
                  const percentage = amt > 0 ? ((spent / amt) * 100).toFixed(0) : 0;
                  const isOver = amt > 0 ? spent > amt : false;

                  return (
                    <div key={budget.id} style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{budget.category}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isOver ? '#ef4444' : '#10b981' }}>
                          {percentage}%
                        </div>
                      </div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
                        {formatCurrency(spent)} of {formatCurrency(amt)}
                      </div>
                      <div style={{ background: '#e5e7eb', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(percentage, 100)}%`,
                          height: '100%',
                          background: isOver ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #10b981, #059669)',
                          borderRadius: '8px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
