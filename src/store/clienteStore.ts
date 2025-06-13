import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClienteApi, DomicilioApi } from '../types/typesClient';
import { obtenerClientePorId } from '../api/clientApi';

interface ClienteState {
  cliente: ClienteApi | null;
  loading: boolean;
  error: string | null;
  domicilioSeleccionado: DomicilioApi | null;
  
  // Acciones
  cargarCliente: (id: number) => Promise<void>;
  seleccionarDomicilio: (domicilioId: number) => void;
  obtenerDomicilioActual: () => DomicilioApi | null;
  obtenerNombreCompleto: () => string;
  obtenerSaludo: () => string;
  obtenerDireccionFormateada: () => string;
}

export const useClienteStore = create<ClienteState>()(
  persist(
    (set, get) => ({
      cliente: null,
      loading: false,
      error: null,
      domicilioSeleccionado: null,
      
      // Cargar datos del cliente
      cargarCliente: async (id: number) => {
        try {
          set({ loading: true, error: null });
          const clienteData = await obtenerClientePorId(id);
          
          // Filtrar solo domicilios activos
          const domiciliosActivos = clienteData.domicilios?.filter(d => d.isActive) || [];
          
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
            error: error instanceof Error ? error.message : 'Error desconocido',
            loading: false
          });
        }
      },
      
      // Seleccionar un domicilio específico
      seleccionarDomicilio: (domicilioId: number) => {
        const { cliente } = get();
        if (!cliente || !cliente.domicilios) return;
        
        const domicilio = cliente.domicilios.find(d => d.id === domicilioId);
        if (domicilio) {
          set({ domicilioSeleccionado: domicilio });
        }
      },
      
      // Obtener el domicilio actualmente seleccionado
      obtenerDomicilioActual: () => {
        return get().domicilioSeleccionado;
      },
      
      // Obtener el nombre completo del cliente
      obtenerNombreCompleto: () => {
        const { cliente } = get();
        if (!cliente) return 'Usuario';
        return `${cliente.nombre} ${cliente.apellido}`;
      },
      
      // Obtener un saludo personalizado según la hora del día
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
      
      // Obtener la dirección formateada del domicilio seleccionado
      obtenerDireccionFormateada: () => {
        const domicilio = get().domicilioSeleccionado;
        if (!domicilio) return "Sin dirección de entrega";
        
        return `${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad.nombre} (CP: ${domicilio.codigoPostal})`;
      }
    }),
    {
      name: 'pizza-mia-cliente', // Nombre para la persistencia en localStorage
    }
  )
);