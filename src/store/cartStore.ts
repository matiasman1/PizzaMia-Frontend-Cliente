import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ArticuloManufacturadoApi, InsumoApi, PromocionApi } from '../types/typesClient';

// Tipo para los items del carrito
export interface CartItem {
  id: number;
  denominacion: string;
  precioVenta: number;
  quantity: number;
  esManufacturado: boolean;
  esPromocion?: boolean; // Añadido para promociones
  imagen?: string;
  tiempoEstimadoProduccion?: number; // Solo para artículos manufacturados
  originalItem: ArticuloManufacturadoApi | InsumoApi | PromocionApi; // Actualizado para incluir promociones
}

// Interfaz para el estado del carrito
interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  // Acciones
  addItem: (item: ArticuloManufacturadoApi | InsumoApi | PromocionApi, esManufacturado: boolean, esPromocion?: boolean) => void;
  // Modificar para recibir también si es promoción
  removeItem: (itemId: number, esManufacturado: boolean, esPromocion?: boolean) => void;
  increaseQuantity: (itemId: number, esManufacturado: boolean, esPromocion?: boolean) => void;
  decreaseQuantity: (itemId: number, esManufacturado: boolean, esPromocion?: boolean) => void;
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
      addItem: (item, esManufacturado, esPromocion = false) => {
        const currentItems = get().items;
        
        // Modificar la búsqueda para considerar el ID, tipo de producto y si es promoción
        const existingItemIndex = currentItems.findIndex(
          i => i.id === item.id && 
               i.esManufacturado === esManufacturado && 
               (i.esPromocion || false) === esPromocion
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
            precioVenta: esPromocion ? (item as PromocionApi).precio : (item as InsumoApi).precioVenta,
            quantity: 1,
            esManufacturado,
            esPromocion,
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
      
      // Eliminar un item del carrito considerando ID, tipo y si es promoción
      removeItem: (itemId, esManufacturado, esPromocion = false) => {
        set(state => ({
          items: state.items.filter(item => 
            !(item.id === itemId && 
              item.esManufacturado === esManufacturado && 
              (item.esPromocion || false) === esPromocion)
          )
        }));
        
        // Recalcular totales
        get().calculateTotals();
      },
      
      // Aumentar la cantidad de un item
      increaseQuantity: (itemId, esManufacturado, esPromocion = false) => {
        set(state => ({
          items: state.items.map(item => 
            (item.id === itemId && 
             item.esManufacturado === esManufacturado && 
             (item.esPromocion || false) === esPromocion)
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        }));
        
        // Recalcular totales
        get().calculateTotals();
      },
      
      // Disminuir la cantidad de un item
      decreaseQuantity: (itemId, esManufacturado, esPromocion = false) => {
        const item = get().items.find(item => 
          item.id === itemId && 
          item.esManufacturado === esManufacturado && 
          (item.esPromocion || false) === esPromocion
        );
        
        if (item && item.quantity > 1) {
          // Si hay más de 1, disminuimos la cantidad
          set(state => ({
            items: state.items.map(item => 
              (item.id === itemId && 
               item.esManufacturado === esManufacturado && 
               (item.esPromocion || false) === esPromocion)
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            )
          }));
        } else {
          // Si solo hay 1, eliminamos el item
          get().removeItem(itemId, esManufacturado, esPromocion);
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