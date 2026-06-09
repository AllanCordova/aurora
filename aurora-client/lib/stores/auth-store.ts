import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie";
import type { User } from "@/lib/schemas/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setSession: (user, token) => {
        setAuthCookie(token);
        set({ user, token });
      },
      clearSession: () => {
        clearAuthCookie();
        set({ user: null, token: null });
      },
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "aurora-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthCookie(state.token);
        }

        state?.setHydrated(true);
      },
    },
  ),
);
