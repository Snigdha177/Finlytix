import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TransactionChart({ data }) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        30-Day Income vs Expense
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(30, 41, 59)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, '']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
