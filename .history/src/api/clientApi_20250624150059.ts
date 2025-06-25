import axios from 'axios';
import { 
    ClienteApi, 
    DomicilioApi, 
    ArticuloManufacturadoApi, 
    InsumoApi, 
    RubroApi, 
    PedidoVentaResponse,
    PageResponse 
} from '../types/typesClient';

const API_BASE_URL = 'http://localhost:8080/api';

// Configuración de axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la API:', error);
        if (error.response?.status === 401) {
            console.error('Error de autenticación');
        }
        return Promise.reject(error);
    }
);

// ==================== FUNCIONES PARA ARTÍCULOS MANUFACTURADOS ====================

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

        const response = await apiClient.get('/manufacturados', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener artículos manufacturados:', error);
        throw error;
    }
};

// Obtener todos los artículos manufacturados sin paginación (para menús/dropdowns)
export const obtenerTodosLosManufacturados = async (
    page: number = 0,
    size: number = 1000,
    sort: string = 'denominacion'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        const response = await obtenerArticulosManufacturados(page, size, sort);
        return response;
    } catch (error) {
        console.error('Error al obtener todos los artículos manufacturados:', error);
        throw error;
    }
};

// Obtener artículos manufacturados simples (solo el array, sin paginación)
export const obtenerManufacturadosSimple = async (): Promise<ArticuloManufacturadoApi[]> => {
    try {
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
    rubroId: number = 1
): Promise<PageResponse<InsumoApi>> => {
    try {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sort: sort,
            rubroId: rubroId.toString()
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

// Obtener un artículo manufacturado por ID
export const obtenerArticuloManufacturadoPorId = async (id: number): Promise<ArticuloManufacturadoApi> => {
    try {
        const response = await apiClient.get(`/manufacturados/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener artículo manufacturado por ID:', error);
        throw error;
    }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id: number): Promise<ClienteApi> => {
    try {
        const response = await apiClient.get(`/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        throw error;
    }
};

// ==================== FUNCIONES PARA INTEGRACIÓN CON BACKEND ====================

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

// FUNCIÓN CORREGIDA - Actualizar cliente
export const actualizarCliente = async (
    auth0Id: string,
    datosCliente: any,
    token: string
): Promise<ClienteApi> => {
    try {
        console.log("Actualizando cliente:", auth0Id, datosCliente);
        
        // CORREGIDO: Usar POST en lugar de PUT y endpoint diferente
        const response = await axios.post(
            `${API_BASE_URL}/clientes/updateByAuth0Id`,
            {
                auth0Id: auth0Id,
                ...datosCliente
            },
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
            // Intentar endpoint alternativo si el primero falla
            return await actualizarClienteAlternativo(auth0Id, datosCliente, token);
        }
        throw error;
    }
};

// Función alternativa para actualizar cliente
const actualizarClienteAlternativo = async (
    auth0Id: string,
    datosCliente: any,
    token: string
): Promise<ClienteApi> => {
    try {
        console.log("Intentando endpoint alternativo...");
        
        // Primero obtener el cliente para conseguir su ID interno
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
        // Usar el ID interno para actualizar
        const response = await axios.put(
            `${API_BASE_URL}/clientes/${clienteData.id}`,
            datosCliente,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error en endpoint alternativo:', error);
        throw new Error('No se pudo actualizar el cliente. Verifique la conexión con el backend.');
    }
};

// Obtener pedidos por cliente Auth0
export const obtenerPedidosPorClienteAuth0 = async (
    auth0Id: string,
    token: string
): Promise<PedidoVentaResponse[]> => {
    try {
        console.log("Obteniendo pedidos para cliente Auth0:", auth0Id);
        
        // PASO 1: Primero obtener los datos del cliente para conseguir su ID interno
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData || !clienteData.id) {
            console.log('Cliente no encontrado, devolviendo array vacío');
            return [];
        }
        
        console.log("Cliente encontrado con ID:", clienteData.id);
        
        // PASO 2: Usar el ID interno del cliente para obtener sus pedidos
        const possibleEndpoints = [
            `/pedidos/cliente/${clienteData.id}`,
            `/pedido-venta/cliente/${clienteData.id}`,
            `/pedidos/${clienteData.id}`,
            `/pedidos?clienteId=${clienteData.id}`
        ];
        
        for (const endpoint of possibleEndpoints) {
            try {
                console.log(`Intentando endpoint: ${endpoint}`);
                
                const response = await axios.get(
                    `${API_BASE_URL}${endpoint}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                console.log(`Éxito con endpoint: ${endpoint}`, response.data);
                
                // Verificar que la respuesta sea un array
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (response.data && Array.isArray(response.data.content)) {
                    // Si viene paginado
                    return response.data.content;
                } else if (response.data) {
                    // Si viene un solo objeto, convertirlo a array
                    return [response.data];
                }
                
            } catch (error) {
                console.log(`Falló endpoint: ${endpoint}`, error);
                continue;
            }
        }
        
        // PASO 3: Si los endpoints específicos fallan, intentar obtener todos los pedidos y filtrar
        try {
            console.log('Intentando obtener todos los pedidos y filtrar...');
            
            const response = await axios.get(
                `${API_BASE_URL}/pedidos`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            let allPedidos = [];
            
            if (Array.isArray(response.data)) {
                allPedidos = response.data;
            } else if (response.data && Array.isArray(response.data.content)) {
                allPedidos = response.data.content;
            }
            
            // Filtrar pedidos del cliente específico
            interface PedidoCliente {
                cliente?: { id: number };
                clienteId?: number;
                cliente_id?: number;
            }

            const pedidosCliente = allPedidos.filter((pedido: PedidoCliente) => {
                // Verificar diferentes estructuras posibles
                const pedidoClienteId: number | undefined = 
                    pedido.cliente?.id || 
                    pedido.clienteId || 
                    pedido.cliente_id;
                
                return pedidoClienteId === clienteData.id;
            });
            
            console.log(`Encontrados ${pedidosCliente.length} pedidos para cliente ${clienteData.id}`);
            return pedidosCliente;
            
        } catch (error) {
            console.error('Error al obtener todos los pedidos:', error);
        }
        
        // Si todo falla, devolver array vacío
        console.log('Todos los métodos fallaron, devolviendo array vacío');
        return [];
        
    } catch (error) {
        console.error('Error al obtener pedidos por cliente Auth0:', error);
        return [];
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

// Obtener manufacturados por rubro (para el menú)
export const obtenerManufacturadosPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        console.log(`Buscando manufacturados para rubro ${rubroId}`);
        
        // Primero intentar obtener todos los manufacturados
        const response = await obtenerArticulosManufacturados(0, 1000, sort);
        
        // Filtrar por rubro en el frontend
        interface ItemRubro {
            rubro?: { id: number };
            rubroId?: number;
            categoria?: { id: number };
        }

        const filteredContent = response.content.filter((item: ArticuloManufacturadoApi & ItemRubro) => {
            // Verificar diferentes posibles estructuras del objeto
            const itemRubroId: number | undefined = item.rubro?.id || item.rubroId || item.categoria?.id;
            return itemRubroId === rubroId;
        });
        
        console.log(`Encontrados ${filteredContent.length} productos para rubro ${rubroId}`);
        
        // Aplicar paginación manual
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = filteredContent.slice(startIndex, endIndex);
        
        return {
            content: paginatedContent,
            totalElements: filteredContent.length,
            totalPages: Math.ceil(filteredContent.length / size),
            size: size,
            number: page,
            first: page === 0,
            last: page >= Math.ceil(filteredContent.length / size) - 1
        };
    } catch (error) {
        console.error('Error al obtener manufacturados por rubro:', error);
        
        // Devolver estructura vacía pero válida
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page,
            first: true,
            last: true
        };
    }
};

// Verificar disponibilidad de un artículo manufacturado
export const verificarDisponibilidadManufacturado = async (id: number): Promise<boolean> => {
    try {
        const response = await apiClient.get(`/manufacturados/${id}/disponibilidad`);
        return response.data.disponible || false;
    } catch (error) {
        console.error(`Error al verificar disponibilidad del artículo ${id}:`, error);
        // En caso de error, asumimos que no está disponible por precaución
        return false;
    }
};

// ==================== NUEVAS FUNCIONES PARA GESTIÓN DE DOMICILIOS ====================

// Agregar nuevo domicilio
export const agregarDomicilio = async (
    auth0Id: string,
    domicilioData: {
        calle: string;
        numero: string;
        pisoDpto?: string;
        codigoPostal: string;
        localidadId: number;
    },
    token: string
): Promise<any> => {
    try {
        console.log("Agregando nuevo domicilio:", domicilioData);
        
        // Primero obtener el cliente
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
        const response = await axios.post(
            `${API_BASE_URL}/domicilios`,
            {
                ...domicilioData,
                clienteId: clienteData.id,
                isActive: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error al agregar domicilio:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error al agregar domicilio');
        }
        throw error;
    }
};

// Actualizar domicilio existente
export const actualizarDomicilio = async (
    domicilioId: number,
    domicilioData: {
        calle: string;
        numero: string;
        pisoDpto?: string;
        codigoPostal: string;
        localidadId: number;
    },
    token: string
): Promise<any> => {
    try {
        console.log("Actualizando domicilio:", domicilioId, domicilioData);
        
        const response = await axios.put(
            `${API_BASE_URL}/domicilios/${domicilioId}`,
            domicilioData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error al actualizar domicilio:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error al actualizar domicilio');
        }
        throw error;
    }
};

// Eliminar domicilio (soft delete)
export const eliminarDomicilio = async (
    domicilioId: number,
    token: string
): Promise<void> => {
    try {
        console.log("Eliminando domicilio:", domicilioId);
        
        await axios.delete(
            `${API_BASE_URL}/domicilios/${domicilioId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        console.error('Error al eliminar domicilio:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error al eliminar domicilio');
        }
        throw error;
    }
};

// Obtener localidades disponibles
export const obtenerLocalidades = async (token: string): Promise<any[]> => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/localidades`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data || [];
    } catch (error) {
        console.error('Error al obtener localidades:', error);
        return [];
    }
};

export default apiClient;