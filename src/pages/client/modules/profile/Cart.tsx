import React, { useState } from 'react';
import styles from './Cart.module.css';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import cashIcon from '../../../../assets/client/paymentmode-cash.svg';
import mpIcon from '../../../../assets/client/paymentmode-MP.svg';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
}

const Cart: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'mercadopago'>('efectivo');

    // Estado para los items del carrito
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'Pizza BBQ',
            price: 40,
            quantity: 2,
            size: '14"',
            image: '/src/assets/client/pizza-bbq.png'
        },
        {
            id: '2',
            name: 'Pizza Pepperoni',
            price: 60,
            quantity: 1,
            size: '16"',
            image: '/src/assets/client/pizza-pepperoni.png'
        },
        {
            id: '3',
            name: 'Pizza BBQ',
            price: 40,
            quantity: 2,
            size: '14"',
            image: '/src/assets/client/pizza-bbq.png'
        },
        {
            id: '4',
            name: 'Pizza Pepperoni',
            price: 60,
            quantity: 1,
            size: '16"',
            image: '/src/assets/client/pizza-pepperoni.png'
        }
    ]);

    // Dirección de entrega
    const deliveryAddress = "Calle Boulogne Sur Mer 1320, San Martín, Mendoza";

    // Calcular el subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 10;
    const discount = 10;
    const total = subtotal + deliveryFee - discount;

    // Eliminar un item del carrito
    const removeItem = (itemId: string) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    // Incrementar cantidad de un item
    const incrementQuantity = (itemId: string) => {
        setCartItems(cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // Decrementar cantidad de un item
    const decrementQuantity = (itemId: string) => {
        setCartItems(cartItems.map(item =>
            item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Carrito</h2>
                </div>

                <div className={styles.cartContent}>
                    {/* Columna izquierda - Items del carrito */}
                    <div className={styles.cartItems}>
                        {cartItems.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.cartItemImage}>
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className={styles.cartItemInfo}>
                                    <div className={styles.cartItemHeader}>
                                        <div>
                                            <h3 className={styles.itemName}>{item.name}</h3>
                                            <span className={styles.itemSize}>{item.size}</span>
                                        </div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className={styles.cartItemFooter}>
                                        <div className={styles.priceTag}>${item.price}</div>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.quantityButton}
                                                onClick={() => decrementQuantity(item.id)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                            <button
                                                className={styles.quantityButton}
                                                onClick={() => incrementQuantity(item.id)}
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Columna derecha - Resumen y opciones */}
                    <div className={styles.orderSummary}>
                        <div className={styles.paymentOptions}>
                            <div className={styles.paymentTabs}>
                                <button className={styles.tabButton}>Tienda</button>
                                <button className={`${styles.tabButton} ${styles.activeTab}`}>Delivery</button>
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

                        <div className={styles.deliveryAddress}>
                            <div className={styles.addressHeader}>
                                <h4>DIRECCIÓN DE ENTREGA</h4>
                                <button className={styles.editButton}>EDITAR</button>
                            </div>
                            <p className={styles.address}>{deliveryAddress}</p>
                        </div>

                        <div className={styles.orderSummaryDetails}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Delivery:</span>
                                <span>${deliveryFee}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Descuento (10%):</span>
                                <span>-${discount}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>TOTAL</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        <button className={styles.checkoutButton}>
                            REALIZAR PEDIDO
                        </button>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Cart;