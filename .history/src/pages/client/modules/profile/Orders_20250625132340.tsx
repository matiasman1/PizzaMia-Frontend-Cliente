import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { obtenerPedidosPorClienteAuth0, descargarFacturaPDF } from '../../../../api/clientApi';
import { PedidoVentaResponse } from '../../../../types/typesClient';
import GenericTable from '../../../../components/GenericTable/GenericTable';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import FacturaModal from '../../../../components/Modal/FacturaModal';
import DetallesModal from '../../../../components/Modal/DetallesModal';
import styles from './Orders.module.css';

// Tipos para la tabla
interface OrderForTable {
    id: React.ReactNode; // Cambiar de number a React.ReactNode para JSX personalizado
    fecha: string;
    total: string;
    estado: React.ReactNode; // Estado como ReactNode para el span con estilos
    tipo: string;
    acciones: React.ReactNode;
}

const Orders: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [pedidos, setPedidos] = useState<PedidoVentaResponse[]>([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    // Estados para modales
    const [facturaModalOpen, setFacturaModalOpen] = useState(false);
    const [detallesModalOpen, setDetallesModalOpen] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<PedidoVentaResponse | null>(null);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

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

    // Convertir pedido a formato de factura con propiedades que SÍ existen
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

    // Convertir pedido a formato de detalles con propiedades que SÍ existen
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

    // Convertir pedidos con disposición vertical de botones y estado renderizado
    const convertPedidosToTableData = (pedidos: PedidoVentaResponse[]): OrderForTable[] => {
    return pedidos.map(pedido => {
        const estadoTexto = typeof pedido.estado === 'object' && pedido.estado?.denominacion
            ? pedido.estado.denominacion
            : (typeof pedido.estado === 'string' ? pedido.estado : 'Pendiente');

        return {
            // JSX personalizado para el ID con formato correcto "Pedido #17" y SVG corregido
            id: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div 
                        style={{
                            // CORREGIDO: Contenedor más cuadrado y proporcional
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff8f5',
                            borderRadius: '12px',
                            border: '2px solid #FFE5D1',
                            // CORREGIDO: Usar el SVG que proporcionaste
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FF6B21' viewBox='0 0 24 24'%3E%3Cpath d='M7 4V2a1 1 0 0 1 2 0v2h6V2a1 1 0 0 1 2 0v2h2a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h2zM5 6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5zm7 4a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zm-3 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z'/%3E%3C/svg%3E")`,
                            backgroundSize: '24px 24px',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            boxShadow: '0 2px 8px rgba(255, 107, 33, 0.15)'
                        }}
                    >
                        {/* Fallback si el SVG no carga */}
                        <span style={{ 
                            fontSize: '20px', 
                            display: 'none' // Solo se muestra si backgroundImage falla
                        }}>📦</span>
                    </div>
                    <span 
                        className="pedido-text"
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#2c3e50',
                            fontFamily: 'var(--client-font-family)',
                            lineHeight: '1.3'
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
            acciones: (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px', 
                    alignItems: 'flex-end',
                    width: '100%'
                }}>
                    <button
                        onClick={() => handleViewDetails(pedido.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            border: '1px solid #FF6B21',
                            backgroundColor: '#FF6B21',
                            color: 'white',
                            minWidth: '90px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Ver Detalles
                    </button>
                    
                    <button
                        onClick={() => handleViewInvoice(pedido.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            color: '#6c757d',
                            minWidth: '90px',
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

    // Configuración correcta de columnas para los estilos
    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'fecha', header: 'Fecha' },
        { key: 'total', header: 'Total' },
        { key: 'estado', header: 'Estado' },
        { key: 'tipo', header: 'Tipo' },
        { key: 'acciones', header: 'Acciones' }
    ];

    // Datos paginados
    const totalPages = Math.ceil(pedidos.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = convertPedidosToTableData(pedidos.slice(startIndex, endIndex));

    // Función para cambiar página
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Renderizado condicional de estados
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
                <div className={styles.header}>
                    <h1 className={styles.sectionTitle}>Mis Pedidos</h1>
                    <p className={styles.subtitle}>Historial completo de tus pedidos</p>
                </div>

                {/* Mantener clase tableContainer para aplicar estilos CSS */}
                <div className={styles.tableContainer}>
                    {/* Solo usar props que SÍ existen en GenericTable */}
                    <GenericTable
                        data={currentData}
                        columns={columns}
                    />
                </div>

                {/* Paginación manual personalizada para restaurar el estilo */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {/* Botón Anterior */}
                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>‹</span>
                        </button>

                        {/* Números de página */}
                        <div className={styles.pageNumbers}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.pageNumber} ${
                                        index === currentPage ? styles.activePage : ''
                                    }`}
                                    onClick={() => handlePageChange(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {/* Botón Siguiente */}
                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>›</span>
                        </button>
                    </div>
                )}

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