import React from 'react';
import GoBackButton from '../GoBackButton';
import styles from './OrderDetailsModal.module.css';

interface OrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderDate: string;
    orderItems: OrderItem[];
    subtotal: number;
    onViewInvoice?: () => void; // Nueva prop para manejar ver factura
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    isOpen,
    onClose,
    orderId,
    orderDate,
    orderItems,
    subtotal,
    onViewInvoice
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleViewInvoice = () => {
        if (onViewInvoice) {
            onViewInvoice();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.goBackContainer}>
                            <GoBackButton 
                                onClick={onClose}
                                variant="modal"
                                showBackText={false}
                            />
                        </div>
                        <h2 className={styles.title}>Detalles pedido</h2>
                    </div>
                </div>

                <div className={styles.orderInfo}>
                    <div className={styles.orderMeta}>
                        <span className={styles.orderLabel}>Pedido</span>
                        <span className={styles.statusBadge}>Completo</span>
                    </div>
                    
                    <div className={styles.orderHeader}>
                        <div className={styles.orderNumber}>Order №{orderId}</div>
                        <div className={styles.orderDate}>{orderDate}</div>
                    </div>
                </div>

                <div className={styles.itemsList}>
                    {orderItems.map((item, index) => (
                        <div key={index} className={styles.itemCard}>
                            <div className={styles.itemImage}>
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className={styles.itemDetails}>
                                <h3 className={styles.itemName}>{item.name}</h3>
                                <div className={styles.itemMeta}>
                                    <span className={styles.itemQuantity}>Cantidad: {item.quantity}</span>
                                    <span className={styles.itemPrice}>${item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <div className={styles.subtotalRow}>
                        <span className={styles.subtotalLabel}>SUBTOTAL</span>
                        <span className={styles.subtotalAmount}>${subtotal}</span>
                    </div>
                </div>

                <button className={styles.invoiceButton} onClick={handleViewInvoice}>
                    VER FACTURA
                </button>
            </div>
        </div>
    );
};

export default OrderDetailsModal;