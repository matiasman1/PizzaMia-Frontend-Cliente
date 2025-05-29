import { 
    InsumoApi, 
    RegistroInsumoApi, 
    RubroApi, 
    RubroTable, 
    ArticuloManufacturadoApi,
    ArticuloManufacturadoDetalleApi
} from "../types/typesAdmin";

// Funciones para manejar Insumos en InsumosSection en el backend
export const fetchInsumos = async (): Promise<InsumoApi[]> => {
    const res = await fetch("/api/insumos");
    const data: InsumoApi[] = await res.json();
    return data.map(insumo => ({
        ...insumo,
        estado: insumo.fechaBaja === null ? "Activo" : "Inactivo"
    }));
};

export const patchEstadoInsumo = async (id: number) => {
    await fetch(`/api/insumos/${id}/estado`, { method: "PATCH" });
};


export const createInsumo = async (
    insumoData: {
        denominacion: string;
        unidadMedida: string;
        rubro: { id: string };
        precioCompra: number;
        precioVenta: number;
        esParaElaborar: boolean;
    }, 
    imageFile?: File
) => {
    // Crear FormData
    const formData = new FormData();
    
    // Agregar el JSON del insumo
    formData.append("insumo", new Blob([JSON.stringify(insumoData)], {
        type: 'application/json'
    }));
    
    // Agregar el archivo si existe
    if (imageFile) {
        formData.append("file", imageFile);
    }
    
    const res = await fetch("/api/insumos", {
        method: "POST",
        // No establecer Content-Type, lo hará automáticamente el navegador para FormData
        body: formData,
    });
    
    if (!res.ok) throw new Error('Error al crear el insumo');
    return res.json();
};

export const updateInsumo = async (id: number, insumoData: any, imageFile?: File) => {
    // Crear FormData
    const formData = new FormData();
    
    // Agregar el JSON del insumo
    formData.append("insumo", new Blob([JSON.stringify(insumoData)], {
        type: 'application/json'
    }));
    
    // Agregar el archivo si existe
    if (imageFile) {
        formData.append("file", imageFile);
    }
    
    const res = await fetch(`/api/insumos/${id}`, {
        method: "PUT",
        body: formData,
    });
    
    if (!res.ok) throw new Error('Error al actualizar el insumo');
    return res.json();
};



export const fetchRubros = async (): Promise<RubroApi[]> => {
    const res = await fetch("/api/rubros");
    if (!res.ok) throw new Error('Error al obtener rubros');
    return res.json();
};

// Funciones para manejar Rubros en RubrosSection en el backend
export const fetchRubrosTable = async (): Promise<RubroTable[]> => {
    const res = await fetch("/api/rubros");
    const data: RubroApi[] = await res.json();
    return data.map((r) => ({
        id: r.id,
        rubro: r.denominacion,
        padre: r.rubroPadre ? r.rubroPadre.denominacion : "",
        estado: r.fechaBaja === null ? "Activo" : "Inactivo",
    }));
};

export const patchEstadoRubro = async (id: number | string) => {
    await fetch(`/api/rubros/${id}/estado`, { method: "PATCH" });
};

export const createRubro = async (rubroData: {
    denominacion: string;
    tipoRubro: string;
    rubroPadre?: { id: string | number } | null;
}): Promise<RubroApi> => {
    const res = await fetch("/api/rubros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rubroData),
    });
    if (!res.ok) throw new Error('Error al crear el rubro');
    return res.json();
};

export const updateRubro = async (id: number | string, rubroData: {
    denominacion: string;
    tipoRubro: string;
    rubroPadre?: { id: string | number } | null;
}): Promise<RubroApi> => {
    const res = await fetch(`/api/rubros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rubroData),
    });
    if (!res.ok) throw new Error('Error al actualizar el rubro');
    return res.json();
};

// Funciones para manejar Registro de Insumos en RegistroInsumosSection en el backend
// Nueva función para registrar movimiento de stock (entrada)
export const createRegistroInsumo = async (registroData: RegistroInsumoApi) => {
    const res = await fetch("/api/registros-insumo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registroData),
    });
    if (!res.ok) throw new Error('Error al registrar movimiento de stock');
    return res.json();
};

// Funciones para manejar Artículos Manufacturados
export const fetchArticulosManufacturados = async (): Promise<ArticuloManufacturadoApi[]> => {
    const res = await fetch("/api/manufacturados");
    const data: ArticuloManufacturadoApi[] = await res.json();
    return data.map(articulo => ({
        ...articulo,
        estado: articulo.fechaBaja === null ? "Activo" : "Inactivo"
    }));
};

export const patchEstadoArticuloManufacturado = async (id: number) => {
    await fetch(`/api/manufacturados/${id}/estado`, { method: "PATCH" });
};

export const createArticuloManufacturado = async (
    articuloData: {
        denominacion: string;
        descripcion: string;
        tiempoEstimadoProduccion: number;
        rubro: { id: string | number };
        detalles: ArticuloManufacturadoDetalleApi[];
        precioVenta?: number;
        precioCosto?: number;
    }, 
    imageFile?: File
) => {
    // Crear FormData
    const formData = new FormData();
    
    // Agregar el JSON del artículo manufacturado
    formData.append("manufacturado", new Blob([JSON.stringify(articuloData)], {
        type: 'application/json'
    }));
    
    // Agregar el archivo si existe
    if (imageFile) {
        formData.append("file", imageFile);
    }
    
    const res = await fetch("/api/manufacturados", {
        method: "POST",
        // No establecer Content-Type, lo hará automáticamente el navegador para FormData
        body: formData,
    });
    
    if (!res.ok) throw new Error('Error al crear el artículo manufacturado');
    return res.json();
};

export const updateArticuloManufacturado = async (id: number, articuloData: any, imageFile?: File) => {
    // Crear FormData
    const formData = new FormData();
    
    // Agregar el JSON del artículo manufacturado
    formData.append("manufacturado", new Blob([JSON.stringify(articuloData)], {
        type: 'application/json'
    }));
    
    // Agregar el archivo si existe
    if (imageFile) {
        formData.append("file", imageFile);
    }
    
    const res = await fetch(`/api/manufacturados/${id}`, {
        method: "PUT",
        body: formData,
    });
    
    if (!res.ok) throw new Error('Error al actualizar el artículo manufacturado');
    return res.json();
};

// Obtener un artículo manufacturado por ID (conveniente para edición)
export const fetchArticuloManufacturadoById = async (id: number): Promise<ArticuloManufacturadoApi> => {
    const res = await fetch(`/api/manufacturados/${id}`);
    if (!res.ok) throw new Error('Error al obtener el artículo manufacturado');
    const data = await res.json();
    return {
        ...data,
        estado: data.fechaBaja === null ? "Activo" : "Inactivo"
    };
};