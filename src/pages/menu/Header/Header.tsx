import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser, FaChevronDown } from "react-icons/fa";
import Search from "../Search/Search";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

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
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
    
    if (isAuthenticated && user?.name) {
      return `Hola ${user.name}, ${saludo}`;
    }
    
    return `¡Bienvenido, ${saludo}`;
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      {/* Área de autenticación */}
      <div className={styles.authArea} ref={dropdownRef}>
        {!isAuthenticated ? (
          <button 
            className={styles.loginButton}
            onClick={() => loginWithRedirect()}
          >
            <FaSignInAlt className={styles.authIcon} />
            <span className={styles.authText}>Iniciar sesión</span>
          </button>
        ) : (
          <div className={styles.userDropdownContainer}>
            <div 
              className={styles.userAvatar}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'Usuario'} 
                  className={styles.avatarImage}
                />
              ) : (
                <FaUser className={styles.avatarIcon} />
              )}
              <FaChevronDown className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.arrowUp : ''}`} />
            </div>
            
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownUserName}>{user?.name}</span>
                  <span className={styles.dropdownUserEmail}>{user?.email}</span>
                </div>
                <div className={styles.dropdownDivider}></div>
                <Link to="/client/profile/personal-info" className={styles.dropdownItem}>
                  <FaUser className={styles.dropdownIcon} />
                  <span>Mi Perfil</span>
                </Link>
                <button 
                  className={styles.dropdownItem}
                  onClick={() => logout({ 
                    logoutParams: { returnTo: window.location.origin } 
                  })}
                >
                  <FaSignOutAlt className={styles.dropdownIcon} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Saludo (visible en pantallas medianas y grandes) */}
      <div className={styles.greeting}>{getSaludo()}</div>

      {/* Búsqueda (centrada) */}
      <div className={styles.searchContainer}>
        <Search value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Información de ubicación y carrito */}
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