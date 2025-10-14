import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Income from './pages/Income.jsx';
import Expenses from './pages/Expenses.jsx';
import Transactions from './pages/Transactions.jsx';
import Cards from './pages/Cards.jsx';
import BankAccounts from './pages/BankAccounts.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';
import Landing from './pages/Landing.jsx';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
  <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
  <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
  <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
  <Route path="/bank-accounts" element={<ProtectedRoute><BankAccounts /></ProtectedRoute>} />
  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<div style={{padding:40}}>Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}
