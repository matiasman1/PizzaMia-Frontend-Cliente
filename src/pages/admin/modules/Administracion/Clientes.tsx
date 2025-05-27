import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../components/admin/GenericTable/getGenericColumns";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Clientes.module.css";
import shared from "../styles/Common.module.css";

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
        ...getGenericColumns({
            onAlta: (_row, rowIndex) => {
                if (clientes[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
            },
            onBaja: (_row, rowIndex) => {
                if (clientes[rowIndex].estado === "Activo") toggleEstado(rowIndex);
            },
            onEditar: (_rowIndex) => {
                alert(`Editar cliente: ${clientes[_rowIndex].nombre} ${clientes[_rowIndex].apellido}`);
                // Aquí puedes abrir tu modal de edición
            },
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
        }),
    ];

    return (
        <div className={shared.adminContent}>
            <div className={shared.adminContentSection}>
                <p>Administrador de Clientes</p>
                <Button
                    label="Nuevo +"
                    onClick={handleNuevoCliente}
                    className={shared.nuevoButton}
                />
                <GenericTable columns={columns} data={clientes} />

                {showModal && (
                    <div className={shared.modalOverlay}>
                        <div className={`${shared.modalContent} ${styles.modalContent}`}>
                            <h2>Nuevo cliente</h2>
                            <input
                                className={`${shared.input} ${styles.input}`}
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={nuevoCliente.nombre}
                                onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                            />
                            <input
                                className={`${shared.input} ${styles.input}`}
                                type="text"
                                placeholder="Ingrese su apellido"
                                value={nuevoCliente.apellido}
                                onChange={e => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
                            />
                            <input
                                className={`${shared.input} ${styles.input}`}
                                type="text"
                                placeholder="Ingrese su usuario"
                                value={nuevoCliente.usuario}
                                onChange={e => setNuevoCliente({ ...nuevoCliente, usuario: e.target.value })}
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

export default Clientes;