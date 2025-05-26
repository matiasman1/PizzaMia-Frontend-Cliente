import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import chevronUp from "../../../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../../../assets/admin/circle-chevron-down.svg";
import iconEdit from "../../../../assets/admin/icon-edit.svg";
import iconReplenish from "../../../../assets/admin/icon-replenish.svg";
import Button from "../../../../components/admin/Button/Button";
import styles from "./InsumosSection.module.css";
import lupaIcon from "../../../../assets/admin/icon-lupa.svg"; // Usa aquí el ícono de lupa que prefieras

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


    // Estado y lógica para modal, alta, baja, editar, etc. (puedes agregar según tu necesidad)

    // Función para obtener el valor numérico del stock
    const getStockValue = (stock: string) => {
        const match = stock.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    // Renderizado de columnas
    const columns = [
        { header: "Insumo", key: "insumo" },
        { header: "Rubro", key: "rubro" },
        {
            header: "Stock",
            key: "stock",
            render: (value: string) => {
                const stockValue = getStockValue(value);
                let color = "#5ACD40"; // verde por defecto
                if (stockValue === 0) color = "#D64C4C"; // rojo
                else if (stockValue < 1000) color = "#FAAE42"; // naranja
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
                    className={styles.actionButton}
                    onClick={() => alert(`Reponer insumo: ${row.insumo}`)}
                    type="button"
                >
                    <img
                        src={iconReplenish}
                        alt="Reponer"
                        className={styles.actionIcon}
                    />
                </button>
            ),
        },
        {
            header: "Estado",
            key: "estado",
            render: (value: string) => (
                <span
                    style={{
                        color: value === "Activo" ? "#5ACD40" : "#D64C4C",
                        fontWeight: 600,
                    }}
                >
                    {value}
                </span>
            ),
        },
        {
            header: "Alta",
            key: "alta",
            render: (_: any, row: any, rowIndex: number) => (
                <button
                    className={styles.actionButton}
                    onClick={() => {
                        if (row.estado === "Inactivo") {
                            setInsumos(insumos =>
                                insumos.map((ins, i) =>
                                    i === rowIndex
                                        ? { ...ins, estado: "Activo" }
                                        : ins
                                )
                            );
                        }
                    }}
                    disabled={row.estado === "Activo"}
                    type="button"
                >
                    <img
                        src={chevronUp}
                        alt="Alta"
                        className={styles.actionIcon}
                        style={{ opacity: row.estado === "Activo" ? 0.4 : 1 }}
                    />
                </button>
            ),
        },
        {
            header: "Baja",
            key: "baja",
            render: (_: any, row: any, rowIndex: number) => (
                <button
                    className={styles.actionButton}
                    onClick={() => {
                        if (row.estado === "Activo") {
                            setInsumos(insumos =>
                                insumos.map((ins, i) =>
                                    i === rowIndex
                                        ? { ...ins, estado: "Inactivo" }
                                        : ins
                                )
                            );
                        }
                    }}
                    disabled={row.estado === "Inactivo"}
                    type="button"
                >
                    <img
                        src={chevronDown}
                        alt="Baja"
                        className={styles.actionIcon}
                        style={{ opacity: row.estado === "Inactivo" ? 0.4 : 1 }}
                    />
                </button>
            ),
        },
        {
            header: "Editar",
            key: "editar",
            render: (_: any, row: any, rowIndex: number) => (
                <button
                    className={styles.actionButton}
                    onClick={() => alert(`Editar insumo: ${row.insumo}`)}
                    type="button"
                >
                    <img
                        src={iconEdit}
                        alt="Editar"
                        className={styles.actionIcon}
                    />
                </button>
            ),
        },
    ];

    const filteredInsumos = insumos.filter((item) =>
        item.insumo.toLowerCase().includes(search.toLowerCase()) ||
        item.rubro.toLowerCase().includes(search.toLowerCase()) ||
        item.stock.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.adminContent}>
            <div className={styles.adminContentRoles}>
                <div className={styles.adminContentTop}>
                    <Button
                        label="Nuevo +"
                        onClick={() => alert("Agregar nuevo insumo")}
                        className={styles.nuevoButton}
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
                <GenericTable columns={columns} data={filteredInsumos} />
            </div>
        </div>
    );
};

export default InsumosSection;