import React, { useState, useEffect, useRef } from 'react';
import ProfileLayout from '../../../../components/Client/ProfileLayout/ProfileLayout';
import styles from './PersonalInfo.module.css';
import { countryCodes, getCountryByDialCode, getDefaultCountry } from '../../../../data/countryCodes';

const PersonalInfo: React.FC = () => {
    // Estados existentes...
    const [nombre, setNombre] = useState<string>('Nombre Usuario');
    const [email, setEmail] = useState<string>('correoelectronico@gmail.com');
    const [telefono, setTelefono] = useState<string>('+54 xxxx xx xx');
    const [password, setPassword] = useState<string>('********');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [isDefaultName, setIsDefaultName] = useState<boolean>(true);
    const [isDefaultPhone, setIsDefaultPhone] = useState<boolean>(true);

    const [editingName, setEditingName] = useState<boolean>(false);
    const [editingPhone, setEditingPhone] = useState<boolean>(false);
    const [editingPassword, setEditingPassword] = useState<boolean>(false);

    const [tempName, setTempName] = useState<string>('Nombre Usuario');
    const [tempPhone, setTempPhone] = useState<string>('xxxx xx xx');
    const [tempPassword, setTempPassword] = useState<string>('');
    const [tempConfirmPassword, setTempConfirmPassword] = useState<string>('');

    // Nuevos estados para el selector de países
    const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

    // Ref para cerrar el dropdown cuando se hace click afuera
    const countryDropdownRef = useRef<HTMLDivElement>(null);

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

    // Efecto para inicializar el país seleccionado basado en el número de teléfono
    useEffect(() => {
        const detectCountry = getCountryByDialCode(telefono);
        if (detectCountry) {
            setSelectedCountry(detectCountry);
        }
    }, []);

    // Funciones existentes...
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEditName = () => {
        setEditingName(true);
        setTempName(nombre);
    };

    const handleEditPhone = () => {
        setEditingPhone(true);
        // Extraer solo el número, sin el prefijo de país
        const phoneWithoutCode = telefono.replace(selectedCountry.dial_code, '').trim();
        setTempPhone(phoneWithoutCode);
    };

    const handleChangePassword = () => {
        setEditingPassword(true);
        setTempPassword('');
        setTempConfirmPassword('');
    };

    const handleAcceptNameChange = () => {
        setNombre(tempName);
        setEditingName(false);
        setIsDefaultName(tempName === 'Nombre Usuario');
    };

    const handleAcceptPhoneChange = () => {
        const formattedPhone = `${selectedCountry.dial_code} ${tempPhone.trim()}`;
        setTelefono(formattedPhone);
        setEditingPhone(false);
        setIsDefaultPhone(formattedPhone === '+54 xxxx xx xx');
    };

    const handleAcceptPasswordChange = () => {
        if (tempPassword !== tempConfirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        if (tempPassword.trim() === '') {
            alert('La contraseña no puede estar vacía');
            return;
        }
        setPassword('********');
        setEditingPassword(false);
    };

    const handleCancel = (field: 'name' | 'phone' | 'password') => {
        switch (field) {
            case 'name':
                setEditingName(false);
                setTempName(nombre);
                break;
            case 'phone':
                setEditingPhone(false);
                setTempPhone(telefono.replace(selectedCountry.dial_code, '').trim());
                break;
            case 'password':
                setEditingPassword(false);
                break;
        }
    };

    const handleTempNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempName(e.target.value);
    };

    const handleTempPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempPhone(e.target.value);
    };

    // Nuevas funciones para el selector de países
    const toggleCountryDropdown = () => {
        setShowCountryDropdown(!showCountryDropdown);
    };

    const handleCountrySelect = (country: typeof selectedCountry) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
    };

    return (
        <ProfileLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.sectionTitle}>Información Personal</h2>
                </header>

                <div className={styles.formSection}>
                    {/* Campo Nombre - mantenerlo igual */}
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
                        {editingName && (
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

                    {/* Campo Email - mantenerlo igual */}
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

                    {/* Campo Teléfono - modificado con selector de países */}
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

                    {/* Campo Contraseña - mantenerlo igual */}
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
                        // Formulario de cambio de contraseña - mantenerlo igual
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
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.acceptButton}
                                    onClick={handleAcceptPasswordChange}
                                    type="button"
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