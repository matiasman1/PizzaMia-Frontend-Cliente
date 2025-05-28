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
    imagen?: { urlImagen: string }; // <-- Cambia aquí
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