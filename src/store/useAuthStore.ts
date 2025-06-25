// authStore.ts
import { create } from "zustand";

interface AuthState {
  token: string | null;
  rol: string | null;
  setToken: (token: string | null) => void;
  setRol: (rol: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  rol: null,
  setToken: (token: string | null) => set({ token }),
  setRol: (rol: string | null) => set({ rol }),
}));
