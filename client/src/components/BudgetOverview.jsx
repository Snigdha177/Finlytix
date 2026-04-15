import React from 'react';
import { formatCurrency } from '../utils/helpers';
import { AlertCircle } from 'lucide-react';

export default function BudgetOverview({ budgets, transactions }) {
  const getSpentAmount = (budget) => {
    return transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category._id === budget.category._id &&
          t.date.startsWith(budget.month)
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'danger', color: 'bg-danger', text: 'Exceeded' };
    if (percentage >= 80) return { status: 'warning', color: 'bg-warning', text: 'Warning' };
    if (percentage >= 50) return { status: 'info', color: 'bg-info', text: 'On Track' };
    return { status: 'success', color: 'bg-success', text: 'Good' };
  };

  return (
    <div className="card p-6 mb-8 animate-slideIn">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Budget Overview</h2>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = getSpentAmount(budget);
          const remaining = Math.max(0, budget.limit - spent);
          const percentage = Math.min(100, (spent / budget.limit) * 100);
          const budgetStatus = getBudgetStatus(spent, budget.limit);

          return (
            <div key={budget._id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{budget.category?.icon || '💰'}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {budget.category?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Budget for {new Date(budget.month + '-01').toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  budgetStatus.status === 'danger'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : budgetStatus.status === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                  {budgetStatus.status === 'danger' && <AlertCircle className="w-3 h-3" />}
                  {budgetStatus.text}
                </div>
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${budgetStatus.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(spent)} of {formatCurrency(budget.limit)} spent
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(remaining)} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No budgets created yet. Create your first budget to track your spending!
        </div>
      )}
    </div>
  );
}
