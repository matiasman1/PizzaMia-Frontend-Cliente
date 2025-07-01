import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './MercadoPagoReturn.module.css';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

interface MercadoPagoDatos {
    id?: number;
    dateCreated: string;
    dateApproved: string;
    payment_type_id: string;
    payment_method_id: string;
    status: string;
    status_detail: string;
    externalReference: string;
    pedidoId?: number; // Opcional para el backend
}

const VITE_API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';

const MercadoPagoReturn: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'success' | 'pending' | 'failure' | 'loading'>('loading');
    const [message, setMessage] = useState<string>('');
    const [pedidoId, setPedidoId] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<MercadoPagoDatos | null>(null);
    const [processingPayment, setProcessingPayment] = useState(true);
    
    // Crear una referencia para rastrear si ya procesamos el pago
    const isProcessed = useRef(false);

    useEffect(() => {
        // Si ya procesamos el pago, no hacer nada
        if (isProcessed.current) {
            console.log("Evitando re-procesamiento debido a StrictMode");
            return;
        }
        
        console.log("useEffect ejecutado");

        // Obtener los parámetros de la URL
        const searchParams = new URLSearchParams(location.search);
        
        // Datos disponibles en la URL de retorno
        const paymentStatus = searchParams.get('status');
        const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
        const externalReference = searchParams.get('external_reference');
        const paymentType = searchParams.get('payment_type');
        const merchantOrderId = searchParams.get('merchant_order_id');
        const collectionId = searchParams.get('collection_id');
        const collectionStatus = searchParams.get('collection_status');
        
        // Obtener el pedidoId de localStorage o del external_reference
        const lastPedidoId = externalReference || localStorage.getItem('lastPedidoId');
        setPedidoId(lastPedidoId);

        console.log("Mercado Pago Response Parameters:", {
            status: paymentStatus,
            payment_id: paymentId,
            external_reference: externalReference,
            payment_type: paymentType,
            merchant_order_id: merchantOrderId,
            collection_id: collectionId,
            collection_status: collectionStatus
        });

        // Procesar y enviar los datos al backend
        const processMercadoPagoData = async () => {
            if (lastPedidoId) {
                try {
                    // Marcar como procesado inmediatamente para evitar duplicación en StrictMode
                    isProcessed.current = true;
                    
                    // Obtener fecha y hora actual en formato ISO para los campos de fecha
                    const now = new Date().toISOString();
                    
                    // Crear objeto con los datos disponibles, asegurando que todos los campos requeridos estén presentes
                    const mercadoPagoData: MercadoPagoDatos = {
                        dateCreated: now,
                        dateApproved: paymentStatus === 'approved' ? now : now, // Si no está aprobado, usamos la misma fecha
                        payment_type_id: paymentType || 'unknown',
                        payment_method_id: paymentId || 'unknown',
                        status: paymentStatus || 'unknown',
                        status_detail: collectionStatus || paymentStatus || 'unknown',
                        externalReference: externalReference || lastPedidoId,
                        pedidoId: parseInt(lastPedidoId, 10)
                    };
                    
                    setPaymentData(mercadoPagoData);
                    
                    // Enviar los datos al backend
                    console.log("Enviando datos a la API:", mercadoPagoData);
                    
                    const response = await axios.post(
                        `${VITE_API_SERVER_URL}/api/mercadopago/datos`,
                        mercadoPagoData
                    );
                    
                    console.log("Respuesta del servidor:", response.data);
                    
                    // Actualizar el estado del pedido si es necesario
                    if (paymentStatus === 'approved') {
                        try {
                            await axios.put(
                                `${VITE_API_SERVER_URL}/api/pedidos/${lastPedidoId}/actualizarEstadoPago`,
                                { nuevoEstado: 'PAGADO' }
                            );
                            console.log("Estado del pedido actualizado a PAGADO");
                        } catch (updateError) {
                            console.error("Error al actualizar el estado del pedido:", updateError);
                        }
                    }
                    
                } catch (error) {
                    console.error("Error al procesar datos de MercadoPago:", error);
                } finally {
                    setProcessingPayment(false);
                }
            } else {
                console.error("No se encontró ID de pedido");
                setProcessingPayment(false);
            }
        };

        // Determinar el estado del pago para la UI
        if (paymentStatus === 'approved') {
            setStatus('success');
            setMessage('¡Tu pago ha sido aprobado! Tu pedido está siendo procesado.');
        } else if (paymentStatus === 'pending' || paymentStatus === 'in_process') {
            setStatus('pending');
            setMessage('Tu pago está pendiente de confirmación. Te notificaremos cuando se complete.');
        } else {
            setStatus('failure');
            setMessage('Hubo un problema con tu pago. Por favor, intenta de nuevo o contacta con soporte.');
        }
        
        // Procesar los datos
        processMercadoPagoData();
        
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

    if (status === 'loading' || processingPayment) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Procesando resultado del pago...</p>
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
                {paymentData && (
                    <div className={styles.paymentDetails}>
                        <p>Método de pago: <strong>{paymentData.payment_type_id}</strong></p>
                        <p>Estado: <strong>{paymentData.status}</strong></p>
                        {paymentData.dateApproved && (
                            <p>Fecha de aprobación: <strong>
                                {new Date(paymentData.dateApproved).toLocaleString()}
                            </strong></p>
                        )}
                    </div>
                )}
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={handleGoToMenu}>
                        Volver al Menú
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default MercadoPagoReturn;