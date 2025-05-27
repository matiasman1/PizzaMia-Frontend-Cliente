import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import iconReplenish from "../../../../assets/admin/icon-replenish.svg";
import Button from "../../../../components/admin/Button/Button";
import lupaIcon from "../../../../assets/admin/icon-lupa.svg";
import { getGenericColumns } from "../../../../components/admin/GenericTable/getGenericColumns";

import styles from "./InsumosSection.module.css";
import shared from "../styles/Common.module.css";

// Datos de ejemplo para insumos
const initialInsumos = [
    { insumo: "Mozarella", rubro: "Queso", stock: "1000 gr", estado: "Activo" },
    { insumo: "Tomate", rubro: "Verdura", stock: "4000 gr", estado: "Activo" },
    { insumo: "Aceite Oliva", rubro: "Aceite", stock: "0 ml", estado: "Inactivo" },
    { insumo: "Sal", rubro: "Condimento", stock: "2000 gr", estado: "Activo" },
    { insumo: "Pimienta", rubro: "Condimento", stock: "1500 gr", estado: "Activo" },
    { insumo: "Rucula", rubro: "Verdura", stock: "200 gr", estado: "Activo" },
    { insumo: "Sal", rubro: "Condimento", stock: "2000 gr", estado: "Activo" },
];

export const InsumosSection: React.FC = () => {
    const [insumos, setInsumos] = useState(initialInsumos);
    const [search, setSearch] = useState("");

    const getStockValue = (stock: string) => {
        const match = stock.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const columns = [
        { header: "Insumo", key: "insumo" },
        { header: "Rubro", key: "rubro" },
        {
            header: "Stock",
            key: "stock",
            render: (value: string) => {
                const stockValue = getStockValue(value);
                let color = "#5ACD40";
                if (stockValue === 0) color = "#D64C4C";
                else if (stockValue < 1000) color = "#FAAE42";
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
                        {value}
                    </span>
                );
            },
        },
        {
            header: "Reponer",
            key: "reponer",
            render: (_: any, row: any) => (
                <button
                    className={shared.actionButton}
                    onClick={() => alert(`Reponer insumo: ${row.insumo}`)}
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
            onAlta: (row, rowIndex) => {
                if (row.estado === "Inactivo") {
                    setInsumos(insumos =>
                        insumos.map((ins, i) =>
                            i === rowIndex ? { ...ins, estado: "Activo" } : ins
                        )
                    );
                }
            },
            onBaja: (row, rowIndex) => {
                if (row.estado === "Activo") {
                    setInsumos(insumos =>
                        insumos.map((ins, i) =>
                            i === rowIndex ? { ...ins, estado: "Inactivo" } : ins
                        )
                    );
                }
            },
            onEditar: (row) => {
                alert(`Editar insumo: ${row.insumo}`);
                // Aquí puedes abrir tu modal de edición
            },
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
        }),
    ];

    const filteredInsumos = insumos.filter((item) =>
        item.insumo.toLowerCase().includes(search.toLowerCase()) ||
        item.rubro.toLowerCase().includes(search.toLowerCase()) ||
        item.stock.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`${shared.adminContent} ${styles.adminContent}`}>
            <div className={shared.adminContentSection}>
                <div className={styles.adminContentTop}>
                    <Button
                        label="Nuevo +"
                        onClick={() => alert("Agregar nuevo insumo")}
                        className={shared.nuevoButton}
                    />
                    <p className={styles.tituloCentrado}>Administrador de insumos</p>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className={styles.inputSearch}
                        />
                        <img src={lupaIcon} alt="Buscar" className={styles.lupaIcon} />
                    </div>
                </div>
                <GenericTable columns={columns} data={filteredInsumos}/>
            </div>
        </div>
    );
};

export default InsumosSection;