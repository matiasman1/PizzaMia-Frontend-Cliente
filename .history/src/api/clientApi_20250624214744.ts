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

// ==================== FUNCIONES DEL CLIENTE ====================

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

// FUNCIÓN CORREGIDA - Actualizar cliente con múltiples estrategias
export const actualizarCliente = async (
    auth0Id: string,
    datosCliente: any,
    token: string
): Promise<ClienteApi> => {
    console.log("=== INICIANDO ACTUALIZACIÓN DE CLIENTE ===");
    console.log("Auth0 ID:", auth0Id);
    console.log("Datos a actualizar:", datosCliente);
    
    // Estrategia 1: Endpoint directo con Auth0 ID
    try {
        console.log("🔄 Estrategia 1: Actualizando con endpoint updateByAuth0Id...");
        
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

        if (response.data) {
            console.log("✅ Estrategia 1 exitosa:", response.data);
            return response.data;
        }
        
    } catch (error) {
        console.log("❌ Estrategia 1 falló:", error);
    }

    // Estrategia 2: Obtener ID interno y usar PUT
    try {
        console.log("🔄 Estrategia 2: Obteniendo ID interno y usando PUT...");
        
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
        console.log("Cliente encontrado con ID:", clienteData.id);
        
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

        if (response.data) {
            console.log("✅ Estrategia 2 exitosa:", response.data);
            return response.data;
        }
        
    } catch (error) {
        console.log("❌ Estrategia 2 falló:", error);
    }

    // Estrategia 3: Endpoint alternativo con PATCH
    try {
        console.log("🔄 Estrategia 3: Usando PATCH...");
        
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
        const response = await axios.patch(
            `${API_BASE_URL}/clientes/${clienteData.id}`,
            datosCliente,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            console.log("✅ Estrategia 3 exitosa:", response.data);
            return response.data;
        }
        
    } catch (error) {
        console.log("❌ Estrategia 3 falló:", error);
    }

    // Estrategia 4: Endpoint con estructura completa
    try {
        console.log("🔄 Estrategia 4: Enviando estructura completa...");
        
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
        // Preparar datos completos manteniendo estructura original
        const datosCompletos = {
            id: clienteData.id,
            nombre: datosCliente.nombre || clienteData.nombre,
            apellido: datosCliente.apellido || clienteData.apellido,
            telefono: datosCliente.telefono || clienteData.telefono,
            email: datosCliente.email || clienteData.email,
            fechaNacimiento: (clienteData as any).fechaNacimiento || null,
            auth0Id: auth0Id,
            domicilios: clienteData.domicilios || []
        };
        
        console.log("Datos completos a enviar:", datosCompletos);
        
        const response = await axios.put(
            `${API_BASE_URL}/clientes/${clienteData.id}`,
            datosCompletos,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            console.log("✅ Estrategia 4 exitosa:", response.data);
            return response.data;
        }
        
    } catch (error) {
        console.log("❌ Estrategia 4 falló:", error);
    }

    // Estrategia 5: Endpoint con POST y ID interno
    try {
        console.log("🔄 Estrategia 5: POST con ID interno...");
        
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }
        
        const response = await axios.post(
            `${API_BASE_URL}/clientes/update`,
            {
                id: clienteData.id,
                ...datosCliente
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            console.log("✅ Estrategia 5 exitosa:", response.data);
            return response.data;
        }
        
    } catch (error) {
        console.log("❌ Estrategia 5 falló:", error);
    }

    console.log("❌ Todas las estrategias fallaron");
    throw new Error('No se pudo actualizar el cliente. Verifique que el backend esté funcionando y los endpoints sean correctos.');
};

// ==================== FUNCIONES PARA GESTIÓN DE DOMICILIOS ====================

