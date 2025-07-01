import React, { useState, useEffect } from 'react';
import styles from './AddAddressModal.module.css';
import { DomicilioCreateRequest, LocalidadApi, DomicilioApi } from '../../types/typesClient';
import { obtenerTodasLasLocalidades } from '../../api/clientApi';
import { useAuthStore } from '../../store/authStore';

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (domicilio: DomicilioCreateRequest) => Promise<void>;
    isLoading: boolean;
    // Nuevas props para edición
    isEditing?: boolean;
    domicilioToEdit?: DomicilioApi | null;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    isEditing = false,
    domicilioToEdit = null
}) => {
    const token = useAuthStore(state => state.token);
    
    const [formData, setFormData] = useState<DomicilioCreateRequest>({
        calle: '',
        numero: 0,
        codigoPostal: 0,
        localidad: { id: 0 },
        isActive: true
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [localidades, setLocalidades] = useState<LocalidadApi[]>([]);
    const [loadingLocalidades, setLoadingLocalidades] = useState(false);
    const [errorLocalidades, setErrorLocalidades] = useState<string>('');

    // Cargar localidades desde la API
    useEffect(() => {
        const cargarLocalidades = async () => {
            setLoadingLocalidades(true);
            setErrorLocalidades('');
            
            try {
                console.log('Cargando localidades desde la API...');
                const localidadesData = await obtenerTodasLasLocalidades(token || undefined);
                setLocalidades(localidadesData);
                console.log('Localidades cargadas:', localidadesData.length);
            } catch (error) {
                console.error('Error al cargar localidades:', error);
                setErrorLocalidades('Error al cargar las localidades. Intenta nuevamente.');
                
                // Fallback a localidades mock en caso de error
                const mockLocalidades: LocalidadApi[] = [
                    { id: 1, nombre: "Mendoza", provincia: { id: 1, nombre: "Mendoza" } },
                    { id: 2, nombre: "Las Heras", provincia: { id: 1, nombre: "Mendoza" } },
                    { id: 3, nombre: "Godoy Cruz", provincia: { id: 1, nombre: "Mendoza" } },
                    { id: 4, nombre: "Maipú", provincia: { id: 1, nombre: "Mendoza" } },
                    { id: 5, nombre: "San Rafael", provincia: { id: 1, nombre: "Mendoza" } },
                ];
                setLocalidades(mockLocalidades);
                console.log('Usando localidades mock como fallback');
            } finally {
                setLoadingLocalidades(false);
            }
        };

        // Solo cargar localidades cuando el modal esté abierto
        if (isOpen) {
            cargarLocalidades();
        }
    }, [isOpen, token]);

    // Resetear o cargar formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            if (isEditing && domicilioToEdit) {
                // Cargar datos del domicilio a editar
                setFormData({
                    calle: domicilioToEdit.calle,
                    numero: domicilioToEdit.numero,
                    codigoPostal: domicilioToEdit.codigoPostal,
                    localidad: { id: domicilioToEdit.localidad.id },
                    isActive: domicilioToEdit.active // Convertir active a isActive para el request
                });
            } else {
                // Resetear formulario para nuevo domicilio
                setFormData({
                    calle: '',
                    numero: 0,
                    codigoPostal: 0,
                    localidad: { id: 0 },
                    isActive: true
                });
            }
            setErrors({});
        }
    }, [isOpen, isEditing, domicilioToEdit]);

    // Manejar cambios en los inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'localidad') {
            setFormData(prev => ({
                ...prev,
                localidad: { id: parseInt(value) }
            }));
        } else if (name === 'numero' || name === 'codigoPostal') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validar formulario
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.calle.trim()) {
            newErrors.calle = 'La calle es obligatoria';
        }

        if (!formData.numero || formData.numero <= 0) {
            newErrors.numero = 'El número debe ser mayor a 0';
        }

        if (!formData.codigoPostal || formData.codigoPostal <= 0) {
            newErrors.codigoPostal = 'El código postal es obligatorio';
        }

        if (!formData.localidad.id || formData.localidad.id === 0) {
            newErrors.localidad = 'Debe seleccionar una localidad';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error al procesar domicilio:', error);
            // El error se manejará en el componente padre
        }
    };

    // Cerrar modal al hacer clic fuera
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Reintentar carga de localidades
    const handleRetryLocalidades = () => {
        if (isOpen) {
            // Trigger el useEffect de carga de localidades
            const event = new Event('localidades-retry');
            window.dispatchEvent(event);
            
            // Recargar manualmente
            setLoadingLocalidades(true);
            obtenerTodasLasLocalidades(token || undefined)
                .then(data => {
                    setLocalidades(data);
                    setErrorLocalidades('');
                })
                .catch(error => {
                    console.error('Error al reintentar carga de localidades:', error);
                    setErrorLocalidades('Error al cargar las localidades. Intenta nuevamente.');
                })
                .finally(() => setLoadingLocalidades(false));
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {isEditing ? 'Modificar Dirección' : 'Agregar Nueva Dirección'}
                    </h2>
                    <button 
                        className={styles.closeButton}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="calle" className={styles.label}>
                            Calle *
                        </label>
                        <input
                            type="text"
                            id="calle"
                            name="calle"
                            value={formData.calle}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.calle ? styles.inputError : ''}`}
                            placeholder="Ej: San Martín"
                            disabled={isLoading}
                        />
                        {errors.calle && <span className={styles.errorText}>{errors.calle}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="numero" className={styles.label}>
                                Número *
                            </label>
                            <input
                                type="number"
                                id="numero"
                                name="numero"
                                value={formData.numero || ''}
                                onChange={handleInputChange}
                                className={`${styles.input} ${errors.numero ? styles.inputError : ''}`}
                                placeholder="123"
                                min="1"
                                disabled={isLoading}
                            />
                            {errors.numero && <span className={styles.errorText}>{errors.numero}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="codigoPostal" className={styles.label}>
                                Código Postal *
                            </label>
                            <input
                                type="number"
                                id="codigoPostal"
                                name="codigoPostal"
                                value={formData.codigoPostal || ''}
                                onChange={handleInputChange}
                                className={`${styles.input} ${errors.codigoPostal ? styles.inputError : ''}`}
                                placeholder="5500"
                                min="1000"
                                max="9999"
                                disabled={isLoading}
                            />
                            {errors.codigoPostal && <span className={styles.errorText}>{errors.codigoPostal}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="localidad" className={styles.label}>
                            Localidad *
                        </label>
                        
                        {/* Mensaje de error de carga de localidades */}
                        {errorLocalidades && (
                            <div className={styles.errorMessage}>
                                <span>{errorLocalidades}</span>
                                <button 
                                    type="button" 
                                    className={styles.retryButton}
                                    onClick={handleRetryLocalidades}
                                    disabled={loadingLocalidades}
                                >
                                    {loadingLocalidades ? 'Cargando...' : 'Reintentar'}
                                </button>
                            </div>
                        )}
                        
                        <select
                            id="localidad"
                            name="localidad"
                            value={formData.localidad.id}
                            onChange={handleInputChange}
                            className={`${styles.select} ${errors.localidad ? styles.inputError : ''}`}
                            disabled={isLoading || loadingLocalidades}
                        >
                            <option value={0}>
                                {loadingLocalidades ? 'Cargando localidades...' : 'Seleccionar localidad'}
                            </option>
                            {localidades.map((localidad) => (
                                <option key={localidad.id} value={localidad.id}>
                                    {localidad.nombre} - {localidad.provincia?.nombre || 'Sin provincia'}
                                </option>
                            ))}
                        </select>
                        {errors.localidad && <span className={styles.errorText}>{errors.localidad}</span>}
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading || loadingLocalidades}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    {isEditing ? 'Actualizando...' : 'Agregando...'}
                                </>
                            ) : (
                                isEditing ? 'Actualizar Dirección' : 'Agregar Dirección'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;