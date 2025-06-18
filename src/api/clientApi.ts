import axios from 'axios';
import { ArticuloManufacturadoApi, InsumoApi, RubroApi, PedidoVentaRequest, PedidoVentaResponse, ClienteApi } from '../types/typesClient';

const API_BASE_URL = 'http://localhost:8080/api'; // Ajusta esta URL a tu API real

// Crear una instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipo de respuesta de paginación
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

// Obtener todos los artículos manufacturados con paginación
export const obtenerTodosLosManufacturados = async (
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

        const response = await apiClient.get('/manufacturados', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener artículos manufacturados:', error);
        throw error;
    }
};

// Obtener artículos manufacturados por rubro
export const obtenerManufacturadosPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'id'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        const params = {
            rubroId: rubroId.toString(),
            page: page.toString(),
            size: size.toString(),
            sort: sort
        };

        const response = await apiClient.get('/manufacturados/por-rubro', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener artículos manufacturados por rubro:', error);
        throw error;
    }
};

// Obtener todos los artículos manufacturados sin paginación (para dropdowns/selects)
export const obtenerManufacturadosSimple = async (): Promise<ArticuloManufacturadoApi[]> => {
    try {
        // Usando un size grande para obtener todos los elementos
        const response = await obtenerTodosLosManufacturados(0, 1000, 'denominacion');
        return response.content;
    } catch (error) {
        console.error('Error al obtener todos los artículos manufacturados:', error);
        throw error;
    }
};

// Obtener insumos no elaborables con paginación
export const obtenerInsumosNoElaborables = async (
    page: number = 0,
    size: number = 10,
    sort: string = 'id',
    rubroId: number = 1  // Valor predeterminado provisional
): Promise<PageResponse<InsumoApi>> => {
    try {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sort: sort,
            rubroId: rubroId.toString()  // Añadimos siempre el parámetro rubroId
        };

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
        console.error(`Error al obtener rubro con ID ${id}:`, error);
        throw error;
    }
};

// Crear un nuevo pedido
export const crearPedido = async (pedido: PedidoVentaRequest): Promise<PedidoVentaResponse> => {
    try {
        const response = await apiClient.post('/pedidos', pedido);
        return response.data;
    } catch (error) {
        console.error('Error al crear pedido:', error);
        // Si axios recibe un error del servidor, podemos extraer más información
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.error || `Error del servidor: ${error.response.status}`);
        }
        throw error;
    }
};

// Crear preferencia de pago con Mercado Pago
export const crearPreferenciaMercadoPago = async (pedidoId: number): Promise<string> => {
    try {
        console.log("Intentando crear preferencia de pago para pedido:", pedidoId);
        
        // Con axios, podemos manejar respuestas en texto plano
        const response = await apiClient.post(`/mercadopago/crear-preferencia/${pedidoId}`, {}, {
            responseType: 'text'
        });
        
        console.log("Respuesta del servidor:", response.data);
        
        // La respuesta ya viene como texto, así que la retornamos directamente
        return response.data;
    } catch (error) {
        console.error('Error al crear preferencia de pago:', error);
        
        // Manejo de errores mejorado
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data || error.message;
            throw new Error(`Error al crear preferencia de pago: ${errorMessage}`);
        }
        throw error;
    }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id: number): Promise<ClienteApi> => {
    try {
        const response = await apiClient.get(`/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cliente con ID ${id}:`, error);
        throw error;
    }
};

// Verificar disponibilidad de un artículo manufacturado
export const verificarDisponibilidadManufacturado = async (id: number): Promise<boolean> => {
    try {
        const response = await apiClient.get(`/manufacturados/${id}/disponibilidad`);
        return response.data.disponible;
    } catch (error) {
        console.error(`Error al verificar disponibilidad del artículo ${id}:`, error);
        // En caso de error, asumimos que no está disponible por precaución
        return false;
    }
};

// Validar conexión con Mercado Pago sin crear preferencia
export const validarConexionMercadoPago = async (): Promise<boolean> => {
    try {
        const response = await apiClient.get('/mercadopago/validar-conexion');
        return response.data.status === 'success';
    } catch (error) {
        console.error('Error al validar conexión con Mercado Pago:', error);
        return false;
    }
};

// src/api/authApi.ts

export const postLogin = async (
  auth0Id: string,
  email: string,
  nombre: string,
  apellido: string,
  token: string, // Recibir el token como parámetro
  telefono?: string
) => {
  try {
    // Preparar los datos del usuario con la estructura correcta esperada por el backend
    const userData = {
      auth0Id: auth0Id,
      email: email,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono || '',
      rol: {
        id: 2, // ID del rol cliente en tu backend
        auth0RoleId: "rol_ppLLSWBfeXIXbdza" // ID del rol en Auth0 (ajústalo según tu configuración)
      }
    };
    
    console.log("Datos enviados al backend:", userData);
    
    // Realizar la solicitud para crear el cliente
    const response = await axios.post(
      `${API_BASE_URL}/clientes/createUserClient`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    // Devolver los datos del cliente creado
    return response.data;
  } catch (error) {
    console.error('Error al registrar el cliente:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', error.response?.data);
    }
    throw error;
  }
};
