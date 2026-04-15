import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ChevronUp, ChevronDown, Trash2, Edit2 } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  const [sortBy, setSortBy] = useState('date');

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return b.amount - a.amount;
    return 0;
  });

  return (
    <div className="card p-6 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 pb-3">
                Description
              </th>
              <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 pb-3">
                Category
              </th>
              <th className="text-right text-xs font-semibold text-gray-700 dark:text-gray-300 pb-3">
                Amount
              </th>
              <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 pb-3">
                Date
              </th>
              <th className="text-right text-xs font-semibold text-gray-700 dark:text-gray-300 pb-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{transaction.category?.icon || '💰'}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                  {transaction.category?.name}
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {transaction.type === 'income' ? (
                      <ChevronUp className="w-4 h-4 text-success" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-danger" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'text-success'
                          : 'text-danger'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-danger transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No transactions yet. Start by adding your first transaction!
        </div>
      )}
    </div>
  );
}
