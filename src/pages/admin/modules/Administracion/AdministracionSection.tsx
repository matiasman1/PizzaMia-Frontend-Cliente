import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../../components/admin/Button/Button";

import Roles from "./Roles";
import Empleados from "./Empleados";
import Clientes from "./Clientes";

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
                return <Roles />;

                
            case "empleados":
                return <Empleados />;

            case "clientes":
                return <Clientes />;
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