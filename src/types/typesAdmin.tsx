export type InsumoApi = {
    id: number;
    denominacion: string;
    precioCompra: number;
    precioVenta: number;
    esParaElaborar: boolean;
    stockActual: number;
    unidadMedida: string;
    rubro: { id: number; denominacion: string };
    fechaAlta: string;
    fechaBaja: string | null;
    estado?: string;
    imagen?: { id?: number; urlImagen: string }; 
};

// Nuevo tipo para RegistroInsumo
export type RegistroInsumoApi = {
    cantidad: number;
    tipoMovimiento: "INGRESO" | "EGRESO"; // Asumiendo que estos son los tipos
    motivo?: string;
    articuloInsumo: { id: number };
    sucursal: { id: number };
};

// Para Insumos.tsx (Rubros)
export type RubroApi = {
    id: number | string;
    denominacion: string;
    tipoRubro: string;
    rubroPadre?: RubroApi | null; // Permite objeto completo o null
    fechaAlta: string;
    fechaBaja: string | null;
};

export type RubroTable = {
    id: number | string;
    rubro: string;
    padre: string;
    estado: string;
};

// Nuevos tipos para Artículos Manufacturados

export type ArticuloManufacturadoDetalleApi = {
    id?: number;
    cantidad: number;
    articuloInsumo: {
        id: number;
        denominacion?: string;
        unidadMedida?: string;
        precioCompra?: number;
    };
};

export type ArticuloManufacturadoApi = {
    id: number;
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    precioCosto: number;
    tiempoEstimadoProduccion: number;
    detalles: ArticuloManufacturadoDetalleApi[];
    imagen: {
        id?: number;
        urlImagen: string;
    };
    rubro: {
        id: number;
        denominacion: string;
    };
    fechaAlta: string;
    fechaBaja: string | null;
    estado?: string; // Calculado en el frontend
};

// Para la tabla de artículos manufacturados
export type ArticuloManufacturadoTable = {
    id: number;
    nombre: string;
    rubro: string;
    precioVenta: number;
    tiempoPreparacion: number;
    estado: string;
    imagen?: string; // URL de la imagen para mostrar en la tabla
};