import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './MercadoPagoReturn.module.css';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { MercadoPagoStatus } from '../../types/mercadopagoTypes';

const MercadoPagoReturn: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'success' | 'pending' | 'failure' | 'loading'>('loading');
    const [message, setMessage] = useState<string>('');
    const [pedidoId, setPedidoId] = useState<string | null>(null);

    useEffect(() => {
        // Obtener los parámetros de la URL
        const searchParams = new URLSearchParams(location.search);
        const paymentStatus = searchParams.get('status');
        const paymentId = searchParams.get('payment_id');
        const externalReference = searchParams.get('external_reference');

        // Obtener el pedidoId de localStorage
        const lastPedidoId = localStorage.getItem('lastPedidoId');
        setPedidoId(lastPedidoId);

        console.log("Mercado Pago status:", paymentStatus);
        console.log("Payment ID:", paymentId);
        console.log("External Reference:", externalReference);
        console.log("Pedido ID:", lastPedidoId);

        // Determinar el estado del pago
        if (paymentStatus === MercadoPagoStatus.APPROVED) {
            setStatus('success');
            setMessage('¡Tu pago ha sido aprobado! Tu pedido está siendo procesado.');
        } else if (paymentStatus === MercadoPagoStatus.PENDING || paymentStatus === MercadoPagoStatus.IN_PROCESS) {
            setStatus('pending');
            setMessage('Tu pago está pendiente de confirmación. Te notificaremos cuando se complete.');
        } else {
            setStatus('failure');
            setMessage('Hubo un problema con tu pago. Por favor, intenta de nuevo o contacta con soporte.');
        }
    }, [location]);

    const handleGoToMenu = () => {
        navigate('/menu');
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <FaCheckCircle className={styles.successIcon} />;
            case 'pending':
                return <FaExclamationCircle className={styles.pendingIcon} />;
            case 'failure':
                return <FaTimesCircle className={styles.failureIcon} />;
            default:
                return null;
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Cargando resultado del pago...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.statusIcon}>
                    {getStatusIcon()}
                </div>
                <h1 className={styles.title}>
                    {status === 'success' && 'Pago Exitoso'}
                    {status === 'pending' && 'Pago Pendiente'}
                    {status === 'failure' && 'Pago Fallido'}
                </h1>
                <p className={styles.message}>{message}</p>
                {pedidoId && (
                    <p className={styles.orderNumber}>
                        Número de pedido: <strong>{pedidoId}</strong>
                    </p>
                )}
                <button className={styles.button} onClick={handleGoToMenu}>
                    Volver al Menú
                </button>
            </div>
        </div>
    );
};

export default MercadoPagoReturn;