import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../hooks/useData';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_TYPES = ['income', 'expense'];

export default function CategoriesPage() {
  const { categories, createCategory, updateCategory, deleteCategory } = useData();
  const [formData, setFormData] = useState({ name: '', type: 'expense', icon: '💰', color: '#6366f1' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success('Category updated!');
      } else {
        await createCategory(formData);
        toast.success('Category created!');
      }
      setFormData({ name: '', type: 'expense', icon: '💰', color: '#6366f1' });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setFormData(category);
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted!');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="💰"
                    className="input-field"
                    maxLength="2"
                  />
                </div>
                <div>
                  <label className="label">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
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
                    setFormData({ name: '', type: 'expense', icon: '💰', color: '#6366f1' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expense Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Expense Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((cat) => (
              <div
                key={cat._id}
                className="card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 text-primary hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-danger hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Income Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map((cat) => (
              <div
                key={cat._id}
                className="card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 text-primary hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-danger hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
