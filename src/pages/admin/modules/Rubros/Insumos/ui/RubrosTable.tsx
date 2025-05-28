// RubrosTable.tsx
import React from "react";
import GenericTable from "../../../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../../../components/admin/GenericTable/getGenericColumns";
import iconAdd from "../../../../../../assets/admin/icon-add.svg";
import { RubroTable } from "../../../../../../types/typesAdmin";
import shared from "../../../styles/Common.module.css";

interface RubrosTableProps {
    rubros: RubroTable[];
    rubrosApi: any[];
    onToggleEstado: (rowIndex: number) => void;
    onAddSubrubro: (padre: string) => void;
    onEditRubro: (rowIndex: number) => void;
}

const RubrosTable: React.FC<RubrosTableProps> = ({
    rubros,
    onToggleEstado,
    onAddSubrubro,
    onEditRubro
}) => {
    const columns = [
        { header: "Rubros", key: "rubro" },
        { header: "Padre", key: "padre", render: (value: string) => value || "-" },
        ...getGenericColumns({
            onAlta: (_row, rowIndex) => {
                if (rubros[rowIndex].estado === "Inactivo") onToggleEstado(rowIndex);
            },
            onBaja: (_row, rowIndex) => {
                if (rubros[rowIndex].estado === "Activo") onToggleEstado(rowIndex);
            },
            onEditar: (_row, rowIndex) => {
                onEditRubro(rowIndex);
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

    return <GenericTable columns={columns} data={rubros} />;
};

export default RubrosTable;