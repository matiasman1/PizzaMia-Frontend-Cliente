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
            imagen?: string;
        }>;
        subtotal: number;
    };
    onViewFactura: () => void;
}

const DetallesModal: React.FC<DetallesModalProps> = ({
    isOpen,
    onClose,
    pedido,
    onViewFactura
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
                    <h2 className={styles.title}>Detalles pedido</h2>
                </div>

                {/* Items */}
                <div className={styles.itemsList}>
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
                                <p className={styles.itemQuantity}>Cantidad: {item.cantidad}</p>
                            </div>
                            <div className={styles.itemPrice}>${item.precio}</div>
                        </div>
                    ))}
                </div>

                {/* Subtotal */}
                <div className={styles.subtotal}>
                    <span className={styles.subtotalLabel}>SUBTOTAL</span>
                    <span className={styles.subtotalValue}>${pedido.subtotal}</span>
                </div>

                {/* Ver Factura Button */}
                <button 
                    className={styles.facturaButton}
                    onClick={onViewFactura}
                >
                    VER FACTURA
                </button>
            </div>
        </div>
    );
};

export default DetallesModal;