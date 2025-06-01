import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './SideBar.module.css';

interface SideBarProps {
    userName: string;
}

const SideBar: React.FC<SideBarProps> = ({ userName }) => {
    const location = useLocation();

    // Función para verificar si un enlace está activo
    const isActive = (path: string) => {
        return location.pathname.includes(path);
    };

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.headerSection}>
                <div className={styles.navigationHeader}>
                    <Link to="/" className={styles.backButton}>
                        <span className={styles.backIcon}>&#60;</span>
                        <h1 className={styles.title}>Perfil Usuario</h1>
                    </Link>
                </div>
                {/* Movido userName fuera del navigationHeader para que esté alineado con el menú */}
                <h2 className={styles.userName}>{userName}</h2>
            </div>

            <div className={styles.menuGroups}>
                {/* Grupo 1: Información Personal y Direcciones */}
                <div className={styles.menuGroup}>
                    {/* Elemento 1: Información Personal */}
                    <Link
                        to="/client/profile/personal-info"
                        className={`${styles.menuItem} ${isActive('/personal-info') ? styles.active : ''}`}
                    >
                        <div className={styles.menuIconContainer}>
                            <span className={styles.emptyCircleIcon}></span>
                        </div>
                        <span className={styles.menuText}>Información Personal</span>
                        <span className={styles.arrow}>›</span>
                    </Link>

                    {/* Elemento 2: Direcciones */}
                    <Link
                        to="/client/profile/addresses"
                        className={`${styles.menuItem} ${isActive('/addresses') ? styles.active : ''}`}
                    >
                        <div className={styles.menuIconContainer}>
                            <span className={styles.emptyCircleIcon}></span>
                        </div>
                        <span className={styles.menuText}>Direcciones</span>
                        <span className={styles.arrow}>›</span>
                    </Link>
                </div>

                {/* Grupo 2: Carrito y Mis Pedidos */}
                <div className={styles.menuGroup}>
                    {/* Elemento 3: Carrito */}
                    <Link
                        to="/client/cart"
                        className={`${styles.menuItem} ${isActive('/cart') ? styles.active : ''}`}
                    >
                        <div className={styles.menuIconContainer}>
                            <span className={styles.emptyCircleIcon}></span>
                        </div>
                        <span className={styles.menuText}>Carrito</span>
                        <span className={styles.arrow}>›</span>
                    </Link>

                    {/* Elemento 4: Mis Pedidos */}
                    <Link
                        to="/client/orders"
                        className={`${styles.menuItem} ${isActive('/orders') ? styles.active : ''}`}
                    >
                        <div className={styles.menuIconContainer}>
                            <span className={styles.emptyCircleIcon}></span>
                        </div>
                        <span className={styles.menuText}>Mis Pedidos</span>
                        <span className={styles.arrow}>›</span>
                    </Link>
                </div>

                {/* Elemento 5: Cerrar Sesión (separado) */}
                <Link
                    to="/logout"
                    className={`${styles.menuItem} ${styles.logout}`}
                >
                    <div className={styles.menuIconContainer}>
                        <span className={styles.emptyCircleIcon}></span>
                    </div>
                    <span className={styles.menuText}>Cerrar Sesión</span>
                    <span className={styles.arrow}>›</span>
                </Link>
            </div>
        </div>
    );
};

export default SideBar;