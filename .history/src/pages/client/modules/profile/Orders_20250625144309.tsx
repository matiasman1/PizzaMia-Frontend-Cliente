import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { obtenerPedidosPorClienteAuth0, descargarFacturaPDF } from '../../../../api/clientApi';
import { PedidoVentaResponse } from '../../../../types/typesClient';
import GenericTable from '../../../../components/GenericTable/GenericTable';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import FacturaModal from '../../../../components/Modal/FacturaModal';
import DetallesModal from '../../../../components/Modal/DetallesModal';
import DateRangeModal from '../../../../components/Modal/DateRangeModal';

// IMPORTACIÓN DIRECTA DEL SVG
import orderIcon from '../../../../assets/client/order-icon.svg';

import styles from './Orders.module.css';

// Tipos para la tabla
interface OrderForTable {
    id: number; // CAMBIO: De React.ReactNode a number
    fecha: string;
    total: string;
    estado: React.ReactNode;
    tipo: string;
    acciones: React.ReactNode;
}

const Orders: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [pedidos, setPedidos] = useState<PedidoVentaResponse[]>([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState<PedidoVentaResponse[]>([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para paginación - CORREGIDO: 6 por página
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    // Estados para modales
    const [facturaModalOpen, setFacturaModalOpen] = useState(false);
    const [detallesModalOpen, setDetallesModalOpen] = useState(false);
    const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<PedidoVentaResponse | null>(null);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

    // Estados para filtro de fechas
    const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
        start: null,
        end: null
    });

    // Cargar pedidos del cliente al montar el componente
    useEffect(() => {
        const loadOrders = async () => {
            if (user?.sub) {
                try {
                    console.log('Iniciando carga de pedidos para usuario:', user.sub);
                    setLoadingPedidos(true);
                    setError(null);

                    const token = await getAccessTokenSilently();
                    console.log('Token obtenido, llamando a API...');

                    const pedidosData = await obtenerPedidosPorClienteAuth0(user.sub, token);
                    console.log('Pedidos recibidos:', pedidosData);

                    setPedidos(pedidosData);
                    setPedidosFiltrados(pedidosData); // Inicialmente mostrar todos

                    if (pedidosData.length === 0) {
                        console.log('No se encontraron pedidos para este usuario');
                    } else {
                        console.log(`Se cargaron ${pedidosData.length} pedidos`);
                    }

                } catch (error) {
                    console.error('Error al cargar pedidos:', error);
                    setError(error instanceof Error ? error.message : 'Error al cargar los pedidos');
                } finally {
                    setLoadingPedidos(false);
                }
            }
        };

        loadOrders();
    }, [user, getAccessTokenSilently]);

    // Filtrar pedidos por rango de fechas
    useEffect(() => {
        if (!dateRange.start || !dateRange.end) {
            setPedidosFiltrados(pedidos);
        } else {
            const filtered = pedidos.filter(pedido => {
                const fechaPedido = new Date(pedido.horaEstimadaFinalizacion || new Date());
                return fechaPedido >= dateRange.start! && fechaPedido <= dateRange.end!;
            });
            setPedidosFiltrados(filtered);
        }
        setCurrentPage(0); // Resetear a primera página al filtrar
    }, [dateRange, pedidos]);

    // Formatear fecha
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Formatear precio
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    // Obtener color del estado
    const getEstadoColor = (estado: string): string => {
        const estadoLower = estado.toLowerCase();
        switch (estadoLower) {
            case 'pendiente':
            case 'en_preparacion':
                return '#FFC736';
            case 'preparado':
            case 'listo':
                return '#16a34a';
            case 'en_delivery':
            case 'enviado':
                return '#FF7622';
            case 'entregado':
            case 'completado':
                return '#2196F3';
            case 'cancelado':
            case 'rechazado':
                return '#F44336';
            default:
                return '#6c757d';
        }
    };

    // Manejar ver detalles
    const handleViewDetails = (pedidoId: number) => {
        const pedido = pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            setSelectedPedido(pedido);
            setDetallesModalOpen(true);
        }
    };

    // Manejar ver factura
    const handleViewInvoice = (pedidoId: number) => {
        const pedido = pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            setSelectedPedido(pedido);
            setFacturaModalOpen(true);
        }
    };

    // Manejar descarga de factura
    const handleDownloadFactura = async () => {
        if (!selectedPedido) return;

        try {
            setDownloadingInvoice(true);
            const token = await getAccessTokenSilently();
            await descargarFacturaPDF(selectedPedido.id, token, `factura-pedido-${selectedPedido.id}.pdf`);
            console.log(`Factura del pedido ${selectedPedido.id} descargada exitosamente`);
        } catch (error) {
            console.error('Error al descargar factura:', error);
            alert('Error al descargar la factura. Por favor, intente nuevamente.');
        } finally {
            setDownloadingInvoice(false);
        }
    };

    // Manejar filtro de fechas
    const handleDateRangeChange = (start: Date | null, end: Date | null) => {
        setDateRange({ start, end });
        setDateRangeModalOpen(false);
    };

    // Limpiar filtro de fechas
    const clearDateFilter = () => {
        setDateRange({ start: null, end: null });
    };

    // Convertir pedido a formato de factura
    const convertToFacturaData = (pedido: PedidoVentaResponse) => {
        return {
            id: pedido.id,
            fecha: formatDate(pedido.horaEstimadaFinalizacion || new Date().toISOString()),
            orderNumber: pedido.id.toString(),
            items: pedido.detalles?.map(detalle => {
                const articulo = detalle.articuloManufacturado;
                const precio = articulo ? (detalle.cantidad || 1) * (articulo.precioVenta || 0) : 0;

                return {
                    nombre: articulo?.denominacion || 'Producto',
                    cantidad: detalle.cantidad || 1,
                    precio: precio
                };
            }) || [],
            subtotal: pedido.totalCosto || 0,
            delivery: 0,
            descuento: (pedido.totalCosto || 0) * 0.1,
            total: pedido.total || 0
        };
    };

    // Convertir pedido a formato de detalles
    const convertToDetallesData = (pedido: PedidoVentaResponse) => {
        return {
            id: pedido.id,
            items: pedido.detalles?.map(detalle => {
                const articulo = detalle.articuloManufacturado;
                const precio = articulo ? (detalle.cantidad || 1) * (articulo.precioVenta || 0) : 0;

                return {
                    nombre: articulo?.denominacion || 'Producto',
                    cantidad: detalle.cantidad || 1,
                    precio: precio,
                    imagen: articulo?.imagenes?.[0]?.url
                };
            }) || [],
            subtotal: pedido.totalCosto || 0
        };
    };

    // Convertir pedidos a formato de tabla
    const convertPedidosToTableData = (pedidos: PedidoVentaResponse[]): OrderForTable[] => {
        return pedidos.map(pedido => {
            const estadoTexto = typeof pedido.estado === 'object' && pedido.estado?.denominacion
                ? pedido.estado.denominacion
                : (typeof pedido.estado === 'string' ? pedido.estado : 'Pendiente');

            return {
                // JSX personalizado con ícono CORREGIDO
                id: (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%'
                    }}>
                        {/* ÍCONO CUADRADO MÁS PEQUEÑO */}
                        <div
                            style={{
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff8f5',
                                borderRadius: '4px',
                                border: '1px solid #FFE5D1',
                                flexShrink: 0
                            }}
                        >
                            <img
                                src={orderIcon}
                                alt="Pedido"
                                style={{
                                    width: '12px',
                                    height: '12px'
                                }}
                            />
                        </div>
                        <span
                            style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Pedido #{pedido.id}
                        </span>
                    </div>
                ) as any,
                fecha: formatDate(pedido.horaEstimadaFinalizacion || new Date().toISOString()),
                total: formatPrice(pedido.total || 0),
                estado: (
                    <span
                        style={{
                            backgroundColor: getEstadoColor(estadoTexto),
                            color: getEstadoColor(estadoTexto) === '#FFC736' ? '#1d1d1d' : 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {estadoTexto}
                    </span>
                ),
                tipo: pedido.tipoEnvio || 'DELIVERY',
                // CORREGIDO: Botones menos separados hacia la derecha
                acciones: (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        alignItems: 'flex-start',
                        width: '100%'
                    }}>
                        <button
                            onClick={() => handleViewDetails(pedido.id)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                border: '1px solid #FF6B21',
                                backgroundColor: '#FF6B21',
                                color: 'white',
                                minWidth: '85px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Ver Detalles
                        </button>

                        <button
                            onClick={() => handleViewInvoice(pedido.id)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                color: '#6c757d',
                                minWidth: '85px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Ver Factura
                        </button>
                    </div>
                )
            };
        });
    };

    // Configuración de columnas
    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'fecha', header: 'Fecha' },
        { key: 'total', header: 'Total' },
        { key: 'estado', header: 'Estado' },
        { key: 'tipo', header: 'Tipo' },
        { key: 'acciones', header: 'Acciones' }
    ];

    // Datos paginados usando pedidosFiltrados
    const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = convertPedidosToTableData(pedidosFiltrados.slice(startIndex, endIndex));

    // Función para cambiar página
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Estados de carga, error y vacío
    if (loadingPedidos) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.sectionTitle}>Mis Pedidos</h1>
                        <p className={styles.subtitle}>Historial completo de tus pedidos</p>
                    </div>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Cargando pedidos...</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    if (error) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.sectionTitle}>Mis Pedidos</h1>
                        <p className={styles.subtitle}>Historial completo de tus pedidos</p>
                    </div>
                    <div className={styles.error}>
                        <h2>Error al cargar pedidos</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    if (pedidos.length === 0) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.sectionTitle}>Mis Pedidos</h1>
                        <p className={styles.subtitle}>Historial completo de tus pedidos</p>
                    </div>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📦</div>
                        <h3>No tienes pedidos aún</h3>
                        <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className={styles.container}>
                {/* CORREGIDO: Header con botón de calendario */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className={styles.sectionTitle}>Mis Pedidos</h1>
                            <p className={styles.subtitle}>
                                {dateRange.start && dateRange.end
                                    ? `Pedidos del ${dateRange.start.toLocaleDateString()} al ${dateRange.end.toLocaleDateString()}`
                                    : 'Historial completo de tus pedidos'
                                }
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            {(dateRange.start || dateRange.end) && (
                                <button
                                    onClick={clearDateFilter}
                                    className={styles.clearFilterButton}
                                >
                                    Limpiar filtro
                                </button>
                            )}
                            <button
                                onClick={() => setDateRangeModalOpen(true)}
                                className={styles.calendarButton}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                </svg>
                                Filtrar por fecha
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <GenericTable
                        data={currentData}
                        columns={columns}
                    />
                </div>

                {/* Paginación personalizada */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>‹</span>
                        </button>

                        <div className={styles.pageNumbers}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.pageNumber} ${index === currentPage ? styles.activePage : ''
                                        }`}
                                    onClick={() => handlePageChange(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>›</span>
                        </button>
                    </div>
                )}

                {/* Modal de Rango de Fechas */}
                <DateRangeModal
                    isOpen={dateRangeModalOpen}
                    onClose={() => setDateRangeModalOpen(false)}
                    onApply={handleDateRangeChange}
                    initialStart={dateRange.start}
                    initialEnd={dateRange.end}
                />

                {/* Modal de Factura */}
                {selectedPedido && (
                    <FacturaModal
                        isOpen={facturaModalOpen}
                        onClose={() => {
                            setFacturaModalOpen(false);
                            setSelectedPedido(null);
                        }}
                        pedido={convertToFacturaData(selectedPedido)}
                        onDownload={handleDownloadFactura}
                        isDownloading={downloadingInvoice}
                    />
                )}

                {/* Modal de Detalles */}
                {selectedPedido && (
                    <DetallesModal
                        isOpen={detallesModalOpen}
                        onClose={() => {
                            setDetallesModalOpen(false);
                            setSelectedPedido(null);
                        }}
                        pedido={convertToDetallesData(selectedPedido)}
                        onViewFactura={() => {
                            setDetallesModalOpen(false);
                            setFacturaModalOpen(true);
                        }}
                    />
                )}
            </div>
        </ProfileLayout>
    );
};

export default Orders;