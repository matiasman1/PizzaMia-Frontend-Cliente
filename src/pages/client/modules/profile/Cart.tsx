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

interface Address {
    id: string;
    name: string;
    address: string;
    details: string;
}

const Cart: React.FC = () => {
    // Estado para el método de pago y tipo de entrega
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'mercadopago'>('efectivo');
    const [deliveryType, setDeliveryType] = useState<'tienda' | 'delivery'>('delivery');
    
    // Estados para la gestión de direcciones
    const [addressExpanded, setAddressExpanded] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string>('1');

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

    // Direcciones del usuario
    const addresses: Address[] = [
        {
            id: '1',
            name: 'Casa',
            address: 'Calle Boulogne Sur Mer 1320',
            details: 'San Martín, Mendoza'
        },
        {
            id: '2',
            name: 'Trabajo',
            address: 'Av. San Martín 567',
            details: 'Ciudad, Mendoza'
        },
        {
            id: '3',
            name: 'Casa de Familia',
            address: 'Las Heras 890',
            details: 'Godoy Cruz, Mendoza'
        }
    ];

    // Obtener la dirección seleccionada actualmente
    const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);

    // Calcular el subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    // El delivery fee se cobra solo cuando el tipo es delivery
    const deliveryFee = deliveryType === 'delivery' ? 10 : 0;
    const discount = 10;
    const total = subtotal + deliveryFee - discount;

    // Función para seleccionar dirección
    const handleAddressSelect = (addressId: string) => {
        setSelectedAddress(addressId);
        setAddressExpanded(false);
    };

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
                <header className={styles.header}>
                    <h2 className={styles.sectionTitle}>Carrito</h2>
                </header>

                <div className={styles.cartContent}>
                    {/* Columna izquierda - Items del carrito */}
                    <div className={styles.cartItems}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.cartItemImage}>
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className={styles.cartItemInfo}>
                                    <div className={styles.cartItemHeader}>
                                        <div className={styles.cartItemTitle}>
                                            <h3 className={styles.itemName}>{item.name}</h3>
                                            <p className={styles.itemSize}>Tamaño: {item.size}</p>
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
                                <button 
                                    className={`${styles.tabButton} ${deliveryType === 'tienda' ? styles.activeTab : ''}`}
                                    onClick={() => setDeliveryType('tienda')}
                                >
                                    Tienda
                                </button>
                                <button 
                                    className={`${styles.tabButton} ${deliveryType === 'delivery' ? styles.activeTab : ''}`}
                                    onClick={() => setDeliveryType('delivery')}
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

                        {/* Solo mostrar la dirección si el tipo de entrega es delivery */}
                        {deliveryType === 'delivery' && (
                            <div className={styles.deliveryAddress}>
                                <div className={styles.addressHeader}>
                                    <h4>DIRECCIÓN DE ENTREGA</h4>
                                    <button 
                                        className={styles.editButton}
                                        onClick={() => setAddressExpanded(!addressExpanded)}
                                    >
                                        {addressExpanded ? 'CERRAR' : 'EDITAR'}
                                    </button>
                                </div>
                                
                                <div className={`${styles.addressContent} ${addressExpanded ? styles.expanded : ''}`}>
                                    {!addressExpanded && selectedAddressData && (
                                        <div className={styles.selectedAddress}>
                                            <p className={styles.address}>
                                                {selectedAddressData.address}<br />
                                                {selectedAddressData.details}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {addressExpanded && (
                                        <div className={styles.addressList}>
                                            {addresses.map((address) => (
                                                <div 
                                                    key={address.id} 
                                                    className={styles.addressOption}
                                                    onClick={() => handleAddressSelect(address.id)}
                                                >
                                                    <div className={`${styles.radioButton} ${selectedAddress === address.id ? styles.selected : ''}`}>
                                                        {selectedAddress === address.id && <div className={styles.radioFill} />}
                                                    </div>
                                                    <div className={styles.addressDetails}>
                                                        <div className={styles.addressName}>{address.name}</div>
                                                        <div className={styles.addressText}>
                                                            {address.address}<br />
                                                            {address.details}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={styles.orderSummaryDetails}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>${subtotal}</span>
                            </div>
                            {deliveryType === 'delivery' && (
                                <div className={styles.summaryRow}>
                                    <span>Delivery:</span>
                                    <span>${deliveryFee}</span>
                                </div>
                            )}
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