import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ArticuloManufacturadoApi, InsumoApi } from '../types/typesClient';

// Tipo para los items del carrito
export interface CartItem {
  id: number;
  denominacion: string;
  precioVenta: number;
  quantity: number;
  esManufacturado: boolean;
  imagen?: string;
  tiempoEstimadoProduccion?: number; // Solo para artículos manufacturados
  originalItem: ArticuloManufacturadoApi | InsumoApi; // Guardamos el objeto original completo para referencia
}

// Interfaz para el estado del carrito
interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  // Acciones
  addItem: (item: ArticuloManufacturadoApi | InsumoApi, esManufacturado: boolean) => void;
  // Modificar para recibir también el tipo del producto
  removeItem: (itemId: number, esManufacturado: boolean) => void;
  increaseQuantity: (itemId: number, esManufacturado: boolean) => void;
  decreaseQuantity: (itemId: number, esManufacturado: boolean) => void;
  clearCart: () => void;
  updateDeliveryFee: (fee: number) => void;
  calculateTotals: () => void;
}

// Crear store con persistencia
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      deliveryFee: 10, // Valor por defecto
      total: 0,
      
      // Añadir un item al carrito
      addItem: (item, esManufacturado) => {
        const currentItems = get().items;
        
        // Modificar la búsqueda para considerar tanto el ID como el tipo de producto
        const existingItemIndex = currentItems.findIndex(
          i => i.id === item.id && i.esManufacturado === esManufacturado
        );
        
        if (existingItemIndex !== -1) {
          // Si el item ya existe, incrementamos su cantidad
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;
          
          set({ items: updatedItems });
        } else {
          // Si es un nuevo item, lo añadimos al carrito
          const newItem: CartItem = {
            id: item.id,
            denominacion: item.denominacion,
            precioVenta: item.precioVenta,
            quantity: 1,
            esManufacturado,
            imagen: item.imagen?.urlImagen,
            originalItem: item,
          };
          
          // Si es un artículo manufacturado, añadimos el tiempo de preparación
          if (esManufacturado) {
            newItem.tiempoEstimadoProduccion = (item as ArticuloManufacturadoApi).tiempoEstimadoProduccion;
          }
          
          set({ items: [...currentItems, newItem] });
        }
        
        // Recalcular totales
        get().calculateTotals();
      },
      
      // Eliminar un item del carrito considerando tanto el ID como el tipo
      removeItem: (itemId, esManufacturado) => {
        set(state => ({
          items: state.items.filter(item => 
            // Filtrar por ID Y tipo del producto
            !(item.id === itemId && item.esManufacturado === esManufacturado)
          )
        }));
        
        // Recalcular totales
        get().calculateTotals();
      },
      
      // Aumentar la cantidad de un item
      increaseQuantity: (itemId, esManufacturado) => {
        set(state => ({
          items: state.items.map(item => 
            // Comprobar tanto ID como tipo
            (item.id === itemId && item.esManufacturado === esManufacturado)
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        }));
        
        // Recalcular totales
        get().calculateTotals();
      },
      
      // Disminuir la cantidad de un item
      decreaseQuantity: (itemId, esManufacturado) => {
        const item = get().items.find(item => 
          item.id === itemId && item.esManufacturado === esManufacturado
        );
        
        if (item && item.quantity > 1) {
          // Si hay más de 1, disminuimos la cantidad
          set(state => ({
            items: state.items.map(item => 
              (item.id === itemId && item.esManufacturado === esManufacturado)
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            )
          }));
        } else {
          // Si solo hay 1, eliminamos el item
          get().removeItem(itemId, esManufacturado);
        }
        
        // Recalcular totales
        get().calculateTotals();
      },
      
      // Vaciar completamente el carrito
      clearCart: () => {
        set({ 
          items: [],
          subtotal: 0,
          total: 0
        });
      },
      
      // Actualizar el costo de envío
      updateDeliveryFee: (fee) => {
        set({ deliveryFee: fee });
        get().calculateTotals();
      },
      
      // Calcular subtotal y total
      calculateTotals: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (total, item) => total + (item.precioVenta * item.quantity), 
          0
        );
        
        const total = subtotal + get().deliveryFee;
        
        set({ 
          subtotal,
          total
        });
      }
    }),
    {
      name: 'pizza-mia-cart', // Nombre para la persistencia en localStorage
    }
  )
);