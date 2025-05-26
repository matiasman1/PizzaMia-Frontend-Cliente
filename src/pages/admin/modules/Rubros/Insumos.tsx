import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import chevronUp from "../../../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../../../assets/admin/circle-chevron-down.svg";
import iconEdit from "../../../../assets/admin/icon-edit.svg";
import iconAdd from "../../../../assets/admin/icon-add.svg";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Insumos.module.css";

// Datos de ejemplo para rubros y subrubros
const initialRubros = [
    { rubro: "Lacteo", padre: "", estado: "Activo" },
    { rubro: "Queso", padre: "Lacteo", estado: "Activo" },
    { rubro: "Leche", padre: "Lacteo", estado: "Activo" },
    { rubro: "Verdura", padre: "", estado: "Activo" },
];

const Insumos: React.FC = () => {
    const [rubros, setRubros] = useState(initialRubros);
    const [showModal, setShowModal] = useState(false);
    const [nuevoRubro, setNuevoRubro] = useState({
        rubro: "",
        padre: "",
        estado: "Activo",
    });
    const [error, setError] = useState("");

    const toggleEstado = (index: number) => {
        setRubros(rubros =>
            rubros.map((r, i) =>
                i === index
                    ? { ...r, estado: r.estado === "Activo" ? "Inactivo" : "Activo" }
                    : r
            )
        );
    };

    const handleNuevoRubro = (padre: string) => {
        setShowModal(true);
        setNuevoRubro({ rubro: "", padre, estado: "Activo" });
        setError("");
    };

    const handleEnviar = () => {
        if (!nuevoRubro.rubro.trim()) {
            setError("El nombre del rubro es obligatorio");
            return;
        }
        setRubros([...rubros, nuevoRubro]);
        setShowModal(false);
    };

    const columns = [
        { header: "Rubros", key: "rubro" },
        { header: "Padre", key: "padre", render: (value: string) => value || "-" },
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
            render: (_: any, _row: any, rowIndex: number) => (
                <button
                    className={styles.actionButton}
                    onClick={() => {
                        if (rubros[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
                    }}
                    disabled={rubros[rowIndex].estado === "Activo"}
                    type="button"
                >
                    <img
                        src={chevronUp}
                        alt="Alta"
                        className={styles.actionIcon}
                        style={{ opacity: rubros[rowIndex].estado === "Activo" ? 0.4 : 1 }}
                    />
                </button>
            ),
        },
        {
            header: "Baja",
            key: "baja",
            render: (_: any, _row: any, rowIndex: number) => (
                <button
                    className={styles.actionButton}
                    onClick={() => {
                        if (rubros[rowIndex].estado === "Activo") toggleEstado(rowIndex);
                    }}
                    disabled={rubros[rowIndex].estado === "Inactivo"}
                    type="button"
                >
                    <img
                        src={chevronDown}
                        alt="Baja"
                        className={styles.actionIcon}
                        style={{ opacity: rubros[rowIndex].estado === "Inactivo" ? 0.4 : 1 }}
                    />
                </button>
            ),
        },
        {
            header: "Editar",
            key: "editar",
            render: (_: any, _row: any, rowIndex: number) => (
                <button
                    className={styles.actionButton}
                    onClick={() => alert(`Editar rubro: ${rubros[rowIndex].rubro}`)}
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
        {
            header: "Sub-Rubro",
            key: "subrubro",
            render: (_: any, row: any) =>
                !row.padre ? (
                    <button
                        className={styles.actionButton}
                        onClick={() => handleNuevoRubro(row.rubro)}
                        type="button"
                    >
                        <img src={iconAdd} alt="Agregar sub-rubro" className={styles.actionIcon} />
                    </button>
                ) : null,
        },
    ];

    return (
        <div className={styles.adminContent}>
            <div className={styles.adminContentRoles}>
                <p>Administrador de rubros</p>
                <Button
                    label="Nuevo +"
                    onClick={() => handleNuevoRubro("")}
                    className={styles.nuevoButton}
                />
                <GenericTable columns={columns} data={rubros} />

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2>
                                {nuevoRubro.padre
                                    ? `Nuevo sub-rubro de: ${nuevoRubro.padre}`
                                    : "Nuevo rubro padre"}
                            </h2>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Ingrese el nombre del rubro"
                                value={nuevoRubro.rubro}
                                onChange={e => setNuevoRubro({ ...nuevoRubro, rubro: e.target.value })}
                            />
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.enviarButton}
                                    onClick={handleEnviar}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className={styles.salirButton}
                                    onClick={() => setShowModal(false)}
                                >
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insumos;