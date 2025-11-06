import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { api } from '../services/api.js';

const Analytics = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch transaction data and process for analytics (Spring returns Page object)
      const response = await api.get('/api/transactions?page=0&size=1000');
      const transactions = response.data.content || [];
      processAnalytics(transactions);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (transactions) => {
    // Process monthly comparisons
    const monthMap = {};
    const categoryMap = {};

    transactions.forEach(tx => {
      const date = new Date(tx.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { income: 0, expenses: 0 };
      }

      if (tx.type === 'INCOME') {
        monthMap[monthKey].income += tx.amount;
      } else {
        monthMap[monthKey].expenses += tx.amount;
        
        // Category breakdown
        const category = tx.category || 'Uncategorized';
        categoryMap[category] = (categoryMap[category] || 0) + tx.amount;
      }
    });

    const months = Object.keys(monthMap).sort().slice(-6);
    setMonthlyData(months.map(month => ({
      month,
      ...monthMap[month]
    })));

    setCategoryData(Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount
    })).sort((a, b) => b.amount - a.amount));
  };

  const maxMonthly = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)), 1);
  const totalCategoryExpenses = categoryData.reduce((sum, c) => sum + c.amount, 0);

  return (
    <Layout>
      <div style={{ maxWidth: 1400 }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, marginBottom: '8px' }}>
            📊 Financial Analytics
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
            Comprehensive insights into your spending patterns and financial trends
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            Loading analytics...
          </div>
        ) : (
          <>
            {/* Monthly Spending Comparisons */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', color: '#1f2937' }}>
                📈 Monthly Income vs Expenses (Last 6 Months)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                {monthlyData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No data available. Start adding transactions to see trends!
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', minHeight: '300px', padding: '0 16px' }}>
                    {monthlyData.map(({ month, income, expenses }) => (
                      <div key={month} style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'flex-end', justifyContent: 'center', height: '240px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>
                              ${income.toFixed(0)}
                            </div>
                            <div style={{
                              width: '100%',
                              height: `${(income / maxMonthly) * 200}px`,
                              background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                              borderRadius: '8px 8px 0 0',
                              minHeight: '8px',
                              transition: 'height 0.3s'
                            }} />
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px' }}>Income</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>
                              ${expenses.toFixed(0)}
                            </div>
                            <div style={{
                              width: '100%',
                              height: `${(expenses / maxMonthly) * 200}px`,
                              background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                              borderRadius: '8px 8px 0 0',
                              minHeight: '8px',
                              transition: 'height 0.3s'
                            }} />
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px' }}>Expenses</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                          {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category-wise Breakdown */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', color: '#1f2937' }}>
                🎯 Category-wise Spending Breakdown
              </h3>
              {categoryData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No expense data available yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {categoryData.map(({ category, amount }, index) => {
                    const percentage = ((amount / totalCategoryExpenses) * 100).toFixed(1);
                    const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'];
                    const color = colors[index % colors.length];

                    return (
                      <div key={category} style={{
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ fontWeight: 600, fontSize: '1rem', color: '#374151' }}>{category}</div>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{percentage}%</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: color }}>${amount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div style={{ background: '#e5e7eb', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                            borderRadius: '8px',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Insights Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>Total Categories</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{categoryData.length}</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>Avg Monthly Expenses</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  ${monthlyData.length > 0 ? (monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length).toFixed(0) : '0'}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>Avg Monthly Income</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  ${monthlyData.length > 0 ? (monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length).toFixed(0) : '0'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
