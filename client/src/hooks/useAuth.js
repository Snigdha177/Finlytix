import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    loading,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
  } = useAuthStore();

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
  };
};
