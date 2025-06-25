import React, { useState, useEffect, ReactElement } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
    const { user, getAccessTokenSilently } = useAuth0();
    const {
        pedidos,
        loadingPedidos,
        error,
        setPedidos,
        setLoadingPedidos,
        setError
    } = useClienteStore();

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);

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
                setError(error instanceof Error ? error.message : 'Error al cargar pedidos');
            } finally {
                setLoadingPedidos(false);
            }
        }
    };

    loadOrders();
}, [user, setPedidos, setLoadingPedidos, setError, getAccessTokenSilently]);

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

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

    const handleViewDetails = (pedidoId: number) => {
        console.log('Ver detalles del pedido:', pedidoId);
        alert(`Funcionalidad "Ver detalles" será implementada próximamente para el pedido #${pedidoId}`);
    };

    const convertPedidosToTableData = (pedidos: PedidoVentaResponse[]): OrderForTable[] => {
        return pedidos.map(pedido => ({
            id: pedido.id,
            fecha: formatDate(pedido.horaEstimadaFinalizacion || new Date().toISOString()),
            total: formatPrice(pedido.total || 0),
            // CORREGIDO - Manejar diferentes estructuras de estado
            estado: typeof pedido.estado === 'object' && pedido.estado?.denominacion
                ? pedido.estado.denominacion
                : (typeof pedido.estado === 'string' ? pedido.estado : 'Pendiente'),
            tipo: pedido.tipoEnvio || 'DELIVERY',
            acciones: (
                <button
                    className={styles.detailsButton}
                    onClick={() => handleViewDetails(pedido.id)}
                >
                    Ver Detalles
                </button>
            )
        }));
    };

    const columns = [
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

    const tableData = convertPedidosToTableData(pedidos);
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = tableData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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

    if (error) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Error al cargar los pedidos</h2>
                        <p>{error}</p>
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

                {pedidos.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📦</div>
                        <h3>No tienes pedidos aún</h3>
                        <p>Cuando realices tu primer pedido, aparecerá aquí</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.tableContainer}>
                            <GenericTable
                                data={currentData}
                                columns={columns}
                            />
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    className={styles.paginationButton}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    ‹ Anterior
                                </button>

                                <div className={styles.pageNumbers}>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.pageNumber} ${currentPage === index ? styles.activePage : ''
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
                                    Siguiente ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ProfileLayout>
    );
};

export default Orders;