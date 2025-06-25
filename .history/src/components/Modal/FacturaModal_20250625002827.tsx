import React from 'react';
import styles from './FacturaModal.module.css';

interface FacturaModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedido: {
        id: number;
        fecha: string;
        orderNumber: string;
        items: Array<{
            nombre: string;
            cantidad: number;
            precio: number;
        }>;
        subtotal: number;
        delivery: number;
        descuento: number;
        total: number;
    };
    onDownload: () => void;
    isDownloading: boolean;
}

const FacturaModal: React.FC<FacturaModalProps> = ({
    isOpen,
    onClose,
    pedido,
    onDownload,
    isDownloading
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={onClose}>
                        ←
                    </button>
                    <h2 className={styles.title}>Factura pedido</h2>
                </div>

                {/* Pizza Icon */}
                <div className={styles.iconContainer}>
                    <div className={styles.pizzaIcon}>🍕</div>
                </div>

                {/* Order Info */}
                <div className={styles.orderInfo}>
                    <h3 className={styles.orderTitle}>Tu pedido</h3>
                    <p className={styles.orderDate}>{pedido.fecha}</p>
                    <p className={styles.orderNumber}>Order N° {pedido.orderNumber}</p>
                </div>

                {/* Items */}
                <div className={styles.itemsList}>
                    {pedido.items.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <span className={styles.itemName}>
                                {item.cantidad}x {item.nombre}
                            </span>
                            <span className={styles.itemPrice}>${item.precio} c/u</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className={styles.totals}>
                    <div className={styles.totalRow}>
                        <span>Subtotal</span>
                        <span>${pedido.subtotal}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Delivery</span>
                        <span>${pedido.delivery}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Descuento 10%</span>
                        <span>-${pedido.descuento}</span>
                    </div>
                    <div className={styles.totalRowFinal}>
                        <span>Total</span>
                        <span>${pedido.total}</span>
                    </div>
                </div>

                {/* Download Button */}
                <button 
                    className={styles.downloadButton}
                    onClick={onDownload}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'DESCARGANDO...' : 'DESCARGAR FACTURA'}
                </button>
            </div>
        </div>
    );
};

export default FacturaModal;