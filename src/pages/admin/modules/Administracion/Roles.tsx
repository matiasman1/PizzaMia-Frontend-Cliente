import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import chevronUp from "../../../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../../../assets/admin/circle-chevron-down.svg";
import Button from "../../../../components/admin/Button/Button";
import styles from "./roles.module.css";

const initialRoles = [
    { rol: "Admin", estado: "Activo" },
    { rol: "Cliente", estado: "Activo" },
    { rol: "Cajero", estado: "Inactivo" },
    { rol: "Cocinero", estado: "Activo" },
];

const Roles: React.FC = () => {
    const [roles, setRoles] = useState(initialRoles);
    const [showModal, setShowModal] = useState(false);
    const [nuevoRol, setNuevoRol] = useState("");
    const [error, setError] = useState("");

    const toggleEstado = (index: number) => {
        setRoles(roles =>
            roles.map((r, i) =>
                i === index
                    ? { ...r, estado: r.estado === "Activo" ? "Inactivo" : "Activo" }
                    : r
            )
        );
    };

    const handleNuevoRol = () => {
        setShowModal(true);
        setNuevoRol("");
        setError("");
    };

    const handleEnviar = () => {
        if (!nuevoRol.trim()) {
            setError("El nombre del rol es obligatorio");
            return;
        }
        if (roles.some(r => r.rol.toLowerCase() === nuevoRol.trim().toLowerCase())) {
            setError("Ese rol ya existe");
            return;
        }
        setRoles([...roles, { rol: nuevoRol.trim(), estado: "Activo" }]);
        setShowModal(false);
    };

    const columns = [
        { header: "Rol", key: "rol" },
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
                        if (roles[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
                    }}
                    disabled={roles[rowIndex].estado === "Activo"}
                    type="button"
                >
                    <img
                        src={chevronUp}
                        alt="Alta"
                        className={styles.actionIcon}
                        style={{ opacity: roles[rowIndex].estado === "Activo" ? 0.4 : 1 }}
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
                        if (roles[rowIndex].estado === "Activo") toggleEstado(rowIndex);
                    }}
                    disabled={roles[rowIndex].estado === "Inactivo"}
                    type="button"
                >
                    <img
                        src={chevronDown}
                        alt="Baja"
                        className={styles.actionIcon}
                        style={{ opacity: roles[rowIndex].estado === "Inactivo" ? 0.4 : 1 }}
                    />
                </button>
            ),
        },
    ];

    return (
        <div className={styles.adminContent}>
            <div className={styles.adminContentRoles}>
                <p>Administrador de Roles</p>
                <Button
                    label="Nuevo +"
                    onClick={handleNuevoRol}
                    className={styles.nuevoButton}
                />
                <GenericTable columns={columns} data={roles} />

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2>Nuevo rol</h2>
                            <label>Nombre</label>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Nombre del nuevo rol"
                                value={nuevoRol}
                                onChange={e => setNuevoRol(e.target.value)}
                            />
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.enviarButton}
                                    onClick={handleEnviar}
                                >
                                    Enviar
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

export default Roles;