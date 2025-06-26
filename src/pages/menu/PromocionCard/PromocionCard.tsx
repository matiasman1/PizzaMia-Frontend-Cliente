import React, { useState } from "react";
import styles from "../ItemCard/ItemCard.module.css";
import { PromocionApi } from "../../../types/typesClient";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../../../store/cartStore";

type PromocionCardProps = {
  item: PromocionApi;
  onAdd?: () => void; // Mantenemos esto como opcional para compatibilidad
};

const PromocionCard: React.FC<PromocionCardProps> = ({ item, onAdd }) => {
  const addItemToCart = useCartStore(state => state.addItem);
  const imagenUrl = item.imagen?.urlImagen || "";
  
  // Estado para el botón
  const [verificando, setVerificando] = useState(false);
  
  // Las promociones siempre están disponibles si están activas
  const disponible = item.estado === 'ACTIVO';

  const handleAddToCart = () => {
    if (!disponible) return;
    
    setVerificando(true);
    
    // Añadir al carrito usando Zustand (false para esManufacturado, true para esPromocion)
    addItemToCart(item, false, true);
    
    // Llamar al callback onAdd si existe
    if (onAdd) onAdd();
    
    setTimeout(() => {
      setVerificando(false);
    }, 500);
  };

  // Calcular precio original basado en el descuento
  const precioOriginal = (item.precio / (1 - (item.descuento / 100))).toFixed(2);

  return (
    <div className={`${styles.itemCard} ${!disponible ? styles.noStock : ''}`}>
      <div className={styles.itemImage}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={item.denominacion} />
        ) : (
          <span className={styles.placeholderIcon}>
            🎁
          </span>
        )}
        
        {/* Badge de descuento */}
        <div className={styles.promotionBadge}>
          {item.descuento}% OFF
        </div>
        
        {/* Indicador de no disponible */}
        {!disponible && (
          <div className={styles.stockBadge}>
            Promo finalizada
          </div>
        )}
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.itemTitle}>{item.denominacion}</div>
        
        {/* Mostrar precio original y con descuento */}
        <div className={styles.priceContainer}>
          <span className={styles.originalPrice}>${precioOriginal}</span>
          <div className={styles.itemPrice}>${item.precio}</div>
        </div>
        
        {/* Descripción de la promoción */}
        {item.descripcion && (
          <div className={styles.itemDescription}>
            {item.descripcion}
          </div>
        )}
      </div>
      <button 
        className={`${styles.cartButton} ${!disponible ? styles.disabledButton : ''}`} 
        onClick={handleAddToCart}
        disabled={!disponible || verificando}
      >
        {verificando ? (
          <span className={styles.loadingDots}>•••</span>
        ) : (
          <FaShoppingCart />
        )}
      </button>
    </div>
  );
};

export default PromocionCard;