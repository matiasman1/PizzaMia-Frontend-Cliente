import { getUserById, actualizarCliente, obtenerPedidosPorClienteAuth0 } from './clientApi';
import { useClienteStore } from '../store/clienteStore';
import { ClienteApi } from '../types/typesClient';

/**
 * Utilidades para coordinar entre la API y el store del cliente
 * Estas funciones manejan tanto la llamada a la API como la actualización del store
 */

// Cargar cliente por Auth0 ID y actualizar el store
export const cargarClientePorAuth0YActualizarStore = async (
    auth0Id: string,
    token: string
): Promise<ClienteApi> => {
    try {
        console.log('Cargando cliente por Auth0 ID:', auth0Id);
        
        // Obtener el store
        const { setCliente, setLoading, setError } = useClienteStore.getState();
        
        setLoading(true);
        setError(null);
        
        // Llamar a la API
        const clienteData = await getUserById({ auth0Id }, token);
        
        // Actualizar el store (esto también aplicará el filtro de domicilios activos)
        setCliente(clienteData);
        
        setLoading(false);
        
        return clienteData;
    } catch (error) {
        console.error('Error al cargar cliente por Auth0:', error);
        
        const { setError, setLoading } = useClienteStore.getState();
        setError(error instanceof Error ? error.message : 'Error al cargar datos del cliente');
        setLoading(false);
        
        throw error;
    }
};

// Actualizar cliente y actualizar el store
export const actualizarClienteYActualizarStore = async (
    auth0Id: string,
    datosCliente: any,
    token: string
): Promise<ClienteApi> => {
    try {
        console.log('Actualizando cliente:', auth0Id, datosCliente);
        
        // Obtener el store
        const { setCliente, setLoading, setError } = useClienteStore.getState();
        
        setLoading(true);
        setError(null);
        
        // Llamar a la API
        const clienteActualizado = await actualizarCliente(auth0Id, datosCliente, token);
        
        // Actualizar el store
        setCliente(clienteActualizado);
        
        setLoading(false);
        
        return clienteActualizado;
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        
        const { setError, setLoading } = useClienteStore.getState();
        setError(error instanceof Error ? error.message : 'Error al actualizar datos');
        setLoading(false);
        
        throw error;
    }
};

// Cargar pedidos del cliente y actualizar el store
export const cargarPedidosClienteYActualizarStore = async (
    auth0Id: string,
    token: string
): Promise<void> => {
    try {
        console.log('Cargando pedidos para cliente Auth0:', auth0Id);
        
        // Obtener el store
        const { setPedidos, setLoadingPedidos, setError } = useClienteStore.getState();
        
        setLoadingPedidos(true);
        setError(null);
        
        // Llamar a la API
        const pedidos = await obtenerPedidosPorClienteAuth0(auth0Id, token);
        
        // Actualizar el store
        setPedidos(pedidos);
        
        setLoadingPedidos(false);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        
        const { setError, setLoadingPedidos } = useClienteStore.getState();
        setError(error instanceof Error ? error.message : 'Error al cargar pedidos');
        setLoadingPedidos(false);
        
        throw error;
    }
};