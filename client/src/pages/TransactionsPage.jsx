import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useData } from '../hooks/useData';
import TransactionModal from '../components/TransactionModal';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Plus, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const { transactions, categories, createTransaction, deleteTransaction } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category._id === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleAddTransaction = async (formData) => {
    try {
      setLoading(true);
      await createTransaction(formData);
      toast.success('Transaction added successfully!');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        toast.success('Transaction deleted!');
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map((t) => [
      formatDate(t.date),
      t.description,
      t.category.name,
      t.type,
      t.amount,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    toast.success('Transactions exported to CSV!');
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <div className="flex gap-2">
            <button onClick={exportToCSV} className="btn-secondary flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {t.category.icon} {t.category.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-semibold ${
                          t.type === 'income' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-primary hover:text-purple-700">Edit</button>
                      <button onClick={() => handleDelete(t._id)} className="text-danger hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No transactions found
            </div>
          )}
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
          categories={categories}
        />
      </div>
    </Layout>
  );
}
