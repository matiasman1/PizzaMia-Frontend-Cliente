import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { obtenerLocalidades } from '../../../api/clientApi';
import styles from './AddressModal.module.css';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: any) => Promise<void>;
    editingAddress?: any;
    title: string;
}

interface Localidad {
    id: number;
    nombre: string;
    provincia: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingAddress,
    title
}) => {
    const { getAccessTokenSilently } = useAuth0();
    
    const [formData, setFormData] = useState({
        calle: '',
        numero: '',
        pisoDpto: '',
        codigoPostal: '',
        localidadId: 0
    });
    
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar localidades al abrir el modal
    useEffect(() => {
        if (isOpen) {
            loadLocalidades();
            
            // Si estamos editando, cargar datos existentes
            if (editingAddress) {
                setFormData({
                    calle: editingAddress.calle || '',
                    numero: editingAddress.numero || '',
                    pisoDpto: editingAddress.pisoDpto || '',
                    codigoPostal: editingAddress.codigoPostal || '',
                    localidadId: editingAddress.localidad?.id || 0
                });
            } else {
                // Limpiar formulario para nueva dirección
                setFormData({
                    calle: '',
                    numero: '',
                    pisoDpto: '',
                    codigoPostal: '',
                    localidadId: 0
                });
            }
        }
    }, [isOpen, editingAddress]);

    const loadLocalidades = async () => {
        try {
            const token = await getAccessTokenSilently();
            const localidadesData = await obtenerLocalidades(token);
            setLocalidades(localidadesData);
        } catch (error) {
            console.error('Error al cargar localidades:', error);
            setError('Error al cargar localidades');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'localidadId' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.calle || !formData.numero || !formData.codigoPostal || !formData.localidadId) {
            setError('Todos los campos obligatorios deben ser completados');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSave(formData);
            onClose();
            
            // Limpiar formulario
            setFormData({
                calle: '',
                numero: '',
                pisoDpto: '',
                codigoPostal: '',
                localidadId: 0
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al guardar dirección');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
            setError(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={loading}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="calle">Calle *</label>
                        <input
                            type="text"
                            id="calle"
                            name="calle"
                            value={formData.calle}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Ej: San Martín"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="numero">Número *</label>
                            <input
                                type="text"
                                id="numero"
                                name="numero"
                                value={formData.numero}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="Ej: 123"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="pisoDpto">Piso/Depto</label>
                            <input
                                type="text"
                                id="pisoDpto"
                                name="pisoDpto"
                                value={formData.pisoDpto}
                                onChange={handleInputChange}
                                disabled={loading}
                                placeholder="Ej: 2A"
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="codigoPostal">Código Postal *</label>
                            <input
                                type="text"
                                id="codigoPostal"
                                name="codigoPostal"
                                value={formData.codigoPostal}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="Ej: 5500"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="localidadId">Localidad *</label>
                            <select
                                id="localidadId"
                                name="localidadId"
                                value={formData.localidadId}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            >
                                <option value={0}>Seleccionar localidad</option>
                                {localidades.map(localidad => (
                                    <option key={localidad.id} value={localidad.id}>
                                        {localidad.nombre} - {localidad.provincia}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;