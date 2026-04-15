import { create } from 'zustand';
import { transactionAPI, categoryAPI, budgetAPI, notificationAPI } from '../services/api';

export const useDataStore = create((set, get) => ({
  // Transactions
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,

  fetchTransactions: async (params) => {
    set({ transactionsLoading: true });
    try {
      const data = await transactionAPI.getAll(params);
      set({ transactions: data.data.transactions });
    } catch (error) {
      set({ transactionsError: error.message });
    } finally {
      set({ transactionsLoading: false });
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const data = await transactionAPI.create(transactionData);
      await get().fetchTransactions();
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateTransaction: async (id, transactionData) => {
    try {
      const data = await transactionAPI.update(id, transactionData);
      await get().fetchTransactions();
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await transactionAPI.delete(id);
      await get().fetchTransactions();
    } catch (error) {
      throw error;
    }
  },

  // Categories
  categories: [],
  categoriesLoading: false,

  fetchCategories: async (params) => {
    set({ categoriesLoading: true });
    try {
      const data = await categoryAPI.getAll(params);
      set({ categories: data.data.categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      set({ categoriesLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    try {
      const data = await categoryAPI.create(categoryData);
      await get().fetchCategories();
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const data = await categoryAPI.update(id, categoryData);
      await get().fetchCategories();
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await categoryAPI.delete(id);
      await get().fetchCategories();
    } catch (error) {
      throw error;
    }
  },

  // Budgets
  budgets: [],
  budgetsLoading: false,

  fetchBudgets: async (params) => {
    set({ budgetsLoading: true });
    try {
      const data = await budgetAPI.getAll(params);
      set({ budgets: data.data.budgets });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      set({ budgetsLoading: false });
    }
  },

  createBudget: async (budgetData) => {
    try {
      const data = await budgetAPI.create(budgetData);
      await get().fetchBudgets({ month: budgetData.month });
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateBudget: async (id, budgetData) => {
    try {
      const data = await budgetAPI.update(id, budgetData);
      await get().fetchBudgets();
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteBudget: async (id) => {
    try {
      await budgetAPI.delete(id);
      await get().fetchBudgets();
    } catch (error) {
      throw error;
    }
  },

  // Notifications
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const data = await notificationAPI.getAll({ limit: 50 });
      set({
        notifications: data.data.notifications,
        unreadCount: data.data.notifications.filter((n) => !n.read).length,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      await get().fetchNotifications();
    } catch (error) {
      throw error;
    }
  },
}));
