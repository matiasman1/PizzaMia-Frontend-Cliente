import React from "react";
import styles from "./Header.module.css";
import { FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import Search from "../Search/Search";
import { useAuth0 } from "@auth0/auth0-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  onCartClick,
}) => {
  // Usar Auth0 para obtener información del usuario
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  
  // Generar un saludo personalizado basado en la hora del día
  const getSaludo = () => {
    const hora = (new Date().getHours())-4;
    let saludo;
    
    if (hora < 12) {
      saludo = '¡buenos días!';
    } else if (hora < 18) {
      saludo = '¡buenas tardes!';
    } else {
      saludo = '¡buenas noches!';
    }
    
    // Si el usuario está autenticado, personalizar el saludo con su nombre
    if (isAuthenticated && user?.name) {
      return `Hola ${user.name}, ${saludo}`;
    }
    
    // Saludo genérico si no hay usuario autenticado
    return `¡Bienvenido, ${saludo}`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.menuIcon}>
        <div className={styles.menuIconBg}>
          <div className={styles.menuLines}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Usar el saludo personalizado basado en Auth0 */}
      <div className={styles.greeting}>{getSaludo()}</div>

      <div className={styles.searchContainer}>
        <Search value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Auth0 Login/Logout Button */}
      <div className={styles.authContainer}>
        {!isAuthenticated ? (
          <button 
            className={styles.authButton}
            onClick={() => loginWithRedirect()}
          >
            <FaSignInAlt className={styles.authIcon} />
            <span className={styles.authText}>Iniciar sesión</span>
          </button>
        ) : (
          <div className={styles.userContainer}>
            <div className={styles.userInfo}>
              <FaUser className={styles.userIcon} />
              <span className={styles.userName}>{user?.name}</span>
            </div>
            <button 
              className={styles.authButton}
              onClick={() => logout({ 
                logoutParams: { returnTo: window.location.origin } 
              })}
            >
              <FaSignOutAlt className={styles.authIcon} />
              <span className={styles.authText}>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>

      <div className={styles.locationInfo}>
        <div>
          <div className={styles.deliverLabel}>Entregar a</div>
          <div className={styles.locationText}>Mendoza, ARG</div>
        </div>
        
        <div className={styles.cartContainer} onClick={onCartClick}>
          <FaShoppingBag className={styles.cartIcon} />
          {cartCount > 0 && (
            <div className={styles.cartBadge}>{cartCount}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;