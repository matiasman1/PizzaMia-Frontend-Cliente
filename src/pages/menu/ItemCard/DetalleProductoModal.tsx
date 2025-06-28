import React from "react";
import { ArticuloManufacturadoApi } from "../../../types/typesClient";
import styles from "./DetalleProductoModal.module.css";

interface DetalleProductoModalProps {
    isOpen: boolean;
    onClose: () => void;
    producto: ArticuloManufacturadoApi | null;
}

const unidadMedidaLabel = (unidad: string | undefined) => {
    if (!unidad) return "";
    switch (unidad) {
        case "GRAMOS": return "gr";
        case "MILILITROS": return "ml";
        case "UNIDADES": return "u";
        default: return unidad.toLowerCase();
    }
};

export const DetalleProductoModal: React.FC<DetalleProductoModalProps> = ({
    isOpen,
    onClose,
    producto
}) => {
    if (!isOpen || !producto) return null;

    // Verificar si el producto tiene detalles
    const tieneDetalles = producto.detalles && Array.isArray(producto.detalles) && producto.detalles.length > 0;

    return (
        <div className={styles.modalOverlay} onClick={(e) => {
            // Cerrar el modal si se hace clic fuera del contenido
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modalContent}>
                <div className={styles.productHeader}>
                    {producto.imagen?.urlImagen ? (
                        <div className={styles.productImageBackground} 
                            style={{backgroundImage: `url(${producto.imagen.urlImagen})`}}>
                        </div>
                    ) : (
                        <div className={styles.productImageBackground}>
                            <span className={styles.placeholderEmoji}>🍕</span>
                        </div>
                    )}
                    <div className={styles.productHeaderContent}>
                        <h2>{producto.denominacion}</h2>
                        <div className={styles.productPrice}>
                            ${producto.precioVenta}
                        </div>
                        <div className={styles.productTime}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>{producto.tiempoEstimadoProduccion} minutos</span>
                        </div>
                    </div>
                </div>

                <div className={styles.productIngredients}>
                    <h3>Ingredientes</h3>
                    {!tieneDetalles ? (
                        <p className={styles.noIngredients}>No hay ingredientes registrados</p>
                    ) : (
                        <ul className={styles.ingredientsList}>
                            {producto.detalles.map((detalle, index) => (
                                <li key={index} className={styles.ingredientItem}>
                                    <span className={styles.ingredientName}>
                                        {detalle.articuloInsumo.denominacion}
                                    </span>
                                    <span className={styles.ingredientQuantity}>
                                        {detalle.cantidad} {unidadMedidaLabel(detalle.articuloInsumo.unidadMedida)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    {producto.descripcion && (
                        <div className={styles.productDescription}>
                            <h3>Descripción</h3>
                            <p>{producto.descripcion}</p>
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

export default DetalleProductoModal;