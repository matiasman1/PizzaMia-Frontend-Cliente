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
        setCliente,
        setLoading,
        setError
    } = useClienteStore();

    // Estados del componente
    const [isDefaultName, setIsDefaultName] = useState(true);
    const [isDefaultPhone, setIsDefaultPhone] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    
    const [nombre, setNombre] = useState('Nombre Usuario');
    const [email, setEmail] = useState('usuario@ejemplo.com');
    const [telefono, setTelefono] = useState('+54 9 261 123-4567');
    
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

    // Actualizar estados locales cuando se cargan los datos del cliente
    useEffect(() => {
        if (cliente) {
            const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`;
            setNombre(nombreCompleto);
            setEmail(cliente.email || 'usuario@ejemplo.com');
            setIsDefaultName(false);
            
            // Formatear teléfono con código de país
            if (cliente.telefono) {
                const telefonoStr = cliente.telefono.toString();
                const telefonoFormateado = `${selectedCountry.dial_code} ${telefonoStr}`;
                setTelefono(telefonoFormateado);
                setIsDefaultPhone(false);
                
                // Detectar país basado en el teléfono
                const detectCountry = getCountryByDialCode(telefonoFormateado);
                if (detectCountry) {
                    setSelectedCountry(detectCountry);
                }
            }
        }
    }, [cliente, selectedCountry.dial_code]);

    // Funciones de edición
    const handleEditName = () => {
        setEditingName(true);
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleEditPhone = () => {
        setEditingPhone(true);
        setSaveError(null);
        setSaveSuccess(false);
    };

    // Función para aceptar cambios de nombre
    const handleAcceptNameChange = async () => {
        if (!user?.sub || !cliente || !nombre.trim()) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const token = await getAccessTokenSilently();
            
            const nameParts = nombre.trim().split(' ');
            const nombreActualizado = nameParts[0] || '';
            const apellidoActualizado = nameParts.slice(1).join(' ') || cliente.apellido;
            
            const datosActualizacion = {
                nombre: nombreActualizado,
                apellido: apellidoActualizado,
                telefono: parseInt(cliente.telefono?.toString() || '0'),
                email: cliente.email,
                auth0Id: user.sub
            };

            const clienteActualizado = await actualizarCliente(user.sub, datosActualizacion, token);
            
            setCliente(clienteActualizado);
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
            
            // Extraer solo los números del teléfono
            const telefonoSinCodigo = telefono.replace(selectedCountry.dial_code, '').trim();
            const telefonoLimpio = telefonoSinCodigo.replace(/\D/g, '');
            
            const datosActualizacion = {
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono: parseInt(telefonoLimpio),
                email: cliente.email,
                auth0Id: user.sub
            };

            const clienteActualizado = await actualizarCliente(user.sub, datosActualizacion, token);
            
            setCliente(clienteActualizado);
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

    const handleCancel = (field: 'name' | 'phone') => {
        if (field === 'name') {
            setEditingName(false);
            // Restaurar nombre original
            if (cliente) {
                setNombre(`${cliente.nombre} ${cliente.apellido}`);
            }
        } else {
            setEditingPhone(false);
            // Restaurar teléfono original
            if (cliente?.telefono) {
                setTelefono(`${selectedCountry.dial_code} ${cliente.telefono}`);
            }
        }
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

                <div className={styles.formSection}>
                    {/* Campo Nombre */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Nombre completo</label>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                id="name"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className={isDefaultName && !editingName ? styles.placeholderValue : ''}
                                readOnly={!editingName}
                                disabled={isSaving}
                            />
                            {!editingName && (
                                <button
                                    className={styles.editIcon}
                                    type="button"
                                    onClick={handleEditName}
                                    aria-label="Editar nombre"
                                    disabled={isSaving}
                                >
                                    <span>✎</span>
                                </button>
                            )}
                        </div>
                        {editingName && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => handleCancel('name')}
                                    type="button"
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.acceptButton}
                                    onClick={handleAcceptNameChange}
                                    type="button"
                                    disabled={isSaving || !nombre.trim()}
                                >
                                    {isSaving ? 'Guardando...' : 'Aceptar'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Campo Email */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Dirección de correo electrónico</label>
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                readOnly
                                className={styles.readOnlyInput}
                            />
                        </div>
                        <small className={styles.helpText}>
                            El correo electrónico no se puede modificar
                        </small>
                    </div>

                    {/* Campo Teléfono */}
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Número de teléfono</label>
                        <div className={styles.inputContainer}>
                            {editingPhone ? (
                                <div className={styles.phoneInputGroup}>
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
                                        id="phone"
                                        value={telefono.replace(selectedCountry.dial_code, '').trim()}
                                        onChange={(e) => setTelefono(`${selectedCountry.dial_code} ${e.target.value}`)}
                                        className={styles.phoneInput}
                                        placeholder="Número de teléfono"
                                        disabled={isSaving}
                                    />
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={telefono}
                                        readOnly
                                        className={isDefaultPhone ? styles.placeholderValue : ''}
                                    />
                                    <button
                                        className={styles.editIcon}
                                        type="button"
                                        onClick={handleEditPhone}
                                        aria-label="Editar teléfono"
                                        disabled={isSaving}
                                    >
                                        <span>✎</span>
                                    </button>
                                </>
                            )}
                        </div>
                        {editingPhone && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => handleCancel('phone')}
                                    type="button"
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.acceptButton}
                                    onClick={handleAcceptPhoneChange}
                                    type="button"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Guardando...' : 'Aceptar'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Campo Contraseña */}
                    <div className={styles.formGroup}>
                        <label>Contraseña</label>
                        <div className={styles.inputContainer}>
                            <input
                                type="password"
                                value="••••••••"
                                readOnly
                                className={styles.readOnlyInput}
                            />
                        </div>
                        <small className={styles.helpText}>
                            La contraseña no se puede modificar por el momento
                        </small>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default PersonalInfo;