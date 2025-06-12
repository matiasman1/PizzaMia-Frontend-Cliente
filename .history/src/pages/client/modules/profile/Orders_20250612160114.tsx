import React, { useState } from 'react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
<<<<<<< HEAD
import DateRangeCalendar from '../../../../components/Client/DateRangeCalendar/DateRangeCalendar';
import OrderDetailsModal from '../../../../components/Client/OrderDetailsModal/OrderDetailsModal';
import InvoiceModal from '../../../../components/Client/InvoiceModal/InvoiceModal';
=======
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
import styles from './Orders.module.css';
import orderIcon from '../../../../assets/client/order-icon.svg';
import filterIcon from '../../../../assets/client/filter-icon.svg';

<<<<<<< HEAD
// Importar imágenes de pizzas
import pizzaBBQ from '../../../../assets/client/pizza-bbq.png';
import pizzaPepperoni from '../../../../assets/client/pizza-pepperoni.png';

interface OrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

=======
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
interface Order {
    id: string;
    date: string;
    total: number;
    quantity: number;
<<<<<<< HEAD
    status: 'Completado';
    items: OrderItem[];
    subtotal: number;
    delivery: number;
    discount: number;
}

const Orders: React.FC = () => {
    // Estados existentes
    const [orders, setOrders] = useState<Order[]>([
        {
            id: '1947034',
            date: '05-12-2025',
            total: 342.2,
            quantity: 1,
            status: 'Completado',
            subtotal: 388,
            delivery: 0,
            discount: 38.8,
            items: [
                {
                    id: '1',
                    name: 'Pizza BBQ',
                    image: pizzaBBQ,
                    quantity: 2,
                    price: 40
                },
                {
                    id: '2',
                    name: 'Pizza Pepperoni',
                    image: pizzaPepperoni,
                    quantity: 2,
                    price: 60
                },
                {
                    id: '3',
                    name: 'Pizza Fugazzeta',
                    image: pizzaBBQ,
                    quantity: 2,
                    price: 94
                }
            ]
        },
        {
            id: '1947032',
            date: '01-07-2025',
            total: 25.50,
            quantity: 2,
            status: 'Completado',
            subtotal: 100,
            delivery: 0,
            discount: 10,
            items: [
                {
                    id: '1',
                    name: 'Pizza BBQ',
                    image: pizzaBBQ,
                    quantity: 2,
                    price: 40
                }
            ]
        },
        {
            id: '1947033',
            date: '03-07-2025',
            total: 18.75,
            quantity: 1,
            status: 'Completado',
            subtotal: 80,
            delivery: 0,
            discount: 8,
            items: [
                {
                    id: '1',
                    name: 'Pizza Pepperoni',
                    image: pizzaPepperoni,
                    quantity: 2,
                    price: 60
                }
            ]
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    // Estados para el calendario
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

    // Estados para el modal de detalles
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Estados para el modal de factura
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

    // Funciones existentes...
    const viewDetails = (orderId: string) => {
        const order = filteredOrders.find(o => o.id === orderId);
        if (order) {
            setSelectedOrder(order);
            setIsOrderDetailsOpen(true);
        }
    };

    const viewInvoice = (orderId: string) => {
        const order = filteredOrders.find(o => o.id === orderId);
        if (order) {
            setSelectedInvoiceOrder(order);
            setIsInvoiceOpen(true);
        }
    };

=======
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
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
    const changePage = (page: number) => {
        setCurrentPage(page);
    };

<<<<<<< HEAD
=======
    // Función para ir a la página anterior
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

<<<<<<< HEAD
=======
    // Función para ir a la página siguiente
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

<<<<<<< HEAD
    // Funciones del calendario
    const handleCalendarOpen = () => {
        setIsCalendarOpen(true);
    };

    const handleCalendarClose = () => {
        setIsCalendarOpen(false);
    };

    const parseDate = (dateString: string): Date => {
        const [day, month, year] = dateString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
        setDateRange({ start: startDate, end: endDate });
        
        const filtered = orders.filter(order => {
            const orderDate = parseDate(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
        
        setFilteredOrders(filtered);
    };

    const clearFilter = () => {
        setDateRange({ start: null, end: null });
        setFilteredOrders(orders);
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Funciones del modal de detalles
    const handleOrderDetailsClose = () => {
        setIsOrderDetailsOpen(false);
        setSelectedOrder(null);
    };

    // Funciones del modal de factura
    const handleInvoiceClose = () => {
        setIsInvoiceOpen(false);
        setSelectedInvoiceOrder(null);
    };

    // Función de paginación existente
    const renderPagination = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
=======
    // Renderizado de los números de página para la navegación
    const renderPagination = () => {
        const pages = [];
        const displayPages = 5; // Número máximo de páginas a mostrar
        let startPage = Math.max(1, currentPage - Math.floor(displayPages / 2));
        let endPage = Math.min(totalPages, startPage + displayPages - 1);

        if (endPage - startPage + 1 < displayPages) {
            startPage = Math.max(1, endPage - displayPages + 1);
        }
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258

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
<<<<<<< HEAD
                    <button className={styles.filterButton} onClick={handleCalendarOpen}>
=======
                    <button className={styles.filterButton}>
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
                        <img src={filterIcon} alt="Filtros" className={styles.filterIcon} />
                    </button>
                </div>

<<<<<<< HEAD
                {/* Mostrar información del filtro aplicado */}
                {dateRange.start && dateRange.end && (
                    <div className={styles.filterInfo}>
                        <span>
                            Mostrando pedidos del {formatDate(dateRange.start)} al {formatDate(dateRange.end)}
                        </span>
                        <button onClick={clearFilter} className={styles.clearFilter}>
                            Limpiar filtro
                        </button>
                    </div>
                )}

=======
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
                <div className={styles.ordersTable}>
                    <div className={styles.tabHeader}>
                        <button className={`${styles.tabButton} ${styles.activeTab}`}>Pedido</button>
                        <button className={styles.tabButton}>Completado</button>
                    </div>

                    <div className={styles.ordersList}>
<<<<<<< HEAD
                        {filteredOrders.map((order, index) => (
=======
                        {orders.map((order, index) => (
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
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

<<<<<<< HEAD
                    {/* Mostrar mensaje si no hay pedidos */}
                    {filteredOrders.length === 0 && (
                        <div className={styles.noOrders}>
                            No se encontraron pedidos en el rango de fechas seleccionado.
                        </div>
                    )}

                    {renderPagination()}
                </div>
            </div>

            {/* Componente del calendario */}
            <DateRangeCalendar
                isOpen={isCalendarOpen}
                onClose={handleCalendarClose}
                onAccept={handleDateRangeSelect}
            />

            {/* Componente del modal de detalles */}
            <OrderDetailsModal
                isOpen={isOrderDetailsOpen}
                onClose={handleOrderDetailsClose}
                orderId={selectedOrder?.id || ''}
                orderDate={selectedOrder?.date || ''}
                orderItems={selectedOrder?.items || []}
                subtotal={selectedOrder?.total || 0}
                onViewInvoice={() => {
                    if (selectedOrder) {
                        handleOrderDetailsClose();
                        setSelectedInvoiceOrder(selectedOrder);
                        setIsInvoiceOpen(true);
                    }
                }}
            />

            {/* Componente del modal de factura */}
            <InvoiceModal
                isOpen={isInvoiceOpen}
                onClose={handleInvoiceClose}
                orderId={selectedInvoiceOrder?.id || ''}
                orderDate={selectedInvoiceOrder?.date || ''}
                items={selectedInvoiceOrder?.items || []}
                subtotal={selectedInvoiceOrder?.subtotal || 0}
                delivery={selectedInvoiceOrder?.delivery || 0}
                discount={selectedInvoiceOrder?.discount || 0}
                total={selectedInvoiceOrder?.total || 0}
            />
=======
                    {renderPagination()}
                </div>
            </div>
>>>>>>> 6fe1fd57108561c312415c7fdc6cd4a8eae43258
        </ProfileLayout>
    );
};

export default Orders;