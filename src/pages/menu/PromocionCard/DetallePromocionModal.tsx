import React from "react";
import { PromocionApi } from "../../../types/typesClient";
import styles from "./DetallePromocionModal.module.css";

interface DetallePromocionModalProps {
    isOpen: boolean;
    onClose: () => void;
    promocion: PromocionApi | null;
}

export const DetallePromocionModal: React.FC<DetallePromocionModalProps> = ({
    isOpen,
    onClose,
    promocion
}) => {
    if (!isOpen || !promocion) return null;

    // Verificar si la promoción tiene detalles
    const tieneDetalles = promocion.detalles && Array.isArray(promocion.detalles) && promocion.detalles.length > 0;

    // Calcular precio original basado en el descuento
    const precioOriginal = (promocion.precio / (1 - (promocion.descuento / 100)));

    // Formatear fechas
    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={(e) => {
            // Cerrar el modal si se hace clic fuera del contenido
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modalContent}>
                <div className={styles.promotionHeader}>
                    {promocion.imagen?.urlImagen ? (
                        <div className={styles.promotionImageBackground} 
                            style={{backgroundImage: `url(${promocion.imagen.urlImagen})`}}>
                            <div className={styles.discountBadge}>
                                {promocion.descuento}% OFF
                            </div>
                        </div>
                    ) : (
                        <div className={styles.promotionImageBackground}>
                            <span className={styles.placeholderEmoji}>🎁</span>
                            <div className={styles.discountBadge}>
                                {promocion.descuento}% OFF
                            </div>
                        </div>
                    )}
                    <div className={styles.promotionHeaderContent}>
                        <h2>{promocion.denominacion}</h2>
                        <div className={styles.priceSection}>
                            <span className={styles.originalPrice}>${precioOriginal.toFixed(2)}</span>
                            <div className={styles.promotionPrice}>
                                ${promocion.precio.toFixed(2)}
                            </div>
                        </div>
                        <div className={styles.discountInfo}>
                            <span>¡Ahorrás ${(precioOriginal - promocion.precio).toFixed(2)}!</span>
                        </div>
                    </div>
                </div>

                <div className={styles.promotionDetails}>
                    <div className={styles.validitySection}>
                        <h3>Vigencia de la promoción</h3>
                        <div className={styles.validityDates}>
                            <div className={styles.dateItem}>
                                <span className={styles.dateLabel}>Desde:</span>
                                <span className={styles.dateValue}>{formatFecha(promocion.fechaInicio)}</span>
                            </div>
                            <div className={styles.dateItem}>
                                <span className={styles.dateLabel}>Hasta:</span>
                                <span className={styles.dateValue}>{formatFecha(promocion.fechaFin)}</span>
                            </div>
                        </div>
                    </div>

                    <h3>¿Qué incluye esta promoción?</h3>
                    {!tieneDetalles ? (
                        <p className={styles.noDetails}>No hay detalles disponibles para esta promoción</p>
                    ) : (
                        <ul className={styles.detailsList}>
                            {promocion.detalles.map((detalle, index) => {
                                const item = detalle.articuloManufacturado || detalle.articuloInsumo;
                                if (!item) return null;
                                
                                return (
                                    <li key={index} className={styles.detailItem}>
                                        <div className={styles.itemInfo}>
                                            {item.imagen?.urlImagen && (
                                                <div className={styles.itemImage}>
                                                    <img src={item.imagen.urlImagen} alt={item.denominacion} />
                                                </div>
                                            )}
                                            <div className={styles.itemDetails}>
                                                <span className={styles.itemName}>
                                                    {item.denominacion}
                                                </span>
                                                <span className={styles.itemQuantity}>
                                                    Cantidad: {detalle.cantidad}
                                                </span>
                                                {item.precioVenta && (
                                                    <span className={styles.itemPrice}>
                                                        Precio individual: ${item.precioVenta.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    
                    {promocion.descripcion && (
                        <div className={styles.promotionDescription}>
                            <h3>Descripción</h3>
                            <p>{promocion.descripcion}</p>
                        </div>
                    )}
                </div>

                <div className={styles.modalActions}>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetallePromocionModal;