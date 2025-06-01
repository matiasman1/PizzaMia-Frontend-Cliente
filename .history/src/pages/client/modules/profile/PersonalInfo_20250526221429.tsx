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
    
    // Estados para controlar si los valores son predeterminados o ingresados por el usuario
    const [isDefaultName, setIsDefaultName] = useState<boolean>(true);
    const [isDefaultPhone, setIsDefaultPhone] = useState<boolean>(true);
    const [isDefaultPassword, setIsDefaultPassword] = useState<boolean>(true);

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

    // Manejo para cambiar contraseña
    const handleChangePassword = () => {
        // Implementar navegación o modal para cambiar contraseña
        alert('Funcionalidad de cambio de contraseña');
    };

    // Manejadores de cambio para detectar cuando el usuario edita los campos
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNombre(value);
        setIsDefaultName(value === 'Nombre Usuario');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTelefono(value);
        setIsDefaultPhone(value === '+54 xxxx xx xx');
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
                                value={nombre}
                                onChange={handleNameChange}
                                placeholder="Nombre Usuario"
                                className={isDefaultName ? styles.placeholderValue : ''}
                            />
                            <button className={styles.editIcon} type="button">
                                <span>✎</span>
                            </button>
                        </div>
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
                            className={styles.placeholderValue} // Siempre es valor por defecto al ser readOnly
                        />
                    </div>

                    {/* Campo Teléfono */}
                    <div className={styles.formGroup}>
                        <label htmlFor="telefono">Número de Teléfono</label>
                        <div className={styles.inputWithIcon}>
                            <input
                                type="tel"
                                id="telefono"
                                value={telefono}
                                onChange={handlePhoneChange}
                                placeholder="+54 xxxx xx xx"
                                className={isDefaultPhone ? styles.placeholderValue : ''}
                            />
                            <button className={styles.editIcon} type="button">
                                <span>✎</span>
                            </button>
                        </div>
                    </div>

                    {/* Campo Contraseña */}
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <div className={styles.passwordField}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                readOnly
                                className={styles.placeholderValue} // Siempre placeholder al ser readOnly
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
                </div>
            </div>
        </ProfileLayout>
    );
};

export default PersonalInfo;