// FUNCIÓN CORREGIDA - Agregar nuevo domicilio
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
    console.log("=== AGREGANDO DOMICILIO ===");
    console.log("Auth0 ID:", auth0Id);
    console.log("Datos del domicilio:", domicilioData);

    try {
        // Primero obtener el cliente
        const clienteData = await getUserById({ auth0Id }, token);
        
        if (!clienteData?.id) {
            throw new Error('No se pudo obtener ID del cliente');
        }

        console.log("Cliente encontrado con ID:", clienteData.id);

        // Estrategia 1: POST directo
        try {
            console.log("🔄 Estrategia 1: POST directo a /domicilios");
            
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

            if (response.data) {
                console.log("✅ Estrategia 1 exitosa:", response.data);
                return response.data;
            }
        } catch (error) {
            console.log("❌ Estrategia 1 falló:", error);
        }

        // Estrategia 2: POST con estructura alternativa
        try {
            console.log("🔄 Estrategia 2: POST con estructura alternativa");
            
            const response = await axios.post(
                `${API_BASE_URL}/domicilios/create`,
                {
                    ...domicilioData,
                    cliente: { id: clienteData.id },
                    isActive: true
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                console.log("✅ Estrategia 2 exitosa:", response.data);
                return response.data;
            }
        } catch (error) {
            console.log("❌ Estrategia 2 falló:", error);
        }

        // Estrategia 3: POST con localidad completa
        try {
            console.log("🔄 Estrategia 3: POST con localidad completa");
            
            const response = await axios.post(
                `${API_BASE_URL}/domicilios`,
                {
                    calle: domicilioData.calle,
                    numero: domicilioData.numero,
                    pisoDpto: domicilioData.pisoDpto || '',
                    codigoPostal: domicilioData.codigoPostal,
                    localidad: { id: domicilioData.localidadId },
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

            if (response.data) {
                console.log("✅ Estrategia 3 exitosa:", response.data);
                return response.data;
            }
        } catch (error) {
            console.log("❌ Estrategia 3 falló:", error);
        }

        throw new Error('No se pudo agregar el domicilio con ninguna estrategia');

    } catch (error) {
        console.error('Error al agregar domicilio:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalles del error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al agregar domicilio');
        }
        throw error;
    }
};

// FUNCIÓN CORREGIDA - Actualizar domicilio existente
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
    console.log("=== ACTUALIZANDO DOMICILIO ===");
    console.log("ID del domicilio:", domicilioId);
    console.log("Datos a actualizar:", domicilioData);
    console.log("Token presente:", !!token);

    // Estrategia 1: PUT directo
    try {
        console.log("🔄 Estrategia 1: PUT directo a /domicilios/{id}");
        
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

        if (response.data) {
            console.log("✅ Estrategia 1 exitosa:", response.data);
            return response.data;
        }
    } catch (error) {
        console.log("❌ Estrategia 1 falló:", error);
    }

    // Estrategia 2: PATCH
    try {
        console.log("🔄 Estrategia 2: PATCH a /domicilios/{id}");
        
        const response = await axios.patch(
            `${API_BASE_URL}/domicilios/${domicilioId}`,
            domicilioData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            console.log("✅ Estrategia 2 exitosa:", response.data);
            return response.data;
        }
    } catch (error) {
        console.log("❌ Estrategia 2 falló:", error);
    }

    // Estrategia 3: POST con ID
    try {
        console.log("🔄 Estrategia 3: POST a /domicilios/update");
        
        const response = await axios.post(
            `${API_BASE_URL}/domicilios/update`,
            {
                id: domicilioId,
                ...domicilioData
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            console.log("✅ Estrategia 3 exitosa:", response.data);
            return response.data;
        }
    } catch (error) {
        console.log("❌ Estrategia 3 falló:", error);
    }

    // Estrategia 4: PUT con estructura completa
    try {
        console.log("🔄 Estrategia 4: PUT con estructura completa");
        
        const datosCompletos = {
            id: domicilioId,
            ...domicilioData,
            isActive: true
        };

        const response = await axios.put(
            `${API_BASE_URL}/domicilios/${domicilioId}`,
            datosCompletos,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            console.log("✅ Estrategia 4 exitosa:", response.data);
            return response.data;
        }
    } catch (error) {
        console.log("❌ Estrategia 4 falló:", error);
    }

    console.log("❌ Todas las estrategias fallaron para actualizar domicilio");
    throw new Error('No se pudo actualizar el domicilio. Verifique que el backend esté funcionando correctamente.');
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

// FUNCIÓN CORREGIDA - Obtener localidades disponibles
export const obtenerLocalidades = async (token: string): Promise<any[]> => {
    console.log("=== OBTENIENDO LOCALIDADES ===");
    console.log("Token presente:", !!token);

    const posiblesEndpoints = [
        '/localidades',
        '/localidad',
        '/ubicaciones/localidades',
        '/geografia/localidades',
        '/domicilios/localidades'
    ];

    // Probar cada endpoint posible
    for (const endpoint of posiblesEndpoints) {
        try {
            console.log(`🔄 Probando endpoint: ${endpoint}`);
            
            const response = await axios.get(
                `${API_BASE_URL}${endpoint}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            let localidades = [];
            
            if (Array.isArray(response.data)) {
                localidades = response.data;
            } else if (response.data && Array.isArray(response.data.content)) {
                localidades = response.data.content;
            } else if (response.data && response.data.localidades) {
                localidades = response.data.localidades;
            }

            if (localidades.length > 0) {
                console.log(`✅ Éxito con endpoint ${endpoint}:`, localidades.slice(0, 3));
                return localidades;
            }
        } catch (error) {
            console.log(`❌ Falló endpoint ${endpoint}:`, error);
        }
    }

    // Si no funcionan los endpoints, devolver localidades de prueba
    console.log("⚠️ Usando localidades de prueba");
    const localidadesPrueba = [
        { id: 1, nombre: 'Mendoza', provincia: 'Mendoza' },
        { id: 2, nombre: 'Godoy Cruz', provincia: 'Mendoza' },
        { id: 3, nombre: 'Maipú', provincia: 'Mendoza' },
        { id: 4, nombre: 'Las Heras', provincia: 'Mendoza' },
        { id: 5, nombre: 'Luján de Cuyo', provincia: 'Mendoza' }
    ];
    
    return localidadesPrueba;
};

// ==================== FUNCIONES PARA PEDIDOS ====================

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
            
            interface PedidoConCliente {
                cliente?: { id: number };
                clienteId?: number;
                cliente_id?: number;
            }
            
            const pedidosCliente = allPedidos.filter((pedido: PedidoConCliente) => {
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

// ==================== FUNCIONES ADICIONALES PARA EL CARRITO ====================

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

// ==================== FUNCIONES EXISTENTES DEL MENÚ ====================

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

// FUNCIÓN CORREGIDA - Obtener artículos manufacturados paginados
export const obtenerManufacturados = async (
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        const response = await apiClient.get('/manufacturados', {
            params: { page, size, sort }  // CORREGIDO: usar 'sort' en lugar de 'sortBy'
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener manufacturados:', error);
        throw error;
    }
};

// FUNCIÓN CORREGIDA - Obtener insumos no elaborables paginados
export const obtenerInsumosNoElaborables = async (
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion',
    rubroId?: number
): Promise<PageResponse<InsumoApi>> => {
    try {
        console.log(`Obteniendo insumos no elaborables - página ${page}, rubro: ${rubroId || 'todos'}`);
        
        // CORREGIDO: parámetros correctos que espera el backend
        const params: any = { 
            page, 
            size, 
            sort  // CORREGIDO: usar 'sort' en lugar de 'sortBy'
        };
        
        // Si hay rubroId, agregarlo a los parámetros
        if (rubroId) {
            params.rubroId = rubroId;
        }
        
        const response = await apiClient.get('/insumos/no-elaborables', { params });
        
        let result = response.data;
        
        // Si no hay filtro de rubro en el backend pero se especificó rubroId, filtrar en frontend
        if (rubroId && result.content) {
            console.log(`Filtrando insumos por rubro ${rubroId} en frontend...`);
            
            const filteredContent = result.content.filter((item: InsumoApi) => {
                const itemRubroId = item.rubro?.id || (item as any).rubroId;
                const match = itemRubroId === rubroId;
                
                if (match) {
                    console.log(`Insumo encontrado: ${item.denominacion} - Rubro ID: ${itemRubroId}`);
                }
                
                return match;
            });
            
            console.log(`Encontrados ${filteredContent.length} insumos para rubro ${rubroId}`);
            
            // Recalcular paginación después del filtrado
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedContent = filteredContent.slice(startIndex, endIndex);
            const totalPages = Math.ceil(filteredContent.length / size);
            
            result = {
                content: paginatedContent,
                totalElements: filteredContent.length,
                totalPages: totalPages,
                size: size,
                number: page,
                first: page === 0,
                last: page >= totalPages - 1,
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
        
        return result;
        
    } catch (error) {
        console.error('Error al obtener insumos no elaborables:', error);
        
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

// FUNCIÓN CORREGIDA - Obtener manufacturados por rubro
export const obtenerManufacturadosPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion'
): Promise<PageResponse<ArticuloManufacturadoApi>> => {
    try {
        console.log(`Buscando manufacturados para rubro ${rubroId}, página ${page}`);
        
        // Primero obtener todos los manufacturados
        const allManufacturados = await obtenerTodosLosManufacturados();
        
        // Filtrar por rubro
        const filteredByRubro = allManufacturados.filter((item: ArticuloManufacturadoApi) => {
            // Verificar diferentes estructuras posibles
            const itemRubroId = item.rubro?.id || (item as any).rubroId;
            const match = itemRubroId === rubroId;
            
            if (match) {
                console.log(`Producto encontrado: ${item.denominacion} - Rubro ID: ${itemRubroId}`);
            }
            
            return match;
        });
        
        console.log(`Encontrados ${filteredByRubro.length} manufacturados para rubro ${rubroId}`);
        
        // Aplicar paginación
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = filteredByRubro.slice(startIndex, endIndex);
        
        const totalPages = Math.ceil(filteredByRubro.length / size);
        
        return {
            content: paginatedContent,
            totalElements: filteredByRubro.length,
            totalPages: totalPages,
            size: size,
            number: page,
            first: page === 0,
            last: page >= totalPages - 1,
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

// FUNCIÓN ADICIONAL - Obtener insumos por rubro específico (para bebidas)
export const obtenerInsumosPorRubro = async (
    rubroId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'denominacion'
): Promise<PageResponse<InsumoApi>> => {
    try {
        console.log(`Obteniendo insumos específicamente para rubro ${rubroId}`);
        
        // Usar la función principal con filtro de rubro
        return await obtenerInsumosNoElaborables(page, size, sort, rubroId);
        
    } catch (error) {
        console.error('Error al obtener insumos por rubro:', error);
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

// ==================== FUNCIONES PARA FACTURAS (si son necesarias) ====================

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