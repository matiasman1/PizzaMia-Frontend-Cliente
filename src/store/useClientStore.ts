import { create } from 'zustand';
import { ClienteApi } from '../types/typesClient';

interface ClientState {
  cliente: ClienteApi | null;
  isLoading: boolean;
  error: string | null;
  setCliente: (cliente: ClienteApi | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  cliente: null,
  isLoading: false,
  error: null,
  setCliente: (cliente) => set({ cliente }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));