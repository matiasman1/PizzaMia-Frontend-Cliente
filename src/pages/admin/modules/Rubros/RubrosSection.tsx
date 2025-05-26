import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../../components/admin/Button/Button";

import Insumos from "./Insumos";
import Productos from "./Productos";

import styles from "./RubrosSection.module.css";

export const RubrosSection: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Redirigir a /admin/rubros/insumos si la ruta es exactamente /admin/rubros
    useEffect(() => {
        if (location.pathname === "/admin/rubros") {
            navigate("/admin/rubros/insumos", { replace: true });
        }
    }, [location.pathname, navigate]);

    // Determinar la opción seleccionada basada en la URL actual
    const getInitialOption = () => {
        const path = location.pathname;
        if (path.includes("/insumos")) return "insumos";
        if (path.includes("/productos")) return "productos";
        return "insumos"; // Opción por defecto
    };

    const [selectedOption, setSelectedOption] = useState<string>(getInitialOption());

    // Actualizar la URL cuando cambie la opción seleccionada
    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        navigate(`/admin/rubros/${option}`);
    };

    // Sincronizar estado con URL al cargar o cambiar la URL
    useEffect(() => {
        setSelectedOption(getInitialOption());
    }, [location.pathname]);

    // Renderizar el contenido según la opción seleccionada
    const renderContent = () => {
        switch (selectedOption) {
            case "insumos":
                return <Insumos />;
            case "productos":
                return <Productos />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.administracionSection}>
            <div className={styles.adminButtonsContainer}>
                <Button
                    label="Insumos"
                    onClick={() => handleOptionChange("insumos")}
                    selected={selectedOption === "insumos"}
                    className={styles.adminButton}
                />
                <Button
                    label="Productos"
                    onClick={() => handleOptionChange("productos")}
                    selected={selectedOption === "productos"}
                    className={styles.adminButton}
                />
            </div>
            <div className={styles.sectionContent}>
                {renderContent()}
            </div>
        </div>
    );
};

export default RubrosSection;