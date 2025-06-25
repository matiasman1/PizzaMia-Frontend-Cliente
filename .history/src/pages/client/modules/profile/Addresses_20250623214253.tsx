import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useClienteStore } from '../../../../store/clienteStore';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './Addresses.module.css';
import currentLocation from '../../../../assets/client/current-location.svg';
import markedLocation from '../../../../assets/client/marked-location.svg';
import unmarkedLocation from '../../../../assets/client/unmarked-location.svg';

const Addresses: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const {
        cliente,
        loading,
        error,
        cargarClientePorAuth0,
        domicilioSeleccionado,
        seleccionarDomicilio
    } = useClienteStore();

    // NUEVO - Cargar datos del cliente al montar el componente
    useEffect(() => {
        const loadClientData = async () => {
            if (user?.sub) {
                try {
                    const token = await getAccessTokenSilently();
                    await cargarClientePorAuth0(user.sub, token);
                } catch (error) {
                    console.error('Error al cargar datos del cliente:', error);
                }
            }
        };

        loadClientData();
    }, [user, cargarClientePorAuth0, getAccessTokenSilently]);

    // MODIFICADA - Función para establecer una dirección como principal (adaptada a datos reales)
    const setPrimaryAddress = (id: number) => {
        seleccionarDomicilio(id);
    };

    // Funciones existentes para eliminar y modificar (preparadas para futura implementación)
    const deleteAddress = (id: number) => {
        alert(`Eliminar dirección ID: ${id} - Funcionalidad será implementada próximamente`);
    };

    const modifyAddress = (id: number) => {
        alert(`Modificar dirección ID: ${id} - Funcionalidad será implementada próximamente`);
    };

    const addNewAddress = () => {
        alert('Agregar nueva ubicación - Funcionalidad será implementada próximamente');
    };

    // MODIFICADA - Función para obtener el icono correcto adaptada a DomicilioApi
    const getLocationIcon = (domicilioId: number) => {
        if (domicilioSeleccionado?.id === domicilioId) {
            return markedLocation; // Dirección seleccionada/principal
        }
        return unmarkedLocation; // Dirección secundaria
    };

    // NUEVO - Mostrar loading
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

    // NUEVO - Mostrar error
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

    // NUEVO - Obtener domicilios del cliente
    const domicilios = cliente?.domicilios || [];

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.sectionTitle}>Mis Direcciones</h1>
                    <p className={styles.subtitle}>Administra tus direcciones de entrega</p>
                </div>

                <div className={styles.content}>
                    {/* MODIFICADA - Mostrar estado vacío si no hay direcciones */}
                    {domicilios.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📍</div>
                            <h3>No tienes direcciones registradas</h3>
                            <p>Las funciones de agregar y editar direcciones estarán disponibles próximamente</p>
                            <button className={styles.addLocationButton} onClick={addNewAddress}>
                                AGREGAR UBICACIÓN
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.addressesList}>
                                {/* MODIFICADA - Mapear domicilios reales */}
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

                                            {/* MODIFICADA - Mostrar datos reales del domicilio */}
                                            <p className={styles.addressText}>
                                                {domicilio.calle} {domicilio.numero}
                                                {domicilio.pisoDpto && `, ${domicilio.pisoDpto}`} <br />
                                                {domicilio.localidad.nombre}, CP: {domicilio.codigoPostal}
                                            </p>

                                            <div className={styles.addressActions}>
                                                <button
                                                    className={styles.eliminateButton}
                                                    onClick={() => deleteAddress(domicilio.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <button
                                                    className={styles.modifyButton}
                                                    onClick={() => modifyAddress(domicilio.id)}
                                                >
                                                    Modificar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className={styles.addLocationButton} onClick={addNewAddress}>
                                AGREGAR UBICACIÓN
                            </button>
                        </>
                    )}

                    {/* NUEVA - Nota informativa */}
                    <div className={styles.note}>
                        <p><strong>Nota:</strong> Las funciones de agregar, editar y eliminar direcciones estarán disponibles cuando se complete la implementación en el backend.</p>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Addresses;