import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClienteApi, DomicilioApi } from '../types/typesClient';
import { obtenerClientePorId } from '../api/clientApi';

// Agregar estas funciones al interface ClienteState:
interface ClienteState {
  cliente: ClienteApi | null;
  loading: boolean;
  error: string | null;
  domicilioSeleccionado: DomicilioApi | null;
  pedidos: PedidoVentaResponse[];
  loadingPedidos: boolean;

  // Acciones para actualizar estado
  setCliente: (cliente: ClienteApi | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPedidos: (pedidos: PedidoVentaResponse[]) => void;
  setLoadingPedidos: (loading: boolean) => void;
  seleccionarDomicilio: (domicilioId: number) => void;
  obtenerDomicilioActual: () => DomicilioApi | null;
  obtenerNombreCompleto: () => string;
  obtenerSaludo: () => string;
  obtenerDireccionFormateada: () => string;
  limpiarDatos: () => void;
  
  // Función original que debe mantenerse
  cargarCliente: (id: number) => Promise<void>;
}

export const useClienteStore = create<ClienteState>()(
  persist(
    (set, get) => ({
      cliente: null,
      loading: false,
      error: null,
      domicilioSeleccionado: null,
      pedidos: [],
      loadingPedidos: false,
      
      // FUNCIÓN ORIGINAL - Cargar datos del cliente por ID interno (mantener)
      cargarCliente: async (id: number) => {
        try {
          set({ loading: true, error: null });
          const clienteData = await obtenerClientePorId(id);
          
          // Filtrar solo domicilios activos
          const domiciliosActivos = clienteData.domicilios?.filter((d: DomicilioApi) => d.isActive !== false) || [];
          
          // Si el cliente tiene domicilios activos, seleccionar el primero por defecto
          const domicilioPorDefecto = domiciliosActivos.length > 0 
            ? domiciliosActivos[0] 
            : null;
          
          set({
            cliente: {
              ...clienteData,
              domicilios: domiciliosActivos
            },
            domicilioSeleccionado: domicilioPorDefecto,
            loading: false
          });
        } catch (error) {
          console.error('Error al cargar el cliente:', error);
          set({
            error: error instanceof Error ? error.message : 'Error al cargar datos del cliente',
            loading: false
          });
        }
      },

      // NUEVAS FUNCIONES - Solo funciones para actualizar estado
      setCliente: (cliente: ClienteApi | null) => {
        if (cliente) {
          // Filtrar domicilios activos al establecer el cliente
          const domiciliosActivos = cliente.domicilios?.filter((d: DomicilioApi) => d.isActive !== false) || [];
          
          // Seleccionar el primer domicilio activo por defecto
          const domicilioPorDefecto = domiciliosActivos.length > 0 ? domiciliosActivos[0] : null;
          
          set({
            cliente: {
              ...cliente,
              domicilios: domiciliosActivos
            },
            domicilioSeleccionado: domicilioPorDefecto,
            error: null
          });
        } else {
          set({ cliente: null, domicilioSeleccionado: null });
        }
      },
      
      setLoading: (loading: boolean) => set({ loading }),
      
      setError: (error: string | null) => set({ error }),
      
      setPedidos: (pedidos: PedidoVentaResponse[]) => set({ pedidos }),
      
      setLoadingPedidos: (loading: boolean) => set({ loadingPedidos: loading }),
      
      // ...resto de funciones existentes...
      seleccionarDomicilio: (domicilioId: number) => {
        const { cliente } = get();
        if (!cliente || !cliente.domicilios) return;
        
        const domicilio = cliente.domicilios.find(d => d.id === domicilioId);
        if (domicilio) {
          set({ domicilioSeleccionado: domicilio });
        }
      },
      
      obtenerDomicilioActual: () => {
        return get().domicilioSeleccionado;
      },
      
      obtenerNombreCompleto: () => {
        const { cliente } = get();
        if (!cliente) return 'Usuario';
        return `${cliente.nombre} ${cliente.apellido}`;
      },
      
      obtenerSaludo: () => {
        const { cliente } = get();
        if (!cliente) return '¡Hola!';
        
        const hora = new Date().getHours();
        let saludo;
        
        if (hora < 12) {
          saludo = '¡buenos días!';
        } else if (hora < 18) {
          saludo = '¡buenas tardes!';
        } else {
          saludo = '¡buenas noches!';
        }
        
        return `Hola ${cliente.nombre}, ${saludo}`;
      },
      
      obtenerDireccionFormateada: () => {
        const domicilio = get().domicilioSeleccionado;
        if (!domicilio) return "Sin dirección de entrega";
        
        return `${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad.nombre} (CP: ${domicilio.codigoPostal})`;
      },

      limpiarDatos: () => {
        set({
          cliente: null,
          domicilioSeleccionado: null,
          pedidos: [],
          error: null,
          loading: false,
          loadingPedidos: false
        });
      }
    }),
    {
      name: 'pizza-mia-cliente',
    }
  )
);