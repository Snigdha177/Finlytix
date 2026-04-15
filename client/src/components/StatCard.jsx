import React from 'react';

export default function StatCard({ title, amount, icon, color, trend }) {
  const colorClass = {
    primary: 'bg-blue-50 dark:bg-blue-900/20 text-primary',
    success: 'bg-green-50 dark:bg-green-900/20 text-success',
    danger: 'bg-red-50 dark:bg-red-900/20 text-danger',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-warning',
  }[color];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{amount}</p>
      {trend && (
        <p className={`text-xs font-medium ${
          trend.startsWith('+') ? 'text-success' : 'text-danger'
        }`}>
          {trend} from last month
        </p>
      )}
    </div>
  );
}
