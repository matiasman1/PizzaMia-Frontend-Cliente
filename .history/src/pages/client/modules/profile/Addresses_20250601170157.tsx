import React, { useState } from 'react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './Addresses.module.css';

interface Address {
    id: number;
    isPrimary: boolean;
    type: string;
    street: string;
    details: string;
}

const Addresses: React.FC = () => {
    // Estado para las direcciones
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 1,
            isPrimary: true,
            type: 'Dirección principal',
            street: 'Av. Colón 785,',
            details: 'Ciudad, Mendoza'
        },
        {
            id: 2,
            isPrimary: false,
            type: 'Dirección secundaria',
            street: 'Calle Boulogne Sur Mer 1320,',
            details: 'San Martín, Mendoza'
        },
        {
            id: 3,
            isPrimary: false,
            type: 'Dirección secundaria',
            street: 'Calle Belgrano 456,',
            details: 'Godoy Cruz, Mendoza'
        }
    ]);

    // Función para establecer una dirección como principal
    const setPrimaryAddress = (id: number) => {
        setAddresses(addresses.map(address => ({
            ...address,
            isPrimary: address.id === id
        })));
    };

    // Función para eliminar una dirección
    const deleteAddress = (id: number) => {
        setAddresses(addresses.filter(address => address.id !== id));
    };

    // Función para modificar una dirección
    const modifyAddress = (id: number) => {
        // En una aplicación real, esto abriría un modal o navegaría a una página para editar la dirección
        alert(`Modificar dirección ID: ${id}`);
    };

    // Función para agregar una nueva dirección
    const addNewAddress = () => {
        // En una aplicación real, esto abriría un modal o navegaría a una página para agregar una dirección
        alert('Agregar nueva dirección');
    };

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.sectionTitle}>Mis Direcciones</h2>
                </header>

                <div className={styles.addressesContainer}>
                    {addresses.map((address) => (
                        <div key={address.id} className={styles.addressCard}>
                            <div className={styles.addressIconContainer}>
                                <div className={styles.locationIconWrapper}>
                                    <div className={styles.locationIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 13.5C13.933 13.5 15.5 11.933 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.067 6.5 8.5 8.067 8.5 10C8.5 11.933 10.067 13.5 12 13.5Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M12 21.5C15.3 18.7 21 14.4 21 10C21 5.6 17 2 12 2C7 2 3 5.6 3 10C3 14.4 8.7 18.7 12 21.5Z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.addressContent}>
                                <div className={styles.addressTypeRow}>
                                    <h3 className={styles.addressType}>{address.type}</h3>
                                    <div className={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            id={`primary-${address.id}`}
                                            checked={address.isPrimary}
                                            onChange={() => setPrimaryAddress(address.id)}
                                            className={styles.primaryCheckbox}
                                        />
                                        <label htmlFor={`primary-${address.id}`} className={styles.checkmarkLabel}>
                                            <span className={styles.checkmark}></span>
                                        </label>
                                    </div>
                                </div>

                                <p className={styles.addressText}>
                                    {address.street} <br />
                                    {address.details}
                                </p>

                                <div className={styles.addressActions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => deleteAddress(address.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => modifyAddress(address.id)}
                                    >
                                        Modificar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className={styles.addLocationButton} onClick={addNewAddress}>
                        AGREGAR UBICACIÓN
                    </button>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Addresses;