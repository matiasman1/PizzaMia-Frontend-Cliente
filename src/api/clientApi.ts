import axios from 'axios';
import { ArticuloManufacturadoApi, InsumoApi, RubroApi, PedidoVentaRequest, PedidoVentaResponse, ClienteApi, ClienteUpdateDTO, PromocionApi, DomicilioCreateRequest, LocalidadApi } from '../types/typesClient';

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
      telefono: telefono,
      rol: {
        id: 2, // ID del rol cliente en tu backend
        auth0RoleId: "rol_7Z51zfMbX01320hQ" // ID del rol en Auth0 (ajústalo según tu configuración)
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

// Seccion Perfil Cliente

// Obtener cliente por Auth0 ID
export const obtenerClientePorAuth0Id = async (auth0Id: string, token: string): Promise<ClienteApi> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/clientes/getUserById`,
      { auth0Id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener cliente por Auth0 ID:', error);
    throw error;
  }
};

// Actualizar información del cliente
export const actualizarCliente = async (clienteId: number, datosActualizados: ClienteUpdateDTO, token: string): Promise<ClienteApi> => {
  try {
    console.log(`Actualizando cliente ${clienteId} con datos:`, datosActualizados);
    
    const response = await axios.put(
      `${API_BASE_URL}/clientes/${clienteId}`,
      datosActualizados,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al actualizar cliente: ${errorMsg}`);
    }
    throw error;
  }
};

// Actualizar el teléfono del cliente (para usuarios de Google)
export const actualizarTelefonoCliente = async (clienteId: number, telefono: number, auth0Id: string, token: string): Promise<ClienteApi> => {
  try {
    // Para usuarios de Google solo actualizamos el teléfono
    const datosActualizados: ClienteUpdateDTO = {
      nombre: "", // No se utilizará
      apellido: "", // No se utilizará
      telefono: telefono,
      email: "", // No se utilizará
      auth0Id: auth0Id // Necesario para identificar que es un usuario de Google
    };
    
    return await actualizarCliente(clienteId, datosActualizados, token);
  } catch (error) {
    console.error('Error al actualizar teléfono del cliente:', error);
    throw error;
  }
};

// Agregar domicilio a un cliente específico
export const agregarDomicilioCliente = async (
  clienteId: number, 
  domicilio: DomicilioCreateRequest, 
  token: string
): Promise<ClienteApi> => {
  try {
    console.log(`Agregando domicilio para cliente ${clienteId}:`, domicilio);
    
    const response = await axios.post(
      `${API_BASE_URL}/clientes/${clienteId}/domicilios`,
      domicilio,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    // El endpoint devuelve el cliente completo actualizado
    return response.data;
  } catch (error) {
    console.error('Error al agregar domicilio al cliente:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al agregar domicilio: ${errorMsg}`);
    }
    throw error;
  }
};

// Obtener pedidos de un cliente específico con paginación
export const obtenerPedidosCliente = async (
  clienteId: number,
  token: string,
  page: number = 0,
  size: number = 10,
  sort: string = 'id,desc'
): Promise<PageResponse<PedidoVentaResponse>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pedidos/cliente/${clienteId}`,
      {
        params: {
          page,
          size,
          sort
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos del cliente:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al obtener pedidos: ${errorMsg}`);
    }
    throw error;
  }
};

// Descargar factura PDF para un pedido específico
export const descargarFacturaPdf = async (pedidoId: number, token: string): Promise<Blob> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/facturas/pedido/${pedidoId}/pdf`,
      {
        responseType: 'blob', // Importante para recibir datos binarios
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al descargar factura PDF:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.status === 404 
        ? "No se encontró la factura para este pedido" 
        : error.message;
      throw new Error(`Error al descargar factura: ${errorMsg}`);
    }
    throw error;
  }
};

// Reemplazar las funciones existentes de promociones

// Función para obtener una promoción específica por ID
export const obtenerPromocionPorId = async (id: number, token?: string): Promise<PromocionApi> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient.get(`/promociones/${id}`, {
      headers
    });
    
    const promocion = response.data;
    
    // Calcular el estado de la promoción
    const today = new Date();
    const fechaInicio = new Date(promocion.fechaInicio);
    const fechaFin = new Date(promocion.fechaFin);
    const isActive = today >= fechaInicio && today <= fechaFin && !promocion.fechaBaja;
    
    return {
      ...promocion,
      estado: isActive ? 'ACTIVO' : 'INACTIVO'
    };
  } catch (error) {
    console.error(`Error en obtenerPromocionPorId ${id}:`, error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al obtener promoción: ${errorMsg}`);
    }
    throw error;
  }
};

// Función para obtener promociones activas
export const obtenerPromocionesActivas = async (token?: string): Promise<PromocionApi[]> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient.get('/promociones/activas', {
      headers
    });
    
    // Ya que estas promociones son activas, asignamos el estado ACTIVO
    return response.data.map((promocion: PromocionApi) => ({
      ...promocion,
      estado: 'ACTIVO'
    }));
  } catch (error) {
    console.error('Error en obtenerPromocionesActivas:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al obtener promociones activas: ${errorMsg}`);
    }
    throw error;
  }
};

// Toggle estado de domicilio (activar/desactivar)
export const toggleEstadoDomicilio = async (
  clienteId: number, 
  domicilioId: number, 
  token: string
): Promise<ClienteApi> => {
  try {
    console.log(`Cambiando estado del domicilio ${domicilioId} para cliente ${clienteId}`);
    
    const response = await axios.patch(
      `${API_BASE_URL}/clientes/${clienteId}/domicilios/${domicilioId}/toggle-estado`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Respuesta del servidor:', response.data.mensaje);
    
    // El endpoint devuelve el cliente completo actualizado
    return response.data.cliente;
  } catch (error) {
    console.error('Error al cambiar estado del domicilio:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al cambiar estado del domicilio: ${errorMsg}`);
    }
    throw error;
  }
};

// Actualizar domicilio existente
export const actualizarDomicilioCliente = async (
  clienteId: number,
  domicilioId: number,
  domicilio: DomicilioCreateRequest,
  token: string
): Promise<ClienteApi> => {
  try {
    console.log(`Actualizando domicilio ${domicilioId} para cliente ${clienteId}:`, domicilio);
    
    const response = await axios.put(
      `${API_BASE_URL}/clientes/${clienteId}/domicilios/${domicilioId}`,
      domicilio,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Respuesta del servidor:', response.data.mensaje);
    
    // El endpoint devuelve el cliente completo actualizado
    return response.data.cliente;
  } catch (error) {
    console.error('Error al actualizar domicilio:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al actualizar domicilio: ${errorMsg}`);
    }
    throw error;
  }
};

// Obtener todas las localidades
export const obtenerTodasLasLocalidades = async (token?: string): Promise<LocalidadApi[]> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient.get('/localidades', {
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener localidades:', error);
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message;
      throw new Error(`Error al obtener localidades: ${errorMsg}`);
    }
    throw error;
  }
};
