import React, { useState } from 'react';
import ProfileLayout from "../../../../components/Client/ProfileLayout/ProfileLayout";
import AddressModal from "../../../../components/Client/AddressModal/AddressModal";
import styles from './Addresses.module.css';
import currentLocation from "../../../../assets/client/current-location.svg";
import disabledLocation from "../../../../assets/client/disabled-location.svg";
import markedLocation from "../../../../assets/client/marked-location.svg";
import unmarkedLocation from "../../../../assets/client/unmarked-location.svg";

interface Address {
    id: number;
    isPrimary: boolean;
    type: string;
    street: string;
    details: string;
    ubicacion?: string;
    departamento?: string;
    calle?: string;
    numero?: string;
    piso?: string;
}

interface AddressFormData {
    ubicacion: string;
    departamento: string;
    calle: string;
    numero: string;
    piso: string;
}

const Addresses: React.FC = () => {
    // Estado para las direcciones
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 1,
            isPrimary: true,
            type: 'Dirección principal',
            street: 'Av. Colón 785,',
            details: 'Ciudad, Mendoza',
            ubicacion: 'MENDOZA',
            departamento: 'Capital',
            calle: 'Av. Colón',
            numero: '785',
            piso: ''
        },
        {
            id: 2,
            isPrimary: false,
            type: 'Dirección secundaria',
            street: 'Calle Boulogne Sur Mer 1320,',
            details: 'San Martín, Mendoza',
            ubicacion: 'MENDOZA',
            departamento: 'San Martín',
            calle: 'Calle Boulogne Sur Mer',
            numero: '1320',
            piso: ''
        },
        {
            id: 3,
            isPrimary: false,
            type: 'Dirección secundaria',
            street: 'Calle Belgrano 456,',
            details: 'Godoy Cruz, Mendoza',
            ubicacion: 'MENDOZA',
            departamento: 'Godoy Cruz',
            calle: 'Calle Belgrano',
            numero: '456',
            piso: '2A'
        }
    ]);

    // Estados para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Función para establecer una dirección como principal
    const setPrimaryAddress = (id: number) => {
        setAddresses(addresses.map(address => ({
            ...address,
            isPrimary: address.id === id
        })));
    };

    // Función para eliminar una dirección
    const deleteAddress = (id: number) => {
        if (addresses.length <= 1) {
            alert('Debe mantener al menos una dirección');
            return;
        }
        
        const addressToDelete = addresses.find(addr => addr.id === id);
        if (addressToDelete?.isPrimary && addresses.length > 1) {
            // Si elimina la dirección principal, hacer que la primera disponible sea principal
            const remainingAddresses = addresses.filter(addr => addr.id !== id);
            remainingAddresses[0].isPrimary = true;
            setAddresses(remainingAddresses);
        } else {
            setAddresses(addresses.filter(address => address.id !== id));
        }
    };

    // Función para abrir modal de modificar
    const modifyAddress = (id: number) => {
        const address = addresses.find(addr => addr.id === id);
        if (address) {
            setEditingAddress(address);
            setModalMode('edit');
            setIsModalOpen(true);
        }
    };

    // Función para abrir modal de agregar
    const addNewAddress = () => {
        setEditingAddress(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    // Función para guardar dirección (agregar o editar)
    const handleSaveAddress = (formData: AddressFormData) => {
        if (modalMode === 'add') {
            // Agregar nueva dirección
            const newAddress: Address = {
                id: Math.max(...addresses.map(a => a.id)) + 1,
                isPrimary: addresses.length === 0, // Primera dirección es principal
                type: addresses.length === 0 ? 'Dirección principal' : 'Dirección secundaria',
                street: `${formData.calle} ${formData.numero},`,
                details: `${formData.departamento}, Mendoza`,
                ubicacion: formData.ubicacion,
                departamento: formData.departamento,
                calle: formData.calle,
                numero: formData.numero,
                piso: formData.piso
            };
            setAddresses([...addresses, newAddress]);
        } else if (modalMode === 'edit' && editingAddress) {
            // Editar dirección existente
            const updatedAddress: Address = {
                ...editingAddress,
                street: `${formData.calle} ${formData.numero},`,
                details: `${formData.departamento}, Mendoza`,
                ubicacion: formData.ubicacion,
                departamento: formData.departamento,
                calle: formData.calle,
                numero: formData.numero,
                piso: formData.piso
            };
            setAddresses(addresses.map(addr => 
                addr.id === editingAddress.id ? updatedAddress : addr
            ));
        }
        handleModalClose();
    };

    // Obtener el icono correcto según el estado de la dirección
    const getLocationIcon = (address: Address) => {
        if (address.isPrimary) {
            return markedLocation;
        } else {
            return disabledLocation;
        }
    };

    // Preparar datos iniciales para el modal de edición
    const getInitialFormData = (): AddressFormData | undefined => {
        if (modalMode === 'edit' && editingAddress) {
            return {
                ubicacion: editingAddress.ubicacion || 'MENDOZA',
                departamento: editingAddress.departamento || '',
                calle: editingAddress.calle || '',
                numero: editingAddress.numero || '',
                piso: editingAddress.piso || ''
            };
        }
        return undefined;
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
                                <img
                                    src={getLocationIcon(address)}
                                    alt={address.isPrimary ? "Dirección principal" : "Dirección secundaria"}
                                    className={styles.locationIcon}
                                />
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
                                            <div className={styles.customCheckbox}>
                                                {address.isPrimary && <span className={styles.checkmark}></span>}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <p className={styles.addressText}>
                                    {address.street} <br />
                                    {address.details}
                                    {address.piso && <><br />Piso/Depto: {address.piso}</>}
                                </p>

                                <div className={styles.addressActions}>
                                    <button
                                        className={styles.eliminateButton}
                                        onClick={() => deleteAddress(address.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className={styles.modifyButton}
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

            {/* Modal de dirección */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveAddress}
                mode={modalMode}
                initialData={getInitialFormData()}
            />
        </ProfileLayout>
    );
};

export default Addresses;