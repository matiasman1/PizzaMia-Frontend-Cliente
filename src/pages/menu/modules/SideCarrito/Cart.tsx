import React, { useState } from 'react';
import styles from './Cart.module.css';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import cashIcon from '../../../../assets/client/paymentmode-cash.svg';
import mpIcon from '../../../../assets/client/paymentmode-MP.svg';
import { useCartStore } from '../../../../store/cartStore';
import { crearPedido, crearPreferenciaMercadoPago } from '../../../../api/clientApi';
import { PedidoVentaDetalle, PedidoVentaRequest, TipoEnvio, TipoPago } from '../../../../types/typesClient';

// Tipo para el modo de entrega
type DeliveryMode = 'tienda' | 'delivery';

const Cart: React.FC = () => {
    // Estado para el método de pago y modo de entrega
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'mercadopago'>('efectivo');
    const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Usar la store del carrito
    const { 
        items: cartItems, 
        subtotal, 
        deliveryFee,
        total,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        updateDeliveryFee,
        calculateTotals
    } = useCartStore();

    // Dirección de entrega
    const deliveryAddress = "Calle Boulogne Sur Mer 1320, San Martín, Mendoza";

    // Actualizar el costo de entrega cuando cambia el modo de entrega
    React.useEffect(() => {
        // Si el modo es "tienda", el costo de entrega es 0
        // Si es "delivery", establecemos el costo de entrega normal (1500)
        updateDeliveryFee(deliveryMode === 'tienda' ? 0 : 1500);
        
        // Recalcular totales
        calculateTotals();
    }, [deliveryMode, updateDeliveryFee, calculateTotals]);

    // Función para cambiar el modo de entrega
    const handleDeliveryModeChange = (mode: DeliveryMode) => {
        setDeliveryMode(mode);
    };

    // Función mejorada para calcular hora estimada de finalización con ajuste de zona horaria
    const calcularHoraEstimadaFinalizacion = (): string => {
        // Tiempo base (para procesamiento del pedido)
        let tiempoTotal = 0; // 10 minutos base
        
        // Si hay delivery, agregar tiempo adicional
        if (deliveryMode === 'delivery') {
            tiempoTotal += 20; // 20 minutos adicionales para entrega
        }
        
        // Calcular tiempo máximo de preparación de los artículos manufacturados
        let tiempoMaximoManufacturado = 0;
        
        // Encontrar el artículo manufacturado que toma más tiempo
        cartItems.forEach(item => {
            if (item.esManufacturado && item.tiempoEstimadoProduccion) {
                tiempoMaximoManufacturado = Math.max(tiempoMaximoManufacturado, item.tiempoEstimadoProduccion);
            }
        });
        
        // Sumar el tiempo máximo de preparación
        tiempoTotal += tiempoMaximoManufacturado;
        
        // Factores adicionales: considerar la cantidad de productos
        const cantidadTotal = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // Agregar tiempo adicional si hay muchos productos
        if (cantidadTotal > 3) {
            // 5 minutos adicionales por cada 3 unidades extra
            tiempoTotal += Math.floor((cantidadTotal - 3) / 3) * 5;
        }
        
        // Crear fecha estimada
        const now = new Date();
        now.setMinutes(now.getMinutes() + tiempoTotal);
        
        // Formatear manualmente para evitar la conversión a UTC
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Formato para backend (compatible con LocalDateTime)
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    // Función para realizar el pedido
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            // Mapear items del carrito a detalles del pedido
            const detalles: PedidoVentaDetalle[] = cartItems.map(item => {
                const detalle: PedidoVentaDetalle = {
                    cantidad: item.quantity
                };
                
                if (item.esManufacturado) {
                    detalle.articuloManufacturado = {
                        id: item.id
                    };
                } else {
                    detalle.articuloInsumo = {
                        id: item.id
                    };
                }
                
                return detalle;
            });
            
            // Calcular hora estimada de finalización basada en los productos y modo de entrega
            const horaEstimada = calcularHoraEstimadaFinalizacion();
            
            // Mapear tipo de envío y pago a los valores esperados por la API
            const tipoEnvio: TipoEnvio = deliveryMode === 'delivery' ? TipoEnvio.DELIVERY : TipoEnvio.LOCAL;
            const tipoPago: TipoPago = paymentMethod === 'efectivo' ? TipoPago.EFECTIVO : TipoPago.MERCADOPAGO;
            
            // Crear objeto de pedido
            const pedidoRequest: PedidoVentaRequest = {
                horaEstimadaFinalizacion: horaEstimada,
                estado: {
                    id: 1 // Estado inicial (Pendiente)
                },
                tipoEnvio,
                tipoPago,
                detalles,
                cliente: {
                    id: 1 // ID de cliente fijo por ahora (se debería obtener del usuario actual)
                },
                empleado: {
                    id: 2 // ID de empleado fijo por ahora
                }
            };
            
            console.log("Enviando pedido:", JSON.stringify(pedidoRequest, null, 2));
            
            // Enviar pedido a la API
            const pedidoResponse = await crearPedido(pedidoRequest);
            
            // Si el método de pago es Mercado Pago, redirigir al checkout
            if (tipoPago === TipoPago.MERCADOPAGO) {
                try {
                    // Obtener URL de checkout de Mercado Pago
                    const checkoutUrl = await crearPreferenciaMercadoPago(pedidoResponse.id);
                    
                    // Limpiar carrito antes de redirigir
                    clearCart();
                    
                    // Guardar ID del pedido en localStorage para referencia futura
                    localStorage.setItem('lastPedidoId', pedidoResponse.id.toString());
                    
                    // Redirigir a la página de checkout de Mercado Pago
                    window.location.href = checkoutUrl;
                    
                    // No mostramos mensaje de éxito ya que estamos redirigiendo
                    return;
                } catch (mpError) {
                    console.error("Error al procesar pago con Mercado Pago:", mpError);
                    setError("Error al procesar el pago con Mercado Pago. Por favor, intenta de nuevo.");
                    // No limpiamos el carrito en caso de error para que pueda intentar de nuevo
                    return;
                }
            }
            
            // Si llegamos aquí, es porque el pago es en efectivo
            // Mostrar mensaje de éxito y limpiar carrito
            setSuccess(`¡Pedido realizado con éxito! Número de pedido: ${pedidoResponse.id}`);
            clearCart();
            
        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            setError(error instanceof Error ? error.message : "Error al procesar tu pedido. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Tu Carrito</h2>
            </div>

            {success && (
                <div className={styles.successMessage}>
                    {success}
                </div>
            )}

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            <div className={styles.cartContent}>
                {/* Columna izquierda - Items del carrito */}
                <div className={styles.cartItems}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>Tu carrito está vacío</p>
                            <p>Agrega productos para realizar un pedido</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.cartItemImage}>
                                    {item.imagen ? (
                                        <img src={item.imagen} alt={item.denominacion} />
                                    ) : (
                                        <div className={styles.placeholderImage}>
                                            {item.esManufacturado ? "🍕" : "🥤"}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cartItemInfo}>
                                    <div className={styles.cartItemHeader}>
                                        <div>
                                            <h3 className={styles.itemName}>{item.denominacion}</h3>
                                            {item.tiempoEstimadoProduccion && (
                                                <span className={styles.itemSize}>
                                                    {item.tiempoEstimadoProduccion} min
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => removeItem(item.id)}
                                            aria-label="Eliminar producto"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className={styles.cartItemFooter}>
                                        <div className={styles.priceTag}>${item.precioVenta}</div>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.quantityButton}
                                                onClick={() => decreaseQuantity(item.id)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Disminuir cantidad"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                            <button
                                                className={styles.quantityButton}
                                                onClick={() => increaseQuantity(item.id)}
                                                aria-label="Aumentar cantidad"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Columna derecha - Resumen y opciones */}
                <div className={styles.orderSummary}>
                    <div className={styles.paymentOptions}>
                        <div className={styles.paymentTabs}>
                            <button 
                                className={`${styles.tabButton} ${deliveryMode === 'tienda' ? styles.activeTab : ''}`}
                                onClick={() => handleDeliveryModeChange('tienda')}
                            >
                                Tienda
                            </button>
                            <button 
                                className={`${styles.tabButton} ${deliveryMode === 'delivery' ? styles.activeTab : ''}`}
                                onClick={() => handleDeliveryModeChange('delivery')}
                            >
                                Delivery
                            </button>
                        </div>

                        <div className={styles.paymentMethods}>
                            <div
                                className={`${styles.paymentMethod} ${paymentMethod === 'efectivo' ? styles.selectedPayment : ''}`}
                                onClick={() => setPaymentMethod('efectivo')}
                            >
                                <img src={cashIcon} alt="Efectivo" />
                                <span>Efectivo</span>
                            </div>
                            <div
                                className={`${styles.paymentMethod} ${paymentMethod === 'mercadopago' ? styles.selectedPayment : ''}`}
                                onClick={() => setPaymentMethod('mercadopago')}
                            >
                                <img src={mpIcon} alt="Mercado Pago" />
                                <span>Mercado Pago</span>
                            </div>
                        </div>
                    </div>

                    {/* Mostrar dirección solo si el modo es delivery */}
                    {deliveryMode === 'delivery' && (
                        <div className={styles.deliveryAddress}>
                            <div className={styles.addressHeader}>
                                <h4>DIRECCIÓN DE ENTREGA</h4>
                                <button className={styles.editButton}>EDITAR</button>
                            </div>
                            <p className={styles.address}>{deliveryAddress}</p>
                        </div>
                    )}

                    <div className={styles.orderSummaryDetails}>
                        <div className={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>${subtotal}</span>
                        </div>
                        {/* Mostrar el costo de delivery solo si el modo es delivery */}
                        {deliveryMode === 'delivery' && (
                            <div className={styles.summaryRow}>
                                <span>Delivery:</span>
                                <span>${deliveryFee}</span>
                            </div>
                        )}
                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                            <span>TOTAL</span>
                            <span>${total}</span>
                        </div>
                    </div>

                    <button 
                        className={`${styles.checkoutButton} ${paymentMethod === 'mercadopago' ? styles.mercadopagoButton : ''}`}
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0 || isSubmitting}
                    >
                        {isSubmitting 
                            ? 'PROCESANDO...' 
                            : paymentMethod === 'mercadopago' 
                                ? 'PAGAR CON MERCADO PAGO' 
                                : 'REALIZAR PEDIDO'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;