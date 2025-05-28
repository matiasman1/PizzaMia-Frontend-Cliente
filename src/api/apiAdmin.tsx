import { InsumoApi, RubroApi, RubroTable } from "../types/typesAdmin";

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

export const createInsumo = async (insumoData: {
    denominacion: string;
    unidadMedida: string;
    rubro: { id: string };
    precioCompra: number;
    precioVenta: number;
    esParaElaborar: boolean;
}) => {
    const res = await fetch("/api/insumos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insumoData),
    });
    if (!res.ok) throw new Error('Error al crear el insumo');
    return res.json();
};

export const updateInsumo = async (id: number, insumoData: any) => {
    const res = await fetch(`/api/insumos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insumoData),
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