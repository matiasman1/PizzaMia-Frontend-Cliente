import React from "react";
import GenericTable from "../../../../../components/admin/GenericTable/GenericTable";
import iconReplenish from "../../../../../assets/admin/icon-replenish.svg";
import { getGenericColumns } from "../../../../../components/admin/GenericTable/getGenericColumns";
import { InsumoApi } from "../../../../../types/typesAdmin";
import shared from "../../styles/Common.module.css";

interface InsumosTableProps {
    insumos: InsumoApi[];
    onToggleEstado: (id: number) => void;
    onEditInsumo: (insumo: InsumoApi) => void;
    onReponerStock: (insumo: InsumoApi) => void;
}

const unidadMedidaLabel = (unidad: string) => {
    switch (unidad) {
        case "GRAMOS": return "gr";
        case "MILILITROS": return "ml";
        case "UNIDADES": return "u";
        default: return unidad;
    }
};

export const InsumosTable: React.FC<InsumosTableProps> = ({
    insumos,
    onToggleEstado,
    onEditInsumo,
    onReponerStock,
}) => {
    const columns = [
        { 
            header: "Imagen",
            key: "imagen",
            render: (_: any, row: InsumoApi) => (
                <div className={shared.tableImageContainer}>
                    {row.imagen?.urlImagen ? (
                        <img 
                            src={row.imagen.urlImagen} 
                            alt={row.denominacion}
                            className={shared.tableImage}
                        />
                    ) : (
                        <div className={shared.noTableImage}>-</div>
                    )}
                </div>
            ),
        },
        { header: "Insumo", key: "denominacion" },
        { 
            header: "Rubro", 
            key: "rubro", 
            render: (_: any, row: InsumoApi) => row.rubro?.denominacion || "-" 
        },
        {
            header: "Stock",
            key: "stockActual",
            render: (value: number, row: InsumoApi) => {
                let color = "#5ACD40";
                if (value === 0) color = "#D64C4C";
                else if (value < 1000) color = "#FAAE42";
                return (
                    <span
                        style={{
                            background: color,
                            color: "#fff",
                            borderRadius: 12,
                            padding: "4px 12px",
                            display: "inline-block",
                            minWidth: 60,
                        }}
                    >
                        {value} {unidadMedidaLabel(row.unidadMedida)}
                    </span>
                );
            },
        },
        {
            header: "Reponer",
            key: "reponer",
            render: (_: any, row: InsumoApi) => (
                <button
                    className={shared.actionButton}
                    onClick={() => onReponerStock(row)}
                    type="button"
                >
                    <img
                        src={iconReplenish}
                        alt="Reponer"
                        className={shared.actionIcon}
                    />
                </button>
            ),
        },
        ...getGenericColumns({
            onAlta: (row) => {
                if (row.estado === "Inactivo") onToggleEstado(row.id);
            },
            onBaja: (row) => {
                if (row.estado === "Activo") onToggleEstado(row.id);
            },
            onEditar: onEditInsumo,
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
            estadoKey: "estado",
        }),
    ];

    return <GenericTable columns={columns} data={insumos} />;
};

export default InsumosTable;