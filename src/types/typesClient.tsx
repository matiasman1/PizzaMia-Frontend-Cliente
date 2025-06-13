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
    id: number;  // Cambiado de string | number a number
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

// Tipos para la creación de pedidos

export enum TipoEnvio {
  DELIVERY = 'DELIVERY',
  LOCAL = 'LOCAL'
}

export enum TipoPago {
  EFECTIVO = 'EFECTIVO',
  MERCADOPAGO = 'MERCADOPAGO'
}

// Tipo para un detalle de pedido
export type PedidoVentaDetalle = {
  cantidad: number;
  articuloInsumo?: {
    id: number;
  };
  articuloManufacturado?: {
    id: number;
  };
  promocion?: {
    id: number;
  };
};

// Tipo para el pedido completo
export type PedidoVentaRequest = {
  horaEstimadaFinalizacion: string; // Formato ISO: "2025-04-23T20:00:00"
  estado: {
    id: number;
  };
  tipoEnvio: TipoEnvio;
  tipoPago: TipoPago;
  detalles: PedidoVentaDetalle[];
  cliente: {
    id: number;
  };
  empleado: {
    id: number;
  };
};

// Tipo para la respuesta del servidor al crear un pedido
export type PedidoVentaResponse = {
  id: number;
  fechaAlta?: string;
  horaEstimadaFinalizacion: string;
  total: number;
  totalCosto?: number;
  estado: {
    id: number;
    denominacion: string;
  };
  tipoEnvio: TipoEnvio;
  tipoPago: TipoPago;
  detalles: PedidoVentaDetalle[];
  cliente: {
    id: number;
  };
  empleado: {
    id: number;
  };
};

// Añadir estos tipos al archivo existente

export type LocalidadApi = {
  id: number;
  nombre: string;
  provincia?: {
    id: number;
    nombre: string;
  };
};

export type DomicilioApi = {
  id: number;
  calle: string;
  numero: number;
  codigoPostal: number;
  localidad: LocalidadApi;
  isActive: boolean;
};

export type UsuarioApi = {
  id: number;
  username: string;
  // Otros campos relevantes del usuario
};

export type ClienteApi = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: number;
  email: string;
  user: UsuarioApi;
  domicilios: DomicilioApi[];
  fechaAlta: string;
  fechaBaja: string | null;
};