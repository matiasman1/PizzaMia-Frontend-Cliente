import React from 'react';
import styles from './Header.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick }) => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const navigate = useNavigate();

  // Función para navegar al perfil del usuario
  const handleProfileClick = () => {
    navigate('/client/profile/personal-info');
  };

  return (
    <header className={styles.header}>
      <div className={styles.menuIcon}>
        <div className={styles.menuIconBg}>
          <div className={styles.menuLines}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
      </div>

      <div className={styles.greeting}>
        {isAuthenticated ? `Hola ${user?.name?.split(' ')[0]}, ¡buenas tardes!` : 'Hola, ¡buenas tardes!'}
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchIcon}>🔍</div>
        <input type="text" className={styles.searchBar} placeholder="¿Qué te gustaría comer?" />
      </div>

      <div className={styles.authSection}>
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
            {/* Perfil de usuario clickeable */}
            <div className={styles.userProfile} onClick={handleProfileClick}>
              <FaUser className={styles.userIcon} />
              <span className={styles.userName}>{user?.name}</span>
            </div>
            
            {/* Botón de logout con hover expandible */}
            <button 
              className={styles.logoutButton}
              onClick={() => logout({ 
                logoutParams: { returnTo: window.location.origin } 
              })}
              title="Cerrar sesión"
            >
              <FaSignOutAlt className={styles.logoutIcon} />
              <span className={styles.logoutText}>Cerrar sesión</span>
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
          <div className={styles.cartIconBg}>
            <FaShoppingCart className={styles.cartIcon} />
            {cartItemCount > 0 && (
              <span className={styles.cartBadge}>{cartItemCount}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;