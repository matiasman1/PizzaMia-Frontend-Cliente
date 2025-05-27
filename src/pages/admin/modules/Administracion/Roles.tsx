import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../components/admin/GenericTable/getGenericColumns";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Roles.module.css";
import shared from "../styles/Common.module.css";

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
        ...getGenericColumns({
            onAlta: (_row, rowIndex) => {
                if (roles[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
            },
            onBaja: (_row, rowIndex) => {
                if (roles[rowIndex].estado === "Activo") toggleEstado(rowIndex);
            },
            onEditar: (_: any, rowIndex) => {
                alert(`Editar rol: ${roles[rowIndex].rol}`);
                // Aquí puedes abrir tu modal de edición
            },
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
        }),
    ];

    return (
        <div className={shared.adminContent}>
            <div className={shared.adminContentSection}>
                <p>Administrador de Roles</p>
                <Button
                    label="Nuevo +"
                    onClick={handleNuevoRol}
                    className={shared.nuevoButton}
                />
                <GenericTable columns={columns} data={roles} />

                {showModal && (
                    <div className={shared.modalOverlay}>
                        <div className={`${shared.modalContent} ${styles.modalContent}`}>
                            <h2>Nuevo rol</h2>
                            <label>Nombre</label>
                            <input
                                className={`${shared.input} ${styles.input}`}
                                type="text"
                                placeholder="Nombre del nuevo rol"
                                value={nuevoRol}
                                onChange={e => setNuevoRol(e.target.value)}
                            />
                            {error && <div className={shared.error}>{error}</div>}
                            <div className={shared.modalActions}>
                                <button
                                    className={shared.enviarButton}
                                    onClick={handleEnviar}
                                >
                                    Enviar
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

export default Roles;