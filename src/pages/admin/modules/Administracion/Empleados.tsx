import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import chevronUp from "../../../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../../../assets/admin/circle-chevron-down.svg";
import iconEdit from "../../../../assets/admin/icon-edit.svg";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Empleados.module.css";

const initialEmpleados = [
    { nombre: "Mariano", apellido: "Lugano", rol: "Cajero", estado: "Activo" },
    { nombre: "Lucas", apellido: "Chavez", rol: "Cocinero", estado: "Activo" },
    { nombre: "Geronimo", apellido: "Crescitelli", rol: "Admin", estado: "Inactivo" },
    { nombre: "Nicolas", apellido: "Silva", rol: "Cajero", estado: "Activo" },
];

const Empleados: React.FC = () => {
    const [empleados, setEmpleados] = useState(initialEmpleados);
    const [showModal, setShowModal] = useState(false);
    type NuevoEmpleado = {
        nombre: string;
        apellido: string;
        rol: string;
        estado: string;
        email?: string;
        telefono?: string;
        password?: string;
        repetirPassword?: string;
        localidad?: string;
        codigoPostal?: string;
        calle?: string;
    };
    
    const [nuevoEmpleado, setNuevoEmpleado] = useState<NuevoEmpleado>({
        nombre: "",
        apellido: "",
        rol: "",
        estado: "Activo",
        email: "",
        telefono: "",
        password: "",
        repetirPassword: "",
        localidad: "",
        codigoPostal: "",
        calle: "",
    });

    const [error, setError] = useState("");

    const toggleEstado = (index: number) => {
        setEmpleados(empleados =>
            empleados.map((emp, i) =>
                i === index
                    ? { ...emp, estado: emp.estado === "Activo" ? "Inactivo" : "Activo" }
                    : emp
            )
        );
    };

    const handleNuevoEmpleado = () => {
        setShowModal(true);
        setNuevoEmpleado({ nombre: "", apellido: "", rol: "", estado: "Activo" });
        setError("");
    };

    const handleEnviar = () => {
        if (!nuevoEmpleado.nombre.trim() || !nuevoEmpleado.apellido.trim() || !nuevoEmpleado.rol.trim()) {
            setError("Todos los campos son obligatorios");
            return;
        }
        setEmpleados([...empleados, nuevoEmpleado]);
        setShowModal(false);
    };

    const columns = [
        { header: "Nombre", key: "nombre" },
        { header: "Apellido", key: "apellido" },
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
                        if (empleados[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
                    }}
                    disabled={empleados[rowIndex].estado === "Activo"}
                    type="button"
                >
                    <img
                        src={chevronUp}
                        alt="Alta"
                        className={styles.actionIcon}
                        style={{ opacity: empleados[rowIndex].estado === "Activo" ? 0.4 : 1 }}
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
                        if (empleados[rowIndex].estado === "Activo") toggleEstado(rowIndex);
                    }}
                    disabled={empleados[rowIndex].estado === "Inactivo"}
                    type="button"
                >
                    <img
                        src={chevronDown}
                        alt="Baja"
                        className={styles.actionIcon}
                        style={{ opacity: empleados[rowIndex].estado === "Inactivo" ? 0.4 : 1 }}
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
                    onClick={() => alert(`Editar empleado: ${empleados[rowIndex].nombre} ${empleados[rowIndex].apellido}`)}
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
                <p>Administrador de Empleados</p>
                <Button
                    label="Nuevo +"
                    onClick={handleNuevoEmpleado}
                    className={styles.nuevoButton}
                />
                <GenericTable columns={columns} data={empleados} />

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2 style={{ width: "100%", textAlign: "center", marginBottom: 18 }}>Nuevo empleado</h2>
                            <div className={styles.modalFormGrid}>
                                {/* Sección Izquierda */}
                                <div className={styles.modalLeft}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Ingrese su nombre"
                                        value={nuevoEmpleado.nombre}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                                    />
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Ingrese su apellido"
                                        value={nuevoEmpleado.apellido}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
                                    />
                                    <input
                                        className={styles.input}
                                        type="email"
                                        placeholder="Ingrese su email"
                                        value={nuevoEmpleado.email || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })}
                                    />
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Ingrese su número de telefono"
                                        value={nuevoEmpleado.telefono || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })}
                                    />
                                    <input
                                        className={styles.input}
                                        type="password"
                                        placeholder="Ingrese contraseña"
                                        value={nuevoEmpleado.password || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, password: e.target.value })}
                                    />
                                    <input
                                        className={styles.input}
                                        type="password"
                                        placeholder="Repita contraseña"
                                        value={nuevoEmpleado.repetirPassword || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, repetirPassword: e.target.value })}
                                    />
                                </div>
                                {/* Sección Derecha */}
                                <div className={styles.modalRight}>
                                    <select
                                        className={styles.input}
                                        value={nuevoEmpleado.rol}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, rol: e.target.value })}
                                    >
                                        <option value="">Seleccione un rol</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Cocinero">Cocinero</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <select
                                        className={styles.input}
                                        value={nuevoEmpleado.localidad || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, localidad: e.target.value })}
                                    >
                                        <option value="">Seleccione una localidad</option>
                                        <option value="Centro">Centro</option>
                                        <option value="Norte">Norte</option>
                                        <option value="Sur">Sur</option>
                                    </select>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Ingrese codigo postal"
                                        value={nuevoEmpleado.codigoPostal || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, codigoPostal: e.target.value })}
                                    />
                                    <input
                                        className={styles.input}
                                        type="text"
                                        placeholder="Nombre de la calle"
                                        value={nuevoEmpleado.calle || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, calle: e.target.value })}
                                    />
                                    <div className={styles.checkRow}>
                                        <input
                                            type="checkbox"
                                            id="habilitado"
                                            checked={nuevoEmpleado.estado === "Activo"}
                                            onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, estado: e.target.checked ? "Activo" : "Inactivo" })}
                                        />
                                        <label htmlFor="habilitado" style={{ marginLeft: 8, fontSize: 16 }}>Habilitado</label>
                                    </div>
                                </div>
                            </div>
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

export default Empleados;