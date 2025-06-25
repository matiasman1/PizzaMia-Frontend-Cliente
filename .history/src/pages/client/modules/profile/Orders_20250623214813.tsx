import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useClienteStore } from '../../../../store/clienteStore';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './Orders.module.css';
import GenericTable from '../../../../components/GenericTable/GenericTable';
import { PedidoVentaResponse } from '../../../../types/typesClient';

// NUEVA - Interfaz adaptada para trabajar con datos reales
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
    const {
        pedidos,
        loadingPedidos,
        error,
        cargarPedidosCliente
    } = useClienteStore();

    // Estados existentes para paginación
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);

    // NUEVO - Cargar pedidos del cliente al montar el componente
    useEffect(() => {
        const loadOrders = async () => {
            if (user?.sub) {
                try {
                    const token = await getAccessTokenSilently();
                    await cargarPedidosCliente(user.sub, token);
                } catch (error) {
                    console.error('Error al cargar pedidos:', error);
                }
            }
        };

        loadOrders();
    }, [user, cargarPedidosCliente, getAccessTokenSilently]);

    // NUEVA - Función para formatear fecha
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

    // NUEVA - Función para formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    // NUEVA - Función para obtener el color del estado
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

    // MODIFICADA - Función para ver detalles (preparada para futura implementación)
    const handleViewDetails = (pedidoId: number) => {
        console.log('Ver detalles del pedido:', pedidoId);
        alert(`Funcionalidad "Ver detalles" será implementada próximamente para el pedido #${pedidoId}`);
    };

    // NUEVA - Convertir pedidos reales a formato de tabla
    const convertPedidosToTableData = (pedidos: PedidoVentaResponse[]): OrderForTable[] => {
        return pedidos.map(pedido => ({
            id: pedido.id,
            fecha: formatDate(pedido.horaEstimadaFinalizacion),
            total: formatPrice(pedido.total),
            estado: pedido.estado.denominacion,
            tipo: pedido.tipoEnvio,
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

    // MODIFICADA - Configuración de columnas adaptada a datos reales
    const columns = [
        { key: 'id' as keyof OrderForTable, header: 'N° Pedido' },
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
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    {estado.toUpperCase()}
                </span>
            )
        },
        { key: 'tipo' as keyof OrderForTable, header: 'Tipo' },
        { key: 'acciones' as keyof OrderForTable, header: 'Acciones' }
    ];

    // NUEVA - Convertir pedidos a datos de tabla
    const tableData = convertPedidosToTableData(pedidos);

    // Lógica de paginación existente
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = tableData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // NUEVO - Mostrar loading
    if (loadingPedidos) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <p>Cargando tus pedidos...</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    // NUEVO - Mostrar error
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

                {/* MODIFICADA - Mostrar estado vacío si no hay pedidos */}
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

                        {/* Paginación existente */}
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
                                            className={`${styles.pageNumber} ${
                                                currentPage === index ? styles.activePage : ''
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