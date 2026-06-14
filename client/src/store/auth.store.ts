import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Based on your Backend Models (User & Role)
interface User {
  id: string;
  email: string;
  username: string;
  role_id: number; // 1 = Hunter, 2 = Leaser, 3 = Admin
  is_approved_leaser: boolean; // Vital for Realtor dashboard access
  profile_pic?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateApprovalStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Call this when your POST /auth/verify or login returns success
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),

      // Call this to clear local storage and state (triggers logout revoking on backend)
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      // Specifically for your "Leaser Approval" logic
      updateApprovalStatus: (status) => set((state) => ({
        user: state.user ? { ...state.user, is_approved_leaser: status } : null
      })),
    }),
    {
      name: 'maskani-auth-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);