import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../components/admin/GenericTable/getGenericColumns";
import iconAdd from "../../../../assets/admin/icon-add.svg";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Insumos.module.css";
import shared from "../styles/Common.module.css";

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
        ...getGenericColumns({
            onAlta: (_row, rowIndex) => {
                if (rubros[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
            },
            onBaja: (_row, rowIndex) => {
                if (rubros[rowIndex].estado === "Activo") toggleEstado(rowIndex);
            },
            onEditar: (_row, rowIndex) => {
                alert(`Editar rubro: ${rubros[rowIndex].rubro}`);
                // Aquí puedes abrir tu modal de edición
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
                        onClick={() => handleNuevoRubro(row.rubro)}
                        type="button"
                    >
                        <img src={iconAdd} alt="Agregar sub-rubro" className={shared.actionIcon} />
                    </button>
                ) : null,
        },
    ];

    return (
        <div className={shared.adminContent}>
            <div className={shared.adminContentSection}>
                <p>Administrador de rubros</p>
                <Button
                    label="Nuevo +"
                    onClick={() => handleNuevoRubro("")}
                    className={shared.nuevoButton}
                />
                <GenericTable columns={columns} data={rubros} />

                {showModal && (
                    <div className={shared.modalOverlay}>
                        <div className={`${shared.modalContent} ${styles.modalContent}`}>
                            <h2>
                                {nuevoRubro.padre
                                    ? `Nuevo sub-rubro de: ${nuevoRubro.padre}`
                                    : "Nuevo rubro padre"}
                            </h2>
                            <input
                                className={`${shared.input} ${styles.input}`}
                                type="text"
                                placeholder="Ingrese el nombre del rubro"
                                value={nuevoRubro.rubro}
                                onChange={e => setNuevoRubro({ ...nuevoRubro, rubro: e.target.value })}
                            />
                            {error && <div className={shared.error}>{error}</div>}
                            <div className={shared.modalActions}>
                                <button
                                    className={shared.enviarButton}
                                    onClick={handleEnviar}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className={shared.salirButton}
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