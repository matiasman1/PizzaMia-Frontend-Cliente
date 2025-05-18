import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/admin/Button/Button";

// Importar las imágenes SVG 
import chevronUp from "../../../assets/admin/circle-chevron-up.svg";
import chevronDown from "../../../assets/admin/circle-chevron-down.svg";

import styles from "./AdministracionSection.module.css";

export const AdministracionSection: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar la opción seleccionada basada en la URL actual
    const getInitialOption = () => {
        const path = location.pathname;
        if (path.includes("/roles")) return "roles";
        if (path.includes("/empleados")) return "empleados";
        if (path.includes("/clientes")) return "clientes";
        return "roles"; // Opción por defecto
    };
    
    // Estado para controlar qué botón está seleccionado
    const [selectedOption, setSelectedOption] = useState<string>(getInitialOption());
    
    // Actualizar la URL cuando cambie la opción seleccionada
    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        navigate(`/admin/administracion/${option}`);
    };

    // Sincronizar estado con URL al cargar o cambiar la URL
    useEffect(() => {
        setSelectedOption(getInitialOption());
    }, [location.pathname]);

    // Función para renderizar el contenido según la opción seleccionada
    const renderContent = () => {
        switch (selectedOption) {
            case "roles":
                return (
                    <div className={styles.adminContent}>
                        <div className={styles.adminContentRoles}>
                            <p>Administrador de Roles</p>
                            
                            <div className={styles.tableContainer}>
                                <table className={styles.rolesTable}>
                                    <thead>
                                        <tr>
                                            <th className={styles.tableHeader}>Rol</th>
                                            <th className={styles.tableHeader}>Estado</th>
                                            <th className={styles.tableHeader}>Alta</th>
                                            <th className={styles.tableHeader}>Baja</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className={styles.rolName}>Admin</td>
                                            <td className={styles.actionColumn}>
                                                <span className={styles.statusActive}>Activo</span>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronUp} 
                                                        alt="Activar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronDown}
                                                        alt="Desactivar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.rolName}>Cliente</td>
                                            <td className={styles.actionColumn}>
                                                <span className={styles.statusActive}>Activo</span>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronUp}
                                                        alt="Activar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronDown} 
                                                        alt="Desactivar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.rolName}>Cajero</td>
                                            <td className={styles.actionColumn}>
                                                <span className={styles.statusInactive}>Inactivo</span>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronUp} 
                                                        alt="Activar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronDown}  
                                                        alt="Desactivar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.rolName}>Cocinero</td>
                                            <td className={styles.actionColumn}>
                                                <span className={styles.statusActive}>Activo</span>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronUp} 
                                                        alt="Activar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                            <td className={styles.actionColumn}>
                                                <button className={styles.actionButton}>
                                                    <img 
                                                        src={chevronDown}  
                                                        alt="Desactivar" 
                                                        className={styles.actionIcon} 
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
                
            case "empleados":
                return (
                    <div className={styles.adminContent}>
                        <h2>Gestión de Empleados</h2>
                        <p>Aquí puedes administrar los empleados de la empresa.</p>
                        {/* Contenido específico para la gestión de empleados */}
                    </div>
                );
            case "clientes":
                return (
                    <div className={styles.adminContent}>
                        <h2>Gestión de Clientes</h2>
                        <p>Aquí puedes administrar los clientes registrados.</p>
                        {/* Contenido específico para la gestión de clientes */}
                    </div>
                );
            default:
                return null; // No debería llegar aquí
        }
    };

    return (
        <div className={styles.administracionSection}>
            
            <div className={styles.adminButtonsContainer}>
                <Button 
                    label="Roles" 
                    onClick={() => handleOptionChange("roles")} 
                    selected={selectedOption === "roles"}
                    className={styles.adminButton}
                />
                <Button 
                    label="Empleados" 
                    onClick={() => handleOptionChange("empleados")} 
                    selected={selectedOption === "empleados"}
                    className={styles.adminButton}
                />
                <Button 
                    label="Clientes" 
                    onClick={() => handleOptionChange("clientes")} 
                    selected={selectedOption === "clientes"}
                    className={styles.adminButton}
                />
            </div>
            
            {/* Renderiza el contenido según la opción seleccionada */}
            <div className={styles.sectionContent}>
                {renderContent()}
            </div>
        </div>
    );
}