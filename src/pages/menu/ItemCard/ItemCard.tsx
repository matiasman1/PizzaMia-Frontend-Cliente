import React from "react";
import styles from "./ItemCard.module.css";
import { ArticuloManufacturadoApi, InsumoApi } from "../../../types/typesClient";
import { FaClock, FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../../../store/cartStore";

type ItemCardProps = {
  item: ArticuloManufacturadoApi | InsumoApi;
  esManufacturado: boolean;
  onAdd?: () => void; // Mantenemos esto como opcional para compatibilidad
};

const ItemCard: React.FC<ItemCardProps> = ({ item, esManufacturado, onAdd }) => {
  const addItemToCart = useCartStore(state => state.addItem);
  const imagenUrl = item.imagen?.urlImagen || "";

  const handleAddToCart = () => {
    // Añadir al carrito usando Zustand
    addItemToCart(item, esManufacturado);
    
    // Llamar al callback onAdd si existe (para compatibilidad)
    if (onAdd) onAdd();
  };

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemImage}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={item.denominacion} />
        ) : (
          <span className={styles.placeholderIcon}>
            {esManufacturado ? "🍕" : "🥤"}
          </span>
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
      </div>
      <button className={styles.cartButton} onClick={handleAddToCart}>
        <FaShoppingCart />
      </button>
    </div>
  );
};

export default ItemCard;