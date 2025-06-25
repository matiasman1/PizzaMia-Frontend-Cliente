import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { obtenerPedidosPorClienteAuth0, descargarFacturaPDF } from '../../../../api/clientApi';
import { PedidoVentaResponse } from '../../../../types/typesClient';
import GenericTable from '../../../../components/GenericTable/GenericTable';
import ProfileLayout from 'src/components/client/ProfileLayout';
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

    // Estados para manejar las descargas
    const [downloadingInvoice, setDownloadingInvoice] = useState<number | null>(null);

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
        console.log('Ver detalles del pedido:', pedidoId);
        // Aquí puedes implementar la navegación o modal para ver detalles
        alert(`Funcionalidad "Ver Detalles" será implementada próximamente para el pedido #${pedidoId}`);
    };

    // Manejar descarga de factura
    const handleViewInvoice = async (pedidoId: number) => {
        try {
            setDownloadingInvoice(pedidoId);
            const token = await getAccessTokenSilently();
            await descargarFacturaPDF(pedidoId, token, `factura-pedido-${pedidoId}.pdf`);
            console.log(`Factura del pedido ${pedidoId} descargada exitosamente`);
        } catch (error) {
            console.error('Error al descargar factura:', error);
            alert('Error al descargar la factura. Por favor, intente nuevamente.');
        } finally {
            setDownloadingInvoice(null);
        }
    };

    // Convertir pedidos reales a formato de tabla
    const convertPedidosToTableData = (pedidos: PedidoVentaResponse[]): OrderForTable[] => {
        return pedidos.map(pedido => ({
            id: pedido.id,
            fecha: formatDate(pedido.horaEstimadaFinalizacion || new Date().toISOString()),
            total: formatPrice(pedido.total || 0),
            // Manejar diferentes estructuras de estado
            estado: typeof pedido.estado === 'object' && pedido.estado?.denominacion
                ? pedido.estado.denominacion
                : (typeof pedido.estado === 'string' ? pedido.estado : 'Pendiente'),
            tipo: pedido.tipoEnvio || 'DELIVERY',
            acciones: (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    {/* Botón "Ver Detalles" - Primario */}
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
                    
                    {/* Botón "Ver Factura" - Secundario */}
                    <button
                        onClick={() => handleViewInvoice(pedido.id)}
                        disabled={downloadingInvoice === pedido.id}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: downloadingInvoice === pedido.id ? 'not-allowed' : 'pointer',
                            border: '1px solid #d1d5db',
                            backgroundColor: downloadingInvoice === pedido.id ? '#f3f4f6' : 'white',
                            color: downloadingInvoice === pedido.id ? '#9ca3af' : '#6c757d',
                            minWidth: '90px',
                            whiteSpace: 'nowrap',
                            opacity: downloadingInvoice === pedido.id ? 0.6 : 1
                        }}
                    >
                        {downloadingInvoice === pedido.id ? 'Descargando...' : 'Ver Factura'}
                    </button>
                </div>
            )
        }));
    };

    // Configuración de columnas para la tabla
    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'total', label: 'Total' },
        { key: 'estado', label: 'Estado' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'acciones', label: 'Acciones' }
    ];

    // Datos paginados
    const totalPages = Math.ceil(pedidos.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = convertPedidosToTableData(pedidos.slice(startIndex, endIndex));

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

                <div className={styles.tableContainer}>
                    <GenericTable
                        data={currentData}
                        columns={columns}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        renderCell={(item: OrderForTable, key: string) => {
                            if (key === 'estado') {
                                return (
                                    <span
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
            </div>
        </ProfileLayout>
    );
};

export default Orders;