import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#0ea5e9', '#f97316'];

export default function CategoryChart({ data }) {
  const chartData = data.slice(0, 8);

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Expense by Category
      </h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-300 flex items-center justify-center text-gray-500">
          No expense data available
        </div>
      )}
    </div>
  );
}
