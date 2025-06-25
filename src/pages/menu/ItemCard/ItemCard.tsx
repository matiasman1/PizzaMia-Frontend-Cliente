import React, { useEffect, useState } from "react";
import styles from "./ItemCard.module.css";
import { ArticuloManufacturadoApi, InsumoApi } from "../../../types/typesClient";
import { FaClock, FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../../../store/cartStore";
import { useStockStore } from '../../../store/stockStore';

type ItemCardProps = {
  item: ArticuloManufacturadoApi | InsumoApi;
  esManufacturado: boolean;
  onAdd?: () => void; // Mantenemos esto como opcional para compatibilidad
};

const ItemCard: React.FC<ItemCardProps> = ({ item, esManufacturado, onAdd }) => {
  const addItemToCart = useCartStore(state => state.addItem);
  const verificarDisponibilidad = useStockStore(state => state.verificarDisponibilidad);
  const imagenUrl = item.imagen?.urlImagen || "";
  
  // Estado local para disponibilidad
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [verificando, setVerificando] = useState(false);
  
  // Verificar disponibilidad al cargar el componente
  useEffect(() => {
    const checkDisponibilidad = async () => {
      if (verificando) return;
      
      setVerificando(true);
      try {
        const disponible = await verificarDisponibilidad(
          item.id, 
          esManufacturado, 
          !esManufacturado ? item as InsumoApi : undefined
        );
        setDisponible(disponible);
      } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        setDisponible(false); // Por precaución
      } finally {
        setVerificando(false);
      }
    };
    
    checkDisponibilidad();
  }, [item.id, esManufacturado, verificarDisponibilidad, item]);

  const handleAddToCart = () => {
    if (!disponible) return;
    
    // Añadir al carrito usando Zustand
    addItemToCart(item, esManufacturado);
    
    // Llamar al callback onAdd si existe
    if (onAdd) onAdd();
  };

  return (
    <div className={`${styles.itemCard} ${disponible === false ? styles.noStock : ''}`}>
      <div className={styles.itemImage}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={item.denominacion} />
        ) : (
          <span className={styles.placeholderIcon}>
            {esManufacturado ? "🍕" : "🥤"}
          </span>
        )}
        
        {/* Indicador de sin stock */}
        {disponible === false && (
          <div className={styles.stockBadge}>
            Sin stock
          </div>
        )}
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.itemTitle}>{item.denominacion}</div>
        <div className={styles.itemPrice}>${item.precioVenta}</div>
        {esManufacturado && (
          <div className={styles.itemTime}>
            <FaClock className={styles.timeIcon} />
            <span>
              {(item as ArticuloManufacturadoApi).tiempoEstimadoProduccion} min
            </span>
          </div>
        )}
        
        {/* Mostrar stock para bebidas */}
        {!esManufacturado && (
          <div className={styles.stockInfo}>
            Stock: {(item as InsumoApi).stockActual} unidades
          </div>
        )}
      </div>
      <button 
        className={`${styles.cartButton} ${disponible === false ? styles.disabledButton : ''}`} 
        onClick={handleAddToCart}
        disabled={disponible === false || verificando}
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

export default ItemCard;