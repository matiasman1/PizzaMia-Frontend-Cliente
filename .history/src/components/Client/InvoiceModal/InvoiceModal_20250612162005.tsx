import React from 'react';
import { GoBackButton } from '../GoBackButton';
import styles from './InvoiceModal.module.css';

interface InvoiceItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderDate: string;
    items: InvoiceItem[];
    subtotal: number;
    delivery: number;
    discount: number;
    total: number;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
    isOpen,
    onClose,
    orderId,
    orderDate,
    items,
    subtotal,
    delivery,
    discount,
    total
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDate = (dateString: string): string => {
        const [day, month, year] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };
        
        return date.toLocaleDateString('es-ES', options);
    };

    const formatTime = (): string => {
        return '16:13 h'; // Hora fija como en el modelo
    };

    const downloadInvoice = () => {
        // Aquí implementarías la lógica para descargar la factura
        console.log('Descargando factura...');
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
                        <h2 className={styles.title}>Factura pedido</h2>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Icono de Pizza */}
                    <div className={styles.pizzaIcon}>
                        🍕
                    </div>

                    {/* Título Tu pedido */}
                    <h3 className={styles.orderTitle}>Tu pedido</h3>

                    {/* Fecha y hora */}
                    <div className={styles.orderDateTime}>
                        <span className={styles.dateTime}>
                            {formatDate(orderDate)} - {formatTime()}
                        </span>
                        <span className={styles.orderNumber}>Order N° {orderId}</span>
                    </div>

                    {/* Lista de items */}
                    <div className={styles.itemsList}>
                        {items.map((item, index) => (
                            <div key={index} className={styles.invoiceItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemQuantity}>{item.quantity}x</span>
                                    <span className={styles.itemName}>{item.name}</span>
                                </div>
                                <span className={styles.itemPrice}>${item.price} c/u</span>
                            </div>
                        ))}
                    </div>

                    {/* Resumen de costos */}
                    <div className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Subtotal</span>
                            <span className={styles.summaryValue}>${subtotal}</span>
                        </div>
                        
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Delivery</span>
                            <span className={styles.summaryValue}>${delivery}</span>
                        </div>
                        
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Descuento 10%</span>
                            <span className={styles.summaryValue}>-${discount}</span>
                        </div>
                        
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total</span>
                            <span className={styles.totalValue}>${total}</span>
                        </div>
                    </div>

                    {/* Botón de descarga */}
                    <button className={styles.downloadButton} onClick={downloadInvoice}>
                        DESCARGAR FACTURA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;