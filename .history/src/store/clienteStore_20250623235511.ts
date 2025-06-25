import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClienteApi, DomicilioApi, PedidoVentaResponse } from '../types/typesClient';

interface ClienteState {
  cliente: ClienteApi | null;
  loading: boolean;
  error: string | null;
  domicilioSeleccionado: DomicilioApi | null;
  pedidos: PedidoVentaResponse[];
  loadingPedidos: boolean;
  
  // Acciones solo para actualizar estado
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
      
      // Solo funciones para actualizar estado - SIN llamadas axios
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
      
      // Función existente - Seleccionar un domicilio específico
      seleccionarDomicilio: (domicilioId: number) => {
        const { cliente } = get();
        if (!cliente || !cliente.domicilios) return;
        
        const domicilio = cliente.domicilios.find(d => d.id === domicilioId);
        if (domicilio) {
          set({ domicilioSeleccionado: domicilio });
        }
      },
      
      // Función existente - Obtener el domicilio actualmente seleccionado
      obtenerDomicilioActual: () => {
        return get().domicilioSeleccionado;
      },
      
      // Función existente - Obtener el nombre completo del cliente
      obtenerNombreCompleto: () => {
        const { cliente } = get();
        if (!cliente) return 'Usuario';
        return `${cliente.nombre} ${cliente.apellido}`;
      },
      
      // Función existente - Obtener un saludo personalizado según la hora del día
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
      
      // Función existente - Obtener la dirección formateada del domicilio seleccionado
      obtenerDireccionFormateada: () => {
        const domicilio = get().domicilioSeleccionado;
        if (!domicilio) return "Sin dirección de entrega";
        
        return `${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad.nombre} (CP: ${domicilio.codigoPostal})`;
      },

      // Limpiar datos del store
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