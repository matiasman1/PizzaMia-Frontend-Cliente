import axios from 'axios';
import { 
    ClienteApi, 
    DomicilioApi, 
    ArticuloManufacturadoApi, 
    InsumoApi, 
    RubroApi, 
    PedidoVentaResponse
} from '../types/typesClient';

const API_BASE_URL = 'http://localhost:8080/api';

// Definir PageResponse aquí directamente
export interface PageResponse<T> {
    content: T[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

// Configuración base de axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// FUNCIONES EXISTENTES DEL CLIENTE

// Obtener cliente por ID Auth0
export const getUserById = async (userData: { auth0Id: string }, token: string): Promise<ClienteApi> => {
    try {
        console.log("Obteniendo usuario por Auth0 ID:", userData.auth0Id);
        
        const response = await axios.post(
            `${API_BASE_URL}/clientes/getUserById`,
            userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.data) {
            throw new Error('Usuario no encontrado');
        }

        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
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
        
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
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

// FUNCIONES PARA GESTIÓN DE DOMICILIOS

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

// FUNCIONES PARA PEDIDOS

// Obtener pedidos por cliente Auth0
export const obtenerPedidosPorClienteAuth0 = async (
    auth0Id: string,
    token: string
): Promise<PedidoVentaResponse[]> => {
    try {
        console.log("Obteniendo pedidos para cliente Auth0:", auth0Id);
        
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData || !clienteData.id) {
            console.log('Cliente no encontrado, devolviendo array vacío');
            return [];
        }
        
        console.log("Cliente encontrado con ID:", clienteData.id);
        
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
                
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (response.data && Array.isArray(response.data.content)) {
                    return response.data.content;
                } else if (response.data) {
                    return [response.data];
                }
                
            } catch (error) {
                console.log(`Falló endpoint: ${endpoint}`, error);
                continue;
            }
        }
        
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
            
            interface PedidoCliente {
                id?: number;
                cliente?: {
                    id: number;
                };
                clienteId?: number;
                cliente_id?: number;
            }

            const pedidosCliente = allPedidos.filter((pedido: PedidoCliente) => {
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
        
        console.log('Todos los métodos fallaron, devolviendo array vacío');
        return [];
        
    } catch (error) {
        console.error('Error al obtener pedidos por cliente Auth0:', error);
        return [];
    }
};

// FUNCIÓN FALTANTE: Crear pedido
export const crearPedido = async (
    pedidoData: any,
    token?: string
): Promise<any> => {
    try {
        console.log("Creando pedido:", pedidoData);
        
        const response = await axios.post(
            `${API_BASE_URL}/pedidos`,
            pedidoData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }
        );

        if (!response.data) {
            throw new Error('Error al crear pedido');
        }

        console.log("Pedido creado exitosamente:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear pedido:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al crear el pedido');
        }
        throw error;
    }
};

// FUNCIONES ADICIONALES PARA EL CARRITO

// Crear preferencia de MercadoPago
export const crearPreferenciaMercadoPago = async (
    pedidoId: number,
    token?: string
): Promise<string> => {
    try {
        console.log("Creando preferencia de MercadoPago para pedido:", pedidoId);
        
        const response = await axios.post(
            `${API_BASE_URL}/mercadopago/create-preference`,
            { pedidoId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }
        );

        if (!response.data?.checkoutUrl) {
            throw new Error('No se pudo obtener URL de checkout');
        }

        return response.data.checkoutUrl;
    } catch (error) {
        console.error('Error al crear preferencia de MercadoPago:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error al procesar pago con MercadoPago');
        }
        throw error;
    }
};

// FUNCIONES EXISTENTES DEL MENÚ (mantener las que ya existían)

// Obtener cliente por ID interno
export const obtenerClientePorId = async (id: number): Promise<ClienteApi> => {
    try {
        const response = await apiClient.get(`/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        throw error;
    }
};

// Obtener artículos manufacturados paginados
export const obtenerManufacturados = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'denominacion'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        const response = await apiClient.get('/manufacturados', {
            params: { page, size, sortBy }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener manufacturados:', error);
        throw error;
    }
};

// Obtener insumos no elaborables paginados
export const obtenerInsumosNoElaborables = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'denominacion'
): Promise<PageResponse<InsumoApi>> => {
    try {
        const response = await apiClient.get('/insumos/no-elaborables', {
            params: { page, size, sortBy }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener insumos no elaborables:', error);
        throw error;
    }
};

// Obtener todos los manufacturados
export const obtenerTodosLosManufacturados = async (): Promise<ArticuloManufacturadoApi[]> => {
    try {
        const response = await obtenerManufacturados(0, 1000, 'denominacion');
        return response.content;
    } catch (error) {
        console.error('Error al obtener todos los manufacturados:', error);
        throw error;
    }
};

// Obtener todos los insumos no elaborables
export const obtenerTodosLosInsumosNoElaborables = async (): Promise<InsumoApi[]> => {
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

// Verificar disponibilidad de un artículo manufacturado
export const verificarDisponibilidadManufacturado = async (id: number): Promise<boolean> => {
    try {
        const response = await apiClient.get(`/manufacturados/${id}/disponibilidad`);
        return response.data.disponible || false;
    } catch (error) {
        console.error(`Error al verificar disponibilidad del artículo ${id}:`, error);
        return false;
    }
};

// ...existing code...

// FUNCIÓN FALTANTE - Obtener manufacturados por rubro (para el menú)
export const obtenerManufacturadosPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        console.log(`Buscando manufacturados para rubro ${rubroId}`);
        
        // Intentar endpoint directo primero
        try {
            const params = {
                rubroId: rubroId.toString(),
                page: page.toString(),
                size: size.toString(),
                sort: sort
            };

            const response = await apiClient.get('/manufacturados/por-rubro', { params });
            console.log(`Éxito con endpoint directo para rubro ${rubroId}:`, response.data);
            return response.data;
        } catch (directError) {
            console.log('Endpoint directo falló, intentando método alternativo...');
            
            // Método alternativo: obtener todos y filtrar
            const response = await obtenerManufacturados(0, 1000, sort);
            
            // Filtrar por rubro en el frontend
            const filteredContent = response.content.filter((item: ArticuloManufacturadoApi) => {
                // Verificar diferentes posibles estructuras del objeto
                const itemRubroId = (item as any).rubro?.id || 
                                   (item as any).rubroId || 
                                   (item as any).categoria?.id;
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
                last: page >= Math.ceil(filteredContent.length / size) - 1,
                pageable: {
                    sort: {
                        empty: false,
                        sorted: true,
                        unsorted: false
                    },
                    offset: startIndex,
                    pageSize: size,
                    pageNumber: page,
                    paged: true,
                    unpaged: false
                },
                sort: {
                    empty: false,
                    sorted: true,
                    unsorted: false
                },
                numberOfElements: paginatedContent.length,
                empty: paginatedContent.length === 0
            };
        }
    } catch (error) {
        console.error('Error al obtener manufacturados por rubro:', error);
        
        // Devolver estructura vacía pero válida en caso de error
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page,
            first: true,
            last: true,
            pageable: {
                sort: {
                    empty: true,
                    sorted: false,
                    unsorted: true
                },
                offset: 0,
                pageSize: size,
                pageNumber: page,
                paged: true,
                unpaged: false
            },
            sort: {
                empty: true,
                sorted: false,
                unsorted: true
            },
            numberOfElements: 0,
            empty: true
        };
    }
};

// FUNCIÓN ADICIONAL - Obtener insumos por rubro (para bebidas)
export const obtenerInsumosPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion'
): Promise<PageResponse<InsumoApi>> => {
    try {
        console.log(`Buscando insumos para rubro ${rubroId}`);
        
        // Intentar endpoint directo primero
        try {
            const params = {
                rubroId: rubroId.toString(),
                page: page.toString(),
                size: size.toString(),
                sort: sort
            };

            const response = await apiClient.get('/insumos/por-rubro', { params });
            console.log(`Éxito con endpoint directo para insumos rubro ${rubroId}:`, response.data);
            return response.data;
        } catch (directError) {
            console.log('Endpoint directo de insumos falló, intentando método alternativo...');
            
            // Método alternativo: obtener todos los insumos no elaborables y filtrar
            const response = await obtenerInsumosNoElaborables(0, 1000, sort);
            
            // Filtrar por rubro en el frontend
            const filteredContent = response.content.filter((item: InsumoApi) => {
                // Verificar diferentes posibles estructuras del objeto
                const itemRubroId = (item as any).rubro?.id || 
                                   (item as any).rubroId || 
                                   (item as any).categoria?.id;
                return itemRubroId === rubroId;
            });
            
            console.log(`Encontrados ${filteredContent.length} insumos para rubro ${rubroId}`);
            
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
                last: page >= Math.ceil(filteredContent.length / size) - 1,
                pageable: {
                    sort: {
                        empty: false,
                        sorted: true,
                        unsorted: false
                    },
                    offset: startIndex,
                    pageSize: size,
                    pageNumber: page,
                    paged: true,
                    unpaged: false
                },
                sort: {
                    empty: false,
                    sorted: true,
                    unsorted: false
                },
                numberOfElements: paginatedContent.length,
                empty: paginatedContent.length === 0
            };
        }
    } catch (error) {
        console.error('Error al obtener insumos por rubro:', error);
        
        // Devolver estructura vacía pero válida en caso de error
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page,
            first: true,
            last: true,
            pageable: {
                sort: {
                    empty: true,
                    sorted: false,
                    unsorted: true
                },
                offset: 0,
                pageSize: size,
                pageNumber: page,
                paged: true,
                unpaged: false
            },
            sort: {
                empty: true,
                sorted: false,
                unsorted: true
            },
            numberOfElements: 0,
            empty: true
        };
    }
};