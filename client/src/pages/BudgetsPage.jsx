import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../hooks/useData';
import { formatCurrency, formatMonth } from '../utils/helpers';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const { budgets, categories, createBudget, updateBudget, deleteBudget, transactions } = useData();
  const [formData, setFormData] = useState({ category: '', limit: '', month: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBudget(editingId, formData);
        toast.success('Budget updated!');
      } else {
        await createBudget(formData);
        toast.success('Budget created!');
      }
      setFormData({ category: '', limit: '', month: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category._id,
      limit: budget.limit,
      month: budget.month,
    });
    setEditingId(budget._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteBudget(id);
        toast.success('Budget deleted!');
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

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

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Budget
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter((c) => c.type === 'expense')
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="label">Limit Amount</label>
                  <input
                    type="number"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    placeholder="0.00"
                    className="input-field"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="label">Month</label>
                  <input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ category: '', limit: '', month: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const spent = getSpentAmount(budget);
            const percentage = Math.min(100, (spent / budget.limit) * 100);
            const remaining = Math.max(0, budget.limit - spent);
            const isWarning = percentage >= 80;
            const isExceeded = percentage >= 100;

            return (
              <div
                key={budget._id}
                className={`card p-6 border-l-4 ${
                  isExceeded
                    ? 'border-l-danger'
                    : isWarning
                    ? 'border-l-warning'
                    : 'border-l-success'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{budget.category.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {budget.category.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatMonth(budget.month)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-2 text-primary hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="p-2 text-danger hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all ${
                        isExceeded
                          ? 'bg-danger'
                          : isWarning
                          ? 'bg-warning'
                          : 'bg-success'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(spent)} of {formatCurrency(budget.limit)}
                    </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {remaining > 0
                    ? `${formatCurrency(remaining)} remaining`
                    : `${formatCurrency(Math.abs(remaining))} over budget`}
                </p>
              </div>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="mb-4">No budgets created yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create your first budget
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
