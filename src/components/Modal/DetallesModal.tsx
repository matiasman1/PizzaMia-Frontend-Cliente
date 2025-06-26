import React from 'react';
import styles from './DetallesModal.module.css';

interface DetallesModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedido: {
        id: number;
        items: Array<{
            nombre: string;
            cantidad: number;
            precio: number;
            subtotal?: number; // Añadido para mostrar subtotal por ítem
            imagen?: string;
        }>;
        subtotal: number;
    };
    onDownloadFactura: () => void;
    isDownloading?: boolean;
    isFacturado?: boolean;
}

const DetallesModal: React.FC<DetallesModalProps> = ({
    isOpen,
    onClose,
    pedido,
    onDownloadFactura,
    isDownloading = false,
    isFacturado = false
}) => {
    if (!isOpen) return null;

    // Función para formatear números como moneda
    const formatCurrency = (value: number) => {
        return `$${value.toFixed(2)}`;
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={onClose}>
                        ←
                    </button>
                    <h2 className={styles.title}>Detalles pedido #{pedido.id}</h2>
                </div>

                {/* Items */}
                <div className={styles.itemsList}>
                    <div className={styles.itemHeader}>
                        <div className={styles.itemHeaderName}>Producto</div>
                        <div className={styles.itemHeaderQuantity}>Cant</div>
                        <div className={styles.itemHeaderPrice}>Precio</div>
                        <div className={styles.itemHeaderSubtotal}>Subtotal</div>
                    </div>
                    
                    {pedido.items.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.itemImage}>
                                {item.imagen ? (
                                    <img src={item.imagen} alt={item.nombre} />
                                ) : (
                                    <div className={styles.placeholderImage}>🍕</div>
                                )}
                            </div>
                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemName}>{item.nombre}</h3>
                            </div>
                            <div className={styles.itemQuantity}>{item.cantidad}</div>
                            <div className={styles.itemPrice}>{formatCurrency(item.precio)}</div>
                            <div className={styles.itemSubtotal}>
                                {formatCurrency(item.subtotal || (item.precio * item.cantidad))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subtotal */}
                <div className={styles.subtotal}>
                    <span className={styles.subtotalLabel}>TOTAL</span>
                    <span className={styles.subtotalValue}>{formatCurrency(pedido.subtotal)}</span>
                </div>

                {/* Botón de Descargar Factura */}
                <button 
                    className={styles.facturaButton}
                    onClick={onDownloadFactura}
                    disabled={isDownloading || !isFacturado}
                >
                    {!isFacturado 
                        ? 'PEDIDO NO FACTURADO' 
                        : isDownloading 
                            ? 'DESCARGANDO...' 
                            : 'DESCARGAR FACTURA'}
                </button>
            </div>
        </div>
    );
};

export default DetallesModal;