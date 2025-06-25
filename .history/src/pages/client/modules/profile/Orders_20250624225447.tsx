import React, { useState, useEffect, ReactElement } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { cargarPedidosCliente } from '../../../../store/pedidosSlice';
import { RootState } from '../../../../store/store';
import { PedidoVentaResponse } from '../../../../types/dtos/pedidos/PedidoVentaResponse';
import { DataTable } from '../../../ui/components/common/DataTable/DataTable';
import { Column } from '../../../ui/components/common/DataTable/DataTable';

import { useClienteStore } from '../../../../store/clienteStore';
import { obtenerPedidosPorClienteAuth0 } from '../../../../api/clientApi';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './Orders.module.css';
import GenericTable from '../../../../components/GenericTable/GenericTable';
import { PedidoVentaResponse } from '../../../../types/typesClient';

interface OrderForTable {
    id: number;
    fecha: string;
    total: string;
    estado: string;
    tipo: string;
    acciones: ReactElement;
}

const Orders: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth();
    const dispatch = useAppDispatch();
    const { pedidos, loadingPedidos, error } = useAppSelector((state: RootState) => state.pedidos);
    
    // Estados locales
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [downloadingFactura, setDownloadingFactura] = useState<number | null>(null);

    // Cargar pedidos del cliente al montar el componente
    useEffect(() => {
        const loadOrders = async () => {
            if (user?.sub) {
                try {
                    console.log('Iniciando carga de pedidos para usuario:', user.sub);
                    const token = await getAccessTokenSilently();
                    console.log('Token obtenido, llamando a API...');
                    await dispatch(cargarPedidosCliente({ clienteAuth0Id: user.sub, token }));
                } catch (error) {
                    console.error('Error al cargar pedidos:', error);
                }
            }
        };

        loadOrders();
    }, [user, dispatch, getAccessTokenSilently]);

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    // Función para obtener el color del estado
    const getStatusColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'preparacion':
                return '#FF7622';
            case 'pendiente':
                return '#FFC736';
            case 'listo':
                return '#4CAF50';
            case 'entregado':
                return '#2196F3';
            case 'cancelado':
                return '#F44336';
            default:
                return '#757575';
        }
    };

    // Función para ver detalles del pedido
    const handleViewDetails = (pedidoId: number) => {
        console.log('Ver detalles del pedido:', pedidoId);
        alert(`Funcionalidad "Ver detalles" será implementada próximamente para el pedido #${pedidoId}`);
    };

    // NUEVA - Función para descargar factura
    const handleDownloadFactura = async (pedidoId: number) => {
        if (!user) {
            alert('Error: No se encontró información de usuario');
            return;
        }

        try {
            setDownloadingFactura(pedidoId);
            console.log('Descargando factura del pedido:', pedidoId);
            
            const token = await getAccessTokenSilently();
            await descargarFacturaPDF(pedidoId, token, `factura-pedido-${pedidoId}.pdf`);
            
            // Mensaje de éxito opcional
            alert(`Factura del pedido #${pedidoId} descargada correctamente`);
            
        } catch (error) {
            console.error('Error al descargar factura:', error);
            alert(`Error al descargar la factura del pedido #${pedidoId}. Por favor, intenta de nuevo.`);
        } finally {
            setDownloadingFactura(null);
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
                    <button
                        className={styles.detailsButton}
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
                        onClick={() => handleDownloadFactura(pedido.id)}
                        disabled={downloadingFactura === pedido.id}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: downloadingFactura === pedido.id ? 'not-allowed' : 'pointer',
                            border: '1px solid #d1d5db',
                            backgroundColor: downloadingFactura === pedido.id ? '#f3f4f6' : 'white',
                            color: downloadingFactura === pedido.id ? '#9ca3af' : '#6c757d',
                            minWidth: '90px',
                            whiteSpace: 'nowrap',
                            opacity: downloadingFactura === pedido.id ? 0.7 : 1
                        }}
                    >
                        {downloadingFactura === pedido.id ? 'Descargando...' : 'Ver Factura'}
                    </button>
                </div>
            )
        }));
    };

    // Configuración de columnas
    const columns: Column<OrderForTable>[] = [
        {
            key: 'id' as keyof OrderForTable,
            header: 'N° Pedido',
            render: (value: number) => `#${value}`
        },
        { key: 'fecha' as keyof OrderForTable, header: 'Fecha y Hora' },
        { key: 'total' as keyof OrderForTable, header: 'Total' },
        {
            key: 'estado' as keyof OrderForTable,
            header: 'Estado',
            render: (estado: string) => (
                <span
                    className={styles.statusBadge}
                    style={{
                        backgroundColor: getStatusColor(estado),
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {estado}
                </span>
            )
        },
        {
            key: 'tipo' as keyof OrderForTable,
            header: 'Tipo',
            render: (tipo: string) => (
                <span className={styles.tipoEntrega}>
                    {tipo === 'DELIVERY' ? 'Delivery' : 'Takeaway'}
                </span>
            )
        },
        { key: 'acciones' as keyof OrderForTable, header: 'Acciones' }
    ];

    // Convertir pedidos a datos de tabla
    const tableData = convertPedidosToTableData(pedidos);
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = tableData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(0); // Reset to first page
    };

    // Mostrar loading
    if (loadingPedidos) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Cargando tus pedidos...</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>¡Oops! Algo salió mal</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    // Mostrar estado vacío
    if (pedidos.length === 0) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.sectionTitle}>Mis Pedidos</h1>
                        <p className={styles.subtitle}>Historial completo de tus pedidos</p>
                    </div>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🍕</div>
                        <h3>No tienes pedidos aún</h3>
                        <p>¡Haz tu primer pedido y aparecerá aquí!</p>
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
                    <DataTable
                        data={currentData}
                        columns={columns}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={tableData.length}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        loading={loadingPedidos}
                        showPagination={true}
                    />
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Orders;