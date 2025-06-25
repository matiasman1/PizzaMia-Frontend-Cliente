import axios from 'axios';
import { ArticuloManufacturadoApi, InsumoApi, RubroApi, PedidoVentaRequest, PedidoVentaResponse, ClienteApi } from '../types/typesClient';

// Configuración de axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interfaces y tipos (mantener los existentes del archivo)
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// Importar tipos desde el archivo de tipos
import { 
    ClienteApi, 
    PedidoVentaResponse, 
    InsumoApi, 
    RubroApi,
    ArticuloApi,
    ArticuloManufacturadoApi
} from '../types/typesClient';

// ==================== FUNCIONES AXIOS PARA EL CLIENTE ====================

// Obtener cliente por ID interno
export const obtenerClientePorId = async (id: number): Promise<ClienteApi> => {
    try {
        console.log("Obteniendo cliente por ID:", id);
        const response = await apiClient.get(`/clientes/${id}`);
        
        if (!response.data) {
            throw new Error('Cliente no encontrado');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al obtener cliente');
        }
        throw error;
    }
};

// Obtener cliente por Auth0 ID
export const getUserById = async (
    data: { auth0Id: string }, 
    token: string
): Promise<ClienteApi> => {
    try {
        console.log("Obteniendo cliente por Auth0 ID:", data.auth0Id);
        
        const response = await axios.post(
            `${API_BASE_URL}/clientes/getUserById`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log('=== DEBUG getUserById DESDE API ===');
        console.log('URL llamada:', `${API_BASE_URL}/clientes/getUserById`);
        console.log('Data enviada:', data);
        console.log('Response completa:', response.data);
        console.log('¿Tiene domicilios?:', response.data?.domicilios);
        console.log('Cantidad de domicilios:', response.data?.domicilios?.length);
        if (response.data?.domicilios) {
            response.data.domicilios.forEach((domicilio: any, index: number) => {
                console.log(`Domicilio ${index + 1}:`, {
                    id: domicilio.id,
                    calle: domicilio.calle,
                    numero: domicilio.numero,
                    isActive: domicilio.isActive
                });
            });
        }
        console.log('=== FIN DEBUG ===');

        if (!response.data || response.data === false) {
            throw new Error('Cliente no encontrado');
        }

        return response.data;
    } catch (error) {
        console.error('Error al obtener cliente por Auth0 ID:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al obtener cliente');
        }
        throw error;
    }
};

// Actualizar cliente
export const actualizarCliente = async (
    auth0Id: string,
    datosCliente: any,
    token: string
): Promise<ClienteApi> => {
    try {
        console.log("Actualizando cliente:", auth0Id, datosCliente);
        
        const response = await axios.put(
            `${API_BASE_URL}/clientes/updateByAuth0Id/${auth0Id}`,
            datosCliente,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.data) {
            throw new Error('Error al actualizar cliente');
        }

        return response.data;
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al actualizar cliente');
        }
        throw error;
    }
};

