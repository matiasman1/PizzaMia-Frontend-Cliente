import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.css";

const SideBar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <hr className={styles.divider} />
            <ul className={styles.menuList}>
                <li>
                    <NavLink 
                        to="/admin/administracion"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Administración
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/admin/rubros"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Rubros
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/admin/insumos"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Insumos
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/admin/productos"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Productos
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/admin/gestion"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Gestión
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/admin/estadisticas"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Estadísticas
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/admin/seguridad"
                        className={({ isActive }) => 
                            `${styles.menuButton} ${isActive ? styles.selected : ""}`
                        }
                    >
                        Seguridad
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default SideBar;