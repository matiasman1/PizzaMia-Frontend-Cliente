import React, { useEffect, useState } from "react";
import styles from "../ItemCard/ItemCard.module.css";
import { PromocionApi } from "../../../types/typesClient";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { useCartStore } from "../../../store/cartStore";
import { verificarDisponibilidadManufacturado } from "../../../api/clientApi"; // Importar directamente
import DetallePromocionModal from './DetallePromocionModal';

type PromocionCardProps = {
  item: PromocionApi;
  onAdd?: () => void;
};

const PromocionCard: React.FC<PromocionCardProps> = ({ item, onAdd }) => {
  const addItemToCart = useCartStore(state => state.addItem);
  const imagenUrl = item.imagen?.urlImagen || "";
  
  // Estado para disponibilidad y verificación
  const [disponible, setDisponible] = useState<boolean>(true); // Comenzar como disponible
  const [verificando, setVerificando] = useState(false);
  const [verificandoStock, setVerificandoStock] = useState(false);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  
  // Las promociones deben estar activas
  const promocionActiva = item.estado === 'ACTIVO';

  // Verificar disponibilidad de los detalles de la promoción SIN usar stockStore
  useEffect(() => {
    // Si la promoción no está activa, marcar como no disponible
    if (!promocionActiva) {
      setDisponible(false);
      return;
    }

    // Si no hay detalles, asumir que está disponible
    if (!item.detalles || item.detalles.length === 0) {
      setDisponible(true);
      return;
    }

    const checkStock = async () => {
      setVerificandoStock(true);
      
      try {
        // Iterar sobre cada detalle y verificar disponibilidad DIRECTAMENTE
        for (const detalle of item.detalles) {
          const esManufacturado = !!detalle.articuloManufacturado;
          const articulo = detalle.articuloManufacturado || detalle.articuloInsumo;
          
          if (!articulo) {
            console.warn(`Detalle de promoción ${item.id} sin artículo válido`);
            setDisponible(false);
            return;
          }

          let estaDisponible = false;

          if (esManufacturado) {
            // Para manufacturados, verificar con la API directamente
            try {
              estaDisponible = await verificarDisponibilidadManufacturado(articulo.id);
            } catch (error) {
              console.error(`Error verificando manufacturado ${articulo.id}:`, error);
              estaDisponible = false;
            }
          } else {
            // Para insumos, asumir disponible por ahora 
            // (no interferir con el stockStore de ItemCard)
            estaDisponible = true;
            
            // Si el artículo tiene stockActual definido, verificar
            if ('stockActual' in articulo && typeof articulo.stockActual === 'number') {
              estaDisponible = articulo.stockActual >= (detalle.cantidad || 1);
            }
          }

          // Si algún detalle no está disponible, la promoción no está disponible
          if (!estaDisponible) {
            console.log(`Promoción ${item.denominacion} sin stock: falta ${articulo.denominacion}`);
            setDisponible(false);
            return;
          }
        }

        // Si llegamos aquí, todos los detalles están disponibles
        console.log(`Promoción ${item.denominacion} disponible - todos los detalles tienen stock`);
        setDisponible(true);

      } catch (error) {
        console.error(`Error verificando stock de promoción ${item.id}:`, error);
        // En caso de error, asumir que está disponible para no bloquear innecesariamente
        setDisponible(true);
      } finally {
        setVerificandoStock(false);
      }
    };

    checkStock();
  }, [item.id, item.detalles, promocionActiva]); // Quitar verificarDisponibilidad de las dependencias

  const handleAddToCart = () => {
    if (!disponible || !promocionActiva) return;
    
    setVerificando(true);
    
    // Añadir al carrito usando Zustand
    addItemToCart(item, false, true);
    
    // Llamar al callback onAdd si existe
    if (onAdd) onAdd();
    
    setTimeout(() => {
      setVerificando(false);
    }, 500);
  };

  const handleShowDetails = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Calcular precio original basado en el descuento
  const precioOriginal = (item.precio / (1 - (item.descuento / 100))).toFixed(2);

  // Determinar el mensaje de estado
  const getStatusMessage = () => {
    if (!promocionActiva) return "Promo finalizada";
    if (!disponible) return "Sin stock";
    return null;
  };

  // Determinar si el botón debe estar deshabilitado
  const isDisabled = !promocionActiva || !disponible || verificando || verificandoStock;

  return (
    <>
      <div className={`${styles.itemCard} ${isDisabled ? styles.noStock : ''}`}>
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
          
          {/* Indicador de estado */}
          {getStatusMessage() && (
            <div className={styles.stockBadge}>
              {getStatusMessage()}
            </div>
          )}
        </div>
        
        <div className={styles.itemInfo}>
          <div className={styles.itemTitle}>{item.denominacion}</div>
          
          {/* Mostrar precio original y con descuento */}
          <div className={styles.priceContainer}>
            <span className={styles.originalPrice}>${precioOriginal}</span>
            <div className={styles.itemPrice}>${item.precio.toFixed(2)}</div>
          </div>
          
          {/* Descripción de la promoción */}
          {item.descripcion && (
            <div className={styles.itemDescription}>
              {item.descripcion}
            </div>
          )}
        </div>
        
        {/* Contenedor de botones */}
        <div className={styles.buttonContainer}>
          {/* Botón de detalles */}
          <button 
            className={styles.detailButton} 
            onClick={handleShowDetails}
            title="Ver detalles de la promoción"
          >
            <FaInfoCircle />
          </button>
          
          {/* Botón de agregar al carrito */}
          <button 
            className={`${styles.cartButton} ${isDisabled ? styles.disabledButton : ''}`} 
            onClick={handleAddToCart}
            disabled={isDisabled}
          >
            {verificando || verificandoStock ? (
              <span className={styles.loadingDots}>•••</span>
            ) : (
              <FaShoppingCart />
            )}
          </button>
        </div>
      </div>
      
      {/* Modal de detalles */}
      <DetallePromocionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        promocion={item}
      />
    </>
  );
};

export default PromocionCard;