// Obtener pedidos por cliente Auth0
export const obtenerPedidosPorClienteAuth0 = async (
    auth0Id: string,
    token: string
): Promise<PedidoVentaResponse[]> => {
    try {
        console.log("Obteniendo pedidos para cliente Auth0:", auth0Id);
        
        const response = await axios.get(
            `${API_BASE_URL}/pedidos/auth0/${auth0Id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data || [];
    } catch (error) {
        console.error('Error al obtener pedidos por cliente Auth0:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al obtener pedidos');
        }
        throw error;
    }
};

// Función para login
export const postLogin = async (userData: any, token: string): Promise<ClienteApi> => {
    try {
        console.log("Realizando login:", userData);
        
        const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error en login:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error en login');
        }
        throw error;
    }
};

// ==================== RESTO DE FUNCIONES EXISTENTES ====================

// Obtener insumos elaborables con paginación
export const obtenerInsumosElaborables = async (
    page: number = 0,
    size: number = 10,
    sort: string = 'id'
): Promise<PageResponse<InsumoApi>> => {
    try {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sort: sort
        };

        const response = await apiClient.get('/insumos/elaborables', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener insumos elaborables:', error);
        throw error;
    }
};

// Obtener insumos no elaborables con paginación
export const obtenerInsumosNoElaborables = async (
    page: number = 0,
    size: number = 10,
    sort: string = 'id',
    rubroId?: number
): Promise<PageResponse<InsumoApi>> => {
    try {
        const params: any = {
            page: page.toString(),
            size: size.toString(),
            sort: sort
        };

        if (rubroId) {
            params.rubroId = rubroId.toString();
        }

        const response = await apiClient.get('/insumos/no-elaborables', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener insumos no elaborables:', error);
        throw error;
    }
};

// Obtener insumos no elaborables por rubro
export const obtenerInsumosNoElaborablesPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'id'
): Promise<PageResponse<InsumoApi>> => {
    try {
        const params = {
            rubroId: rubroId.toString(),
            page: page.toString(),
            size: size.toString(),
            sort: sort
        };

        const response = await apiClient.get('/insumos/no-elaborables', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener insumos no elaborables por rubro:', error);
        throw error;
    }
};

// Obtener insumos no elaborables sin paginación (para dropdowns/selects)
export const obtenerInsumosNoElaborablesSimple = async (): Promise<InsumoApi[]> => {
    try {
        // Usando un size grande para obtener todos los elementos
        const response = await obtenerInsumosNoElaborables(0, 1000, 'denominacion');
        return response.content;
    } catch (error) {
        console.error('Error al obtener todos los insumos no elaborables:', error);
        throw error;
    }
};

// Obtener todos los rubros
export const obtenerTodosLosRubros = async (): Promise<RubroApi[]> => {
    try {
        const response = await apiClient.get('/rubros');
        return response.data;
    } catch (error) {
        console.error('Error al obtener rubros:', error);
        throw error;
    }
};

// Obtener un rubro por ID
export const obtenerRubroPorId = async (id: number): Promise<RubroApi> => {
    try {
        const response = await apiClient.get(`/rubros/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener rubro por ID:', error);
        throw error;
    }
};

// Obtener todos los artículos manufacturados con paginación
export const obtenerArticulosManufacturados = async (
    page: number = 0,
    size: number = 10,
    sort: string = 'id'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sort: sort
        };

        const response = await apiClient.get('/articulos/manufacturados', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener artículos manufacturados:', error);
        throw error;
    }
};

// Obtener artículos manufacturados sin paginación
export const obtenerArticulosManufacturadosSimple = async (): Promise<ArticuloManufacturadoApi[]> => {
    try {
        const response = await obtenerArticulosManufacturados(0, 1000, 'denominacion');
        return response.content;
    } catch (error) {
        console.error('Error al obtener todos los artículos manufacturados:', error);
        throw error;
    }
};

// Obtener un artículo manufacturado por ID
export const obtenerArticuloManufacturadoPorId = async (id: number): Promise<ArticuloManufacturadoApi> => {
    try {
        const response = await apiClient.get(`/articulos/manufacturados/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener artículo manufacturado por ID:', error);
        throw error;
    }
};

// Generar factura de pedido
export const generarFacturaPedido = async (
    pedidoId: number,
    token: string
): Promise<Blob> => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/facturas/pedido/${pedidoId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error al generar factura:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error al generar factura');
        }
        throw error;
    }
};

// Descargar factura como PDF
export const descargarFacturaPDF = async (
    pedidoId: number,
    token: string,
    nombreArchivo?: string
): Promise<void> => {
    try {
        const blob = await generarFacturaPedido(pedidoId, token);

        // Crear URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear elemento de descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo || `factura-pedido-${pedidoId}.pdf`;

        // Agregar al DOM, hacer clic y remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar URL del blob
        window.URL.revokeObjectURL(url);

        console.log(`Factura descargada: ${link.download}`);
    } catch (error) {
        console.error('Error al descargar factura:', error);
        throw error;
    }
};