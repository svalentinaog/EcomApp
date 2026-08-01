import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  rememberMe: boolean;
  setToken: (newToken: string, shouldRemember?: boolean) => void;
  setRememberMe: (shouldRemember: boolean) => void;
  logout: () => void;
}

const storage = {
  getItem: (name: string) => {
    const fromLocal = localStorage.getItem(name);
    const fromSession = sessionStorage.getItem(name);

    if (fromLocal) return fromLocal;
    return fromSession;
  },
  setItem: (name: string, value: string) => {
    const parsedValue = JSON.parse(value) as { state?: { rememberMe?: boolean } };
    const shouldPersistLocally = parsedValue.state?.rememberMe === true;

    if (shouldPersistLocally) {
      localStorage.setItem(name, value);
      sessionStorage.removeItem(name);
      return;
    }

    sessionStorage.setItem(name, value);
    localStorage.removeItem(name);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      rememberMe: false,

      setToken: (newToken: string, shouldRemember = false) =>
        set({ token: newToken, rememberMe: shouldRemember }),

      setRememberMe: (shouldRemember: boolean) =>
        set((state) => ({
          rememberMe: shouldRemember,
          token: state.token,
        })),

      logout: () => set({ token: null, rememberMe: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        token: state.token,
        rememberMe: state.rememberMe,
      }),
    }
  )
);