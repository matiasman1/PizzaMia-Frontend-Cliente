import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './PersonalInfo.module.css';
import { countryCodes, getCountryByDialCode, getDefaultCountry } from '../../../../data/countryCodes';
import { useClientStore } from '../../../../store/useClientStore';
import { useAuthStore } from '../../../../store/authStore';
import { obtenerClientePorAuth0Id, actualizarCliente, actualizarTelefonoCliente } from '../../../../api/clientApi';
import { ClienteUpdateDTO } from '../../../../types/typesClient';

const PersonalInfo: React.FC = () => {
    // Obtener user y getAccessTokenSilently directamente de Auth0
    const { user, getAccessTokenSilently } = useAuth0();
    const { cliente, setCliente, isLoading, setLoading, error, setError } = useClientStore();
    const storeToken = useAuthStore(state => state.token); // Mantenemos referencia al token del store
    const setStoreToken = useAuthStore(state => state.setToken); // Para actualizar el token en el store
    
    // Estado local para el token
    const [token, setToken] = useState<string | null>(storeToken);
    
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    
    const [isDefaultName, setIsDefaultName] = useState<boolean>(true);
    const [isDefaultEmail, setIsDefaultEmail] = useState<boolean>(true);
    const [isDefaultPhone, setIsDefaultPhone] = useState<boolean>(true);
    
    const [editingName, setEditingName] = useState<boolean>(false);
    const [editingEmail, setEditingEmail] = useState<boolean>(false);
    const [editingPhone, setEditingPhone] = useState<boolean>(false);
    
    const [tempName, setTempName] = useState<string>('');
    const [tempEmail, setTempEmail] = useState<string>('');
    const [tempPhone, setTempPhone] = useState<string>('');
    
    // Estado para determinar si es un usuario de Google
    const [isGoogleUser, setIsGoogleUser] = useState<boolean>(false);
    
    // Estados para el selector de países
    const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
    
    // Ref para cerrar el dropdown cuando se hace click afuera
    const countryDropdownRef = useRef<HTMLDivElement>(null);
    
    // Efecto para obtener el token de Auth0
    useEffect(() => {
        const obtenerToken = async () => {
            try {
                if (user) {
                    console.log("👤 Usuario Auth0 disponible, obteniendo token...");
                    const newToken = await getAccessTokenSilently();
                    console.log("🔑 Token obtenido:", newToken ? "OK" : "No disponible");
                    
                    setToken(newToken);
                    setStoreToken(newToken); // Actualizar también en el store global
                }
            } catch (error) {
                console.error("❌ Error al obtener token:", error);
                setError("No se pudo obtener el token de autenticación.");
            }
        };
        
        obtenerToken();
    }, [user, getAccessTokenSilently, setStoreToken, setError]);
    
    // Efecto para detectar clicks fuera del dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setShowCountryDropdown(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    // Efecto para determinar si es un usuario de Google
    useEffect(() => {
        if (user?.sub) {
            const isGoogle = user.sub.startsWith('google-oauth2|');
            setIsGoogleUser(isGoogle);
            console.log("🔍 ¿Es usuario de Google?:", isGoogle);
        }
    }, [user?.sub]);
    
    // Efecto para cargar los datos del cliente una vez que tengamos el token
    useEffect(() => {
        const fetchClienteData = async () => {
            if (!user?.sub || !token) {
                console.log("❌ No hay usuario o token disponible:", { 
                    userSub: user?.sub, 
                    tokenAvailable: !!token 
                });
                return;
            }
            
            console.log("🔄 Iniciando carga de datos del cliente...");
            console.log("🔑 Auth0 User:", user);
            console.log("🔒 Token disponible:", !!token);
            
            setLoading(true);
            try {
                console.log("📡 Obteniendo datos del cliente con auth0Id:", user.sub);
                const data = await obtenerClientePorAuth0Id(user.sub, token);
                
                console.log("✅ DATOS DEL CLIENTE RECIBIDOS:", data);
                console.log("📋 ID:", data?.id);
                console.log("👤 Nombre:", data?.nombre);
                console.log("👤 Apellido:", data?.apellido);
                console.log("📧 Email:", data?.email);
                console.log("📞 Teléfono:", data?.telefono);
                
                if (data) {
                    setCliente(data);
                    
                    // Actualizar el nombre
                    const nombreCompleto = `${data.nombre || ''} ${data.apellido || ''}`.trim();
                    console.log("📝 Nombre completo establecido:", nombreCompleto);
                    setNombre(nombreCompleto);
                    setTempName(nombreCompleto);
                    setIsDefaultName(nombreCompleto === '');
                    
                    // Actualizar el email
                    console.log("📧 Email establecido:", data.email || '');
                    setEmail(data.email || '');
                    setTempEmail(data.email || '');
                    setIsDefaultEmail(data.email === '');
                    
                    // Formatear y actualizar el teléfono
                    if (data.telefono) {
                        const phoneStr = data.telefono.toString();
                        console.log("📞 Teléfono recibido (raw):", phoneStr);
                        
                        // Detectar país basado en el teléfono
                        const country = getCountryByDialCode(phoneStr) || getDefaultCountry();
                        console.log("🌍 País detectado:", country.name, country.dial_code);
                        setSelectedCountry(country);
                        
                        // Quitar código de país del teléfono si existe
                        let phoneWithoutCode = phoneStr;
                        if (phoneStr.startsWith(country.dial_code)) {
                            phoneWithoutCode = phoneStr.replace(country.dial_code, '').trim();
                        }
                        
                        const formattedPhone = `${country.dial_code} ${phoneWithoutCode}`;
                        console.log("📞 Teléfono formateado:", formattedPhone);
                        
                        setTelefono(formattedPhone);
                        setTempPhone(phoneWithoutCode);
                        setIsDefaultPhone(false);
                    } else {
                        // Si no hay teléfono, usar valores por defecto
                        console.log("⚠️ No hay teléfono, usando valores por defecto");
                        setTelefono(`${selectedCountry.dial_code} `);
                        setTempPhone('');
                        setIsDefaultPhone(true);
                    }
                    
                    console.log("✅ Estados locales actualizados correctamente");
                } else {
                    console.log("⚠️ No se recibieron datos del cliente");
                }
            } catch (err) {
                console.error('❌ ERROR al cargar datos del cliente:', err);
                if (err instanceof Error) {
                    console.error('❌ Mensaje de error:', err.message);
                    console.error('❌ Stack de error:', err.stack);
                }
                setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
            } finally {
                setLoading(false);
                console.log("🔄 Finalizada la carga de datos del cliente");
            }
        };
        
        fetchClienteData();
    }, [user?.sub, token, setCliente, setLoading, setError]);
    
    // Funciones para manejar los cambios
    const handleEditName = () => {
        setEditingName(true);
        setTempName(nombre);
    };

    const handleEditEmail = () => {
        setEditingEmail(true);
        setTempEmail(email);
    };
    
    const handleEditPhone = () => {
        setEditingPhone(true);
        // Extraer solo el número, sin el prefijo de país
        const phoneWithoutCode = telefono.replace(selectedCountry.dial_code, '').trim();
        setTempPhone(phoneWithoutCode);
    };
    
    const handleAcceptNameChange = async () => {
        if (!cliente || !token || !user?.sub) {
            console.log("❌ No se puede actualizar nombre - faltan datos:", {
                cliente: !!cliente,
                token: !!token,
                userSub: !!user?.sub
            });
            return;
        }
        
        console.log("🔄 Iniciando actualización de nombre...");
        setLoading(true);
        try {
            // Para usuarios de Google, no permitimos cambiar el nombre
            if (isGoogleUser) {
                console.log("⚠️ Usuario de Google - no se permite actualizar nombre");
                setError("Los usuarios de Google no pueden cambiar su nombre o correo electrónico.");
                setLoading(false);
                return;
            }
            
            // Dividir el nombre completo en nombre y apellido
            const nameParts = tempName.trim().split(' ');
            const nombre = nameParts[0] || '';
            const apellido = nameParts.slice(1).join(' ') || '';
            console.log("📝 Nombre dividido:", { nombre, apellido });
            
            // Crear objeto de actualización
            const datosActualizados: ClienteUpdateDTO = {
                nombre: nombre,
                apellido: apellido,
                telefono: cliente.telefono || 0,
                email: cliente.email,
                auth0Id: user.sub
            };
            console.log("📤 Datos a enviar:", datosActualizados);
            
            // Actualizar en el backend
            console.log("📡 Enviando actualización al servidor para cliente ID:", cliente.id);
            const updatedCliente = await actualizarCliente(
                cliente.id,
                datosActualizados,
                token
            );
            
            console.log("✅ Cliente actualizado correctamente:", updatedCliente);
            
            // Actualizar store y estado local
            setCliente(updatedCliente);
            setNombre(tempName);
            setEditingName(false);
            setIsDefaultName(false);
            setError(null);
            console.log("✅ Estados locales actualizados después de la actualización");
        } catch (err) {
            console.error('❌ Error al actualizar nombre:', err);
            if (err instanceof Error) {
                console.error('❌ Mensaje de error:', err.message);
                console.error('❌ Stack de error:', err.stack);
            }
            setError(err instanceof Error ? err.message : 'Error al actualizar nombre');
        } finally {
            setLoading(false);
            console.log("🔄 Finalizado el proceso de actualización de nombre");
        }
    };

    const handleAcceptEmailChange = async () => {
        if (!cliente || !token || !user?.sub) {
            console.log("❌ No se puede actualizar email - faltan datos:", {
                cliente: !!cliente,
                token: !!token,
                userSub: !!user?.sub
            });
            return;
        }
        
        console.log("🔄 Iniciando actualización de email...");
        setLoading(true);
        try {
            // Para usuarios de Google, no permitimos cambiar el email
            if (isGoogleUser) {
                console.log("⚠️ Usuario de Google - no se permite actualizar email");
                setError("Los usuarios de Google no pueden cambiar su nombre o correo electrónico.");
                setLoading(false);
                return;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(tempEmail)) {
                console.log("⚠️ Formato de email inválido:", tempEmail);
                setError("El formato del correo electrónico no es válido.");
                setLoading(false);
                return;
            }
            
            // Crear objeto de actualización
            const datosActualizados: ClienteUpdateDTO = {
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                telefono: cliente.telefono || 0,
                email: tempEmail,
                auth0Id: user.sub
            };
            console.log("📤 Datos a enviar:", datosActualizados);
            
            // Actualizar en el backend
            console.log("📡 Enviando actualización al servidor para cliente ID:", cliente.id);
            const updatedCliente = await actualizarCliente(
                cliente.id,
                datosActualizados,
                token
            );
            
            console.log("✅ Cliente actualizado correctamente:", updatedCliente);
            
            // Actualizar store y estado local
            setCliente(updatedCliente);
            setEmail(tempEmail);
            setEditingEmail(false);
            setIsDefaultEmail(false);
            setError(null);
            console.log("✅ Estados locales actualizados después de la actualización");
        } catch (err) {
            console.error('❌ Error al actualizar email:', err);
            if (err instanceof Error) {
                console.error('❌ Mensaje de error:', err.message);
                console.error('❌ Stack de error:', err.stack);
            }
            setError(err instanceof Error ? err.message : 'Error al actualizar email');
        } finally {
            setLoading(false);
            console.log("🔄 Finalizado el proceso de actualización de email");
        }
    };
    
    const handleAcceptPhoneChange = async () => {
        if (!cliente || !token || !user?.sub) {
            console.log("❌ No se puede actualizar teléfono - faltan datos:", {
                cliente: !!cliente,
                token: !!token,
                userSub: !!user?.sub
            });
            return;
        }
        
        console.log("🔄 Iniciando actualización de teléfono...");
        setLoading(true);
        try {
            // Formatear teléfono para guardar (eliminar caracteres no numéricos)
            const phoneStr = tempPhone.replace(/\D/g, '');
            console.log("📞 Teléfono procesado (solo números):", phoneStr);
            
            // Validar que el teléfono tenga al menos 5 dígitos
            if (phoneStr.length < 5) {
                console.log("⚠️ Teléfono demasiado corto:", phoneStr.length, "dígitos");
                setError("El número de teléfono debe tener al menos 5 dígitos.");
                setLoading(false);
                return;
            }
            
            const phoneNumber = parseInt(phoneStr, 10);
            console.log("📞 Teléfono convertido a número:", phoneNumber);
            
            let updatedCliente;
            
            if (isGoogleUser) {
                // Para usuarios de Google, solo actualizamos el teléfono
                console.log("🔄 Actualizando teléfono para usuario de Google");
                updatedCliente = await actualizarTelefonoCliente(
                    cliente.id,
                    phoneNumber,
                    user.sub,
                    token
                );
            } else {
                // Para usuarios normales, actualizamos todos los campos
                console.log("🔄 Actualizando teléfono para usuario normal");
                const datosActualizados: ClienteUpdateDTO = {
                    nombre: cliente.nombre,
                    apellido: cliente.apellido,
                    telefono: phoneNumber,
                    email: cliente.email,
                    auth0Id: user.sub
                };
                console.log("📤 Datos a enviar:", datosActualizados);
                
                updatedCliente = await actualizarCliente(
                    cliente.id,
                    datosActualizados,
                    token
                );
            }
            
            console.log("✅ Cliente actualizado correctamente:", updatedCliente);
            
            // Actualizar store y estado local
            setCliente(updatedCliente);
            const formattedPhone = `${selectedCountry.dial_code} ${tempPhone.trim()}`;
            console.log("📞 Teléfono formateado para mostrar:", formattedPhone);
            setTelefono(formattedPhone);
            setEditingPhone(false);
            setIsDefaultPhone(false);
            setError(null);
            console.log("✅ Estados locales actualizados después de la actualización");
        } catch (err) {
            console.error('❌ Error al actualizar teléfono:', err);
            if (err instanceof Error) {
                console.error('❌ Mensaje de error:', err.message);
                console.error('❌ Stack de error:', err.stack);
            }
            setError(err instanceof Error ? err.message : 'Error al actualizar teléfono');
        } finally {
            setLoading(false);
            console.log("🔄 Finalizado el proceso de actualización de teléfono");
        }
    };
    
    const handleCancel = (field: 'name' | 'email' | 'phone') => {
        setError(null);
        switch (field) {
            case 'name':
                setEditingName(false);
                setTempName(nombre);
                break;
            case 'email':
                setEditingEmail(false);
                setTempEmail(email);
                break;
            case 'phone':
                setEditingPhone(false);
                setTempPhone(telefono.replace(selectedCountry.dial_code, '').trim());
                break;
        }
    };
    
    const handleTempNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempName(e.target.value);
    };

    const handleTempEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempEmail(e.target.value);
    };
    
    const handleTempPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Solo permitir números, espacios y guiones
        const value = e.target.value.replace(/[^\d\s-]/g, '');
        setTempPhone(value);
    };
    
    // Funciones para el selector de países
    const toggleCountryDropdown = () => {
        setShowCountryDropdown(!showCountryDropdown);
    };
    
    const handleCountrySelect = (country: typeof selectedCountry) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
    };
    
    // Mostrar spinner durante la carga
    if (isLoading) {
        return (
            <ProfileLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando información...</p>
                </div>
            </ProfileLayout>
        );
    }
    
    return (
        <ProfileLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.sectionTitle}>Información Personal</h2>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {isGoogleUser && (
                        <div className={styles.infoMessage}>
                            Como usuario de Google, solo puedes actualizar tu número de teléfono.
                        </div>
                    )}
                </header>
                
                <div className={styles.formSection}>
                    {/* Campo Nombre */}
                    <div className={styles.formGroup}>
                        <label htmlFor="nombre">Nombre completo</label>
                        <div className={styles.inputWithIcon}>
                            <input
                                type="text"
                                id="nombre"
                                value={editingName ? tempName : nombre}
                                onChange={handleTempNameChange}
                                placeholder="Nombre y Apellido"
                                className={isDefaultName && !editingName ? styles.placeholderValue : ''}
                                readOnly={!editingName || isGoogleUser}
                            />
                            {!editingName && !isGoogleUser && (
                                <button
                                    className={styles.editIcon}
                                    type="button"
                                    onClick={handleEditName}
                                    aria-label="Editar nombre"
                                >
                                    <span>✎</span>
                                </button>
                            )}
                        </div>
                        {editingName && !isGoogleUser && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => handleCancel('name')}
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.acceptButton}
                                    onClick={handleAcceptNameChange}
                                    type="button"
                                >
                                    Aceptar
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Campo Email - ahora editable */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Dirección de correo electrónico</label>
                        <div className={styles.inputWithIcon}>
                            <input
                                type="email"
                                id="email"
                                value={editingEmail ? tempEmail : email}
                                onChange={handleTempEmailChange}
                                placeholder="correoelectronico@gmail.com"
                                className={isDefaultEmail && !editingEmail ? styles.placeholderValue : ''}
                                readOnly={!editingEmail || isGoogleUser}
                            />
                            {!editingEmail && !isGoogleUser && (
                                <button
                                    className={styles.editIcon}
                                    type="button"
                                    onClick={handleEditEmail}
                                    aria-label="Editar email"
                                >
                                    <span>✎</span>
                                </button>
                            )}
                        </div>
                        {editingEmail && !isGoogleUser && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => handleCancel('email')}
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.acceptButton}
                                    onClick={handleAcceptEmailChange}
                                    type="button"
                                >
                                    Aceptar
                                </button>
                            </div>
                        )}
                        {editingEmail && !isGoogleUser && (
                            <div className={styles.formHelp}>
                                Cambiar tu correo electrónico también modificará tu usuario de inicio de sesión.
                            </div>
                        )}
                    </div>
                    
                    {/* Campo Teléfono */}
                    <div className={styles.formGroup}>
                        <label htmlFor="telefono">Número de Teléfono</label>
                        {!editingPhone ? (
                            <div className={styles.inputWithIcon}>
                                <input
                                    type="tel"
                                    id="telefono"
                                    value={telefono}
                                    placeholder="+54 xxxx xx xx"
                                    className={isDefaultPhone ? styles.placeholderValue : ''}
                                    readOnly
                                />
                                <button
                                    className={styles.editIcon}
                                    type="button"
                                    onClick={handleEditPhone}
                                    aria-label="Editar teléfono"
                                >
                                    <span>✎</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.phoneInputContainer}>
                                    <div className={styles.countrySelector} ref={countryDropdownRef}>
                                        <button
                                            type="button"
                                            className={styles.countryButton}
                                            onClick={toggleCountryDropdown}
                                        >
                                            <span className={styles.flagIcon}>{selectedCountry.flag}</span>
                                            <span>{selectedCountry.dial_code}</span>
                                        </button>
                                        
                                        {showCountryDropdown && (
                                            <div className={styles.countryDropdown}>
                                                {countryCodes.map(country => (
                                                    <div
                                                        key={country.code}
                                                        className={styles.countryOption}
                                                        onClick={() => handleCountrySelect(country)}
                                                    >
                                                        <span className={styles.countryFlag}>{country.flag}</span>
                                                        <span className={styles.countryName}>{country.name}</span>
                                                        <span className={styles.countryCode}>{country.dial_code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        value={tempPhone}
                                        onChange={handleTempPhoneChange}
                                        placeholder="xxxx xx xx"
                                        maxLength={15}
                                    />
                                </div>
                                <div className={styles.actionButtons}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => handleCancel('phone')}
                                        type="button"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className={styles.acceptButton}
                                        onClick={handleAcceptPhoneChange}
                                        type="button"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Nota sobre cambio de contraseña */}
                    <div className={styles.passwordNoteContainer}>
                        <div className={styles.passwordNote}>
                            <p>
                                <strong>¿Necesitas cambiar tu contraseña?</strong>
                            </p>
                            <p>
                                Por razones de seguridad, la gestión de contraseñas se realiza directamente a través de Auth0.
                                Si necesitas cambiar tu contraseña, utiliza la opción "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default PersonalInfo;