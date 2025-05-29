import React from "react";
import { ArticuloManufacturadoApi } from "../../../../../types/typesAdmin";
import styles from "../ProductosSection.module.css";
import shared from "../../styles/Common.module.css";

interface VerRecetaModalProps {
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

export const VerRecetaModal: React.FC<VerRecetaModalProps> = ({
    isOpen,
    onClose,
    producto
}) => {
    if (!isOpen || !producto) return null;

    return (
        <div className={shared.modalOverlay}>
            <div className={`${shared.modalContent} ${styles.recetaModalContent}`}>
                <div className={styles.recetaHeader}>
                    {producto.imagen?.urlImagen && (
                        <div className={styles.recetaImageBackground} 
                             style={{backgroundImage: `url(${producto.imagen.urlImagen})`}}>
                        </div>
                    )}
                    <div className={styles.recetaHeaderContent}>
                        <h2 className={styles.recetaTitulo}>{producto.denominacion}</h2>
                        <div className={styles.recetaTiempo}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>{producto.tiempoEstimadoProduccion} min</span>
                        </div>
                    </div>
                </div>

                <div className={styles.recetaIngredientes}>
                    <h3>Ingredientes</h3>
                    {producto.detalles.length === 0 ? (
                        <p className={styles.noIngredientes}>No hay ingredientes registrados</p>
                    ) : (
                        <ul className={styles.ingredientesList}>
                            {producto.detalles.map((detalle, index) => (
                                <li key={index} className={styles.ingredienteRecetaItem}>
                                    <span className={styles.ingredienteNombre}>
                                        {detalle.articuloInsumo.denominacion}
                                    </span>
                                    <span className={styles.ingredienteCantidad}>
                                        {detalle.cantidad} {unidadMedidaLabel(detalle.articuloInsumo.unidadMedida)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={shared.modalActions}>
                    <button
                        className={shared.salirButton}
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerRecetaModal;