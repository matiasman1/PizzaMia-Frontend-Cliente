import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useClienteStore } from '../../../../store/clienteStore';
import { 
    getUserById, 
    agregarDomicilio, 
    actualizarDomicilio, 
    eliminarDomicilio 
} from '../../../../api/clientApi';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import AddressModal from '../../../../components/Client/AddressModal/AddressModal';
import styles from './Addresses.module.css';
import markedLocation from '../../../../assets/client/marked-location.svg';
import unmarkedLocation from '../../../../assets/client/unmarked-location.svg';

const Addresses: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const {
        cliente,
        loading,
        error,
        domicilioSeleccionado,
        setCliente,
        setLoading,
        setError,
        seleccionarDomicilio
    } = useClienteStore();

    // Estados del modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [modalTitle, setModalTitle] = useState('');
    
    // Estados para operaciones
    const [operationLoading, setOperationLoading] = useState(false);
    const [operationError, setOperationError] = useState<string | null>(null);
    const [operationSuccess, setOperationSuccess] = useState<string | null>(null);

    // Cargar datos del cliente al montar el componente
    useEffect(() => {
        const loadClientData = async () => {
            if (user?.sub) {
                try {
                    setLoading(true);
                    setError(null);
                    
                    const token = await getAccessTokenSilently();
                    const clienteData = await getUserById({ auth0Id: user.sub }, token);
                    
                    setCliente(clienteData);
                } catch (error) {
                    console.error('Error al cargar datos del cliente:', error);
                    setError(error instanceof Error ? error.message : 'Error al cargar datos del cliente');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadClientData();
    }, [user, setCliente, setLoading, setError, getAccessTokenSilently]);

    // Recargar datos del cliente después de operaciones
    const reloadClientData = async () => {
        if (user?.sub) {
            try {
                const token = await getAccessTokenSilently();
                const clienteData = await getUserById({ auth0Id: user.sub }, token);
                setCliente(clienteData);
            } catch (error) {
                console.error('Error al recargar datos:', error);
            }
        }
    };

    const setPrimaryAddress = (id: number) => {
        seleccionarDomicilio(id);
    };

    // NUEVA FUNCIÓN - Eliminar dirección
    const deleteAddress = async (id: number) => {
        if (!confirm('¿Está seguro que desea eliminar esta dirección?')) {
            return;
        }

        setOperationLoading(true);
        setOperationError(null);

        try {
            const token = await getAccessTokenSilently();
            await eliminarDomicilio(id, token);
            
            setOperationSuccess('Dirección eliminada correctamente');
            setTimeout(() => setOperationSuccess(null), 3000);
            
            // Recargar datos
            await reloadClientData();
        } catch (error) {
            setOperationError(error instanceof Error ? error.message : 'Error al eliminar dirección');
        } finally {
            setOperationLoading(false);
        }
    };

    // NUEVA FUNCIÓN - Modificar dirección
    const modifyAddress = (domicilio: any) => {
        setEditingAddress(domicilio);
        setModalTitle('Editar Dirección');
        setModalOpen(true);
    };

    // NUEVA FUNCIÓN - Agregar nueva dirección
    const addNewAddress = () => {
        setEditingAddress(null);
        setModalTitle('Agregar Nueva Dirección');
        setModalOpen(true);
    };

    // NUEVA FUNCIÓN - Guardar dirección (agregar o editar)
    const handleSaveAddress = async (addressData: any) => {
        if (!user?.sub) return;

        const token = await getAccessTokenSilently();

        try {
            if (editingAddress) {
                // Editar dirección existente
                await actualizarDomicilio(editingAddress.id, addressData, token);
                setOperationSuccess('Dirección actualizada correctamente');
            } else {
                // Agregar nueva dirección
                await agregarDomicilio(user.sub, addressData, token);
                setOperationSuccess('Dirección agregada correctamente');
            }
            
            setTimeout(() => setOperationSuccess(null), 3000);
            
            // Recargar datos
            await reloadClientData();
        } catch (error) {
            throw error; // El modal manejará el error
        }
    };

    const getLocationIcon = (domicilioId: number) => {
        if (domicilioSeleccionado?.id === domicilioId) {
            return markedLocation;
        }
        return unmarkedLocation;
    };

    if (loading) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <p>Cargando direcciones...</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    if (error) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Error al cargar las direcciones</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    const domicilios = cliente?.domicilios || [];

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.sectionTitle}>Mis Direcciones</h1>
                    <p className={styles.subtitle}>Administra tus direcciones de entrega</p>
                </div>

                {operationError && (
                    <div className={styles.errorMessage}>
                        {operationError}
                    </div>
                )}

                {operationSuccess && (
                    <div className={styles.successMessage}>
                        {operationSuccess}
                    </div>
                )}

                <div className={styles.content}>
                    {domicilios.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📍</div>
                            <h3>No tienes direcciones registradas</h3>
                            <p>Agrega tu primera dirección para realizar pedidos</p>
                            <button 
                                className={styles.addLocationButton} 
                                onClick={addNewAddress}
                                disabled={operationLoading}
                            >
                                AGREGAR UBICACIÓN
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.addressesList}>
                                {domicilios.map((domicilio) => (
                                    <div key={domicilio.id} className={styles.addressCard}>
                                        <div className={styles.cardContent}>
                                            <div className={styles.addressHeader}>
                                                <div className={styles.locationIconContainer}>
                                                    <img 
                                                        src={getLocationIcon(domicilio.id)} 
                                                        alt="Ubicación" 
                                                        className={styles.locationIcon}
                                                    />
                                                </div>
                                                
                                                <div className={styles.addressInfo}>
                                                    <div className={styles.typeAndPrimary}>
                                                        <h3 className={styles.addressType}>
                                                            {domicilioSeleccionado?.id === domicilio.id ? 'Dirección principal' : 'Dirección secundaria'}
                                                        </h3>
                                                        <div className={styles.primaryCheckbox}>
                                                            <input
                                                                type="radio"
                                                                id={`primary-${domicilio.id}`}
                                                                name="primaryAddress"
                                                                checked={domicilioSeleccionado?.id === domicilio.id}
                                                                onChange={() => setPrimaryAddress(domicilio.id)}
                                                                className={styles.hiddenCheckbox}
                                                            />
                                                            <label htmlFor={`primary-${domicilio.id}`} className={styles.checkmarkLabel}>
                                                                <div className={styles.customCheckbox}>
                                                                    {domicilioSeleccionado?.id === domicilio.id && <span className={styles.checkmark}></span>}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className={styles.addressText}>
                                                {domicilio.calle} {domicilio.numero}
                                                <br />
                                                {domicilio.localidad.nombre}, CP: {domicilio.codigoPostal}
                                            </p>

                                            <div className={styles.addressActions}>
                                                <button
                                                    className={styles.eliminateButton}
                                                    onClick={() => deleteAddress(domicilio.id)}
                                                    disabled={operationLoading}
                                                >
                                                    {operationLoading ? 'Procesando...' : 'Eliminar'}
                                                </button>
                                                <button
                                                    className={styles.modifyButton}
                                                    onClick={() => modifyAddress(domicilio)}
                                                    disabled={operationLoading}
                                                >
                                                    Modificar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                className={styles.addLocationButton} 
                                onClick={addNewAddress}
                                disabled={operationLoading}
                            >
                                AGREGAR UBICACIÓN
                            </button>
                        </>
                    )}
                </div>

                <AddressModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveAddress}
                    editingAddress={editingAddress}
                    title={modalTitle}
                />
            </div>
        </ProfileLayout>
    );
};

export default Addresses;