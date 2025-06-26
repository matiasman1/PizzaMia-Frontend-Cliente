import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './SideBar.module.css';

// Importar los iconos SVG
import goBackIcon from '../../../assets/client/goback-icon.svg';
import personalInfoIcon from '../../../assets/client/personalinfo-icon.svg';
import directionsIcon from '../../../assets/client/directions-icon.svg';
import ordersIcon from '../../../assets/client/orders-icon.svg';
import logoutIcon from '../../../assets/client/logout-icon.svg';

interface SideBarProps {
    userName: string;
}

const SideBar: React.FC<SideBarProps> = ({ userName }) => {
    const location = useLocation();
    const { logout } = useAuth0();

    // Función para verificar si un enlace está activo
    const isActive = (path: string) => {
        return location.pathname.includes(path);
    };

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        // Limpiar localStorage o cualquier otro almacenamiento local si es necesario
        localStorage.removeItem('auth_token');
        
        // Cerrar sesión en Auth0 y redirigir al inicio
        logout({ 
            logoutParams: {
                returnTo: window.location.origin 
            }
        });
    };

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.headerSection}>
                <div className={styles.navigationHeader}>
                    <Link to="/menu" className={styles.backButton}>
                        <img src={goBackIcon} alt="Volver" className={styles.backIcon} />
                        <h1 className={styles.title}>Perfil Usuario</h1>
                    </Link>
                </div>
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
                            <img src={personalInfoIcon} alt="Información Personal" className={styles.menuIcon} />
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
                            <img src={directionsIcon} alt="Direcciones" className={styles.menuIcon} />
                        </div>
                        <span className={styles.menuText}>Direcciones</span>
                        <span className={styles.arrow}>›</span>
                    </Link>
                </div>

                {/* Grupo 2: Carrito y Mis Pedidos */}
                <div className={styles.menuGroup}>
                    {/* Elemento 4: Mis Pedidos */}
                    <Link
                        to="/client/orders"
                        className={`${styles.menuItem} ${isActive('/orders') ? styles.active : ''}`}
                    >
                        <div className={styles.menuIconContainer}>
                            <img src={ordersIcon} alt="Mis Pedidos" className={styles.menuIcon} />
                        </div>
                        <span className={styles.menuText}>Mis Pedidos</span>
                        <span className={styles.arrow}>›</span>
                    </Link>
                </div>

                {/* Elemento 5: Cerrar Sesión (separado) - Ahora como botón */}
                <button 
                    className={styles.menuItem} 
                    onClick={handleLogout}
                >
                    <div className={styles.menuIconContainer}>
                        <img src={logoutIcon} alt="Cerrar Sesión" className={styles.menuIcon} />
                    </div>
                    <span className={styles.menuText}>Cerrar Sesión</span>
                    <span className={styles.arrow}>›</span>
                </button>
            </div>
        </div>
    );
};

export default SideBar;