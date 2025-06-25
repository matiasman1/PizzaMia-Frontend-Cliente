import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClienteApi, DomicilioApi } from '../types/typesClient';
import { obtenerClientePorId, actualizarCliente, obtenerPedidosPorClienteAuth0 } from '../api/clientApi';
import { PedidoVentaResponse } from '../types/typesClient';

interface ClienteState {
  cliente: ClienteApi | null;
  loading: boolean;
  error: string | null;
  domicilioSeleccionado: DomicilioApi | null;
  pedidos: PedidoVentaResponse[];
  loadingPedidos: boolean;
  
  // Acciones existentes
  cargarCliente: (id: number) => Promise<void>;
  seleccionarDomicilio: (domicilioId: number) => void;
  obtenerDomicilioActual: () => DomicilioApi | null;
  obtenerNombreCompleto: () => string;
  obtenerSaludo: () => string;
  obtenerDireccionFormateada: () => string;
  
  // Nuevas acciones para la integración
  cargarClientePorAuth0: (auth0Id: string, token: string) => Promise<void>;
  actualizarDatosCliente: (datosCliente: any, token: string) => Promise<void>;
  cargarPedidosCliente: (auth0Id: string, token: string) => Promise<void>;
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
      
      // Función existente - cargar datos del cliente por ID interno
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

      // NUEVA - Cargar datos del cliente por Auth0 ID
      cargarClientePorAuth0: async (auth0Id: string, token: string) => {
        try {
          set({ loading: true, error: null });
          const clienteData = await obtenerClientePorId(parseInt(auth0Id));
          
          if (!clienteData) {
            throw new Error('Cliente no encontrado');
          }
          
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
          console.error('Error al cargar el cliente por Auth0:', error);
          set({
            error: error instanceof Error ? error.message : 'Error al cargar datos del cliente',
            loading: false
          });
        }
      },

      // NUEVA - Actualizar datos del cliente
      actualizarDatosCliente: async (datosCliente: any, token: string) => {
        try {
          set({ loading: true, error: null });
          
          // Actualizar en el servidor usando Auth0 ID
          const clienteActualizado = await actualizarCliente(
            datosCliente.auth0Id,
            datosCliente,
            token
          );
          
          // Actualizar en el store
          set({
            cliente: clienteActualizado,
            loading: false
          });
          
          return clienteActualizado;
        } catch (error) {
          console.error('Error al actualizar el cliente:', error);
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar datos',
            loading: false
          });
          throw error;
        }
      },

      // NUEVA - Cargar pedidos del cliente
      cargarPedidosCliente: async (auth0Id: string, token: string) => {
        try {
          set({ loadingPedidos: true, error: null });
          const pedidos = await obtenerPedidosPorClienteAuth0(auth0Id, token);
          set({
            pedidos,
            loadingPedidos: false
          });
        } catch (error) {
          console.error('Error al cargar pedidos:', error);
          set({
            error: error instanceof Error ? error.message : 'Error al cargar pedidos',
            loadingPedidos: false
          });
        }
      },
      
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

      // NUEVA - Limpiar datos del store
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