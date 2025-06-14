// Añadir a store/stockStore.ts
import { create } from 'zustand';
import { verificarDisponibilidadManufacturado } from '../api/clientApi';
import { InsumoApi } from '../types/typesClient';

interface StockState {
  disponibilidadCache: Record<string, boolean>;
  lastUpdated: Record<string, number>;
  
  verificarDisponibilidad: (itemId: number, esManufacturado: boolean, insumo?: InsumoApi) => Promise<boolean>;
  invalidarCache: () => void;
}

// Tiempo de vida del caché en milisegundos (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;

export const useStockStore = create<StockState>((set, get) => ({
  disponibilidadCache: {},
  lastUpdated: {},
  
  verificarDisponibilidad: async (itemId: number, esManufacturado: boolean, insumo?: InsumoApi) => {
    const cacheKey = `${esManufacturado ? 'm' : 'i'}-${itemId}`;
    const now = Date.now();
    const lastUpdate = get().lastUpdated[cacheKey] || 0;
    
    // Si tenemos un valor en caché y no ha expirado, usarlo
    if (
      cacheKey in get().disponibilidadCache && 
      now - lastUpdate < CACHE_TTL
    ) {
      return get().disponibilidadCache[cacheKey];
    }
    
    let disponible = false;
    
    // Si es un insumo y tenemos los datos, verificar directamente
    if (!esManufacturado && insumo) {
      disponible = insumo.stockActual > 0;
    } 
    // Si es manufacturado, consultar al backend
    else if (esManufacturado) {
      disponible = await verificarDisponibilidadManufacturado(itemId);
    }
    
    // Actualizar caché
    set(state => ({
      disponibilidadCache: {
        ...state.disponibilidadCache,
        [cacheKey]: disponible
      },
      lastUpdated: {
        ...state.lastUpdated,
        [cacheKey]: now
      }
    }));
    
    return disponible;
  },
  
  invalidarCache: () => {
    set({ disponibilidadCache: {}, lastUpdated: {} });
  }
}));