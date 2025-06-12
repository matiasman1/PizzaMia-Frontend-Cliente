import React, { useState } from 'react';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import styles from './CartPanel.module.css';
import cashIcon from '../../../assets/client/paymentmode-cash.svg';
import mpIcon from '../../../assets/client/paymentmode-MP.svg';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    image?: string;
}

interface Address {
    id: string;
    name: string;
    address: string;
    details: string;
}

interface CartPanelProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ 
    isOpen, 
    onClose, 
    cartItems, 
    onUpdateQuantity, 
    onRemoveItem 
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'mercadopago'>('efectivo');
    const [deliveryType, setDeliveryType] = useState<'tienda' | 'delivery'>('delivery');
    const [selectedAddress, setSelectedAddress] = useState<string>('1');
    const [addressExpanded, setAddressExpanded] = useState(false);

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

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = deliveryType === 'delivery' ? 10 : 0;
    const discount = 10;
    const total = subtotal + deliveryFee - discount;

    const incrementQuantity = (itemId: string) => {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            onUpdateQuantity(itemId, item.quantity + 1);
        }
    };

    const decrementQuantity = (itemId: string) => {
        const item = cartItems.find(item => item.id === itemId);
        if (item && item.quantity > 1) {
            onUpdateQuantity(itemId, item.quantity - 1);
        }
    };

    const handleAddressSelect = (addressId: string) => {
        setSelectedAddress(addressId);
        setAddressExpanded(false);
    };

    const selectedAddressData = addresses.find(addr => addr.id === selectedAddress);

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose} />}
            <div className={`${styles.cartPanel} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Carrito</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.cartItems}>
                        {cartItems.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    <span>🍕</span>
                                </div>
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemHeader}>
                                        <div>
                                            <h3 className={styles.itemName}>{item.name}</h3>
                                            {item.size && <span className={styles.itemSize}>{item.size}</span>}
                                        </div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => onRemoveItem(item.id)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <div className={styles.priceTag}>${item.price}</div>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.quantityButton}
                                                onClick={() => decrementQuantity(item.id)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                            <button
                                                className={styles.quantityButton}
                                                onClick={() => incrementQuantity(item.id)}
                                            >
                                                <FaPlus size={10} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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
                                            <p className={styles.addressText}>
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
        </>
    );
};

export default CartPanel;