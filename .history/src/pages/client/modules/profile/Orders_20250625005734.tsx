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
    id: number;
    fecha: string;
    total: string;
    estado: string;
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

    // CORREGIDO: Convertir pedido a formato de factura con propiedades correctas
    const convertToFacturaData = (pedido: PedidoVentaResponse) => {
        return {
            id: pedido.id,
            fecha: formatDate(pedido.horaEstimadaFinalizacion || new Date().toISOString()),
            orderNumber: pedido.id.toString(),
            items: pedido.detalles?.map(detalle => ({
                // CORREGIDO: Usar articuloManufacturado en lugar de articulo
                nombre: (detalle.articuloManufacturado as any)?.denominacion || 'Producto',
                cantidad: detalle.cantidad || 1,
                // CORREGIDO: Usar subTotalDetalle en lugar de subTotal
                precio: detalle.subTotalDetalle || 0
            })) || [],
            subtotal: pedido.totalCosto || 0,
            delivery: 0,
            descuento: (pedido.totalCosto || 0) * 0.1,
            total: pedido.total || 0
        };
    };

    // CORREGIDO: Convertir pedido a formato de detalles con propiedades correctas
    const convertToDetallesData = (pedido: PedidoVentaResponse) => {
        return {
            id: pedido.id,
            items: pedido.detalles?.map(detalle => ({
                // CORREGIDO: Usar articuloManufacturado en lugar de articulo
                nombre: (detalle.articuloManufacturado as any)?.denominacion || 'Producto',
                cantidad: detalle.cantidad || 1,
                // CORREGIDO: Usar subTotal en lugar de subTotalDetalle
                precio: detalle.subTotal || 0,
                // CORREGIDO: Usar articuloManufacturado en lugar de articulo
                imagen: (detalle.articuloManufacturado as any)?.imagenes?.[0]?.url
            })) || [],
            subtotal: pedido.totalCosto || 0
        };
    };

    // CRÍTICO: Convertir pedidos con disposición vertical de botones
    const convertPedidosToTableData = (pedidos: PedidoVentaResponse[]): OrderForTable[] => {
        return pedidos.map(pedido => {
            const estadoText = typeof pedido.estado === 'object' && pedido.estado?.denominacion
                ? pedido.estado.denominacion
                : (typeof pedido.estado === 'string' ? pedido.estado : 'Pendiente');
            
            return {
                id: pedido.id,
                fecha: formatDate(pedido.horaEstimadaFinalizacion || new Date().toISOString()),
                total: formatPrice(pedido.total || 0),
                estado: (
                    <span
                        style={{
                            backgroundColor: getEstadoColor(estadoText),
                            color: getEstadoColor(estadoText) === '#FFC736' ? '#1d1d1d' : 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {estadoText}
                    </span>
                ),
                tipo: pedido.tipoEnvio || 'DELIVERY',
                // CRÍTICO: Mantener disposición vertical de botones
                acciones: (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px', 
                        alignItems: 'flex-end',
                        width: '100%'
                    }}>
                        {/* Botón "Ver Detalles" - Primario arriba */}
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
                        
                        {/* Botón "Ver Factura" - Secundario debajo */}
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

    // CRÍTICO: Configuración correcta de columnas para los estilos
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

    // CORREGIDO: Función para cambiar página
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
                {/* CRÍTICO: Mantener clase tableContainer para aplicar estilos CSS */}
                <div className={styles.tableContainer}>
                    {/* CORREGIDO: Quitar props que no existen en GenericTable */}
                    <GenericTable
                        data={currentData}
                        columns={columns}
                    />
                </div>
                                        style={{
                                            backgroundColor: getEstadoColor(item.estado),
                                            color: getEstadoColor(item.estado) === '#FFC736' ? '#1d1d1d' : 'white',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {item.estado}
                                    </span>
                                );
                            }
                            return item[key as keyof OrderForTable];
                        }}
                    />
                </div>

                {/* CORREGIDO: Paginación manual personalizada para restaurar el estilo */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {/* Botón Anterior */}
                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            ←
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
                            →
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