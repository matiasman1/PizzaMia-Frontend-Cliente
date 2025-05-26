import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import chevronUp from "../../../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../../../assets/admin/circle-chevron-down.svg";
import iconEdit from "../../../../assets/admin/icon-edit.svg";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Clientes.module.css";

const initialClientes = [
    { nombre: "Mariano", apellido: "Lugano", usuario: "Marian99", estado: "Activo" },
    { nombre: "Lucas", apellido: "Chavez", usuario: "Lucha12", estado: "Activo" },
    { nombre: "Geronimo", apellido: "Crescitelli", usuario: "Gero2001", estado: "Inactivo" },
    { nombre: "Nicolas", apellido: "Silva", usuario: "ElTanque", estado: "Activo" },
];

const Clientes: React.FC = () => {
    const [clientes, setClientes] = useState(initialClientes);
    const [showModal, setShowModal] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: "",
        apellido: "",
        usuario: "",
        estado: "Activo",
    });
    const [error, setError] = useState("");

    const toggleEstado = (index: number) => {
        setClientes(clientes =>
            clientes.map((cli, i) =>
                i === index
                    ? { ...cli, estado: cli.estado === "Activo" ? "Inactivo" : "Activo" }
                    : cli
            )
        );
    };

    const handleNuevoCliente = () => {
        setShowModal(true);
        setNuevoCliente({ nombre: "", apellido: "", usuario: "", estado: "Activo" });
        setError("");
    };

    const handleEnviar = () => {
        if (!nuevoCliente.nombre.trim() || !nuevoCliente.apellido.trim() || !nuevoCliente.usuario.trim()) {
            setError("Todos los campos son obligatorios");
            return;
        }
        setClientes([...clientes, nuevoCliente]);
        setShowModal(false);
    };

    const columns = [
        { header: "Nombre", key: "nombre" },
        { header: "Apellido", key: "apellido" },
        { header: "Usuario", key: "usuario" },
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
                        if (clientes[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
                    }}
                    disabled={clientes[rowIndex].estado === "Activo"}
                    type="button"
                >
                    <img
                        src={chevronUp}
                        alt="Alta"
                        className={styles.actionIcon}
                        style={{ opacity: clientes[rowIndex].estado === "Activo" ? 0.4 : 1 }}
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
                        if (clientes[rowIndex].estado === "Activo") toggleEstado(rowIndex);
                    }}
                    disabled={clientes[rowIndex].estado === "Inactivo"}
                    type="button"
                >
                    <img
                        src={chevronDown}
                        alt="Baja"
                        className={styles.actionIcon}
                        style={{ opacity: clientes[rowIndex].estado === "Inactivo" ? 0.4 : 1 }}
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
                    onClick={() => alert(`Editar cliente: ${clientes[rowIndex].nombre} ${clientes[rowIndex].apellido}`)}
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

    return (
        <div className={styles.adminContent}>
            <div className={styles.adminContentRoles}>
                <p>Administrador de Clientes</p>
                <Button
                    label="Nuevo +"
                    onClick={handleNuevoCliente}
                    className={styles.nuevoButton}
                />
                <GenericTable columns={columns} data={clientes} />

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2>Nuevo cliente</h2>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={nuevoCliente.nombre}
                                onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                            />
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Ingrese su apellido"
                                value={nuevoCliente.apellido}
                                onChange={e => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
                            />
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Ingrese su usuario"
                                value={nuevoCliente.usuario}
                                onChange={e => setNuevoCliente({ ...nuevoCliente, usuario: e.target.value })}
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

export default Clientes;