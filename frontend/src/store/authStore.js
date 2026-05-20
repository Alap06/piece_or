import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.login(credentials);
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.message || 'Erreur de connexion',
          };
        }
      },

      logout: async () => {
        try {
          if (get().isAuthenticated) {
            await authAPI.logout();
          }
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        if (!get().accessToken) return;
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);

export default useAuthStore;
