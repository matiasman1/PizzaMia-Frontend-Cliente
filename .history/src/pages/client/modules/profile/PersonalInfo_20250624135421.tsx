import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useClienteStore } from '../../../../store/clienteStore';
import { getUserById, actualizarCliente } from '../../../../api/clientApi';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './PersonalInfo.module.css';
import { countries, Country } from '../../../../api/countriesData';

// Helper functions
const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

const getCountryByDialCode = (phone: string): Country | null => {
    for (const country of countries) {
        if (phone.startsWith(country.dial_code)) {
            return country;
        }
    }
    return countries.find(c => c.code === 'AR') || null;
};

const PersonalInfo: React.FC = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const {
        cliente,
        loading,
        error,
        setLoading,
        setError
    } = useClienteStore();

    // Estados del componente
    const [nombre, setNombre] = useState('Nombre Usuario');
    const [email, setEmail] = useState('usuario@ejemplo.com');
    const [telefono, setTelefono] = useState('+54 9 261 123-4567');
    
    const [editingName, setEditingName] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    
    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    
    const [selectedCountry, setSelectedCountry] = useState<Country>(
        countries.find(c => c.code === 'AR') || countries[0]
    );

    // Estados para manejo de guardado
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Cargar datos del cliente al montar el componente
    useEffect(() => {
        const loadClientData = async () => {
            if (user?.sub) {
                try {
                    setLoading(true);
                    setError(null);
                    
                    const token = await getAccessTokenSilently();
                    const clienteData = await getUserById({ auth0Id: user.sub }, token);
                    const clienteData = await getUserById({ auth0Id: user.sub }, token);
                    
                    // Store cliente data in a local state or update the store appropriately
                    // setCliente(clienteData); // Remove this line if setCliente doesn't exist
                    console.error('Error al cargar datos del cliente:', error);
                    setError(error instanceof Error ? error.message : 'Error al cargar datos del cliente');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadClientData();
    }, [user, setCliente, setLoading, setError, getAccessTokenSilently]);

    // Actualizar estados locales cuando se cargan los datos del cliente
    useEffect(() => {
        if (cliente) {
            const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`;
            setNombre(nombreCompleto);
            setEmail(cliente.email || 'usuario@ejemplo.com');
            
            // Formatear teléfono con código de país
            const telefonoFormateado = cliente.telefono 
                ? `${selectedCountry.dial_code} ${cliente.telefono}`
                : '+54 9 261 123-4567';
            setTelefono(telefonoFormateado);
            
            // Detectar país basado en el teléfono
            const detectCountry = getCountryByDialCode(telefonoFormateado);
            if (detectCountry) {
                setSelectedCountry(detectCountry);
            }
        }
    }, [cliente, selectedCountry.dial_code]);

    // Detectar país por teléfono
    useEffect(() => {
        const detectCountry = getCountryByDialCode(telefono);
        if (detectCountry) {
            setSelectedCountry(detectCountry);
        }
    }, [telefono]);

    // Funciones de edición
    const handleEditName = () => {
        setEditingName(true);
        setTempName(nombre);
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleEditPhone = () => {
        setEditingPhone(true);
        const phoneWithoutCode = telefono.replace(selectedCountry.dial_code, '').trim();
        setTempPhone(phoneWithoutCode);
        setSaveError(null);
        setSaveSuccess(false);
    };

    // Función para aceptar cambios de nombre
    const handleAcceptNameChange = async () => {
        if (!user?.sub || !cliente) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const token = await getAccessTokenSilently();
            
            const nameParts = tempName.trim().split(' ');
            const nombre = nameParts[0] || '';
            const apellido = nameParts.slice(1).join(' ') || cliente.apellido;
            
            const datosActualizacion = {
                nombre,
                apellido,
                telefono: parseInt(cliente.telefono?.toString() || '0'),
                email: cliente.email,
                auth0Id: user.sub
            };

            const clienteActualizado = await actualizarCliente(user.sub, datosActualizacion, token);
            
            // Update local state instead of using setCliente
            // setCliente(clienteActualizado); // Remove this line if setCliente doesn't exist
            setNombre(tempName);
            setEditingName(false);
            setSaveSuccess(true);
            
            setTimeout(() => setSaveSuccess(false), 3000);
            
        } catch (error) {
            console.error('Error al guardar nombre:', error);
            setSaveError(error instanceof Error ? error.message : 'Error al guardar el nombre');
        } finally {
            setIsSaving(false);
        }
    };

    // Función para aceptar cambios de teléfono
    const handleAcceptPhoneChange = async () => {
        if (!user?.sub || !cliente) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const token = await getAccessTokenSilently();
            
            const telefonoLimpio = tempPhone.replace(/\D/g, '');
            
            const datosActualizacion = {
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono: parseInt(telefonoLimpio),
                email: cliente.email,
                auth0Id: user.sub
            };
            const clienteActualizado = await actualizarCliente(user.sub, datosActualizacion, token);
            
            // Update local state instead of using setCliente
            // setCliente(clienteActualizado); // Remove this line if setCliente doesn't exist
            
            const newFormattedPhone = `${selectedCountry.dial_code} ${formatPhoneNumber(telefonoLimpio)}`;
            const newFormattedPhone = `${selectedCountry.dial_code} ${formatPhoneNumber(telefonoLimpio)}`;
            setTelefono(newFormattedPhone);
            setEditingPhone(false);
            setSaveSuccess(true);
            
            setTimeout(() => setSaveSuccess(false), 3000);
            
        } catch (error) {
            console.error('Error al guardar teléfono:', error);
            setSaveError(error instanceof Error ? error.message : 'Error al guardar el teléfono');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelNameChange = () => {
        setEditingName(false);
        setTempName('');
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleCancelPhoneChange = () => {
        setEditingPhone(false);
        setTempPhone('');
        setSaveError(null);
        setSaveSuccess(false);
    };

    if (loading) {
        return (
            <ProfileLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <p>Cargando información personal...</p>
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
                        <h2>Error al cargar los datos</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.sectionTitle}>Información Personal</h1>
                    <p className={styles.subtitle}>Administra tu información personal y de contacto</p>
                </div>

                {saveError && (
                    <div className={styles.errorMessage}>
                        {saveError}
                    </div>
                )}

                {saveSuccess && (
                    <div className={styles.successMessage}>
                        ¡Datos actualizados correctamente!
                    </div>
                )}

                <div className={styles.infoSection}>
                    {/* Campo Nombre */}
                    <div className={styles.fieldContainer}>
                        <div className={styles.fieldHeader}>
                            <h3 className={styles.fieldTitle}>Nombre completo</h3>
                            {!editingName && (
                                <button 
                                    className={styles.editButton} 
                                    onClick={handleEditName}
                                    disabled={isSaving}
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                        
                        <div className={styles.fieldContent}>
                            {editingName ? (
                                <div className={styles.editingContainer}>
                                    <input
                                        type="text"
                                        className={styles.editInput}
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        placeholder="Ingresa tu nombre completo"
                                        disabled={isSaving}
                                    />
                                    <div className={styles.editButtons}>
                                        <button 
                                            className={styles.cancelButton} 
                                            onClick={handleCancelNameChange}
                                            disabled={isSaving}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            className={styles.acceptButton} 
                                            onClick={handleAcceptNameChange}
                                            disabled={isSaving || !tempName.trim()}
                                        >
                                            {isSaving ? 'Guardando...' : 'Aceptar'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.fieldValue}>{nombre}</p>
                            )}
                        </div>
                    </div>

                    {/* Campo Email */}
                    <div className={styles.fieldContainer}>
                        <div className={styles.fieldHeader}>
                            <h3 className={styles.fieldTitle}>Correo electrónico</h3>
                        </div>
                        <div className={styles.fieldContent}>
                            <p className={styles.fieldValue}>{email}</p>
                            <small className={styles.helpText}>
                                El correo electrónico no se puede modificar
                            </small>
                        </div>
                    </div>

                    {/* Campo Teléfono */}
                    <div className={styles.fieldContainer}>
                        <div className={styles.fieldHeader}>
                            <h3 className={styles.fieldTitle}>Número de teléfono</h3>
                            {!editingPhone && (
                                <button 
                                    className={styles.editButton} 
                                    onClick={handleEditPhone}
                                    disabled={isSaving}
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                        
                        <div className={styles.fieldContent}>
                            {editingPhone ? (
                                <div className={styles.editingContainer}>
                                    <div className={styles.phoneInputContainer}>
                                        <select 
                                            className={styles.countrySelect}
                                            value={selectedCountry.code}
                                            onChange={(e) => {
                                                const country = countries.find(c => c.code === e.target.value);
                                                if (country) setSelectedCountry(country);
                                            }}
                                            disabled={isSaving}
                                        >
                                            {countries.map(country => (
                                                <option key={country.code} value={country.code}>
                                                    {country.flag} {country.dial_code}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            className={styles.phoneInput}
                                            value={tempPhone}
                                            onChange={(e) => setTempPhone(e.target.value)}
                                            placeholder="Número de teléfono"
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className={styles.editButtons}>
                                        <button 
                                            className={styles.cancelButton} 
                                            onClick={handleCancelPhoneChange}
                                            disabled={isSaving}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            className={styles.acceptButton} 
                                            onClick={handleAcceptPhoneChange}
                                            disabled={isSaving || !tempPhone.trim()}
                                        >
                                            {isSaving ? 'Guardando...' : 'Aceptar'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.fieldValue}>{telefono}</p>
                            )}
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div className={styles.fieldContainer}>
                        <div className={styles.fieldHeader}>
                            <h3 className={styles.fieldTitle}>Contraseña</h3>
                        </div>
                        <div className={styles.fieldContent}>
                            <p className={styles.fieldValue}>••••••••</p>
                            <small className={styles.helpText}>
                                La contraseña no se puede modificar por el momento
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default PersonalInfo;