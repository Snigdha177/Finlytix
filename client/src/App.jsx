import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import './index.css';

function ProtectedRoute({ children, isAuthenticated, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary via-secondary to-purple-900">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const { user, token, getCurrentUser, loading: authLoading } = useAuth();
  const { fetchTransactions, fetchCategories, fetchBudgets, fetchNotifications } = useData();

  useEffect(() => {
    // Check if user is logged in on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      getCurrentUser();
    }
  }, []);

  useEffect(() => {
    // Fetch data when user is authenticated
    if (user && token) {
      fetchTransactions();
      fetchCategories();
      fetchBudgets();
      fetchNotifications();
    }
  }, [user, token]);

  const isAuthenticated = !!user && !!token;

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={authLoading}
            >
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={authLoading}
            >
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={authLoading}
            >
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={authLoading}
            >
              <BudgetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={authLoading}
            >
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={authLoading}
            >
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
