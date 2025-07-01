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
    denominacion?: string;
    precioVenta?: number;
    imagen?: ImagenApi;
  };
  articuloManufacturado?: {
    id: number;
    denominacion?: string;
    precioVenta?: number;
    imagen?: ImagenApi;
  };
  promocion?: {
    id: number;
    denominacion?: string;
    precioVenta?: number;
    imagen?: ImagenApi;
  };
};

export type ImagenApi = {
  id?: number;
  urlImagen: string;
}

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
  active: boolean; // Cambiar isActive por active
};

export type DomicilioCreateRequest = {
  calle: string;
  numero: number;
  codigoPostal: number;
  localidad: {
    id: number;
  };
  isActive: boolean; // Este mantenerlo como isActive porque así lo espera tu endpoint de creación
};

export type UsuarioApi = {
  id?: number;
  authOId: string;
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

// Añadir después de ClienteApi

export type ClienteUpdateDTO = {
  nombre: string;
  apellido: string;
  telefono: number;
  email: string;
  auth0Id: string;
};

// Añadir estos nuevos tipos al final del archivo

// Tipo para los detalles de una promoción
export type PromocionDetalleApi = {
    id: number;
    cantidad: number;
    articuloInsumo?: {
        id: number;
        denominacion?: string;
        precioVenta?: number;
        imagen?: ImagenApi;
    };
    articuloManufacturado?: {
        id: number;
        denominacion?: string;
        precioVenta?: number;
        imagen?: ImagenApi;
    };
};

// Tipo para una promoción completa
export type PromocionApi = {
    id: number;
    fechaInicio: string; // En formato ISO: "2025-06-01"
    fechaFin: string;    // En formato ISO: "2025-06-30"
    descuento: number;   // Porcentaje de descuento (ej: 10, 20)
    precio: number;      // Precio calculado con el descuento
    denominacion: string; // Nombre de la promoción
    descripcion?: string; // Descripción opcional
    detalles: PromocionDetalleApi[];
    imagen?: ImagenApi;   // Imagen de la promoción
    fechaAlta: string;
    fechaBaja: string | null;
    estado?: string;     // Calculado en el frontend (ACTIVO/INACTIVO)
};

// Tipo para la vista de una promoción en la interfaz
export type PromocionItemType = {
    item: PromocionApi;
    esPromocion: true;
};