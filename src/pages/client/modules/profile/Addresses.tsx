import React, { useState, useEffect } from 'react';
import ProfileLayout from "../../../../components/Client/ProfileLayout/ProfileLayout";
import styles from './Addresses.module.css';
import { useClientStore } from '../../../../store/useClientStore';
import { useAuth0 } from '@auth0/auth0-react';
import { ClienteApi, DomicilioApi, DomicilioCreateRequest } from '../../../../types/typesClient';
import { agregarDomicilioCliente, actualizarDomicilioCliente, toggleEstadoDomicilio } from '../../../../api/clientApi';
import AddAddressModal from '../../../../components/Modal/AddAddressModal';

const Addresses: React.FC = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { cliente, isLoading, error } = useClientStore();
    
    // Estados para domicilios y modales
    const [domicilios, setDomicilios] = useState<DomicilioApi[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
    
    // Nuevos estados para edición
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [domicilioToEdit, setDomicilioToEdit] = useState<DomicilioApi | null>(null);

    // Función helper para actualizar la lista de domicilios (solo activos)
    const actualizarListaDomicilios = (nuevosdomicilios: DomicilioApi[]) => {
        const domiciliosActivos = nuevosdomicilios
            .filter(d => d.active === true)
            .sort((a, b) => b.id - a.id);
        
        setDomicilios(domiciliosActivos);
    };

    // Efecto para cargar los domicilios desde el cliente
    useEffect(() => {
        if (cliente && cliente.domicilios) {
            console.log("🏠 Domicilios del cliente cargados:", cliente.domicilios);
            actualizarListaDomicilios(cliente.domicilios);
        }
    }, [cliente]);

    // Función para eliminar un domicilio (eliminación lógica)
    const deleteAddress = async (id: number) => {
        if (!cliente) {
            setSubmitError('No se encontró información del cliente');
            return;
        }

        // Confirmar la eliminación
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta dirección?');
        if (!confirmDelete) return;

        setDeletingAddressId(id);
        setSubmitError('');

        try {
            const token = await getAccessTokenSilently();
            const clienteActualizado = await toggleEstadoDomicilio(cliente.id, id, token);
            
            console.log('✅ Domicilio desactivado exitosamente');
            
            // Actualizar la lista con los domicilios activos
            if (clienteActualizado.domicilios) {
                actualizarListaDomicilios(clienteActualizado.domicilios);
            }
            
        } catch (error) {
            console.error('Error al eliminar domicilio:', error);
            setSubmitError(error instanceof Error ? error.message : 'Error al eliminar domicilio');
        } finally {
            setDeletingAddressId(null);
        }
    };

    // Función para modificar un domicilio
    const modifyAddress = (id: number) => {
        const domicilio = domicilios.find(d => d.id === id);
        if (domicilio) {
            setDomicilioToEdit(domicilio);
            setIsEditingMode(true);
            setSubmitError('');
            setShowAddModal(true);
        }
    };

    // Función para manejar agregar nueva dirección
    const handleAddNewAddress = () => {
        setIsEditingMode(false);
        setDomicilioToEdit(null);
        setSubmitError('');
        setShowAddModal(true);
    };

    // Función para manejar el envío del formulario (agregar o actualizar)
    const handleSubmitAddress = async (domicilio: DomicilioCreateRequest) => {
        if (!cliente) {
            setSubmitError('No se encontró información del cliente');
            return;
        }

        setIsSubmittingAddress(true);
        setSubmitError('');

        try {
            const token = await getAccessTokenSilently();
            let clienteActualizado: ClienteApi;

            if (isEditingMode && domicilioToEdit) {
                // Actualizar domicilio existente
                clienteActualizado = await actualizarDomicilioCliente(
                    cliente.id, 
                    domicilioToEdit.id, 
                    domicilio, 
                    token
                );
                console.log('✅ Domicilio actualizado exitosamente');
            } else {
                // Agregar nuevo domicilio
                clienteActualizado = await agregarDomicilioCliente(cliente.id, domicilio, token);
                console.log('✅ Domicilio agregado exitosamente');
            }
            
            // Actualizar la lista usando la función helper
            if (clienteActualizado.domicilios) {
                actualizarListaDomicilios(clienteActualizado.domicilios);
            }
            
        } catch (error) {
            console.error('Error al procesar domicilio:', error);
            setSubmitError(error instanceof Error ? error.message : 'Error al procesar domicilio');
            throw error;
        } finally {
            setIsSubmittingAddress(false);
        }
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowAddModal(false);
        setIsEditingMode(false);
        setDomicilioToEdit(null);
        setSubmitError('');
    };

    // Formatear la dirección para mostrar
    const formatAddress = (domicilio: DomicilioApi) => {
        return {
            street: `${domicilio.calle} ${domicilio.numero}`,
            details: `${domicilio.localidad.nombre}, CP: ${domicilio.codigoPostal}`
        };
    };

    // Mostrar spinner durante la carga
    if (isLoading) {
        return (
            <ProfileLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando domicilios...</p>
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Mis Direcciones</h2>
                    <button 
                        className={styles.addButton}
                        onClick={handleAddNewAddress}
                        disabled={isSubmittingAddress}
                    >
                        <span className={styles.addIcon}>+</span>
                        {isSubmittingAddress ? 'Agregando...' : 'Agregar dirección'}
                    </button>
                </div>
                
                {(error || submitError) && (
                    <div className={styles.errorMessage}>
                        {error || submitError}
                    </div>
                )}

                <div className={styles.addressesTable}>
                    {domicilios.length === 0 ? (
                        <div className={styles.emptyAddressesMessage}>
                            <p>No tienes direcciones guardadas</p>
                            <small>Agrega tu primera dirección para empezar a realizar pedidos</small>
                        </div>
                    ) : (
                        <div className={styles.addressesList}>
                            {domicilios.map((domicilio) => {
                                const formattedAddress = formatAddress(domicilio);
                                const isDeleting = deletingAddressId === domicilio.id;
                                
                                return (
                                    <div key={domicilio.id} className={styles.addressItem}>
                                        <div className={styles.addressIconContainer}>
                                            <div className={styles.addressIcon}>
                                                📍
                                            </div>
                                        </div>
                                        
                                        <div className={styles.addressDetails}>
                                            <div className={styles.addressHeader}>
                                                <h3 className={styles.addressTitle}>
                                                    {formattedAddress.street}
                                                </h3>
                                                <div className={styles.addressStatus}>
                                                    Activa
                                                </div>
                                            </div>
                                            
                                            <div className={styles.addressInfo}>
                                                <div className={styles.addressLocation}>
                                                    <span className={styles.locationLabel}>Ubicación:</span>
                                                    <span className={styles.locationText}>
                                                        {formattedAddress.details}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.addressActions}>
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => modifyAddress(domicilio.id)}
                                                    disabled={isDeleting}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => deleteAddress(domicilio.id)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <AddAddressModal
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitAddress}
                    isLoading={isSubmittingAddress}
                    isEditing={isEditingMode}
                    domicilioToEdit={domicilioToEdit}
                />
            </div>
        </ProfileLayout>
    );
};

export default Addresses;