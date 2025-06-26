import React, { useState, useEffect } from 'react';
import ProfileLayout from "../../../../components/Client/ProfileLayout/ProfileLayout";
import styles from './Addresses.module.css';
import { useClientStore } from '../../../../store/useClientStore';
import markedLocation from "../../../../assets/client/marked-location.svg";
import disabledLocation from "../../../../assets/client/disabled-location.svg";
import { DomicilioApi } from '../../../../types/typesClient';

const Addresses: React.FC = () => {
    // Obtener los datos del cliente desde el store
    const { cliente, isLoading, error } = useClientStore();
    
    // Estado local para los domicilios y el domicilio primario
    const [domicilios, setDomicilios] = useState<DomicilioApi[]>([]);
    const [domicilioPrimario, setDomicilioPrimario] = useState<number | null>(null);
    
    // Efecto para cargar los domicilios desde el cliente
    useEffect(() => {
        if (cliente && cliente.domicilios) {
            console.log("🏠 Domicilios del cliente cargados:", cliente.domicilios);
            
            // Ordenar domicilios: primero los activos, luego por ID
            const domiciliosOrdenados = [...cliente.domicilios].sort((a, b) => {
                // Primero por estado activo
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;
                // Luego por ID (más reciente primero)
                return b.id - a.id;
            });
            
            setDomicilios(domiciliosOrdenados);
            
            // Establecer el primer domicilio activo como primario si no hay ninguno establecido
            const domicilioActivo = domiciliosOrdenados.find(d => d.isActive);
            if (domicilioActivo && domicilioPrimario === null) {
                setDomicilioPrimario(domicilioActivo.id);
            }
        }
    }, [cliente]);

    // Función para establecer un domicilio como primario
    const setPrimaryAddress = (id: number) => {
        setDomicilioPrimario(id);
        console.log(`🏠 Domicilio ${id} establecido como primario`);
        // Aquí luego añadiremos la lógica para actualizar en el backend
    };

    // Función para eliminar un domicilio (solo UI por ahora)
    const deleteAddress = (id: number) => {
        console.log(`🗑️ Eliminar domicilio ${id}`);
        // Actualización local temporal
        setDomicilios(domicilios.filter(d => d.id !== id));
        // Aquí luego añadiremos la lógica para eliminar en el backend
    };

    // Función para modificar un domicilio
    const modifyAddress = (id: number) => {
        console.log(`✏️ Modificar domicilio ${id}`);
        // Aquí luego añadiremos la lógica para modificar
    };

    // Función para agregar una nueva dirección
    const addNewAddress = () => {
        console.log("➕ Agregar nueva dirección");
        // Aquí luego añadiremos la lógica para agregar
    };

    // Obtener el icono correcto según el estado del domicilio
    const getLocationIcon = (domicilio: DomicilioApi) => {
        return domicilio.id === domicilioPrimario ? markedLocation : disabledLocation;
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
                <header className={styles.header}>
                    <h2 className={styles.sectionTitle}>Mis Direcciones</h2>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                </header>

                <div className={styles.addressesContainer}>
                    {domicilios.length === 0 ? (
                        <div className={styles.noAddressesMessage}>
                            <p>No tienes direcciones guardadas.</p>
                        </div>
                    ) : (
                        domicilios.map((domicilio) => {
                            const formattedAddress = formatAddress(domicilio);
                            return (
                                <div key={domicilio.id} className={styles.addressCard}>
                                    <div className={styles.addressIconContainer}>
                                        <img
                                            src={getLocationIcon(domicilio)}
                                            alt={domicilio.id === domicilioPrimario ? "Dirección principal" : "Dirección secundaria"}
                                            className={styles.locationIcon}
                                        />
                                    </div>

                                    <div className={styles.addressContent}>
                                        <div className={styles.addressTypeRow}>
                                            <h3 className={styles.addressType}>
                                                {domicilio.id === domicilioPrimario ? "Dirección principal" : "Dirección secundaria"}
                                            </h3>
                                            <div className={styles.checkboxContainer}>
                                                <input
                                                    type="checkbox"
                                                    id={`primary-${domicilio.id}`}
                                                    checked={domicilio.id === domicilioPrimario}
                                                    onChange={() => setPrimaryAddress(domicilio.id)}
                                                    className={styles.primaryCheckbox}
                                                />
                                                <label htmlFor={`primary-${domicilio.id}`} className={styles.checkmarkLabel}>
                                                    <div className={styles.customCheckbox}>
                                                        {domicilio.id === domicilioPrimario && <span className={styles.checkmark}></span>}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <p className={styles.addressText}>
                                            {formattedAddress.street} <br />
                                            {formattedAddress.details}
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
                            );
                        })
                    )}

                    <button className={styles.addLocationButton} onClick={addNewAddress}>
                        AGREGAR UBICACIÓN
                    </button>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Addresses;