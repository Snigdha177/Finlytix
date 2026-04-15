import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import TransactionChart from '../components/TransactionChart';
import CategoryChart from '../components/CategoryChart';
import RecentTransactions from '../components/RecentTransactions';
import BudgetOverview from '../components/BudgetOverview';
import { formatCurrency, calculateSummary, getChartData, getCategoryBreakdown } from '../utils/helpers';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions, budgets, categories, loading } = useData();
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    if (transactions.length > 0) {
      // Last 30 days transactions
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentTransactions = transactions.filter(
        (t) => new Date(t.date) >= thirtyDaysAgo
      );
      
      setSummary(calculateSummary(recentTransactions));
    }
  }, [transactions]);

  const chartData = getChartData(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const budgetAlerts = budgets.filter(
    (b) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category._id === b.category._id &&
            t.date.startsWith(b.month)
        )
        .reduce((sum, t) => sum + t.amount, 0);
      return spent > b.limit * 0.8;
    }
  );

  return (
    <Layout>
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your financial overview for the last 30 days
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid-cols-auto mb-8">
          <StatCard
            title="Income"
            amount={formatCurrency(summary.income, user?.currency || 'USD')}
            icon={<TrendingUp className="w-6 h-6" />}
            color="success"
            trend="+12.5%"
          />
          <StatCard
            title="Expense"
            amount={formatCurrency(summary.expense, user?.currency || 'USD')}
            icon={<TrendingDown className="w-6 h-6" />}
            color="danger"
            trend="-8.2%"
          />
          <StatCard
            title="Balance"
            amount={formatCurrency(summary.balance, user?.currency || 'USD')}
            icon={<DollarSign className="w-6 h-6" />}
            color="primary"
            trend={summary.balance >= 0 ? '+' : '-'}
          />
        </div>

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <div className="mb-8 p-4 bg-warning/10 border border-warning rounded-lg animate-slideIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning mb-1">Budget Alerts</h3>
                <p className="text-sm text-warning/80">
                  {budgetAlerts.length} of your budgets are approaching or exceeded their limits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TransactionChart data={chartData} />
          <CategoryChart data={categoryBreakdown} />
        </div>

        {/* Budget Overview */}
        <BudgetOverview budgets={budgets} transactions={transactions} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions.slice(0, 10)} />
      </div>
    </Layout>
  );
}
