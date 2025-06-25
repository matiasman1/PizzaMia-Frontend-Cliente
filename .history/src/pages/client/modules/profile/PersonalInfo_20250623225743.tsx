import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useClienteStore } from '../../../../store/clienteStore';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './PersonalInfo.module.css';
import { countries, Country } from '../../../../api/countriesData.ts';

// Helper functions existentes
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
        cargarClientePorAuth0,
        actualizarDatosCliente
    } = useClienteStore();

    // Estados existentes del componente
    const [nombre, setNombre] = useState('Nombre Usuario');
    const [email, setEmail] = useState('usuario@ejemplo.com');
    const [telefono, setTelefono] = useState('+54 9 261 123-4567');
    const [contraseña] = useState('contraseña123');

    const [showPassword, setShowPassword] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    const [tempName, setTempName] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [tempConfirmPassword, setTempConfirmPassword] = useState('');

    const [selectedCountry, setSelectedCountry] = useState<Country>(
        countries.find(c => c.code === 'AR') || countries[0]
    );

    // NUEVO - Estados para manejo de guardado
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

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

    // NUEVO - Actualizar estados locales cuando se cargan los datos del cliente
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

    // Efecto existente para inicializar el país seleccionado
    useEffect(() => {
        const detectCountry = getCountryByDialCode(telefono);
        if (detectCountry) {
            setSelectedCountry(detectCountry);
        }
    }, [telefono]);

    // Funciones existentes sin cambios
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEditName = () => {
        setEditingName(true);
        setTempName(nombre);
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleEditPhone = () => {
        setEditingPhone(true);
        // Extraer solo el número, sin el prefijo de país
        const phoneWithoutCode = telefono.replace(selectedCountry.dial_code, '').trim();
        setTempPhone(phoneWithoutCode);
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleChangePassword = () => {
        setEditingPassword(true);
        setTempPassword('');
        setTempConfirmPassword('');
    };

    // MODIFICADA - Función para aceptar cambios de nombre con integración a la API
    const handleAcceptNameChange = async () => {
        if (!user?.sub || !cliente) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const token = await getAccessTokenSilently();

            // Dividir el nombre completo en nombre y apellido
            const nameParts = tempName.trim().split(' ');
            const nombre = nameParts[0] || '';
            const apellido = nameParts.slice(1).join(' ') || cliente.apellido;

            // Preparar los datos para enviar (el JSON que mencionó tu compañero)
            const datosActualizacion = {
                nombre,
                apellido,
                telefono: parseInt(cliente.telefono?.toString() || '0'),
                email: cliente.email,
                auth0Id: user.sub
            };

            await actualizarDatosCliente(datosActualizacion, token);

            // Actualizar estado local
            setNombre(tempName);
            setEditingName(false);
            setSaveSuccess(true);

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (error) {
            console.error('Error al guardar nombre:', error);
            setSaveError(error instanceof Error ? error.message : 'Error al guardar el nombre');
        } finally {
            setIsSaving(false);
        }
    };

    // MODIFICADA - Función para aceptar cambios de teléfono con integración a la API
    const handleAcceptPhoneChange = async () => {
        if (!user?.sub || !cliente) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const token = await getAccessTokenSilently();

            // Limpiar el teléfono de caracteres no numéricos
            const telefonoLimpio = tempPhone.replace(/\D/g, '');

            // Preparar los datos para enviar
            const datosActualizacion = {
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono: parseInt(telefonoLimpio),
                email: cliente.email,
                auth0Id: user.sub
            };

            await actualizarDatosCliente(datosActualizacion, token);

            // Actualizar estado local con formato
            const newFormattedPhone = `${selectedCountry.dial_code} ${formatPhoneNumber(telefonoLimpio)}`;
            setTelefono(newFormattedPhone);
            setEditingPhone(false);
            setSaveSuccess(true);

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (error) {
            console.error('Error al guardar teléfono:', error);
            setSaveError(error instanceof Error ? error.message : 'Error al guardar el teléfono');
        } finally {
            setIsSaving(false);
        }
    };

    // Funciones existentes para cancelar cambios
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

    const handleCancelPasswordChange = () => {
        setEditingPassword(false);
        setTempPassword('');
        setTempConfirmPassword('');
    };

    const handleAcceptPasswordChange = () => {
        if (tempPassword !== tempConfirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        setEditingPassword(false);
        // Por ahora no implementamos el cambio de contraseña
        alert('Cambio de contraseña no disponible por el momento');
    };

    // NUEVO - Mostrar loading si está cargando
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

    // NUEVO - Mostrar error si hay error
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

                {/* NUEVO - Mensajes de éxito y error */}
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

                {/* Resto del JSX existente sin cambios, solo agregando disabled cuando isSaving */}
                <div className={styles.infoSection}>
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

                    {/* Campo de email (no editable) */}
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

                    {/* Campo de teléfono */}
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

                    {/* Campo de contraseña (no editable por ahora) */}
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