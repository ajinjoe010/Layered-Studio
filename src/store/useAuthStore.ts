import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  role: 'user' | 'admin';
  measurements?: {
    height: number;
    weight: number;
    chest?: number;
    waist?: number;
    fitPreference?: 'Slim' | 'Regular' | 'Oversized';
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string, role?: 'user' | 'admin') => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  updateMeasurements: (measurements: User['measurements']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name, role = 'user') => set({ user: { email, name, role }, isAuthenticated: true }),
      signup: (email, name) => set({ user: { email, name, role: 'user' }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateMeasurements: (measurements) => set((state) => ({
        user: state.user ? { ...state.user, measurements } : null
      })),
    }),
    {
      name: 'vantage-auth-storage',
    }
  )
);
