import React, { useState } from "react";
import GenericTable from "../../../../components/admin/GenericTable/GenericTable";
import { getGenericColumns } from "../../../../components/admin/GenericTable/getGenericColumns";
import Button from "../../../../components/admin/Button/Button";
import styles from "./Empleados.module.css";
import shared from "../styles/Common.module.css";

const initialEmpleados = [
    { nombre: "Mariano", apellido: "Lugano", rol: "Cajero", estado: "Activo" },
    { nombre: "Lucas", apellido: "Chavez", rol: "Cocinero", estado: "Activo" },
    { nombre: "Geronimo", apellido: "Crescitelli", rol: "Admin", estado: "Inactivo" },
    { nombre: "Nicolas", apellido: "Silva", rol: "Cajero", estado: "Activo" },
];

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

const Empleados: React.FC = () => {
    const [empleados, setEmpleados] = useState(initialEmpleados);
    const [showModal, setShowModal] = useState(false);
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
        ...getGenericColumns({
            onAlta: (_row, rowIndex) => {
                if (empleados[rowIndex].estado === "Inactivo") toggleEstado(rowIndex);
            },
            onBaja: (_row, rowIndex) => {
                if (empleados[rowIndex].estado === "Activo") toggleEstado(rowIndex);
            },
            onEditar: (_: unknown, rowIndex) => {
                alert(`Editar empleado: ${empleados[rowIndex].nombre} ${empleados[rowIndex].apellido}`);
                // Aquí puedes abrir tu modal de edición
            },
            disabledAlta: row => row.estado === "Activo",
            disabledBaja: row => row.estado === "Inactivo",
        }),
    ];

    return (
        <div className={shared.adminContent}>
            <div className={shared.adminContentSection}>
                <p>Administrador de Empleados</p>
                <Button
                    label="Nuevo +"
                    onClick={handleNuevoEmpleado}
                    className={shared.nuevoButton}
                />
                <GenericTable columns={columns} data={empleados} />

                {showModal && (
                    <div className={shared.modalOverlay}>
                        <div className={`${shared.modalContent} ${styles.modalContent}`}>
                            <h2 style={{ width: "100%", textAlign: "center", marginBottom: 18 }}>Nuevo empleado</h2>
                            <div className={styles.modalFormGrid}>
                                {/* Sección Izquierda */}
                                <div className={styles.modalLeft}>
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="text"
                                        placeholder="Ingrese su nombre"
                                        value={nuevoEmpleado.nombre}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                                    />
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="text"
                                        placeholder="Ingrese su apellido"
                                        value={nuevoEmpleado.apellido}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
                                    />
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="email"
                                        placeholder="Ingrese su email"
                                        value={nuevoEmpleado.email || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })}
                                    />
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="text"
                                        placeholder="Ingrese su número de telefono"
                                        value={nuevoEmpleado.telefono || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })}
                                    />
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="password"
                                        placeholder="Ingrese contraseña"
                                        value={nuevoEmpleado.password || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, password: e.target.value })}
                                    />
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="password"
                                        placeholder="Repita contraseña"
                                        value={nuevoEmpleado.repetirPassword || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, repetirPassword: e.target.value })}
                                    />
                                </div>
                                {/* Sección Derecha */}
                                <div className={styles.modalRight}>
                                    <select
                                        className={`${shared.input} ${styles.input}`}
                                        value={nuevoEmpleado.rol}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, rol: e.target.value })}
                                    >
                                        <option value="">Seleccione un rol</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Cocinero">Cocinero</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <select
                                        className={`${shared.input} ${styles.input}`}
                                        value={nuevoEmpleado.localidad || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, localidad: e.target.value })}
                                    >
                                        <option value="">Seleccione una localidad</option>
                                        <option value="Centro">Centro</option>
                                        <option value="Norte">Norte</option>
                                        <option value="Sur">Sur</option>
                                    </select>
                                    <input
                                        className={`${shared.input} ${styles.input}`}
                                        type="text"
                                        placeholder="Ingrese codigo postal"
                                        value={nuevoEmpleado.codigoPostal || ""}
                                        onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, codigoPostal: e.target.value })}
                                    />
                                    <input
                                        className={`${shared.input} ${styles.input}`}
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
                            {error && <div className={shared.error}>{error}</div>}
                            <div className={`${shared.modalActions} ${styles.modalActions}`}>
                                <button
                                    className={`${shared.enviarButton} ${styles.enviarButton}`}
                                    onClick={handleEnviar}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className={`${shared.salirButton} ${styles.salirButton}`}
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