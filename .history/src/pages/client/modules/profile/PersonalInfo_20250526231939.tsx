import React, { useState, useEffect } from 'react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './PersonalInfo.module.css';

const PersonalInfo: React.FC = () => {
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [password, setPassword] = useState<string>('********');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    // Estados para controlar si los valores son predeterminados
    const [isDefaultName, setIsDefaultName] = useState<boolean>(true);
    const [isDefaultPhone, setIsDefaultPhone] = useState<boolean>(true);

    // Estados para manejar qué campo está siendo editado
    const [editingName, setEditingName] = useState<boolean>(false);
    const [editingPhone, setEditingPhone] = useState<boolean>(false);
    const [editingPassword, setEditingPassword] = useState<boolean>(false);

    // Estados para almacenar valores temporales durante la edición
    const [tempName, setTempName] = useState<string>('');
    const [tempPhone, setTempPhone] = useState<string>('');
    const [tempPassword, setTempPassword] = useState<string>('');
    const [tempConfirmPassword, setTempConfirmPassword] = useState<string>('');

    // Simulación de carga de datos del usuario
    useEffect(() => {
        // Aquí se cargarían los datos del usuario desde la API
        const loadUserData = async () => {
            try {
                // Simular carga de datos (reemplazar con llamada real a API)
                const mockUserData = {
                    nombre: 'Nombre Usuario',
                    email: 'correoelectronico@gmail.com',
                    telefono: '+54 xxxx xx xx',
                };

                setNombre(mockUserData.nombre);
                setEmail(mockUserData.email);
                setTelefono(mockUserData.telefono);
                setTempName(mockUserData.nombre);
                setTempPhone(mockUserData.telefono);
            } catch (error) {
                console.error('Error al cargar los datos del usuario:', error);
            }
        };

        loadUserData();
    }, []);

    // Manejo para mostrar/ocultar contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Manejo para editar nombre
    const handleEditName = () => {
        setEditingName(true);
        setTempName(nombre);
    };

    // Manejo para editar teléfono
    const handleEditPhone = () => {
        setEditingPhone(true);
        setTempPhone(telefono);
    };

    // Manejo para cambiar contraseña
    const handleChangePassword = () => {
        setEditingPassword(true);
        setTempPassword('');
        setTempConfirmPassword('');
    };

    // Manejar aceptar cambio de nombre
    const handleAcceptNameChange = () => {
        setNombre(tempName);
        setEditingName(false);
        setIsDefaultName(tempName === 'Nombre Usuario');
    };

    // Manejar aceptar cambio de teléfono
    const handleAcceptPhoneChange = () => {
        setTelefono(tempPhone);
        setEditingPhone(false);
        setIsDefaultPhone(tempPhone === '+54 xxxx xx xx');
    };

    // Manejar aceptar cambio de contraseña
    const handleAcceptPasswordChange = () => {
        if (tempPassword !== tempConfirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        if (tempPassword.trim() === '') {
            alert('La contraseña no puede estar vacía');
            return;
        }
        setPassword('********'); // En una app real, aquí enviaríamos la nueva contraseña al backend
        setEditingPassword(false);
    };

    // Manejar cancelar edición
    const handleCancel = (field: 'name' | 'phone' | 'password') => {
        switch(field) {
            case 'name':
                setEditingName(false);
                setTempName(nombre);
                break;
            case 'phone':
                setEditingPhone(false);
                setTempPhone(telefono);
                break;
            case 'password':
                setEditingPassword(false);
                break;
        }
    };

    // Manejadores de cambio para los campos temporales
    const handleTempNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempName(e.target.value);
    };

    const handleTempPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempPhone(e.target.value);
    };

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.sectionTitle}>Información Personal</h2>
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
                                placeholder="Nombre Usuario"
                                className={isDefaultName && !editingName ? styles.placeholderValue : ''}
                                readOnly={!editingName}
                            />
                            {!editingName && (
                                <button className={styles.editIcon} type="button" onClick={handleEditName}>
                                    <span>✎</span>
                                </button>
                            )}
                        </div>
                        {editingName && (
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.cancelButton} 
                                    onClick={() => handleCancel('name')}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={styles.acceptButton}
                                    onClick={handleAcceptNameChange}
                                >
                                    Aceptar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Campo Email (solo lectura) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Dirección de correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="correoelectronico@gmail.com"
                            readOnly
                            className={styles.placeholderValue}
                        />
                    </div>

                    {/* Campo Teléfono */}
                    <div className={styles.formGroup}>
                        <label htmlFor="telefono">Número de Teléfono</label>
                        <div className={styles.inputWithIcon}>
                            <input
                                type="tel"
                                id="telefono"
                                value={editingPhone ? tempPhone : telefono}
                                onChange={handleTempPhoneChange}
                                placeholder="+54 xxxx xx xx"
                                className={isDefaultPhone && !editingPhone ? styles.placeholderValue : ''}
                                readOnly={!editingPhone}
                            />
                            {!editingPhone && (
                                <button className={styles.editIcon} type="button" onClick={handleEditPhone}>
                                    <span>✎</span>
                                </button>
                            )}
                        </div>
                        {editingPhone && (
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.cancelButton} 
                                    onClick={() => handleCancel('phone')}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={styles.acceptButton}
                                    onClick={handleAcceptPhoneChange}
                                >
                                    Aceptar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Campo Contraseña */}
                    {!editingPassword ? (
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <div className={styles.passwordField}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    readOnly
                                    className={styles.placeholderValue}
                                />
                                <button
                                    className={styles.togglePassword}
                                    onClick={togglePasswordVisibility}
                                    type="button"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            <button
                                className={styles.changePasswordLink}
                                onClick={handleChangePassword}
                                type="button"
                            >
                                Cambiar contraseña ?
                            </button>
                        </div>
                    ) : (
                        // Formulario de cambio de contraseña
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">Nueva Contraseña</label>
                            <div className={styles.passwordField}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={tempPassword}
                                    onChange={(e) => setTempPassword(e.target.value)}
                                    placeholder="*************"
                                />
                                <button
                                    className={styles.togglePassword}
                                    onClick={togglePasswordVisibility}
                                    type="button"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            
                            <label htmlFor="confirmPassword" className={styles.confirmLabel}>Repetir Contraseña</label>
                            <div className={styles.passwordField}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={tempConfirmPassword}
                                    onChange={(e) => setTempConfirmPassword(e.target.value)}
                                    placeholder="*************"
                                />
                                <button
                                    className={styles.togglePassword}
                                    onClick={togglePasswordVisibility}
                                    type="button"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.cancelButton} 
                                    onClick={() => handleCancel('password')}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={styles.acceptButton}
                                    onClick={handleAcceptPasswordChange}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
};

export default PersonalInfo;