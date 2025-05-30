import React from "react";
import GenericTable from "../../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../../components/admin/GenericTable/getGenericColumns";
import { ArticuloManufacturadoApi } from "../../../../../types/typesAdmin";
import shared from "../../styles/Common.module.css";
// Importa el ícono para ver la receta (puedes usar uno adecuado)
import styles from "../ProductosSection.module.css"; // Asegúrate de tener este archivo CSS
import iconRecipe from "../../../../../assets/admin/icon-recipe.svg"; // Asegúrate de tener este ícono

interface ProductosTableProps {
    productos: ArticuloManufacturadoApi[];
    onToggleEstado: (id: number) => void;
    onEditProducto: (producto: ArticuloManufacturadoApi) => void;
    onVerReceta: (producto: ArticuloManufacturadoApi) => void; // Nueva prop
}

export const ProductosTable: React.FC<ProductosTableProps> = ({
    productos,
    onToggleEstado,
    onEditProducto,
    onVerReceta,
}) => {
    const columns = [
        { 
            header: "Imagen",
            key: "imagen",
            render: (_: any, row: ArticuloManufacturadoApi) => (
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
        { header: "Producto", key: "denominacion" },
        { 
            header: "Rubro", 
            key: "rubro", 
            render: (_: any, row: ArticuloManufacturadoApi) => row.rubro?.denominacion || "-" 
        },
        {
            header: "Tiempo Prep.",
            key: "tiempoEstimadoProduccion",
            render: (value: number) => (
                <span>
                    {value} min
                </span>
            ),
        },
        {
            header: "Costo",
            key: "precioCosto",
            render: (value: number) => (
                <span>
                    ${value.toFixed(2)}
                </span>
            ),
        },
        {
            header: "Precio",
            key: "precioVenta",
            render: (value: number) => (
                <span>
                    ${value.toFixed(2)}
                </span>
            ),
        },
        {
            header: "Ver Receta",
            key: "verReceta",
            render: (_: any, row: ArticuloManufacturadoApi) => (
                <button
                    className={shared.actionButton}
                    onClick={() => onVerReceta(row)}
                    type="button"
                >
                    <img
                        src={iconRecipe}
                        alt="Ver Receta"
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
            onEditar: onEditProducto,
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
            estadoKey: "estado",
        }),
    ];

    return <GenericTable columns={columns} data={productos} className={styles.tableContainer}/>;
};

export default ProductosTable;