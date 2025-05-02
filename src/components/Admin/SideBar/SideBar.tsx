import React, { useState } from "react";
import styles from "./SideBar.module.css";

const SideBar: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>("administracion");

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <aside className={styles.sidebar}>
            <hr className={styles.divider} />
            <ul className={styles.menuList}>
                <li>
                    <button 
                        className={`${styles.menuButton} ${selectedOption === "administracion" ? styles.selected : ""}`}
                        onClick={() => handleOptionClick("administracion")}
                    >
                        Administración
                    </button>
                </li>
                <li>
                    <button 
                        className={`${styles.menuButton} ${selectedOption === "insumos" ? styles.selected : ""}`}
                        onClick={() => handleOptionClick("insumos")}
                    >
                        Insumos
                    </button>
                </li>
                <li>
                    <button 
                        className={`${styles.menuButton} ${selectedOption === "productos" ? styles.selected : ""}`}
                        onClick={() => handleOptionClick("productos")}
                    >
                        Productos
                    </button>
                </li>
                <li>
                    <button 
                        className={`${styles.menuButton} ${selectedOption === "gestion" ? styles.selected : ""}`}
                        onClick={() => handleOptionClick("gestion")}
                    >
                        Gestión
                    </button>
                </li>
                <li>
                    <button 
                        className={`${styles.menuButton} ${selectedOption === "estadisticas" ? styles.selected : ""}`}
                        onClick={() => handleOptionClick("estadisticas")}
                    >
                        Estadísticas
                    </button>
                </li>
                <li>
                    <button 
                        className={`${styles.menuButton} ${selectedOption === "seguridad" ? styles.selected : ""}`}
                        onClick={() => handleOptionClick("seguridad")}
                    >
                        Seguridad
                    </button>
                </li>
            </ul>
        </aside>
    );
};

export default SideBar;