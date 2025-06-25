import React, { useState } from 'react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './Orders.module.css';
import orderIcon from '../../../../assets/client/order-icon.svg';
import filterIcon from '../../../../assets/client/filter-icon.svg';

interface Order {
    id: string;
    date: string;
    total: number;
    quantity: number;
    status: 'Completado' | 'En proceso' | 'Cancelado';
}

const Orders: React.FC = () => {
    // Estado para almacenar los pedidos
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 'No1947034',
            date: '05-12-2025',
            total: 35.25,
            quantity: 1,
            status: 'Completado'
        },
        {
            id: 'No1947034',
            date: '05-12-2025',
            total: 35.25,
            quantity: 1,
            status: 'Completado'
        },
        {
            id: 'No1947034',
            date: '05-12-2025',
            total: 35.25,
            quantity: 1,
            status: 'Completado'
        }
    ]);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; // Suponiendo que hay 10 páginas en total

    // Función para ver detalles de un pedido
    const viewDetails = (orderId: string) => {
        alert(`Ver detalles del pedido ${orderId}`);
    };

    // Función para ver factura de un pedido
    const viewInvoice = (orderId: string) => {
        alert(`Ver factura del pedido ${orderId}`);
    };

    // Función para cambiar de página
    const changePage = (page: number) => {
        setCurrentPage(page);
    };

    // Función para ir a la página anterior
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Función para ir a la página siguiente
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Renderizado de los números de página para la navegación
    const renderPagination = () => {
        const pages = [];
        const displayPages = 5; // Número máximo de páginas a mostrar
        let startPage = Math.max(1, currentPage - Math.floor(displayPages / 2));
        let endPage = Math.min(totalPages, startPage + displayPages - 1);

        if (endPage - startPage + 1 < displayPages) {
            startPage = Math.max(1, endPage - displayPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
                    onClick={() => changePage(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className={styles.pagination}>
                <button
                    className={`${styles.pageNavButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {pages}
                {endPage < totalPages && <span className={styles.ellipsis}>...</span>}
                {endPage < totalPages &&
                    <button
                        className={styles.pageButton}
                        onClick={() => changePage(totalPages)}
                    >
                        {totalPages}
                    </button>
                }
                <button
                    className={`${styles.pageNavButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        );
    };

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Mis pedidos</h2>
                    <button className={styles.filterButton}>
                        <img src={filterIcon} alt="Filtros" className={styles.filterIcon} />
                    </button>
                </div>

                <div className={styles.ordersTable}>
                    <div className={styles.tabHeader}>
                        <button className={`${styles.tabButton} ${styles.activeTab}`}>Pedido</button>
                        <button className={styles.tabButton}>Completado</button>
                    </div>

                    <div className={styles.ordersList}>
                        {orders.map((order, index) => (
                            <div key={`${order.id}-${index}`} className={styles.orderItem}>
                                <div className={styles.orderIconContainer}>
                                    <img src={orderIcon} alt="Pedido" className={styles.orderIcon} />
                                </div>
                                <div className={styles.orderDetails}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderIdContainer}>
                                            <span className={styles.orderIdLabel}>Order {order.id}</span>
                                            <span className={styles.orderDate}>{order.date}</span>
                                        </div>
                                    </div>
                                    <div className={styles.orderInfo}>
                                        <div className={styles.orderTotals}>
                                            <span className={styles.totalLabel}>Total:</span>
                                            <span className={styles.totalAmount}>${order.total.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.orderQuantity}>
                                            <span className={styles.quantityLabel}>Cantidad:</span>
                                            <span className={styles.quantityValue}>{order.quantity}</span>
                                        </div>
                                    </div>
                                    <div className={styles.orderActions}>
                                        <button
                                            className={styles.detailsButton}
                                            onClick={() => viewDetails(order.id)}
                                        >
                                            Ver detalles
                                        </button>
                                        <button
                                            className={styles.invoiceButton}
                                            onClick={() => viewInvoice(order.id)}
                                        >
                                            Ver factura
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {renderPagination()}
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Orders;