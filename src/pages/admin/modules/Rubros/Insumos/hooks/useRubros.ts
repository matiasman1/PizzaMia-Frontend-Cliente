// useRubros.ts
import { useState, useEffect } from "react";
import { 
    fetchRubrosTable, 
    patchEstadoRubro, 
    fetchRubros, 
    createRubro, 
    updateRubro 
} from "../../../../../../api/apiAdmin";
import { RubroTable, RubroApi } from "../../../../../../types/typesAdmin";

export const useRubros = () => {
    const [rubros, setRubros] = useState<RubroTable[]>([]);
    const [rubrosApi, setRubrosApi] = useState<RubroApi[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [tableData, apiData] = await Promise.all([
                fetchRubrosTable(),
                fetchRubros()
            ]);
            setRubros(tableData);
            setRubrosApi(apiData);
        } catch (error) {
            console.error("Error loading rubros:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleEstado = async (rowIndex: number) => {
        const rubro = rubros[rowIndex];
        try {
            await patchEstadoRubro(rubro.id);
            await loadData();
        } catch (error) {
            console.error("Error changing estado:", error);
            throw error;
        }
    };

    const handleCreateRubro = async (rubroData: {
        denominacion: string;
        tipoRubro: string;
        rubroPadre?: { id: string | number } | null;
    }) => {
        try {
            await createRubro(rubroData);
            await loadData();
        } catch (error) {
            console.error("Error creating rubro:", error);
            throw error;
        }
    };

    const handleUpdateRubro = async (id: number | string, rubroData: {
        denominacion: string;
        tipoRubro: string;
        rubroPadre?: { id: string | number } | null;
    }) => {
        try {
            await updateRubro(id, rubroData);
            await loadData();
        } catch (error) {
            console.error("Error updating rubro:", error);
            throw error;
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return {
        rubros,
        rubrosApi,
        loading,
        toggleEstado,
        handleCreateRubro,
        handleUpdateRubro
    };
};