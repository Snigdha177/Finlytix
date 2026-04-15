import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const data = await authAPI.register({ name, email, password, confirmPassword: password });
      localStorage.setItem('token', data.data.token);
      set({ user: data.data.user, token: data.data.token });
      return data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.data.token);
      set({ user: data.data.user, token: data.data.token });
      return data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      const data = await authAPI.getCurrentUser();
      set({ user: data.data.user });
      return data;
    } catch (error) {
      set({ token: null, user: null });
      localStorage.removeItem('token');
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const data = await authAPI.updateProfile(profileData);
      set({ user: data.data.user });
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
