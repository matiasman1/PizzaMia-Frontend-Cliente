import React, { useState, useEffect } from 'react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './Orders.module.css';
import orderIcon from '../../../../assets/client/order-icon.svg';
import filterIcon from '../../../../assets/client/filter-icon.svg';
import { useClientStore } from '../../../../store/useClientStore';
import { useAuthStore } from '../../../../store/authStore';
import { obtenerPedidosCliente, descargarFacturaPdf } from '../../../../api/clientApi';
import { PedidoVentaResponse } from '../../../../types/typesClient';
import DetallesModal from '../../../../components/Modal/DetallesModal';
import DateRangeModal from '../../../../components/Modal/DateRangeModal';

// Interfaz para la paginación
interface PageInfo {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

const Orders: React.FC = () => {
    // Hooks de autenticación y cliente
    const { cliente, isLoading: clienteLoading } = useClientStore();
    const token = useAuthStore(state => state.token);
    
    // Estados para pedidos y paginación
    const [pedidos, setPedidos] = useState<PedidoVentaResponse[]>([]);
    const [allPedidos, setAllPedidos] = useState<PedidoVentaResponse[]>([]); // Todos los pedidos sin paginar
    const [filteredPedidos, setFilteredPedidos] = useState<PedidoVentaResponse[]>([]);
    const [paginatedPedidos, setPaginatedPedidos] = useState<PedidoVentaResponse[]>([]); // Pedidos paginados localmente
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    });
    const [localPageInfo, setLocalPageInfo] = useState<PageInfo>({
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para los modales
    const [selectedPedido, setSelectedPedido] = useState<PedidoVentaResponse | null>(null);
    const [showDetallesModal, setShowDetallesModal] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    
    // Estado para filtros
    const [activeTab, setActiveTab] = useState<string>('todos');
    const [usarPaginacionLocal, setUsarPaginacionLocal] = useState<boolean>(false);
    
    // Añadir estos nuevos estados para el filtro de fechas
    const [showDateFilterModal, setShowDateFilterModal] = useState<boolean>(false);
    const [dateRangeFilter, setDateRangeFilter] = useState<{
        startDate: Date | null,
        endDate: Date | null
    }>({
        startDate: null,
        endDate: null
    });
    
    // Función para obtener todos los pedidos (sin paginar)
    const fetchAllPedidos = async () => {
        if (!cliente?.id || !token) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            console.log(`Obteniendo todos los pedidos del cliente ${cliente.id}`);
            const response = await obtenerPedidosCliente(
                cliente.id, 
                token,
                0,  // Página inicial
                1000 // Un tamaño grande para obtener todos
            );
            
            setAllPedidos(response.content);
        } catch (err) {
            console.error('Error al cargar todos los pedidos:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al cargar pedidos');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Efecto para cargar todos los pedidos cuando se monta el componente
    useEffect(() => {
        fetchAllPedidos();
    }, [cliente?.id, token]);
    
    // Función para aplicar el filtro a los pedidos
    const applyFilter = (filter: string) => {
        let filteredData: PedidoVentaResponse[] = [];
        
        switch (filter) {
            case 'completados':
                // Mostrar solo pedidos con estado "FACTURADO"
                filteredData = allPedidos.filter(pedido => 
                    pedido.estado?.denominacion === "FACTURADO"
                );
                break;
            case 'proceso':
                // Mostrar pedidos con estado diferente a "FACTURADO"
                filteredData = allPedidos.filter(pedido => 
                    pedido.estado?.denominacion !== "FACTURADO"
                );
                break;
            case 'todos':
            default:
                // Mostrar todos los pedidos
                filteredData = [...allPedidos];
                break;
        }
        
        // Actualizar los pedidos filtrados
        setFilteredPedidos(filteredData);
        
        // Configurar la paginación local
        const totalElements = filteredData.length;
        const totalPages = Math.ceil(totalElements / localPageInfo.size);
        
        setLocalPageInfo(prev => ({
            ...prev,
            number: 0, // Volver a la primera página
            totalElements,
            totalPages
        }));
        
        // Activar paginación local para los filtros distintos a "todos"
        setUsarPaginacionLocal(filter !== 'todos');
        
        // Si el filtro es "todos", usar la paginación del servidor
        if (filter === 'todos') {
            // Cargar la primera página desde el servidor
            setPageInfo(prev => ({
                ...prev,
                number: 0 // Volver a la primera página
            }));
        }
    };
    
    // Efecto para aplicar paginación local a los pedidos filtrados
    useEffect(() => {
        if (filteredPedidos.length > 0) {
            const startIndex = localPageInfo.number * localPageInfo.size;
            const endIndex = Math.min(startIndex + localPageInfo.size, filteredPedidos.length);
            
            setPaginatedPedidos(filteredPedidos.slice(startIndex, endIndex));
        } else {
            setPaginatedPedidos([]);
        }
    }, [filteredPedidos, localPageInfo.number, localPageInfo.size]);
    
    // Efecto para cargar pedidos del cliente (paginado desde el servidor)
    useEffect(() => {
        if (usarPaginacionLocal) return; // No hacer peticiones al servidor si usamos paginación local
        
        const fetchPedidos = async () => {
            if (!cliente?.id || !token) {
                return;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                console.log(`Obteniendo pedidos del cliente ${cliente.id}, página ${pageInfo.number}`);
                const response = await obtenerPedidosCliente(
                    cliente.id, 
                    token,
                    pageInfo.number,
                    pageInfo.size
                );
                
                console.log('Pedidos obtenidos:', response);
                const pedidosData = response.content;
                setPedidos(pedidosData);
                console.log(`Total de pedidos obtenidos:}`, pedidos);
                setFilteredPedidos(pedidosData);
                setPaginatedPedidos(pedidosData);
                
                setPageInfo({
                    number: response.number,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages
                });
            } catch (err) {
                console.error('Error al cargar pedidos:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido al cargar pedidos');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPedidos();
    }, [cliente?.id, token, pageInfo.number, pageInfo.size, usarPaginacionLocal]);
    
    // Función para cambiar de página (servidor o local)
    const changePage = (page: number) => {
        if (usarPaginacionLocal) {
            setLocalPageInfo(prev => ({ ...prev, number: page }));
        } else {
            setPageInfo(prev => ({ ...prev, number: page }));
        }
    };
    
    // Función para ir a la página anterior
    const goToPrevPage = () => {
        if (usarPaginacionLocal) {
            if (localPageInfo.number > 0) {
                changePage(localPageInfo.number - 1);
            }
        } else {
            if (pageInfo.number > 0) {
                changePage(pageInfo.number - 1);
            }
        }
    };
    
    // Función para ir a la página siguiente
    const goToNextPage = () => {
        if (usarPaginacionLocal) {
            if (localPageInfo.number < localPageInfo.totalPages - 1) {
                changePage(localPageInfo.number + 1);
            }
        } else {
            if (pageInfo.number < pageInfo.totalPages - 1) {
                changePage(pageInfo.number + 1);
            }
        }
    };
    
    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    // Función para obtener el total de items en un pedido
    const getTotalItems = (pedido: PedidoVentaResponse) => {
        return pedido.detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
    };
    
    // Función para ver detalles de un pedido
    const viewDetails = (pedido: PedidoVentaResponse) => {
        setSelectedPedido(pedido);
        setShowDetallesModal(true);
    };
    
    // Función para verificar si un pedido está facturado
    const isPedidoFacturado = (pedido: PedidoVentaResponse): boolean => {
        // Verificar si el estado es "FACTURADO" (también podríamos verificar por ID si sabemos el ID del estado)
        return pedido.estado?.denominacion === "FACTURADO";
    };
    
    // Función para descargar factura
    const downloadInvoice = async (pedido: PedidoVentaResponse) => {
        if (!token) {
            setError("No se pudo autenticar para descargar la factura");
            return;
        }
        
        // Verificar si el pedido está facturado
        if (!isPedidoFacturado(pedido)) {
            setError("Solo se pueden descargar facturas de pedidos facturados");
            return;
        }
        
        setIsDownloading(true);
        try {
            // Descargar la factura PDF
            const pdfBlob = await descargarFacturaPdf(pedido.id, token);
            
            // Crear una URL para el blob
            const blobUrl = window.URL.createObjectURL(pdfBlob);
            
            // Crear un elemento <a> para descargar el archivo
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `factura-pedido-${pedido.id}.pdf`;
            
            // Añadir el enlace al documento, hacer clic y luego removerlo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Liberar la URL del objeto
            window.URL.revokeObjectURL(blobUrl);
            
            // Mensaje de éxito
            console.log(`✅ Factura del pedido ${pedido.id} descargada correctamente`);
        } catch (err) {
            console.error('❌ Error al descargar factura:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al descargar la factura');
        } finally {
            setIsDownloading(false);
        }
    };
    
    // Función para aplicar el filtro por fecha
    const applyDateRangeFilter = (startDate: Date | null, endDate: Date | null) => {
        setDateRangeFilter({ startDate, endDate });
        
        // Si no hay fechas seleccionadas, no aplicamos filtro
        if (!startDate && !endDate) {
            applyFilter(activeTab);
            return;
        }
        
        let filteredData = [...allPedidos];
        
        // Primero filtramos por estado (tab)
        switch (activeTab) {
            case 'completados':
                filteredData = filteredData.filter(pedido => 
                    pedido.estado?.denominacion === "FACTURADO"
                );
                break;
            case 'proceso':
                filteredData = filteredData.filter(pedido => 
                    pedido.estado?.denominacion !== "FACTURADO"
                );
                break;
        }
        
        // Luego filtramos por fecha
        if (startDate || endDate) {
            filteredData = filteredData.filter(pedido => {
                const pedidoDate = new Date(pedido.horaEstimadaFinalizacion);
                
                // Si solo hay fecha de inicio
                if (startDate && !endDate) {
                    // Establecer la hora de startDate a 00:00:00
                    const startDateTime = new Date(startDate);
                    startDateTime.setHours(0, 0, 0, 0);
                    return pedidoDate >= startDateTime;
                }
                
                // Si solo hay fecha de fin
                if (!startDate && endDate) {
                    // Establecer la hora de endDate a 23:59:59
                    const endDateTime = new Date(endDate);
                    endDateTime.setHours(23, 59, 59, 999);
                    return pedidoDate <= endDateTime;
                }
                
                // Si hay ambas fechas
                if (startDate && endDate) {
                    // Ajustar las horas para incluir todo el día
                    const startDateTime = new Date(startDate);
                    startDateTime.setHours(0, 0, 0, 0);
                    
                    const endDateTime = new Date(endDate);
                    endDateTime.setHours(23, 59, 59, 999);
                    
                    return pedidoDate >= startDateTime && pedidoDate <= endDateTime;
                }
                
                return true;
            });
        }
        
        // Actualizar los pedidos filtrados
        setFilteredPedidos(filteredData);
        
        // Configurar la paginación local
        const totalElements = filteredData.length;
        const totalPages = Math.ceil(totalElements / localPageInfo.size);
        
        setLocalPageInfo(prev => ({
            ...prev,
            number: 0, // Volver a la primera página
            totalElements,
            totalPages
        }));
        
        // Usar siempre paginación local cuando se aplica filtro de fechas
        setUsarPaginacionLocal(true);
    };
    
    // Función para limpiar el filtro de fechas
    const clearDateFilter = () => {
        setDateRangeFilter({
            startDate: null,
            endDate: null
        });
        
        // Volver a aplicar solo el filtro por tab
        applyFilter(activeTab);
    };
    
    // Mostrar indicador visual si hay filtro de fechas activo
    const isDateFilterActive = () => {
        return dateRangeFilter.startDate !== null || dateRangeFilter.endDate !== null;
    };
    
    // Formatear el rango de fechas para mostrar
    const formatDateRangeForDisplay = () => {
        if (!dateRangeFilter.startDate && !dateRangeFilter.endDate) {
            return '';
        }
        
        const formatDate = (date: Date | null) => {
            if (!date) return '';
            return date.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };
        
        if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
            return `${formatDate(dateRangeFilter.startDate)} - ${formatDate(dateRangeFilter.endDate)}`;
        } else if (dateRangeFilter.startDate) {
            return `Desde ${formatDate(dateRangeFilter.startDate)}`;
        } else if (dateRangeFilter.endDate) {
            return `Hasta ${formatDate(dateRangeFilter.endDate)}`;
        }
        
        return '';
    };
    
    // Reemplazar tu función filterPedidos existente con esta:
    const filterPedidos = (tab: string) => {
        setActiveTab(tab);
        
        // Si hay un filtro de fechas activo, aplicarlo junto con el nuevo tab
        if (isDateFilterActive()) {
            applyDateRangeFilter(dateRangeFilter.startDate, dateRangeFilter.endDate);
        } else {
            applyFilter(tab);
        }
    };
    
    // Renderizado de los números de página para la navegación
    const renderPagination = () => {
        const pages = [];
        const displayPages = 5; // Número máximo de páginas a mostrar
        
        // Determinar qué información de página usar
        const pInfo = usarPaginacionLocal ? localPageInfo : pageInfo;
        const totalPages = pInfo.totalPages;
        const currentPage = pInfo.number;
        
        // No mostrar paginación si solo hay una página
        if (totalPages <= 1) return null;
        
        let startPage = Math.max(0, currentPage - Math.floor(displayPages / 2));
        let endPage = Math.min(totalPages - 1, startPage + displayPages - 1);
        
        if (endPage - startPage + 1 < displayPages) {
            startPage = Math.max(0, endPage - displayPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
                    onClick={() => changePage(i)}
                >
                    {i + 1}
                </button>
            );
        }
        
        return (
            <div className={styles.pagination}>
                <button
                    className={`${styles.pageNavButton} ${currentPage === 0 ? styles.disabledButton : ''}`}
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                >
                    &lt;
                </button>
                {pages}
                {endPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
                {endPage < totalPages - 1 &&
                    <button
                        className={styles.pageButton}
                        onClick={() => changePage(totalPages - 1)}
                    >
                        {totalPages}
                    </button>
                }
                <button
                    className={`${styles.pageNavButton} ${currentPage === totalPages - 1 ? styles.disabledButton : ''}`}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                >
                    &gt;
                </button>
            </div>
        );
    };
    
    // Mostrar mensaje de carga mientras se cargan datos
    if (clienteLoading || isLoading) {
        return (
            <ProfileLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando pedidos...</p>
                </div>
            </ProfileLayout>
        );
    }
    
    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Mis pedidos</h2>
                    <button 
                        className={`${styles.filterButton} ${isDateFilterActive() ? styles.activeFilter : ''}`}
                        onClick={() => setShowDateFilterModal(true)}
                    >
                        <img src={filterIcon} alt="Filtros" className={styles.filterIcon} />
                    </button>
                </div>
                
                {error && <div className={styles.errorMessage}>{error}</div>}
                
                {/* Mostrar el filtro activo si existe */}
                {isDateFilterActive() && (
                    <div className={styles.activeFilterBar}>
                        <span className={styles.filterLabel}>Filtro de fechas:</span>
                        <span className={styles.filterValue}>{formatDateRangeForDisplay()}</span>
                        <button 
                            className={styles.clearFilterButton} 
                            onClick={clearDateFilter}
                            title="Quitar filtro de fechas"
                        >
                            ✕
                        </button>
                    </div>
                )}
                
                <div className={styles.ordersTable}>
                    <div className={styles.tabHeader}>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'todos' ? styles.activeTab : ''}`}
                            onClick={() => filterPedidos('todos')}
                        >
                            Todos
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'completados' ? styles.activeTab : ''}`}
                            onClick={() => filterPedidos('completados')}
                        >
                            Completado
                        </button>
                        <button 
                            className={`${styles.tabButton} ${activeTab === 'proceso' ? styles.activeTab : ''}`}
                            onClick={() => filterPedidos('proceso')}
                        >
                            En Proceso
                        </button>
                    </div>
                    
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>Cargando pedidos...</p>
                        </div>
                    ) : paginatedPedidos.length === 0 ? (
                        <div className={styles.emptyOrdersMessage}>
                            <p>
                                {activeTab === 'todos' 
                                    ? 'No tienes pedidos realizados aún.' 
                                    : activeTab === 'completados' 
                                        ? 'No tienes pedidos completados.' 
                                        : 'No tienes pedidos en proceso.'}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {paginatedPedidos.map((pedido) => (
                                <div key={pedido.id} className={styles.orderItem}>
                                    <div className={styles.orderIconContainer}>
                                        <img src={orderIcon} alt="Pedido" className={styles.orderIcon} />
                                    </div>
                                    <div className={styles.orderDetails}>
                                        <div className={styles.orderHeader}>
                                            <div className={styles.orderIdContainer}>
                                                <span className={styles.orderIdLabel}>Order #{pedido.id}</span>
                                                <span className={styles.orderDate}>
                                                    {formatDate(pedido.horaEstimadaFinalizacion || '')}
                                                </span>
                                            </div>
                                            <div className={styles.orderStatus}>
                                                {pedido.estado?.denominacion || "Sin estado"}
                                            </div>
                                        </div>
                                        <div className={styles.orderInfo}>
                                            <div className={styles.orderTotals}>
                                                <span className={styles.totalLabel}>Total:</span>
                                                <span className={styles.totalAmount}>${pedido.total.toFixed(2)}</span>
                                            </div>
                                            <div className={styles.orderQuantity}>
                                                <span className={styles.quantityLabel}>Cantidad:</span>
                                                <span className={styles.quantityValue}>{getTotalItems(pedido)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.orderActions}>
                                            <button
                                                className={styles.detailsButton}
                                                onClick={() => viewDetails(pedido)}
                                            >
                                                Ver detalles
                                            </button>
                                            <button
                                                className={styles.invoiceButton}
                                                onClick={() => downloadInvoice(pedido)}
                                                disabled={isDownloading || !isPedidoFacturado(pedido)}
                                            >
                                                {isDownloading ? 'Descargando...' : 'Descargar factura'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {paginatedPedidos.length > 0 && renderPagination()}
                </div>
            </div>
            
            {/* Modal de Detalles */}
            {selectedPedido && (
                <DetallesModal
                    isOpen={showDetallesModal}
                    onClose={() => setShowDetallesModal(false)}
                    pedido={{
                        id: selectedPedido.id,
                        items: selectedPedido.detalles.map(detalle => {
                            // Determinar qué tipo de producto es y obtener su información
                            let nombre = "Producto sin identificar";
                            let precio = 0;
                            let imagen = undefined;
                            
                            if (detalle.articuloManufacturado) {
                                nombre = detalle.articuloManufacturado.denominacion || "Producto elaborado";
                                precio = detalle.articuloManufacturado.precioVenta || 0;
                                imagen = detalle.articuloManufacturado.imagen?.urlImagen;
                            } else if (detalle.articuloInsumo) {
                                nombre = detalle.articuloInsumo.denominacion || "Producto no elaborado";
                                precio = detalle.articuloInsumo.precioVenta || 0;
                                imagen = detalle.articuloInsumo.imagen?.urlImagen;
                            } else if (detalle.promocion) {
                                nombre = detalle.promocion.denominacion || "Promoción";
                                precio = detalle.promocion.precioVenta || 0;
                                imagen = detalle.promocion.imagen?.urlImagen;
                            }
                            
                            // Calcular el subtotal del ítem
                            const subtotal = precio * detalle.cantidad;
                            
                            return {
                                nombre: nombre,
                                cantidad: detalle.cantidad,
                                precio: precio,
                                subtotal: subtotal,
                                imagen: imagen
                            };
                        }),
                        subtotal: selectedPedido.total // O el subtotal si está disponible
                    }}
                    onDownloadFactura={() => downloadInvoice(selectedPedido)}
                    isDownloading={isDownloading}
                    isFacturado={isPedidoFacturado(selectedPedido)}
                />
            )}
            
            {/* Modal de selección de rango de fechas */}
            <DateRangeModal
                isOpen={showDateFilterModal}
                onClose={() => setShowDateFilterModal(false)}
                onApply={(startDate, endDate) => {
                    applyDateRangeFilter(startDate, endDate);
                    setShowDateFilterModal(false);
                }}
                initialStart={dateRangeFilter.startDate}
                initialEnd={dateRangeFilter.endDate}
            />
        </ProfileLayout>
    );
};

export default Orders;