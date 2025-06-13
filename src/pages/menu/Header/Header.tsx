import React from "react";
import styles from "./Header.module.css";
import { FaShoppingBag } from "react-icons/fa";
import Search from "../Search/Search";
import { useClienteStore } from "../../../store/clienteStore";

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
  // Usar el store del cliente para obtener el saludo personalizado
  const obtenerSaludo = useClienteStore((state) => state.obtenerSaludo);
  const saludo = obtenerSaludo();

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

      <div className={styles.greeting}>{saludo}</div>

      <div className={styles.searchContainer}>
        <Search value={searchQuery} onChange={setSearchQuery} />
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