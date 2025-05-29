// RubrosTable.tsx
import React, { useMemo } from "react";
import GenericTable from "../../../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../../../components/admin/GenericTable/getGenericColumns";
import iconAdd from "../../../../../../assets/admin/icon-add.svg";
import { RubroTable, RubroApi } from "../../../../../../types/typesAdmin";
import shared from "../../../styles/Common.module.css";

interface RubrosTableProps {
    rubros: RubroTable[];
    rubrosApi: RubroApi[];
    onToggleEstado: (rowIndex: number) => void;
    onAddSubrubro: (padre: string) => void;
    onEditRubro: (rowIndex: number) => void;
}

const RubrosTable: React.FC<RubrosTableProps> = ({
    rubros,
    rubrosApi,
    onToggleEstado,
    onAddSubrubro,
    onEditRubro
}) => {
    // Reorganizar rubros usando la información de rubrosApi para relaciones jerárquicas más precisas
    const organizedRubros = useMemo(() => {
        // Crear un mapa para acceder fácilmente a los objetos RubroTable por su id
        const rubroMap = new Map<string | number, RubroTable>();
        rubros.forEach(rubro => {
            rubroMap.set(rubro.id, rubro);
        });
        
        // Crear un mapa para acceder fácilmente a los objetos RubroApi por su denominación
        const rubroApiByName = new Map<string, RubroApi>();
        rubrosApi.forEach(rubro => {
            rubroApiByName.set(rubro.denominacion, rubro);
        });
        
        // Identificar los rubros padre (sin rubroPadre) que sean de tipo MANUFACTURADO
        const padres = rubrosApi.filter(r => !r.rubroPadre && r.tipoRubro === "MANUFACTURADO");
        
        // Función recursiva para agregar padres y sus hijos en orden jerárquico
        const getHierarchy = (rubrosArr: RubroApi[]): RubroTable[] => {
            const result: RubroTable[] = [];
            
            // Para cada rubro padre
            rubrosArr.forEach(padre => {
                // Buscar la versión RubroTable de este rubro
                const padreTable = rubroMap.get(padre.id);
                if (padreTable) {
                    // Agregar el padre
                    result.push(padreTable);
                    
                    // Buscar sus hijos directos usando rubrosApi (solo los de tipo MANUFACTURADO)
                const hijos = rubrosApi.filter(r => 
                    r.rubroPadre && 
                    r.rubroPadre.id === padre.id && 
                    r.tipoRubro === "MANUFACTURADO"
                );
                    
                    // Si tiene hijos, procesarlos recursivamente
                    if (hijos.length > 0) {
                        // Convertir hijos de RubroApi a RubroTable
                        hijos.forEach(hijo => {
                            const hijoTable = rubroMap.get(hijo.id);
                            if (hijoTable) {
                                result.push(hijoTable);
                            }
                        });
                    }
                }
            });
            
            return result;
        };
        
        return getHierarchy(padres);
    }, [rubros, rubrosApi]);

    // Crear un mapeo de índices originales a nuevos índices organizados
    const indexMap = useMemo(() => {
        const map = new Map<number, number>();
        organizedRubros.forEach((rubro, newIndex) => {
            const originalIndex = rubros.findIndex(r => r.id === rubro.id);
            if (originalIndex !== -1) {
                map.set(newIndex, originalIndex);
            }
        });
        return map;
    }, [organizedRubros, rubros]);

    const columns = [
        { 
            header: "Rubros", 
            key: "rubro",
            render: (value: string, row: RubroTable) => (
                <div style={{ 
                    paddingLeft: row.padre ? '20px' : '0', 
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {row.padre && <span style={{ marginRight: '5px' }}>↳</span>}
                    {value}
                </div>
            )
        },
        { header: "Padre", key: "padre", render: (value: string) => value || "-" },
        ...getGenericColumns({
            onAlta: (_row, rowIndex) => {
                const originalIndex = indexMap.get(rowIndex) ?? rowIndex;
                if (rubros[originalIndex].estado === "Inactivo") onToggleEstado(originalIndex);
            },
            onBaja: (_row, rowIndex) => {
                const originalIndex = indexMap.get(rowIndex) ?? rowIndex;
                if (rubros[originalIndex].estado === "Activo") onToggleEstado(originalIndex);
            },
            onEditar: (_row, rowIndex) => {
                const originalIndex = indexMap.get(rowIndex) ?? rowIndex;
                onEditRubro(originalIndex);
            },
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
        }),
        {
            header: "Sub-Rubro",
            key: "subrubro",
            render: (_: any, row: any) =>
                !row.padre ? (
                    <button
                        className={shared.actionButton}
                        onClick={() => onAddSubrubro(row.rubro)}
                        type="button"
                    >
                        <img src={iconAdd} alt="Agregar sub-rubro" className={shared.actionIcon} />
                    </button>
                ) : null,
        },
    ];

    return <GenericTable columns={columns} data={organizedRubros} />;
};

export default RubrosTable;