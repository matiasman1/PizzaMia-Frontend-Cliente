import { ArticuloManufacturadoApi, InsumoApi, RubroApi, PedidoVentaRequest, PedidoVentaResponse, ClienteApi } from '../types/typesClient';

const API_BASE_URL = 'http://localhost:8080/api'; // Ajusta esta URL a tu API real

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
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        const response = await fetch(`${API_BASE_URL}/manufacturados?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
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
        const params = new URLSearchParams({
            rubroId: rubroId.toString(),
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        const response = await fetch(`${API_BASE_URL}/manufacturados/por-rubro?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
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
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort,
            rubroId: rubroId.toString()  // Añadimos siempre el parámetro rubroId
        });

        const response = await fetch(`${API_BASE_URL}/insumos/no-elaborables?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
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
        const params = new URLSearchParams({
            rubroId: rubroId.toString(),
            page: page.toString(),
            size: size.toString(),
            sort: sort
        });

        const response = await fetch(`${API_BASE_URL}/insumos/no-elaborables?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
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
        const response = await fetch(`${API_BASE_URL}/rubros`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener rubros:', error);
        throw error;
    }
};

// Obtener un rubro por ID
export const obtenerRubroPorId = async (id: number): Promise<RubroApi> => {
    try {
        const response = await fetch(`${API_BASE_URL}/rubros/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener rubro con ID ${id}:`, error);
        throw error;
    }
};

// Crear un nuevo pedido
export const crearPedido = async (pedido: PedidoVentaRequest): Promise<PedidoVentaResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Añadir token de autenticación si es necesario
                // 'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(pedido),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear pedido:', error);
        throw error;
    }
};

// Crear preferencia de pago con Mercado Pago
export const crearPreferenciaMercadoPago = async (pedidoId: number): Promise<string> => {
    try {
        const url = `${API_BASE_URL}/mercadopago/crear-preferencia/${pedidoId}`;
        console.log("Intentando crear preferencia de pago en:", url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Obtener el texto de la respuesta primero
        const responseText = await response.text();
        console.log("Respuesta del servidor:", responseText);

        if (!response.ok) {
            // Usar el texto directamente como mensaje de error
            throw new Error(responseText || `Error del servidor: ${response.status}`);
        }

        // Si llegamos aquí, la respuesta es exitosa
        return responseText; // La URL de checkout como string
    } catch (error) {
        console.error('Error al crear preferencia de pago:', error);
        throw error;
    }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (id: number): Promise<ClienteApi> => {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener cliente con ID ${id}:`, error);
        throw error;
    }
};
